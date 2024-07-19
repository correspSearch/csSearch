<template>
    <!-- Facet: All editions -->
    <b-list-group-item>
    <h3
        v-bind:class="(facets.edition.length === 0) ? 'disabled' : ''"
    >
        <b-link
        v-bind:disabled="facets.edition.length === 0"
        v-bind:aria-expanded="collapsed.editionAll ? 'true' : 'false'"
        aria-controls="editionCollapseAll"
        v-on:click="collapsed.editionAll = !collapsed.editionAll"
        >
        <font-awesome-icon
            v-bind:icon="'chevron-' + ((!collapsed.editionAll ||
            facets.edition.length === 0) ? 'right' : 'down')"
            class="mr-1"
        />
        </b-link> {{ store.labels.vals['facetHeadings.editions'] }}
        <span class="facet-counter">({{(this.searchString)? searchFacet().length: this.edition.length}})</span>
    </h3>
    <b-collapse
        v-if="edition.length > 0"
        id="editionCollapseAll"
        v-model="collapsed.editionAll"
    >
        <div class="sort">
            <sort-alpha
            v-bind:sortTarget="'edition'"
            v-bind:inputList="this.edition">
            </sort-alpha>
            <sort-numeric
            v-bind:sortTarget="'edition'"
            v-bind:inputList="this.edition">
            </sort-numeric>
            <font-awesome-icon icon="search" class="facet-search "
              v-on:click="toggleInputField()"
              v-bind:class="{active: isActive}"/>
            <b-form-input v-if="isActive" type="text" class="input-facet" :placeholder="store.labels.vals['facets.search']" v-model="searchString"></b-form-input>
        </div>
        <!-- Dynamic Scroller Solution -->
          <dynamic-scroller          
          :items="(this.searchString)? searchFacet(): this.edition"
          :min-item-size="54"
          class="scroller"
          >
            <template v-slot="{ item, index, active }">
              <dynamic-scroller-item
                :item="item"
                :active="active"
                :size-dependencies="[item.idno.buckets[0].key,]"
                :data-index="index"
                class="facetList list-group-item"
                v-bind:class="(url.facets.edition.includes((item).idno.buckets[0].key)) ? 'facetActive' : ''"
              >
                <b-row class="p-0 m-0">
                <b-popover
                  v-bind:target="'editionLink' + index"
                  triggers="hover"
                  boundary="viewport"
                  placement="left"
                  adaptivePosition="false"
                  :no-fade="true"
                >
                  {{ item.idno.buckets[0].key }}
                </b-popover>
              <b-col
                cols="8"
                class="p-0"
              >
                <b-link
                  v-if="item.idno.buckets[0].key !== undefined"
                  v-bind:id="'editionLink' + index"
                  v-on:click="$parent.setFacet(item.idno.buckets[0].key, 'e')"
                  v-on:mouseover="showPopover('editionLink' + index)"
                  v-on:wheel="disableAllPopovers()"
                >
                  {{item.key}}
                </b-link>
                <span v-if="item.idno.buckets[0].key === undefined">{{ item.key}} </span>
                ({{ item.count }})
                
              </b-col>
                <b-col
                cols="4"
                class="p-0"
              >
                <font-awesome-icon
                  v-if="item.idno.buckets[0].key !== undefined && !url.facets.edition.includes(item.idno.buckets[0].key)"
                  icon="plus-circle"
                  class="mt-1 float-right ml-1 facet-icons"
                  v-on:click="$parent.setFacet(item.idno.buckets[0].key, 'e')"
                />
                <font-awesome-icon
                  v-if="item.idno.buckets[0].key !== undefined && url.facets.edition.includes(item.idno.buckets[0].key)"
                  icon="times-circle"
                  class="mt-1 float-right ml-1 facet-icons"
                  v-on:click="$parent.removeFacet(item.idno.buckets[0].key, 'e')"
                />
                <font-awesome-icon
                  v-if="item.idno.buckets[0].key !== undefined && !url.facets.edition.includes(item.idno.buckets[0].key)"
                  icon="minus-circle"
                  class="mt-1 float-right ml-1 facet-icons"
                  v-on:click="$parent.exceptFacet(item.idno.buckets[0].key, 'e')"
                />
              </b-col>
              </b-row>
              </dynamic-scroller-item>
            </template>
          </dynamic-scroller>
    </b-collapse>
    </b-list-group-item>
</template>

<script>
import { mapState } from 'vuex';
import SortAlpha from '../buttons/SortAlpha.vue';
import SortNumeric from '../buttons/SortNumeric.vue';
import Vue from 'vue'
import VueVirtualScroller from 'vue-virtual-scroller';
import { DynamicScroller } from 'vue-virtual-scroller';
import {DynamicScrollerItem} from 'vue-virtual-scroller';
import FacetSearchButton from '../buttons/FacetSearchButton.vue';

Vue.use(VueVirtualScroller)
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

export default {
    components: {
        SortAlpha,
        SortNumeric,
        DynamicScroller,
        DynamicScrollerItem,
        FacetSearchButton
    },
    data(){
        return {
          edition: [],
          searchString: '',
          isActive: false
        }
    },
     watch: {
      facets: function() {
        this.getEditions();
        this.searchString = ''
        this.isActive = false
      }
  },
    computed: {
      ...mapState({
        store: state => state,
        collapsed: state => state.facets.collapsed,
        sort: state => state.facets.sort,
        url: state => state.url,
        facets: state => state.search.facets})
    },
    methods: {
      toggleInputField(){
        this.isActive = !this.isActive;
    	},
      disableAllPopovers() {      
      this.$root.$emit('bv::hide::popover');
      this.$root.$emit('bv::disable::popover');
      this.$root.$emit('bv::enable::popover');
      },
      showPopover(id) {
        this.$root.$emit('bv::disable::popover');
        this.$root.$emit('bv::enable::popover', id);
      },
        // This method handles the displaying of an extended list, if there are more than a certain amount of results
        openExtendedList(target) {
            // TODO: continue on this for pseudo-async loading of list. Problem: collapse-variable-names are different (sent <-> namesSent)

            // Checks if the length of the given target-property (in this case 'editions')
            // of the prop 'extended' is not zero and toggles the 'collapsed'-Property in the state of the $store (true/false)
            if (this.edition.length > 5) {
                this.collapsed[target] = !this.collapsed[target];
            } else {
                // if the property is empty, then asign it the given target-Object and toggle collapsed
                this.collapsed[target] = !this.collapsed[target];
            }
        },
        getEditions() {
            const f = []
            // check if edition exists in facet and assign them, else assign empty array to edition-property
            const facets = (this.facets.edition) ? [...this.facets.edition] : [];
            facets.map((facet, index) => {
                f.push({
                    idno: facet.id,
                    key: facet.key,
                    count: facet.doc_count,
                    id: index,
                });
            });
            this.edition = [...f];
        },
        searchFacet(){
          const subList = []
            this.edition.map((item, index) => {
              if(item.key.toLowerCase().match(this.searchString.toLowerCase())){subList.push(item)}
            });
          return subList
        },
    }
}
</script>

<style>
</style>