<template>
    <!-- Facet: All CMIF files -->
    <b-list-group-item>
    <h3
        v-bind:class="(cmif.length === 0) ? 'disabled' : ''"
    >
        <b-link
        v-bind:disabled="cmif.length === 0"
        v-bind:aria-expanded="collapsed.cmifAll ? 'true' : 'false'"
        aria-controls="cmifCollapseAll"
        v-on:click="collapsed.cmifAll = !collapsed.cmifAll"
        >
        <font-awesome-icon
            v-bind:icon="'chevron-' + ((!collapsed.cmifAll || facets.cmif.length
            === 0) ? 'right' : 'down')"
            class="mr-1"
        />
        </b-link> {{ store.labels.vals['facetHeadings.cmif'] }}
        <span class="facet-counter">({{(this.searchString)? searchFacet().length: this.cmif.length}})</span>
    </h3>
    <b-collapse
        v-if="cmif.length > 0"
        id="cmifCollapseAll"
        v-model="collapsed.cmifAll"
    >
        <div class="sort">
            <sort-alpha
                v-bind:sortTarget="'cmif'"
                v-bind:inputList="this.cmif">
            </sort-alpha>
            <sort-numeric
                v-bind:sortTarget="'cmif'"
                v-bind:inputList="this.cmif">
            </sort-numeric>
            <font-awesome-icon icon="search" class="facet-search "
              v-on:click="toggleInputField()"
              v-bind:class="{active: isActive}"/>
            <b-form-input v-if="isActive" type="text" class="input-facet" :placeholder="store.labels.vals['facets.search']" v-model="searchString"></b-form-input>
        </div>
        <!-- Dynamic Scroller Solution -->
          <dynamic-scroller          
          :items="(this.searchString)? searchFacet(): this.cmif"
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
                v-bind:class="(url.facets.cmif.includes((item).idno.buckets[0].key)) ? 'facetActive' : ''"
              >
                <b-row class="p-0 m-0">
                <b-popover
                  v-bind:target="'cmifLink' + index"
                  triggers="hover"
                  placement="left"
                  boundary="viewport"
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
                  v-bind:id="'cmifLink' + index"
                  v-on:click="$parent.setFacet(item.idno.buckets[0].key, 'c')"
                  v-on:mouseover="showPopover('cmifLink' + index)"
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
                  v-if="item.idno.buckets[0].key !== undefined && !url.facets.cmif.includes(item.idno.buckets[0].key)"
                  icon="plus-circle"
                  class="mt-1 float-right ml-1 facet-icons"
                  v-on:click="$parent.setFacet(item.idno.buckets[0].key, 'c')"
                />
                <font-awesome-icon
                  v-if="item.idno.buckets[0].key !== undefined && url.facets.cmif.includes(item.idno.buckets[0].key)"
                  icon="times-circle"
                  class="mt-1 float-right ml-1 facet-icons"
                  v-on:click="$parent.removeFacet(item.idno.buckets[0].key, 'c')"
                />
                <font-awesome-icon
                  v-if="item.idno.buckets[0].key !== undefined && !url.facets.cmif.includes(item.idno.buckets[0].key)"
                  icon="minus-circle"
                  class="mt-1 float-right ml-1 facet-icons"
                  v-on:click="$parent.exceptFacet(item.idno.buckets[0].key, 'c')"
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

// Vue.component('RecycleScroller', RecycleScroller)

Vue.use(VueVirtualScroller)
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

export default {
    components: {
        SortAlpha,
        SortNumeric,
        DynamicScroller,
        DynamicScrollerItem,
        FacetSearchButton
        // RecycleScroller
    },
    data() {
        return {
          cmif: [],
          searchString: '',
          isActive: false
        }
    },
    watch: {
      facets: function() {
        this.getCmifs();
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
        openExtendedList(target) {
        // TODO: continue on this for pseudo-async loading of list. Problem: collapse-variable-names are different (sent <-> namesSent)
            if (this.cmif.length > 5) {
                this.collapsed[target] = !this.collapsed[target];
            } 
            else {
                this.collapsed[target] = !this.collapsed[target];
            }
        },
        getCmifs() {
            const f = []
            // check if cmif exists in facet and assign them, else assign empty array to cmif-property
            const facets = (this.facets.cmif) ? [...this.facets.cmif] : [];

            facets.map((facet, index) => {
        
          // if true, push facet name, ref, and count to f-array
          f.push({
            idno: facet.idno,
            key: facet.key,
            count: facet.doc_count,
            id: index,
          });
          // id = id++
      });
      // set f-array to cmifs-property 
      this.cmif = [...f];
      },
      searchFacet(){
        const subList = []
          this.cmif.map((item, index) => {
            if(item.key.toLowerCase().match(this.searchString.toLowerCase())){subList.push(item)}
          });
        return subList
      },
    }
}
</script>

<style>
</style>