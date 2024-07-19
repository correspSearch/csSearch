<template>
        <!-- Facet: All places -->
      <b-list-group-item>
        <h3
          v-bind:class="(places.length === 0) ? 'disabled' : ''"
        >
          <b-link
            v-bind:disabled="places.length === 0"
            v-bind:aria-expanded="collapsed.placesAllAll ? 'true' : 'false'"
            aria-controls="placesAllCollapseAll"
            v-on:click="collapsed.placesAllAll = !collapsed.placesAllAll"
          >
            <font-awesome-icon
              v-bind:icon="'chevron-' + ((!collapsed.placesAllAll || places.length
                === 0) ? 'right' : 'down')"
              class="mr-1"
            />
          </b-link> {{ store.labels.vals['facetHeadings.places'] }}
          <span class="facet-counter">({{(this.searchString)? searchFacet().length: this.places.length}})</span>
        </h3>
        <b-collapse
          v-if="places.length > 0"
          id="placesAllCollapseAll"
          v-model="collapsed.placesAllAll"
        >
          <div class="sort">
            <sort-alpha
            v-bind:sortTarget="'places'"
            v-bind:inputList="this.places">
            </sort-alpha>
            <sort-numeric
            v-bind:sortTarget="'places'"
            v-bind:inputList="this.places">
            </sort-numeric>  
            <font-awesome-icon icon="search" class="facet-search "
              v-on:click="toggleInputField()"
              v-bind:class="{active: isActive}"/>
            <b-form-input v-if="isActive" type="text" class="input-facet" :placeholder="store.labels.vals['facets.search']" v-model="searchString"></b-form-input>
          </div>
          <!-- Dynamic Scroller Solution -->
          <dynamic-scroller          
            :items="(this.searchString)? searchFacet(): this.places"
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
                  v-bind:class="(url.facets.places.includes((item).ref)) ? 'facetActive' : ''"
                >
                 <b-row class="p-0 m-0">
                  <b-popover
                    v-bind:target="'placeLink' + index"
                    triggers="hover"
                    boundary="viewport"
                    placement="left"
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
                    v-bind:id="'placeLink' + index"
                    v-on:click="$parent.setFacet(item.ref, 'p')"
                    v-on:mouseover="showPopover('placeLink' + index)"
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
                    v-if="item.ref !== undefined && !url.facets.places.includes(item.ref)"
                    icon="plus-circle"
                    class="mt-1 float-right ml-1 facet-icons"
                    v-on:click="$parent.setFacet(item.ref, 'p')"
                  />
                  <font-awesome-icon
                    v-if="item.ref !== undefined && url.facets.places.includes(item.ref)"
                    icon="times-circle"
                    class="mt-1 float-right ml-1 facet-icons"
                    v-on:click="$parent.removeFacet(item.ref, 'p')"
                  />
                  <font-awesome-icon
                    v-if="item.ref !== undefined && !url.facets.places.includes(item.ref)"
                    icon="minus-circle"
                    class="mt-1 float-right ml-1 facet-icons"
                    v-on:click="$parent.exceptFacet(item.ref, 'p')"
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
  data() {
      return {
        places: [],
        searchString: '',
        isActive: false
      }
  },
  watch: {
    facets() {
        this.getPlaces();
        this.searchString = ''
        this.isActive = false
    },
  },
  computed: {
    ...mapState({
      store: state => state,
      collapsed: state => state.facets.collapsed,
      facets: state => state.search.facets,
      sort: state => state.facets.sort,
      url: state => state.url})
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
    getPlaces() {
      const f = [];
      // if places exist in facets, assign these. Else assign empty array 
      const facets = (this.facets.places) ? this.facets.places : [];
      facets.map((facet, index) => {
        // check if there is a _source.canonical_ref and _source.text
        if (
          facet.ref.hits.hits[0]._source.canonical_ref
          && facet.ref.hits.hits[0]._source.text
        ) {
          // if true, push facet name, ref, and count to f-array
          f.push({
            name: facet.ref.hits.hits[0]._source.text,
            ref: facet.ref.hits.hits[0]._source.canonical_ref,
            count: facet.doc_count,
            id: index
          });
        }
      });
      // set f-array to places-property
      this.places = [...f];
    },
    searchFacet(){
      const subList = []
        this.places.map((item, index) => {
          if(item.name.toLowerCase().match(this.searchString.toLowerCase())){subList.push(item)}
        });
      return subList
    },
    // See description at ./FacetEditions.vue
    openExtendedList(target) {
      // TODO: continue on this for pseudo-async loading of list. Problem: collapse-variable-names are different (sent <-> namesSent)
      if (this.places.length > 5) {
        this.collapsed[target] = !this.collapsed[target];
      } else {
        // this.extended[target] = [...this[target]];
        this.collapsed[target] = !this.collapsed[target];
      }
    }
  }
}
</script>

<style>
</style>