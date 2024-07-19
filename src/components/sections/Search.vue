<template>
  <div class="container mt-5 mb-5">
    <div tabindex="0">
      <b-input-group
       v-for="(t, i) in store.search.datasets"
          v-bind:key="t.index">
        <template v-slot:prepend>
          <b-form-select
            v-bind:options="searchOptions.options"
            v-bind:value="searchOptions.selected"
            v-bind:disabled="extendedSearch.show"
            v-on:input="setSearchOption"
          />
        </template>
        
        <b-form-input
          v-if="searchOptions.selected!='datasets'"
          v-bind:placeholder=" (searchOptions.selected === 'date' && !extendedSearch.show) ? label['form.date.input.placeholder'] : ''"
          v-bind:value="search.term"
          v-bind:disabled="extendedSearch.show"
          v-on:input="setSearchTerm"
          v-on:keydown.up.prevent="acSetSelected('none', -1)"
          v-on:keydown.down.prevent="acSetSelected('none', 1)"
          v-on:keydown.esc="closeAutocomplete"
          v-on:keydown.enter="(autocomplete.suggestions[autocomplete.selected] || (((searchOptions.selected === 'date')&&
            search.term.length > 3) || ((searchOptions.selected ==='full_text') &&
            search.term.length > 2))) ? ((searchOptions.selected === 'date') &&
            search.term.length > 3) ?
            $parent.trigger('search', { byDate: true }) : ((searchOptions.selected ==='full_text') &&  search.term.length > 2) ? $parent.trigger('search', { byFullText: true }):
            $parent.trigger('search', { target: autocomplete.suggestions[autocomplete.selected],
                                byAutocomplete: true }) :''"
        />
        <b-form-select
        v-if="searchOptions.selected ==='datasets'"
                  v-bind:disabled="extendedSearch.show"
                  v-bind:options="t.options"
                  v-bind:value="t.selected"
                  v-on:change="setDatasetOption($event, i, 'searchDatasets');  $parent.setFacet(t.selected, 't')">
        </b-form-select><!--((!(search.badges.length === 0 && t.selected ==='pdb18'))?... : triggerTeaser(t.selected, 't'));  -->
        <template v-slot:append>
          <b-button
            v-if="(searchOptions.selected === 'date' || searchOptions.selected ==='full_text')"
            v-bind:disabled="extendedSearch.show"
            v-on:click="((search.term.length > 3) && (searchOptions.selected === 'date'))? $parent.trigger('search', { byDate:
              true }): ((search.term.length > 2) && (searchOptions.selected === 'full_text'))? $parent.trigger('search', { byFullText:
              true }) : ''"
          >
            {{ label['nav.search'] }}
          </b-button>
        </template>
      </b-input-group>
      <div
        v-if="autocomplete.show"
      >
        <div
          id="autocomplete"
        >
          <b-list-group>
            <b-list-group-item
              v-for="(suggestion, key) in autocomplete.suggestions"
              v-bind:id="`acMain${key}`"
              v-bind:key="key"
              v-bind:class="(autocomplete.selected === key) ? 'highlighted' :
                ''"
              v-on:click="$parent.trigger('search', { target: suggestion,
                                              byAutocomplete: true })"
              v-on:mouseover="acSetSelected(key)"
            >
              <span
                class="highlighted-text"
                v-html="suggestion.highlight"
              />&#32;
              {{ liveAndDeath(suggestion.birth_date, suggestion.death_date) }}
            </b-list-group-item>
          </b-list-group>
        </div>
      </div>
      <exsearch
        v-if="windowWidth > 780"
        v-bind:ac="store.autocomplete.es"
        v-bind:label="label"
        v-on:trigger-ex-search="$emit('trigger', $event)"
      />
      <result-statisitcs></result-statisitcs>
      <div
        v-if="!store.loadingActive"
      >
        <b-badge
          v-for="(b, i) in search.badges"
          v-bind:key="i"
          v-bind:variant="(b.type === 'except') ? 'danger' : 'secondary'"
          class="m-1"
        >
          {{ (b.text !== 'hybrid') ? b.text : store.labels.vals['form.availability.hybrid'] }}
          <font-awesome-icon
            icon="times-circle"
            class="ml-1"
            v-on:click="removeBadge(b, i)"
          />
        </b-badge>
      </div>
    </div>
  </div> 
</template>

<script>

import { mapState } from 'vuex';

import exsearch from '../ExSearch.vue';
import ResultStatisitcs from './ResultStatistics.vue';

export default {
  components:{
    exsearch,
    ResultStatisitcs
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
  data () {
    return {
    }
  },
  props: {
    onlyPDB: {
      type: Boolean,
      required: true,
    }, 
  },
  methods: {
    // sets the currently selected autocomplete suggestion in the store and handles scrolling
    acSetSelected(key, direction = 0) {
      let newKey = (key !== 'none') ? key : this.autocomplete.selected;
      // set the number of all suggestions
      const suggestionsCount = this.autocomplete.suggestions.length - 1;
      // if direction goes down, check if limit of suggestions is reached,
      // if true, reset newKey to suggestionscount, else count down
      if (direction === -1) {
        if (newKey - 1 >= 0) newKey -= 1;
        else if (newKey - 1 < 0) newKey = suggestionsCount;
        document.getElementById(`acMain${newKey}`).scrollIntoView(true);
      } // if direction goes up, check if limit is reached and if true reset to zero
        // else count up
        else if (direction === 1) {
        if (newKey + 1 > suggestionsCount) newKey = 0;
        else if (newKey + 1 <= suggestionsCount) newKey += 1;
        document.getElementById(`acMain${newKey}`).scrollIntoView(false);
      }
      // set selected item in the store
      this.$store.commit('acSetSelected', {
        newKey,
        target: 'main',
      });
    },
    // builds the live and death dates for the suggestions
    liveAndDeath(birth, death) {
      let liveDates = '';
      if (!isNaN(parseInt(birth, 10)) && !isNaN(parseInt(death, 10))) liveDates += `(${parseInt(birth, 10)}`;
      if (!isNaN(parseInt(birth, 10)) && isNaN(parseInt(death, 10))) liveDates += `(* ${parseInt(birth, 10)}`;
      if (!isNaN(parseInt(birth, 10)) && !isNaN(parseInt(death, 10))) liveDates += '-';
      if (!isNaN(parseInt(birth, 10)) && isNaN(parseInt(death, 10))) liveDates += ')';
      if (isNaN(parseInt(birth, 10)) && !isNaN(parseInt(death, 10))) liveDates += '(d. ';
      if (!isNaN(parseInt(birth, 10)) && !isNaN(parseInt(death, 10))) liveDates += parseInt(death, 10);
      if (!isNaN(parseInt(death, 10))) liveDates += ')';
      return liveDates;
    },
    //closes autocomplete and resets suggestions
    closeAutocomplete() {
      this.$store.commit('closeAutocomplete');
    },
    // set search option for simple search (places, dates, correspondent, etc. )
    setSearchOption(option) {
      this.$store.commit('setSearchOption', option);
      // When changed, trigger new search attempt
      if (option !== 'date' && option !== 'full_text') this.$parent.trigger('autocomplete');
    },
    // Sets options for select field for dataset
    setDatasetOption(e, key, type) {
        this.$store.commit('esSetOption', {
            field: key,
            type,
            value: e,
        });
        // this.$store.commit('esResetSearchForm');
    },
    // sets the current searchterm and triggers the autocomplete-specific search-function
    setSearchTerm(e, triggerAutocomplete = true) {
      if (e.length === 0) this.$store.commit('closeAutocomplete');
      else {
        this.$store.commit('setSearchTerm', e);
        // When changed, trigger new search attempt, unless it is to set the searchTerm after choosing a name from the autocomplete list
        if (
            triggerAutocomplete
            && this.searchOptions.selected !== 'date' && this.searchOptions.selected !== 'full_text'
        ) {
          this.$store.commit('trigger', {
            autocomplete: true,
            key: 0,
            target: this.searchOptions.selected,
            main: true,
            input: e,
          }); // this.trigger('autocomplete');
        }

        if (!triggerAutocomplete) {
          this.$store.commit('setSearchTerm', '');
        }
      }
    },
    triggerTeaser(selected, type){
      // ((!this.url.facets.datasets.includes(selected))? this.url.facets.datasets.push(selected):'')
      //   this.store.exSearch.datasets.selected = selected,
      (this.$store.commit("addFacet", {type, facet: selected, role: null}),
      this.$store.commit("updateUrl", true),
      this.$store.commit("setBadges"),
      this.setPDB18Teaser())
    },
    setPDB18Teaser(){
      this.$store.commit("setPDBTeaser", (this.store.pdbTeaserHTML));
      console.log('Add pdb18 HTMLteaser to teaser')
    },
    // PART 2: Search-Related Methods
    
    // removes a badge, if there are other badges left resets the pagenumber,
    // triggers a new search and updates the url, if there are no badges left, everything
    // will be resetted
    removeBadge(b, i) {
      this.$store.commit('removeBadge', b, i);
      // this.$store.commit('updateUrl');
      if (this.search.badges.length > 0 )
      // && !(this.search.badges.length ===1 && this.search.badges[0].ref === "pdb18") 
     {
        this.$store.commit('setPageNumber', 1);
        this.$parent.trigger('search');
      } 
      // else if (this.search.badges.length ===1 && this.search.badges[0].ref === "pdb18"){
      //   // set pdb18 teaser
      //   this.$store.commit("setBadges");
      //   this.$store.commit('unsetResults', true);
      //   this.setPDB18Teaser();
      // }
      else {
        // Either none or all results
        this.$store.commit('unsetResults', true);
        this.$store.commit('setPageNumber', 1);
        // this.$store.commit('updateUrl');
      }
    },
    // set the start of the pagination
    getPaginationStart() {
      const p = (this.store.pagination.start < 1) ? 0 : this.store.pagination.start - 1;
      return p * this.store.pagination.count;
    },
    resetDatasetOption() {
      this.$store.commit('resetDatasetOption')
    },
    resetSearchForm() {
      this.$store.commit('esResetSearchForm');
    },
    console(){console.log('volltext suche start')}
  }
}
</script>

<style>

</style>