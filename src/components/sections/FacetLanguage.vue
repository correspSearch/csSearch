<template>
  <!-- Facet: Language -->
  <b-list-group-item >
     <h3
        v-bind:class="(this.languages.length === 0 || (this.languages.length === 1 && this.languages[0].ref ==='unknown' && this.url.facets.languages!='unknown')) ? 'disabled' : ''">
      <collapse-facet-header 
      aria-controls="languageAllCollapseAll"
      v-bind:targetFacet="this.targetFacet"
       v-bind:targetFacetAll="this.targetFacetAll"></collapse-facet-header>
      &#32;{{ store.labels.vals['facetHeadings.writtenLang'] }}
      <span class="facet-counter">({{(this.searchString)? searchFacet().length: this.languages.length}})</span>
     </h3>
     <b-collapse
          v-if="facets.languages.length > 0"
          id="languagesAllCollapseAll"
          v-model="collapsed.languagesAll"
          >
        <!-- v-bind:class="(this.languages.length === 1 && this.languages[0].ref ==='unknown') ? 'disabled disabled-lang' : ''" -->
        <!-- Sort Button Alphabetical -->
            <div class="sort"
            v-if="!(this.languages.length === 1 && this.languages[0].ref ==='unknown')">
            <sort-alpha 
            v-bind:sortTarget="'languages'"
            v-bind:inputList="this.languages"
            />
            <!--v-bind:inputExtendedList="this.extended"-->
            <!-- Sort Button Numerical -->
             <sort-numeric 
            v-bind:sortTarget="'languages'"
            v-bind:inputList="this.languages"
            />
            <font-awesome-icon icon="search" class="facet-search "
              v-on:click="toggleInputField()"
              v-bind:class="{active: isActive}"/>
            <b-form-input v-if="isActive" type="text" class="input-facet" :placeholder="store.labels.vals['facets.search']" v-model="searchString"></b-form-input>
            </div>
            <!-- Dynamic Scroller Solution -->
          <dynamic-scroller          
          :items="(this.searchString)? searchFacet(): this.languages"
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
                v-bind:class="(url.facets.languages.includes((item).ref)) ? 'facetActive' : ''"
              >
                <b-row class="p-0 m-0">
                <b-popover
                  v-bind:target="'languageLink' + index"
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
                  v-if="item.ref !== undefined && !(languages.length === 1 && item.ref ==='unknown')"
                  v-bind:id="'languageLink' + index"
                  v-on:click="$parent.setFacet(item.ref, 'wl')"
                  v-on:mouseover="showPopover('languageLink' + index)"
                  v-on:wheel="disableAllPopovers()"
                >
                  {{item.name}}
                </b-link>
                <span
                  v-else-if="languages.length === 1 && item.ref ==='unknown'"
                  v-bind:id="'languageLink' + index"
                  v-on:mouseover="showPopover('languageLink' + index)"
                  v-on:wheel="disableAllPopovers()"
                >
                  {{item.name}}
                </span>
                <span v-if="item.ref === undefined">{{ item.key}} </span>
                ({{ item.count }})
                
              </b-col>
                <b-col
                cols="4"
                class="p-0"
              >
                <font-awesome-icon
                  v-if="item.ref !== undefined && !url.facets.languages.includes((item).ref) && !(languages.length === 1 && item.ref ==='unknown')"
                  icon="plus-circle"
                  class="mt-1 float-right ml-1 facet-icons"
                  v-on:click="$parent.setFacet(item.ref, 'wl')"
                />
                <font-awesome-icon
                  v-if="item.ref !== undefined && url.facets.languages.includes((item).ref)"
                  icon="times-circle"
                  class="mt-1 float-right ml-1 facet-icons"
                  v-on:click="$parent.removeFacet(item.ref, 'wl')"
                />
                <font-awesome-icon
                  v-if="item.ref !== undefined && !url.facets.languages.includes((item).ref)&& !(languages.length === 1 && item.ref ==='unknown')"
                  icon="minus-circle"
                  class="mt-1 float-right ml-1 facet-icons"
                  v-on:click="$parent.exceptFacet(item.ref, 'wl')"
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
import CollapseFacetHeader from '../buttons/CollapseFacetHeader.vue';
import SortAlpha from '../buttons/SortAlpha.vue';
import SortNumeric from '../buttons/SortNumeric.vue';
import AddButton from '../buttons/AddButton.vue';
import ExcludeButton from '../buttons/ExcludeButton.vue';
import RemoveButton from '../buttons/RemoveButton.vue';
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
        CollapseFacetHeader,
        AddButton,
        ExcludeButton,
        RemoveButton,
        FacetSearchButton
   
    },
    data(){
        return {
            targetFacet: 'languages',
            targetFacetAll: 'languagesAll',
            languages: [],
            searchString: '',
            isActive: false
        }
    },
    watch: {
    //Facets
    facets: function () {
      this.getLanguages();
      this.searchString = ''
      this.isActive = false
    }
  },
    computed: {
      ...mapState({
        store: state => state,
        facets: state => state.search.facets,
        collapsed: state => state.facets.collapsed,
        sort: state => state.facets.sort,
        url: state => state.url,
        lang: state => state.lang})
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
      getLanguages() {
      // check if datasets exists in facet and assign them, else assign empty array to datasets-property
      const f = [];
      // if datasets exist in facets, assign them, else assign empty array
      const facets = (this.facets.languages) ? this.facets.languages : [];
      // for facet in facets-array check if canonical_ref and label_de_ungendered exist
      facets.map((facet, index) => {
        if (
          facet.ref.hits.hits[0]._source.ref
          && facet.ref.hits.hits[0]._source.label_de
        ) {
          // if true, push facet languages ref, and count to f-array
          f.push({
            name: (this.lang === 'de')? facet.ref.hits.hits[0]._source.label_de : facet.ref.hits.hits[0]._source.label_en,
            ref: facet.ref.hits.hits[0]._source.ref,
            count: facet.doc_count,
            id: index
          });
        }
      });
      // set f-array to occupations-property 
      this.languages = [...f];
    },
    searchFacet(){
      const subList = []
        this.languages.map((item, index) => {
          if(item.name.toLowerCase().match(this.searchString.toLowerCase())){subList.push(item)}
        });
      return subList
    },
      // See description at ./FacetEditions.vue
      openExtendedList(target) {
        // TODO: continue on this for pseudo-async loading of list. 
        if (this.languages.length > 5) {
          this.collapsed[target] = !this.collapsed[target];
        } else {
          this.collapsed[target] = !this.collapsed[target];
        }
      },
    callTriggerSearch(){
      console.log('calling trigger(search)',
      this.$parent.trigger('search'))
    }
    }
}
</script>

<style>
</style>