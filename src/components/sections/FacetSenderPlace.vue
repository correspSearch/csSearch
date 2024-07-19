<template>
        <!-- Facet: All sender places -->
      <b-list-group-item>
        <h4
          v-bind:class="(placesSent.length === 0) ? 'disabled' : ''"
        >
          <b-link
            v-bind:disabled="placesSent.length === 0"
            v-bind:aria-expanded="collapsed.placesSentAll ? 'true' : 'false'"
            aria-controls="placesSentCollapseAll"
            v-on:click="collapsed.placesSentAll = !collapsed.placesSentAll"
          >
            <font-awesome-icon
              v-bind:icon="'chevron-' + ((!collapsed.placesSentAll ||
                placesSent.length === 0) ? 'right' : 'down')"
              class="mr-1"
            />
          </b-link> {{ store.labels.vals['facetHeadings.sendingPlace'] }}
          <span class="facet-counter">({{(this.searchString)? searchFacet().length: this.placesSent.length}})</span>
        </h4>
        <b-collapse
          v-if="placesSent.length > 0"
          id="placesSentCollapseAll"
          v-model="collapsed.placesSentAll"
        >
          <b-list-group flush>
            <!-- Sort Button Alphabetical -->
            <div class="sort">
            <sort-alpha 
            v-bind:sortTarget="'placesSent'"
            v-bind:inputList="this.placesSent"
            />
            <!-- Sort Button Numerical -->
             <sort-numeric 
            v-bind:sortTarget="'placesSent'"
            v-bind:inputList="this.placesSent"
            />
            <font-awesome-icon icon="search" class="facet-search "
              v-on:click="toggleInputField()"
              v-bind:class="{active: isActive}"/>
            <b-form-input v-if="isActive" type="text" class="input-facet" :placeholder="store.labels.vals['facets.search']" v-model="searchString"></b-form-input>
            </div>
            <!-- Dynamic Scroller Solution -->
          <dynamic-scroller          
            :items="(this.searchString)? searchFacet(): this.placesSent"
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
                    v-bind:target="'placesSentLink' + index"
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
                    v-bind:id="'placesSentLink' + index"
                    v-on:click="$parent.setFacet(item.ref, 'p', 's')"
                    v-on:mouseover="showPopover('placesSentLink' + index)"
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
                    v-on:click="$parent.setFacet(item.ref, 'p', 's')"
                  />
                  <font-awesome-icon
                    v-if="item.ref !== undefined && url.facets.places.includes(item.ref)"
                    icon="times-circle"
                    class="mt-1 float-right ml-1 facet-icons"
                    v-on:click="$parent.removeFacet(item.ref, 'p', 's')"
                  />
                  <font-awesome-icon
                    v-if="item.ref !== undefined && !url.facets.places.includes(item.ref)"
                    icon="minus-circle"
                    class="mt-1 float-right ml-1 facet-icons"
                    v-on:click="$parent.exceptFacet(item.ref, 'p', 's')"
                  />
                </b-col>
                </b-row>
                </dynamic-scroller-item>
              </template>
            </dynamic-scroller>
          </b-list-group>
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
  data () {
    return {
      placesSent: [],
      searchString: '',
      isActive: false
    }
  },
  watch: {
    //Facets
    facets() {
        this.getPlacesSent();
        this.searchString = ''
        this.isActive = false
    }
  },
  created() {
    this.getPlacesSent();
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
    getPlacesSent() {
      const f = [];
      // check if placesRoles exists in facets and assign them, else assign empty array
      const facets = (this.facets.placesRoles) ? this.facets.placesRoles : [];
      facets.map((facet, index) => {
        // check if facet has 3 items in key and that the 3rd is equal to 'sent'
        if (facet.key[2] === 'sent'
          && facet.key[0]
          && facet.key[1]
        ) {
          // if true, push facet name, ref, count, and role to f-array
          f.push({
            name: facet.key[0],
            ref: facet.key[1],
            count: facet.doc_count,
            role: facet.key[2],
            id: index
          });
        }
      });
      // set f-array to the placesSent-property
      this.placesSent = [...f];
    },
    searchFacet(){
      const subList = []
        this.placesSent.map((item, index) => {
          if(item.name.toLowerCase().match(this.searchString.toLowerCase())){subList.push(item)}
        });
      return subList
    },
    // See description at ./FacetEditions.vue
    openExtendedList(target) {
      // TODO: continue on this for pseudo-async loading of list. Problem: collapse-variable-names are different (sent <-> namesSent)
      if (this.placesSent.length > 5) {
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