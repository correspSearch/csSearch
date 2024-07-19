<template>
        <!-- Facet: Gender -->
      <b-list-group-item>
        <h3
          v-bind:class="(facets.gender.length === 0) ? 'disabled' : ''"
        ><collapse-facet-header 
        aria-controls="genderCollapse"
        v-bind:targetFacet="this.targetFacet">
        </collapse-facet-header>
          <!-- <b-link
            v-bind:disabled="facets.gender.length === 0"
            v-bind:aria-expanded="collapsed.gender ? 'true' : 'false'"
            aria-controls="genderCollapse"
            v-on:click="collapsed.gender = !collapsed.gender"
          >
            <font-awesome-icon
              v-bind:icon="'chevron-' + ((!collapsed.gender ||
                facets.gender.length === 0) ? 'right' : 'down')"
              class="mr-1"
            /> 
          </b-link>--> {{ store.labels.vals['facetHeadings.gender'] }}
        </h3>
        <b-collapse
          v-if="facets.gender.length > 0"
          id="genderCollapse"
          v-model="collapsed.gender"
        >
          <b-list-group flush>
            <b-list-group-item
              v-for="(ge, i) in facets.gender"
              v-bind:key="i"
              class="facetList"
              v-bind:class="(url.facets.gender.includes(ge.key)) ? 'facetActive' : ''"
            >
              <b-row class="p-0 m-0">
                <b-col
                  cols="8"
                  class="p-0"
                >
                  <b-link
                    v-if="ge.key !== undefined"
                    v-bind:id="'genderLink' + i"
                    v-on:click="$parent.setFacet(ge.key, 'g')"
                  >
                    {{ store.labels.vals[`facets.gender.${ge.key}`] }}
                  </b-link> ({{ ge.doc_count }})
                </b-col>
                <b-col
                  cols="4"
                  class="p-0"
                >
                  <font-awesome-icon
                    v-if="ge.key !== undefined && !url.facets.gender.includes(ge.key)"
                    icon="plus-circle"
                    class="mt-1 float-right ml-1 facet-icons"
                    v-on:click="$parent.setFacet(ge.key, 'g')"
                  />
                  <font-awesome-icon
                    v-if="ge.key !== undefined && url.facets.gender.includes(ge.key)"
                    icon="times-circle"
                    class="mt-1 float-right ml-1 facet-icons"
                    v-on:click="$parent.removeFacet(ge.key, 'g')"
                  />
                  <font-awesome-icon
                    v-if="ge.key !== undefined && !url.facets.gender.includes(ge.key)"
                    icon="minus-circle"
                    class="mt-1 float-right ml-1 facet-icons"
                    v-on:click="$parent.exceptFacet(ge.key, 'g')"
                  />
                </b-col>
              </b-row>
            </b-list-group-item>
          </b-list-group>
        </b-collapse>
      </b-list-group-item>
</template>

<script>
import { mapState } from 'vuex';
import CollapseFacetHeader from '../buttons/CollapseFacetHeader.vue'

export default {
    components:{
      CollapseFacetHeader
    },
    data(){
      return{
         targetFacet: 'gender'
      }
    },
    computed: {
      ...mapState({
        store: state => state,
        collapsed: state => state.facets.collapsed,
        sort: state => state.facets.sort,
        url: state => state.url,
        facets: state => state.search.facets})
        
      }
}
</script>

<style>

</style>