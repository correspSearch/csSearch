<template>
        <!-- Facet: All receiver names -->
      <b-list-group-item>
        <h4
          v-bind:class="(namesReceived.length === 0) ? 'disabled' : ''"
        >
          <b-link
            v-bind:disabled="namesReceived.length === 0"
            v-bind:aria-expanded="collapsed.namesReceivedAll ? 'true' : 'false'"
            aria-controls="namesReceivedCollapseAll"
            v-on:click="collapsed.namesReceivedAll = !collapsed.namesReceivedAll"
          >
            <font-awesome-icon
              v-bind:icon="'chevron-' + ((!collapsed.namesReceivedAll ||
                namesReceived.length === 0) ? 'right' : 'down')"
              class="mr-1"
            />
          </b-link>
          &#32;{{ store.labels.vals['facetHeadings.receiver'] }}
          <span class="facet-counter">({{(this.searchString)? searchFacet().length: this.namesReceived.length}})</span>
        </h4>
        <b-collapse
          v-if="namesReceived.length > 0"
          id="namesReceivedCollapseAll"
          v-model="collapsed.namesReceivedAll"
        >
        <b-list-group flush>
            <div class="sort">
            <sort-alpha 
            v-bind:sortTarget="'namesReceived'"
            v-bind:inputList="this.namesReceived"
            />
             <sort-numeric 
            v-bind:sortTarget="'namesReceived'"
            v-bind:inputList="this.namesReceived"
            />
            <font-awesome-icon icon="search" class="facet-search "
              v-on:click="toggleInputField()"
              v-bind:class="{active: isActive}"/>
            <b-form-input v-if="isActive" type="text" class="input-facet" :placeholder="store.labels.vals['facets.search']" v-model="searchString"></b-form-input>
            </div>
        <!-- Dynamic Scroller -->
        <dynamic-scroller          
            :items="(this.searchString)? searchFacet(): this.namesReceived"
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
                    v-bind:target="'namesReceivedLink' + index"
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
                    v-bind:id="'namesReceivedLink' + index"
                    v-on:click="$parent.setFacet(item.ref, 's', 'r')"
                    v-on:mouseover="showPopover('namesReceivedLink' + index)"
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
                    v-on:click="$parent.setFacet(item.ref, 's', 'r')"
                  />
                  <font-awesome-icon
                    v-if="item.ref !== undefined && url.search.includes(item.ref)"
                    icon="times-circle"
                    class="mt-1 float-right ml-1 facet-icons"
                    v-on:click="$parent.removeFacet(item.ref, 's', 'r')"
                  />
                  <font-awesome-icon
                    v-if="item.ref !== undefined && !url.search.includes(item.ref)"
                    icon="minus-circle"
                    class="mt-1 float-right ml-1 facet-icons"
                    v-on:click="$parent.exceptFacet(item.ref, 's', 'r')"
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
  data(){
        return {
          namesReceived: [],
          searchString: '',
          isActive: false
        }
    },
    watch: {
      facets: function() {
        this.getNamesReceived();
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
      getNamesReceived() {
      const f = [];
      // check if namesRoles exist in facets and assign them, else assign empty array
      const facets = (this.facets.namesRoles) ? this.facets.namesRoles : [];
      facets.map((facet, index) => {
        // check if key has 3 items in facet and if 3rd item equals 'recieved'
        if (facet.key[2] === 'received'
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
      // set f-array to namesReceived property
      this.namesReceived = [...f];
    },
    searchFacet(){
      const subList = []
        this.namesReceived.map((item, index) => {
          if(item.name.toLowerCase().match(this.searchString.toLowerCase())){subList.push(item)}
        });
      return subList
    },
      // See description at ./FacetEditions.vue
      openExtendedList(target) {
        // TODO: continue on this for pseudo-async loading of list. Problem: collapse-variable-names are different (sent <-> namesSent)
        if (this.namesReceived.length > 5) {
          this.collapsed[target] = !this.collapsed[target];
        } else {
          this.collapsed[target] = !this.collapsed[target];
        }
      },
    }
}
</script>

<style>
</style>