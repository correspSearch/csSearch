<template>
  <!-- Facet: All Occupations -->
      <b-list-group-item>
        <h3
          v-bind:class="(occupationsList.length === 0) ? 'disabled' : ''"
        >
          <b-link
            v-bind:disabled="occupationsList.length === 0"
            v-bind:aria-expanded="collapsed.occupationsAll ? 'true' : 'false'"
            aria-controls="occupationsCollapseAll"
            v-on:click="collapsed.occupationsAll = !collapsed.occupationsAll"
          >
            <font-awesome-icon
              v-bind:icon="'chevron-' + ((!collapsed.occupationsAll ||
                occupationsList.length === 0) ? 'right' : 'down')"
              class="mr-1"
            />
          </b-link>
          &#32;{{ store.labels.vals['facetHeadings.occupations'] }}
          <span class="facet-counter">({{(this.searchString)? searchFacet().length: this.occupationsList.length}})</span>
        </h3>
        <b-collapse
          v-if="occupationsList.length > 0"
          id="occupationsAllCollapseAll"
          v-model="collapsed.occupationsAll"
        >
          <div class="sort">
            <sort-alpha
            v-bind:sortTarget="'occupations'"
            v-bind:inputList="this.occupationsList">
            </sort-alpha>
            <sort-numeric
            v-bind:sortTarget="'occupations'"
            v-bind:inputList="this.occupationsList">
            </sort-numeric>
            <font-awesome-icon icon="search" class="facet-search "
              v-on:click="toggleInputField()"
              v-bind:class="{active: isActive}"/>
            <b-form-input v-if="isActive" type="text" class="input-facet" :placeholder="store.labels.vals['facets.search']" v-model="searchString"></b-form-input>
          </div>
          <!-- <div> -->
          <!-- Dynamic Scroller Solution -->
          <dynamic-scroller          
          :items="(this.searchString)? searchFacet(): this.occupationsList"
          :min-item-size="54"
          class="scroller"
          >
            <template v-slot="{ item, index, active }">
              <dynamic-scroller-item
                :item="item"
                :active="active"
                :size-dependencies="[item.name,]"
                :data-index="index"
                class="facetList list-group-item"
                v-bind:class="(url.facets.occupations.includes((item).ref)) ? 'facetActive' : ''"
              >
                <b-row class="p-0 m-0">
                <b-popover
                  v-bind:target="'occupationLink' + index"
                  triggers="hover"
                  :no-fade="true"
                  boundary="viewport"
                  placement="left"
                  adaptivePosition="false"
                >
                  {{ item.ref }}
                </b-popover>
              <b-col
                cols="8"
                class="p-0"
              >
                <b-link
                  v-if="item.ref !== undefined"
                  v-bind:id="'occupationLink' + index"
                  v-on:click="$parent.setFacet(item.ref, 'o')"
                  v-on:mouseover="showPopover('occupationLink' + index)"
                  v-on:wheel="disableAllPopovers()"
                >
                  {{item.name}}
                </b-link>
                <span v-if="item.ref === undefined">{{ item.name}} </span>
                ({{ item.count }})
                
              </b-col>
                <b-col
                cols="4"
                class="p-0"
              >
                <font-awesome-icon
                  v-if="item.ref !== undefined && !url.facets.occupations.includes(item.ref)"
                  icon="plus-circle"
                  class="mt-1 float-right ml-1 facet-icons"
                  v-on:click="$parent.setFacet(item.ref, 'o')"
                />
                <font-awesome-icon
                  v-if="item.ref !== undefined && url.facets.occupations.includes(item.ref)"
                  icon="times-circle"
                  class="mt-1 float-right ml-1 facet-icons"
                  v-on:click="$parent.removeFacet(item.ref, 'o')"
                />
                <font-awesome-icon
                  v-if="item.ref !== undefined && !url.facets.occupations.includes(item.ref)"
                  icon="minus-circle"
                  class="mt-1 float-right ml-1 facet-icons"
                  v-on:click="$parent.exceptFacet(item.ref, 'o')"
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
        FacetSearchButton,
    },
    computed: {
      ...mapState({
        facets: state => state.search.facets,
        store: state => state,
        collapsed: state => state.facets.collapsed,
        sort: state => state.facets.sort,
        url: state => state.url,
        lang: state => state.lang})
    },
    data (){
      return {
      occupationsList : [],
      searchString: '',
      isActive: false
      }
    },
    watch: {
      facets: function () {
        this.getOccupations();
        this.searchString = ''
      }
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
      getOccupations() {
      const f = [];
      // if occupations exist in facets, assign them, else assign empty array
      const facets = (this.facets.occupations) ? this.facets.occupations : [];
      // for facet in facets-array check if canonical_ref and label_de_ungendered exist
      facets.map((facet, index) => {
        if (
          facet.ref.hits.hits[0]._source.canonical_ref
          && facet.ref.hits.hits[0]._source.label_de_ungendered
        ) {
          // if true, push facet name, ref, and count to f-array
          f.push({
            name: (this.lang === 'de')? facet.ref.hits.hits[0]._source.label_de_ungendered : facet.ref.hits.hits[0]._source.label_en_ungendered,
            ref: facet.ref.hits.hits[0]._source.canonical_ref,
            count: facet.doc_count,
            id: index,
          });
        }
      });
      // set f-array to occupations-property 
      this.occupationsList = [...f];
    },
    searchFacet(){
      const subList = []
        this.occupationsList.map((item, index) => {
          if(item.name.toLowerCase().match(this.searchString.toLowerCase())){subList.push(item)}
        });
      return subList
    },
        // described in FacetEditions.vue
        openExtendedList(target) {
        // TODO: continue on this for pseudo-async loading of list. Problem: collapse-variable-names are different (sent <-> namesSent)
            if (this.occupationsList.length > 5) {
                this.collapsed[target] = !this.collapsed[target];
            } else {
                this.collapsed[target] = !this.collapsed[target];
            }
        }
    }
}
</script>

<style>
</style>