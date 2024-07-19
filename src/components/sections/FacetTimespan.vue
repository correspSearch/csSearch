<template>
  <!-- Facet: Dates -->
      <b-list-group-item>
        <h3
          v-bind:class="(facets.dates.length === 0) ? 'disabled' : ''">
          <b-link
            v-bind:aria-expanded="collapsed.datesAll ? 'true' : 'false'"
            v-bind:disabled="facets.dates.length === 0"
            aria-controls="datesCollapseAll"
            v-on:click="collapsed.datesAll = !collapsed.datesAll"
          >
            <font-awesome-icon
              v-bind:icon="'chevron-' + ((!collapsed.datesAll || facets.dates.length
                === 0) ? 'right' : 'down')"
              class="mr-1"
            />
          </b-link>
          &#32;{{ store.labels.vals['facetHeadings.dates'] }}
          <span class="facet-counter">({{(this.searchString)? searchFacet().length: this.dates.length}})</span>
        </h3>
        <b-collapse
          v-if="facets.dates.length > 0"
          id="datesAllCollapseAll"
          v-model="collapsed.datesAll"
        >
          <div id="csYearChart" />
          <div class="sort">
            <sort-alpha
            v-bind:sortTarget="'dates'"
            v-bind:inputList="this.dates">
            </sort-alpha>
            <sort-numeric
            v-bind:sortTarget="'dates'"
            v-bind:inputList="this.dates">
            </sort-numeric>
            <font-awesome-icon icon="search" class="facet-search "
              v-on:click="toggleInputField()"
              v-bind:class="{active: isActive}"/>
            <b-form-input v-if="isActive" type="text" class="input-facet" :placeholder="store.labels.vals['facets.search']" v-model="searchString"></b-form-input>
          </div>
          <dynamic-scroller          
            :items="(this.searchString)? searchFacet(): this.dates"
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
                  v-bind:class="(url.facets.dates.includes((item).name)) ? 'facetActive' : ''"
                >
                <b-row class="p-0 m-0">
                <b-col
                  cols="8"
                  class="p-0"
                >
                  <b-link
                    v-if="item.name !== undefined"
                    v-bind:id="'dateLink' + index"
                    v-on:click="$parent.setFacet(item.name, 'd')"
                  >
                    {{item.name}}
                  </b-link>
                  <span v-if="item.name === undefined">{{ item.name}} </span>
                  ({{ item.count }})
                  
                </b-col>
                 <b-col
                  cols="4"
                  class="p-0"
                >
                  <font-awesome-icon
                    v-if="item.name !== undefined && !url.facets.dates.includes(item.name)"
                    icon="plus-circle"
                    class="mt-1 float-right ml-1 facet-icons"
                    v-on:click="$parent.setFacet(item.name, 'd')"
                  />
                  <font-awesome-icon
                    v-if="item.name !== undefined && url.facets.dates.includes(item.name)"
                    icon="times-circle"
                    class="mt-1 float-right ml-1 facet-icons"
                    v-on:click="$parent.removeFacet(item.name, 'd')"
                  />
                  <font-awesome-icon
                    v-if="item.name !== undefined && !url.facets.dates.includes(item.name)"
                    icon="minus-circle"
                    class="mt-1 float-right ml-1 facet-icons"
                    v-on:click="$parent.exceptFacet(item.name, 'd')"
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
        dates: [],
        searchString: '',
        isActive: false
      }
    },
    computed: {
      ...mapState({
        store: state => state,
        facets: state => state.search.facets, 
        collapsed: state => state.facets.collapsed,
        sort: state => state.facets.sort,
        url: state => state.url,
      })
    },
    watch: {
      facets() {
        new Promise((resolve) => {
          this.getDates();
          resolve();
        }).then(() => {
          this.$parent.updateChart();
        });
        
        this.searchString = ''
        this.isActive = false
      }
  },
  methods: {
    toggleInputField(){
        this.isActive = !this.isActive;
    },
    // See description at ./FacetEditions.vue
    openExtendedList(target) {
      // TODO: continue on this for pseudo-async loading of list. Problem: collapse-variable-names are different (sent <-> namesSent)
      if (this.dates.length > 5) {
        this.collapsed[target] = !this.collapsed[target];
      } else {
        this.collapsed[target] = !this.collapsed[target];
      }
    },
    getDates() {
      const f = [];
      // check if dates exist in facets and assign them, if not assign an empty array
      const facets = (this.facets.dates) ? this.facets.dates : [];
      facets.map((facet, index) => {
        // Check if key_as_string exists in facet, if yes...
        if (facet.key_as_string) {
          // add name and count of facet to array
          f.push({
            name: facet.key_as_string,
            count: facet.doc_count,
            id: index
          });
        }
      });
      // pass on the f-array to dates-property when DOM has been updated
      this.$nextTick(() => {
        this.dates = [...f];
      });
    },
    searchFacet(){
      const subList = []
        this.dates.map((item, index) => {
          if(item.name.toLowerCase().match(this.searchString.toLowerCase())){subList.push(item)}
        });
      return subList
    },
  }
}
</script>

<style>
</style>