<template>
  <!-- Facet: Datasets -->
 <b-list-group-item>
        <h3 v-bind:class="(datasets.length === 0) ? 'disabled' : ''">
          <b-link
            v-bind:disabled="datasets.length === 0"
            v-bind:aria-expanded="collapsed.datasetsAll ? 'true' : 'false'"
            aria-controls="datasetsCollapseAll"
            v-on:click="collapsed.datasetsAll = !collapsed.datasetsAll"
          >
            <font-awesome-icon
              v-bind:icon="'chevron-' + ((!collapsed.datasetsAll ||
                datasets.length === 0) ? 'right' : 'down')"
              class="mr-1"
            />
          </b-link>
          &#32;{{ store.labels.vals['facetHeadings.datasets'] }}
          <span class="facet-counter">({{(this.searchString)? searchFacet().length: this.datasets.length}})</span>
        </h3>
        <b-collapse
          v-if="datasets.length > 0"
          id="datasetsAllCollapseAll"
          v-model="collapsed.datasetsAll"
        >
          <div class="sort">
            <sort-alpha
              v-bind:sortTarget="'datasets'"
              v-bind:inputList="this.datasets">
            </sort-alpha>
            <sort-numeric
              v-bind:sortTarget="'datasets'"
              v-bind:inputList="this.datasets">
            </sort-numeric>
            <!-- <font-awesome-icon icon="search" class="facet-search "
              v-on:click="toggleInputField()"
              v-bind:class="{active: isActive}"/>
           <b-form-input v-if="isActive" type="text" class="input-facet" :placeholder="store.labels.vals['facets.search']" v-model="searchString"></b-form-input> -->
          </div>
          <!-- Dynamic Scroller Solution -->
          <dynamic-scroller          
          :items="(this.searchString)? searchFacet(): this.datasets"
          :min-item-size="54"
          class="scroller"
          >
            <template v-slot="{ item, index, active }">
              <dynamic-scroller-item
                :item="item"
                :active="active"
                :size-dependencies="[item.ref,]"
                :data-index="index"
                class="facetList list-group-item"
                v-bind:class="(url.facets.datasets.includes((item).ref)) ? 'facetActive' : ''"
              >
                <b-row class="p-0 m-0">
                <b-popover
                  v-bind:target="'datasetLink' + index"
                  triggers="hover"
                  placement="left"
                  boundary="viewport"
                  adaptivePosition="false"
                  :no-fade="true"
                >
                  {{ item.ref }}
                </b-popover>
              <b-col
                cols="8"
                class="p-0"
              >
                <b-link
                  v-if="item.ref !== undefined"
                  v-bind:id="'datasetLink' + index"
                  v-on:click="$parent.setFacet(item.ref, 't')"
                  v-on:mouseover="showPopover('datasetLink' + index)"
                  v-on:wheel="disableAllPopovers()"
                >
                  {{item.name}}
                </b-link>
                <span v-if="item.ref === undefined">{{ item.key}} </span>
                ({{ item.count }})
                
              </b-col>
                <b-col
                cols="4"
                class="p-0"
              >
                <font-awesome-icon
                  v-if="item.ref !== undefined && !url.facets.datasets.includes((item).ref)"
                  icon="plus-circle"
                  class="mt-1 float-right ml-1 facet-icons"
                  v-on:click="$parent.setFacet(item.ref, 't')"
                />
                <font-awesome-icon
                  v-if="item.ref !== undefined && url.facets.datasets.includes((item).ref)"
                  icon="times-circle"
                  class="mt-1 float-right ml-1 facet-icons"
                  v-on:click="$parent.removeFacet(item.ref, 't')"
                />
                <font-awesome-icon
                  v-if="item.ref !== undefined && !url.facets.datasets.includes((item).ref)"
                  icon="minus-circle"
                  class="mt-1 float-right ml-1 facet-icons"
                  v-on:click="$parent.exceptFacet(item.ref, 't')"
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
      datasets: [],
      
          searchString: '',
          isActive: false
    }
  },
  watch: {
      facets: function() {
        this.getDatasets();
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
          if (this.datasets.length > 5) {
              this.collapsed[target] = !this.collapsed[target];
          } 
          else {
              this.collapsed[target] = !this.collapsed[target];
          }
      },
      getDatasets() {
        // check if datasets exists in facet and assign them, else assign empty array to datasets-property
        const f = [];
        // if datasets exist in facets, assign them, else assign empty array
        const facets = (this.facets.datasets) ? this.facets.datasets : [];
        // for facet in facets-array check if canonical_ref and label_de_ungendered exist
        facets.map((facet, index) => {
          if (
            facet.ref.hits.hits[0]._source.ref
            && facet.ref.hits.hits[0]._source.ref != 'pdb18-retro'
            && facet.ref.hits.hits[0]._source.label_de
          ) {
            // if true, push facet name, ref, and count to f-array
            f.push({
              name: (this.lang === 'en')? facet.ref.hits.hits[0]._source.label_en : facet.ref.hits.hits[0]._source.label_de,
              ref: facet.ref.hits.hits[0]._source.ref,
              count: facet.doc_count,
              id: index
            });
          }
        });
        // set f-array to occupations-property 
        this.datasets = [...f];
      },
      searchFacet(){
      const subList = []
        this.datasets.map((item, index) => {
          if(item.name.toLowerCase().match(this.searchString.toLowerCase())){subList.push(item)}
        });
      return subList
    },
  }
}
</script>

<style>
</style>