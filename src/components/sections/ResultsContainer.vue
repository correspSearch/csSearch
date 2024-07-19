<template>
  <b-col>
    <div>
      <b-row v-if="anything"> <!-- && !onlyPDB18 -->
        <b-col
          cols="12"
          lg="4"
          class="py-1"
        >
          <div v-if="results.count > 0">
            {{
              Number(store.pagination.start)*Number(store.pagination.count)-9
            }}-{{
              (Number(store.pagination.start)*Number(store.pagination.count) &lt;= results.count)
                ? Number(store.pagination.start)*Number(store.pagination.count)
                : results.count
            }} {{ label['resultCountOf'] }} {{ results.count }} {{ label['search.results'] }}
          </div>
        </b-col>
        <b-col
          cols="12"
          lg="4"
          class="align-items-center py-1"
        >
          <b-pagination
            v-if="results.count > 10 && !store.loadingActive"
            v-bind:value="store.pagination.start"
            v-bind:total-rows="results.count"
            v-bind:per-page="10"
            size="sm"
            align="center"
            class="result-pagination"
            v-on:change="setNewPage"
          />
        </b-col>
        <b-col>
          <div
            v-if="results.count > 0 && !store.loadingActive"
            class="sortResults py-1"
          >
            <!--
            <font-awesome-icon
                    v-bind:class="(store.sort.alpha.active) ? 'activeSorting' : 'sorting'"
                    v-bind:icon="(store.sort.alpha.asc) ? 'sort-alpha-down' : 'sort-alpha-up'"
                    v-on:click="sortResults('alpha')"
            ></font-awesome-icon>
            -->
            <font-awesome-icon
              v-bind:class="(store.sort.numeric.active) ? 'activeSorting' : 'sorting'"
              v-bind:icon="(store.sort.numeric.asc) ? 'sort-numeric-down' : 'sort-numeric-up'"
              v-on:click="$parent.sortResults('numeric')"
            />
          </div>
        </b-col>
      </b-row>
      <div v-if="!store.loadingActive">
        <result
          v-for="(result, key) in results.all"
          v-bind:key="key"
          v-bind:result="result"
          v-bind:label="label"
          v-bind:weekdays="url.facets.weekdays"
          v-bind:reflinks="url.facets.externalRefLinks"
          v-bind:showdateastext="url.facets.showDateAsText"
          v-bind:showrdate="url.facets.showRDate"
          v-bind:showcmifinfo="url.facets.showCmifInfo"
        />
      </div>
      <div
        v-if="!anything||results.count === 0" 
        v-html="store.teaser"
      /><!-- && !onlyPDB18 -->
      <!-- <div
        v-if="onlyPDB"
        v-html="store.pdbTeaser"></div> -->
      <b-row>
        <b-col />
        <b-col>
          <b-pagination
            v-if="results.count > 10 && !store.loadingActive"
            v-bind:value="store.pagination.start"
            v-bind:total-rows="results.count"
            v-bind:per-page="10"
            size="sm"
            align="center"
            v-on:change="setNewPage"
          />
        </b-col>
        <b-col />
      </b-row>
    </div>
  </b-col>
</template>

<script>
import { mapState } from 'vuex';
import Result from '../Result.vue';

export default {
  props: {
    anything: {
      type: Boolean,
      required: true,
    },
    onlyPDB: {
      type: Boolean,
      required: true,
    }, 
  },
  components: {
        Result
      },
  computed: {
      ...mapState({
        store: state => state,
        facets: state => state.search.facets,
        search: state => state.search,
        searchOptions: state => state.search.options,
        label: state => state.labels.vals,
        page: state => state.pagination,
        autocomplete: state => state.autocomplete.main,
        results: state => state.results,
        url: state => state.url,
        dateApi: state => state.dateApi,
        windowWidth: state => state.window,
        extendedSearch: state => state.extendedSearch
      })},
  methods: {
    setNewPage(page) {
      //sets a new Pagenumber
      this.$store.commit('setPageNumber', page);
      //update the url, because a new Pagenumber has been set
      this.$store.commit('updateUrl');
      //call the trigger-method from the parent-Element
      this.$parent.trigger('search');
    },
  }
}
</script>

<style>

</style>