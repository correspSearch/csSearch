<template>
  <!-- Facet: All names -->
      <b-list-group-item>
        <!-- <div>Test names: {{names}}</div> -->
        <h3
          v-bind:class="(names.length === 0) ? 'disabled' : ''"
        >
          <b-link
            v-bind:disabled="names.length === 0"
            v-bind:aria-expanded="collapsed.namesAllAll ? 'true' : 'false'"
            aria-controls="namesAllCollapseAll"
            v-on:click="collapsed.namesAllAll = !collapsed.namesAllAll"
          >
            <font-awesome-icon
              v-bind:icon="'chevron-' + ((!collapsed.namesAllAll || names.length ===
                0) ? 'right' : 'down')"
              class="mr-1"
            />
          </b-link>
          &#32;{{ store.labels.vals['facetHeadings.persons'] }} 
          <span class="facet-counter">({{(this.searchString)? searchFacet().length: this.names.length}})</span>
          <!-- check label situation -->
        </h3>
        <b-collapse
          v-if="names.length > 0"
          id="namesAllCollapseAll"
          v-model="collapsed.namesAllAll"
        >
          <div class="sort">
            <sort-alpha
            v-bind:sortTarget="'names'"
            v-bind:inputList="this.names">
            </sort-alpha>
            <sort-numeric
            v-bind:sortTarget="'names'"
            v-bind:inputList="this.names">
            </sort-numeric>
            <font-awesome-icon icon="search" class="facet-search "
              v-on:click="toggleInputField()"
              v-bind:class="{active: isActive}"/>
            <b-form-input v-if="isActive" type="text" class="input-facet" :placeholder="store.labels.vals['facets.search']" v-model="searchString"></b-form-input>
          </div>
          <dynamic-scroller          
            :items="(this.searchString)? searchFacet(): this.names"
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
                  v-bind:class="(url.search.includes((item).ref)) ? 'facetActive' : ''"
                >
                 <b-row class="p-0 m-0">
                  <b-popover
                    v-bind:target="'nameLink' + index"
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
                    v-bind:id="'nameLink' + index"
                    v-on:click="$parent.setFacet(item.ref, 's')"
                    v-on:mouseover="showPopover('nameLink' + index)"
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
                    v-if="item.ref !== undefined && !url.search.includes(item.ref)"
                    icon="plus-circle"
                    class="mt-1 float-right ml-1 facet-icons"
                    v-on:click="$parent.setFacet(item.ref, 's')"
                  />
                  <font-awesome-icon
                    v-if="item.ref !== undefined && url.search.includes(item.ref)"
                    icon="times-circle"
                    class="mt-1 float-right ml-1 facet-icons"
                    v-on:click="$parent.removeFacet(item.ref, 's')"
                  />
                  <font-awesome-icon
                    v-if="item.ref !== undefined && !url.search.includes(item.ref)"
                    icon="minus-circle"
                    class="mt-1 float-right ml-1 facet-icons"
                    v-on:click="$parent.exceptFacet(item.ref, 's')"
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
  props: {
  },
  data () {
    return {
      names: [],
      searchString: '',
      isActive: false
    }
  },
  watch: {
    facets() {
        this.getNames();
        this.searchString = ''
        this.isActive = false
    },
  },
  computed: {
    ...mapState({
      store: state => state,
      facets: state => state.search.facets,
      collapsed: state => state.facets.collapsed,
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
    getNames() {
      const f = [];
      // check if names exist in facets and assign them, if not assign an empty array
      const facets = (this.facets.names) ? this.facets.names : [];
      facets.map((facet, index) => {
        // check if canonical_name and canonical_ref exists in facet
        if (
          facet.canonical_ref.hits.hits[0]._source.canonical_name
          && facet.canonical_ref.hits.hits[0]._source.canonical_ref
        ) {
          // if true, the facet name, ref, and count is pushed to the f-array
          f.push({
            name: facet.canonical_ref.hits.hits[0]._source.canonical_name,
            ref: facet.canonical_ref.hits.hits[0]._source.canonical_ref,
            count: facet.doc_count,
            id: index
          });
        }
      });
      //  set the f-array to the names-property after the DOM has updated
      this.$nextTick(() => {
        this.names = [...f];
      });
    },
    searchFacet(){
      const subList = []
        this.names.map((item, index) => {
          if(item.name.toLowerCase().match(this.searchString.toLowerCase())){subList.push(item)}
        });
      return subList
    },
    //described in FacetEditions.vue
    openExtendedList(target) {
      // TODO: continue on this for pseudo-async loading of list. Problem: collapse-variable-names are different (sent <-> namesSent)
      if (this.names.length > 5) {
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