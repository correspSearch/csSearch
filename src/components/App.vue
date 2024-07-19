<template>
  <div class="">
    <div v-if="!this.$store.map">
      <div class="container-fluid cs-content-top no-min-height header">
        <!-- ### Banner ### -->
        <dataset-banner
          v-if="this.url.facets.datasets.length > 0"
          v-bind:dataset="this.url.facets.datasets[0]"
        ></dataset-banner>
        <!-- ### Search ### -->
        <search-field v-on:trigger="trigger($event)" v-bind:onlyPDB="this.onlyPDB18"></search-field>
      </div>
      <div class="container-fluid cs-content-bottom">
        <div class="container cs-content-box">
          <b-row>
            <!-- ### Results ###-->
            <results-container cols="12" v-bind:lg="anything? '9' : '12'" v-bind:anything="this.anything" v-bind:onlyPDB="this.onlyPDB18"> <!-- && !onlyPDB18 -->
            </results-container>
            <!-- ### FACETS ###-->
            <b-col cols="12" lg="3" class="align-items-center" v-if="anything"><!-- && !onlyPDB18 -->
              <visualisations-box></visualisations-box>
              <div class="facets cs-orange">
                <b-list-group>
                  <facet-timespan></facet-timespan>
                  <facet-names></facet-names>
                  <facet-senders></facet-senders>
                  <facet-receivers></facet-receivers>
                  <facet-occupation></facet-occupation>
                  <facet-gender></facet-gender>
                  <facet-places></facet-places>
                  <facet-sender-place></facet-sender-place>
                  <facet-receiver-place></facet-receiver-place>
                  <facet-language />
                  <facet-dataset></facet-dataset>
                  <facet-editions></facet-editions>
                  <facet-c-m-i-f></facet-c-m-i-f>
                  <facet-availability></facet-availability>
                  <facet-options></facet-options>
                </b-list-group>
              </div>
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
    <div v-if="this.$store.map" class="h-100">
      <csmap
        v-bind:label="label"
        v-bind:mapobject="store.map"
        v-bind:mapsearch="store.mapSearch"
        v-bind:results="results"
        v-bind:url="url"
        v-bind:page="store.pagination.start"
        v-on:trigger="
          (searchType, data) => trigger(searchType, undefined, data)
        "
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import "babel-polyfill";
import exsearch from "./ExSearch.vue";
import store from "../store";
import SearchField from "./sections/Search.vue";
import ResultsContainer from "./sections/ResultsContainer.vue";
import FacetTimespan from "./sections/FacetTimespan.vue";
import FacetNames from "./sections/FacetNames.vue";
import FacetSenders from "./sections/FacetSenders.vue";
import FacetReceivers from "./sections/FacetReceivers.vue";
import FacetOccupation from "./sections/FacetOccupation.vue";
import FacetGender from "./sections/FacetGender.vue";
import FacetPlaces from "./sections/FacetPlaces.vue";
import FacetSenderPlace from "./sections/FacetSenderPlace.vue";
import FacetReceiverPlace from "./sections/FacetReceiverPlace.vue";
import FacetEditions from "./sections/FacetEditions.vue";
import FacetCMIF from "./sections/FacetCMIF.vue";
import FacetAvailability from "./sections/FacetAvailability.vue";
import FacetOptions from "./sections/FacetOptions.vue";
import FacetDataset from "./sections/FacetDataset.vue";
import DatasetBanner from "./sections/DatasetBanner.vue";
import FacetLanguage from "./sections/FacetLanguage.vue";
import VisualisationsBox from "./sections/VisualisationsBox.vue"
import * as d3 from "d3";
import { match } from "assert";

export default {
  components: {
    exsearch,
    csmap: () => import("./Map.vue"),
    SearchField,
    ResultsContainer,
    FacetTimespan,
    FacetNames,
    FacetSenders,
    FacetReceivers,
    FacetOccupation,
    FacetGender,
    FacetPlaces,
    FacetSenderPlace,
    FacetReceiverPlace,
    FacetEditions,
    FacetCMIF,
    FacetAvailability,
    FacetOptions,
    FacetDataset,
    DatasetBanner,
    FacetLanguage,
    VisualisationsBox,
  },
  data() {
    return {
      teaser: "",
      timestamp: 0,
      selectedDataset: this.$store.url
    };
  },
  computed: {
    ...mapState({
      store: (state) => state,
      facets: (state) => state.search.facets,
      search: (state) => state.search,
      searchOptions: (state) => state.search.options,
      label: (state) => state.labels.vals,
      page: (state) => state.pagination,
      autocomplete: (state) => state.autocomplete.main,
      results: (state) => state.results,
      url: (state) => state.url,
      dateApi: (state) => state.dateApi,
      querybuilderApi: (state) => state.querybuilderApi,
      windowWidth: (state) => state.window,
      extendedSuche: (state) => state.extendedSearch,
      lang: (state) => state.lang,
      // vv from store/facets.js vv
      sort: (state) => state.facets.sort,
      visuals: (state) => state.search.visuals,
    }),
    // displayCmifInfo(){return this.store.labels.vals['facets.displayCmifInfo']},
    // For stuff that is only meant to be shown when search is on (e.g. facets)
    anything() {
      return (
        this.url.search.length > 0 ||
        this.url.facets.dates.length > 0 ||
        this.url.facets.occupations.length > 0 ||
        this.url.facets.places.length > 0 ||
        this.url.facets.edition.length > 0 ||
        this.url.facets.cmif.length > 0 ||
        this.url.facets.availability.length > 0 ||
        this.url.facets.datasets.length > 0 ||
        this.url.facets.languages.length > 0 ||
        this.url.facets.gender.length > 0 ||
        this.url.facets.fullText.length > 0 ||
        this.url.exceptFacets.persons.length > 0 ||
        this.url.exceptFacets.places.length > 0 ||
        this.url.exceptFacets.edition.length > 0 ||
        this.url.exceptFacets.cmif.length > 0 ||
        this.url.exceptFacets.datasets.length > 0 ||
        this.url.exceptFacets.languages.length > 0 ||
        this.url.exceptFacets.gender.length > 0 ||
        this.url.exceptFacets.dates.length > 0 ||
        this.url.exceptFacets.availability.length > 0
      );
    },
    onlyPDB18(){
      return (
        this.url.search.length === 0 &&
        this.url.facets.dates.length === 0 &&
        this.url.facets.occupations.length === 0 &&
        this.url.facets.places.length === 0 &&
        this.url.facets.edition.length === 0 &&
        this.url.facets.cmif.length === 0 &&
        this.url.facets.availability.length === 0 &&
        (this.url.facets.datasets.length=== 1 && this.url.facets.datasets[0]=== "pdb18") &&
        this.url.facets.languages.length === 0 &&
        this.url.facets.gender.length === 0 &&
        this.url.facets.fullText.length === 0 &&
        this.url.exceptFacets.persons.length === 0 &&
        this.url.exceptFacets.places.length === 0 &&
        this.url.exceptFacets.edition.length === 0 &&
        this.url.exceptFacets.cmif.length === 0 &&
        this.url.exceptFacets.datasets.length === 0 &&
        this.url.exceptFacets.languages.length === 0 &&
        this.url.exceptFacets.gender.length === 0 &&
        this.url.exceptFacets.dates.length === 0 &&
        this.url.exceptFacets.availability.length === 0
      )
    }
  },
  // Facets
  beforeCreate() {
    this.timestamp = Date.now();
  },
  created() {
    /* -- TODO --
      IMPORTANT: Clean up this mess with loading teaser, initial search, params,
      etc. Especially this "anything"-variable, resp. these conditions to test
      if any params are given. This is ugly as hell and probably not save.
      Best would be to just take some time to implement vue router...
      - use vue router to check if params are set in url

    */
    window.addEventListener("resize", this.setWindowWidth);
    /* TODO: Better to be solved with vue router */
    if (window.location.hostname === "localhost") {
      // LOCAL DEV
      // Show Map search as starting page
      // this.$store.commit("setMap", true);
    } else if (window.location.pathname.match(/karte\.html|map\.html/))
      this.$store.commit("setMap", true);
    else this.$store.commit("setMap", false);

    // Get Teaser if currently none in store
    if (this.store.teaserHTML === "") {
      fetch(
        `https://correspsearch.net/search-teaser.xql${
          this.store.lang === "en" ? "?l=en" : ""
        }`
      ).then((response) => {
        response.text().then((html) => {
          this.$store.commit("setTeaserHTML", html);
          if (
            !(
              this.url.search.length > 0 ||
              this.url.facets.dates.length > 0 ||
              this.url.facets.places.length > 0 ||
              this.url.facets.occupations.length > 0 ||
              this.url.facets.edition.length > 0 ||
              this.url.facets.cmif.length > 0 ||
              this.url.facets.availability.length > 0 ||
              this.url.facets.datasets.length > 0 ||
              this.url.facets.languages.length > 0 ||
              this.url.facets.fullText.length > 0 ||
              this.url.exceptFacets.persons.length > 0 ||
              this.url.exceptFacets.places.length > 0 ||
              this.url.exceptFacets.edition.length > 0 ||
              this.url.exceptFacets.cmif.length > 0 ||
              this.url.exceptFacets.datasets.length > 0 ||
              this.url.exceptFacets.languages.length > 0 ||
              this.url.exceptFacets.dates.length > 0 ||
              this.url.exceptFacets.availability.length > 0
            )
          ) {
            this.$store.commit("setTeaser", html);
          }
        });
      });
    }
    // Get PDB18Teaser if currently none in store
    if (this.store.pdbTeaserHTML === "") {
      fetch(
        `https://correspsearch.net/search-teaser.xql?id=pdb18${
          this.store.lang === "en" ? "?l=en" : ""
        }`
      ).then((response) => {
        response.text().then((html) => {
          this.$store.commit("setPDBTeaserHTML", html);
          if (this.onlyPDB18
          ) {
            this.$store.commit("setPDBTeaser", html);
          }
        });
      });
    }
  },
  mounted() {
    // if url contains facet content, set trigger
    if (
      this.url.search.length > 0 ||
      this.url.facets.dates.length > 0 ||
      this.url.facets.places.length > 0 ||
      this.url.facets.occupations.length > 0 ||
      this.url.facets.edition.length > 0 ||
      this.url.facets.cmif.length > 0 ||
      this.url.facets.availability.length > 0 ||
      this.url.facets.datasets.length > 0 ||
      this.url.facets.languages.length > 0 ||
      this.url.facets.fullText.length > 0 ||
      this.url.exceptFacets.persons.length > 0 ||
      this.url.exceptFacets.places.length > 0 ||
      this.url.exceptFacets.edition.length > 0 ||
      this.url.exceptFacets.cmif.length > 0 ||
      this.url.exceptFacets.datasets.length > 0 ||
      this.url.exceptFacets.dates.length > 0 ||
      this.url.exceptFacets.availability.length > 0 ||
      this.url.exceptFacets.languages.length > 0 
      //&& !this.onlyPDB18
    ) {
      this.trigger("search", {
        target: {
          ref: this.url.search,
          text: "__PROXY__",
        },
      });
    } 
    // else if (this.onlyPDB18){
    // this.$store.commit("setPDBTeaser", this.store.pdbTeaserHTML);
    // this.$store.commit("setBadges")
    // this.$store.commit("setTeaser", "");
    //   }
    else if (Object.keys(store.state.map).length) {
      this.$store.commit("setTeaser", "");
      /* initiate map */
    } 
    else {
        this.$store.commit("setTeaser", this.store.teaserHTML)
    }
    // Facets
    this.updateChart();
  },
  methods: {
    setWindowWidth() {
      // set window width
      this.$store.commit("setWindowWidth", window.screen.width);
    },
    sortResults(target) {
      // set result sorting be given taget e.g. numeric
      this.$store.commit("sortResults", target);
      //call trigger-method with 'search'as target
      this.trigger("search");
    },
    getPageNumber() {
      // if remainder of results.count / 10 is not 0
      // round up result to next greater number
      if (this.results.count % 10 !== 0) {
        return Math.ceil(this.results.count / 10);
      }
      // else return results.count / 10
      return this.results.count / 10;
    },
    setNewPage(page) {
      //sets a new Pagenumber
      this.$store.commit("setPageNumber", page);
      //update the url, because a new Pagenumber has been set
      this.$store.commit("updateUrl");
      //call the trigger-method from the parent-Element
      this.trigger("search");
    },
    // !! method not called in components !!
    generatePageLink(p) {
      return "#top";
    },
    // PART 2: Search-Related Methods

    // trigger method with passed-on target param e.g. 'search' and param otions defined in method
    async trigger(
      target,
      options = {
        target: {},
        byUrl: false,
        byAutocomplete: false,
        byDate: false,
        onlyFacets: false,
        byFullText: false,
      },
      data
    ) {
      // hide facets, no search set by facets or autocomplete
      const showAll =
        this.url.search.length === 0 &&
        this.url.facets.dates.length === 0 &&
        this.url.facets.places.length === 0 &&
        this.url.facets.occupations.length === 0 &&
        this.url.facets.edition.length === 0 &&
        this.url.facets.cmif.length === 0 &&
        this.url.facets.datasets.length === 0 &&
        this.url.facets.availability.length === 0 &&
        this.url.facets.gender.length === 0 &&
        this.url.facets.languages.length === 0 &&
        this.url.facets.fullText.length === 0 &&
        !options.byAutocomplete &&
        !options.byDate &&
        !options.byFullText;
      // clear facets
      if (target === 'search') this.$store.commit("clearFacets");
      if (target === "search" && showAll) {
        // Testcase for starting page scenario: only show facets but no results,
        // has to be adjusted as right now (2021-03-25), 0 results is displayed.
        this.generateQuery(null, null, { showAll: true }).then((query) => {
          console.log("QUERY FOR ALL:", JSON.stringify(query));
          this.$store.commit("setBadges");
          this.fetchResults(query, true);
        });
      }
      // if trigger is called and facets are set:
      else if (target === "search" && !showAll) {
        // Unset Results
        this.$store.commit("unsetResults");
        if (options.byUrl) {
          // If search is triggered by URL params, without using the UI
          console.info("Search triggered by URL, params are: ", this.url);
          console.log("urlFacets-params", this.url.facets);
          console.log("urlSearch-params:", this.url.search);
        } else if (options.byAutocomplete) {
          // If search is triggered by mainpage autocomplete
          const suggestion = options.target;
          this.$store.commit("closeAutocomplete");
          console.info(
            "Search triggered by AC, suggestion is: ",
            suggestion,
            this.searchOptions.selected
          );
          switch (this.searchOptions.selected) {
            case "names":
              if (!this.url.search.includes(suggestion.ref))
                this.url.search.push(suggestion.ref);
              this.$store.commit("setSearchTerm", "");
              break;
            case "places":
              if (!this.url.facets.places.includes(suggestion.ref))
                this.url.facets.places.push(suggestion.ref);
              this.$store.commit("setSearchTerm", "");
              break;
            case "source_text":
              if (!this.url.facets.edition.includes(suggestion.id))
                this.url.facets.edition.push(suggestion.id);
              this.$store.commit("setSearchTerm", "");
              break;
            case "cmif":
              if (!this.url.facets.cmif.includes(suggestion.ref))
                this.url.facets.cmif.push(suggestion.ref);
              this.$store.commit("setSearchTerm", "");
              break;
            // autocomplete for occupation not yet functional
            case "occupations":
              if (!this.url.facets.occupations.includes(suggestion.ref))
                this.url.facets.occupations.push(suggestion.ref);
              this.$store.commit("setSearchTerm", "");
              break;
            default:
              break;
          }
          // this.$store.commit('updateUrl');
        } else if (options.byDate) {
          // If search is triggered by mainpage date input field
          if (!this.url.facets.dates.includes(this.search.term.toLowerCase())) {
            // Since the dateAPI is case-sensitive, the first letter always needs to be upper case
            const dateArray = this.search.term.split(" ");
            let ArrayToUpperCaseDate = dateArray.map((datePart) => {
              if (datePart.match(/^[a-z]/g)) {
                return datePart.charAt(0).toUpperCase() + datePart.slice(1);
              }

              return datePart;
            });

            ArrayToUpperCaseDate = ArrayToUpperCaseDate.join(" ");

            this.url.facets.dates.push(ArrayToUpperCaseDate);
          }
          this.$store.commit("setSearchTerm", "");
          // this.$store.commit('updateUrl');
        } else if (options.byFullText) {
          console.log("full text running");
          // If search is triggered by mainpage full-text input field
          if (!this.url.facets.fullText.includes(this.search.term))
            this.url.facets.fullText.push(this.search.term);
          // }
          this.$store.commit("setSearchTerm", "");
          // this.$store.commit('updateUrl');
        }

        // this.$store.commit('setBadges');

        // If no params exist => showAllFacet-Scenario
        // here if params exist
        if (
          this.url.search.length > 0 ||
          this.url.facets.dates.length > 0 ||
          this.url.facets.occupations.length > 0 ||
          this.url.facets.places.length > 0 ||
          this.url.facets.edition.length > 0 ||
          this.url.facets.cmif.length > 0 ||
          this.url.facets.datasets.length > 0 ||
          this.url.facets.availability.length > 0 ||
          this.url.facets.gender.length > 0 ||
          this.url.facets.languages.length > 0 ||
          this.url.facets.fullText.length > 0 ||
          this.url.exceptFacets.persons.length > 0 ||
          this.url.exceptFacets.occupations.length > 0 ||
          this.url.exceptFacets.places.length > 0 ||
          this.url.exceptFacets.edition.length > 0 ||
          this.url.exceptFacets.cmif.length > 0 ||
          this.url.exceptFacets.datasets.length > 0 ||
          this.url.exceptFacets.dates.length > 0 ||
          this.url.exceptFacets.availability.length > 0 ||
          this.url.exceptFacets.gender.length > 0 ||
          this.url.exceptFacets.languages.length > 0
        ) {
          if (this.url.facets.dates.length > 0) {
            // Don't know how to outsource that in a function and resolve it correctly here
            // Maybe someone who's better with async calls can outsource this
            const allDates = [];
            const unifiedDates = [];
            this.url.facets.dates.forEach((d) => {
              allDates.push(d);
            });

            const promises = allDates.map(
              (date) =>
                new Promise((resolve, reject) => {
                  const yearMonthDayRegex = /[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9](?![0-9])/gm;
                  const yearMonthRegex = /[0-2][0-9][0-9][0-9]\-[0-1][0-9](?![0-9])/gm;
                  const yearRegex = /(?<![a-zA-Z]+\s?)[0-2][0-9][0-9][0-9]/gm;

                  // check if date matches one of the regexes above (is already in a machine readable format)
                  if (!yearMonthDayRegex.test(date) && !yearMonthRegex.test(date) && !yearRegex.test(date)) {
                    console.log("matchesRegex", date);
                    const api =
                      this.store.lang === "en"
                        ? this.dateApi
                            .replace("=de", "=en")
                            .replace("{{DATE}}", date)
                        : this.dateApi.replace("{{DATE}}", date);
                    // if not send it to the dateAPI, to get a machine readable date
                    fetch(api).then((dateResult) => {
                      dateResult.json().then((json) => {
                        resolve(json.results[0]);
                      });
                    });
                  } else {
                    resolve(date);
                  }
                })
            );

            // when all promises are resolved, built the date-query
            Promise.all(promises).then((dateResult) => {
              dateResult.forEach((dr, i) => {
                // query = this.setDateQuery(query, dr);
                if (dr.isodate) {
                  const unifiedDate = {};
                  const date = dr.isodate;

                  // isodate can contain different properties, dependent on the input of the user
                  // the date needs to be in a unified form, so it must be checked, if additional data must be complemented
                  if (date.when) {
                    [unifiedDate.whenStart] = new Date(date.when)
                      .toISOString()
                      .split("T");
                    if (date.when.match(/[0-2][0-9][0-9][0-9]$/g)) {
                      [unifiedDate.whenEnd] = new Date(
                        String(new Date(date.when).getFullYear()),
                        11,
                        32
                      )
                        .toISOString()
                        .split("T");
                    } else if (
                      date.when.match(/[0-2][0-9][0-9][0-9]\-[0-1][0-9]$/g)
                    ) {
                      const splitdate = date.when.split("-");
                      [unifiedDate.whenEnd] = new Date(
                        splitdate[0],
                        splitdate[1],
                        0
                      )
                        .toISOString()
                        .split("T");
                    } else if (
                      date.when.match(
                        /[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/g
                      )
                    ) {
                      unifiedDate.whenEnd = date.when;
                    }
                  }
                  if (date.notBefore) {
                    [unifiedDate.notBefore] = new Date(date.notBefore)
                      .toISOString()
                      .split("T");
                  }
                  if (date.notAfter) {
                    if (date.notAfter.match(/[0-2][0-9][0-9][0-9]$/g)) {
                      [unifiedDate.notAfter] = new Date(
                        String(new Date(date.notAfter).getFullYear()),
                        11,
                        32
                      )
                        .toISOString()
                        .split("T");
                    } else if (
                      date.notAfter.match(/[0-2][0-9][0-9][0-9]\-[0-1][0-9]$/g)
                    ) {
                      const splitdate = date.notAfter.split("-");
                      [unifiedDate.notAfter] = new Date(
                        splitdate[0],
                        splitdate[1],
                        0
                      )
                        .toISOString()
                        .split("T");
                    } else if (
                      date.notAfter.match(
                        /[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/g
                      )
                    ) {
                      unifiedDate.notAfter = date.notAfter;
                    }
                  }
                  if (date.from)
                    [unifiedDate.from] = new Date(date.from)
                      .toISOString()
                      .split("T");
                  if (date.to) {
                    if (date.to.match(/[0-2][0-9][0-9][0-9]$/g)) {
                      [unifiedDate.to] = new Date(
                        String(new Date(date.to).getFullYear()),
                        11,
                        32
                      )
                        .toISOString()
                        .split("T");
                    } else if (
                      date.to.match(/[0-2][0-9][0-9][0-9]\-[0-1][0-9]$/g)
                    ) {
                      const splitdate = date.to.split("-");
                      [unifiedDate.to] = new Date(splitdate[0], splitdate[1], 0)
                        .toISOString()
                        .split("T");
                    } else if (
                      date.to.match(
                        /[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/g
                      )
                    ) {
                      unifiedDate.to = date.to;
                    }
                  }
                  // build a unified dateString for the querybuilder-api
                  const dateStart =
                    date.when !== undefined
                      ? unifiedDate.whenStart
                      : unifiedDate.notBefore !== undefined
                      ? unifiedDate.notBefore
                      : unifiedDate.from
                      ? unifiedDate.from
                      : "";
                  const dateEnd =
                    date.when !== undefined
                      ? unifiedDate.whenEnd
                      : date.notAfter !== undefined
                      ? unifiedDate.notAfter
                      : date.to
                      ? unifiedDate.to
                      : "";
                  const newDateOccurrence =
                    dateStart === dateEnd
                      ? dateStart
                      : dateStart.concat("-", dateEnd);
                  unifiedDates.push(newDateOccurrence);
                } else {
                  const dateNoSpace = dr.replace(/\s/g, "");
                  unifiedDates.push(dateNoSpace);
                }
              });
              this.url.facets.dates = unifiedDates;
              this.$store.commit("updateUrl");
              this.$store.commit("setBadges");
              this.getQuery();
            });
          } else {
            this.$store.commit("updateUrl");
            this.$store.commit("setBadges");
            this.getQuery();
          }
        }
      } else if (target === "exSearch") {
        this.$store.commit("esGetInputData");
        if (this.url.facets.dates.length > 0) {
          // Don't know how to outsource that in a function and resolve it correctly here
          // Maybe someone who's better with async calls can outsource this
          const allDates = [];
          const unifiedDates = [];
          this.url.facets.dates.forEach((d) => {
            allDates.push(d);
          });
          const yearMonthDayRegex = /[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9](?![0-9])/gm;
          const yearMonthRegex = /[0-2][0-9][0-9][0-9]\-[0-1][0-9](?![0-9])/gm;
          const yearRegex = /(?<![a-zA-Z]+\s)[0-2][0-9][0-9][0-9]/gm;

          const promises = allDates.map(
            (date) =>
              new Promise((resolve, reject) => {
                // check if date matches one of the regexes above (is already in a machine readable format)
                if (
                  !(
                    yearMonthDayRegex.test(date) ||
                    yearMonthRegex.test(date) ||
                    yearRegex.test(date)
                  )
                ) {
                  const api =
                    this.store.lang === "en"
                      ? this.dateApi
                          .replace("=de", "=en")
                          .replace("{{DATE}}", date)
                      : this.dateApi.replace("{{DATE}}", date);
                  // if not send it to the dateAPI, to get a machine readable date
                  fetch(api).then((dateResult) => {
                    dateResult.json().then((json) => {
                      resolve(json.results[0]);
                    });
                  });
                } else {
                  resolve(date);
                }
              })
          );

          // when all promises are resolved, built the date-query
          Promise.all(promises).then((dateResult) => {
            dateResult.forEach((dr, i) => {
              // query = this.setDateQuery(query, dr);
              if (dr.isodate) {
                const unifiedDate = {};
                const date = dr.isodate;

                // isodate can contain different properties, dependent on the input of the user
                // the date needs to be in a unified form, so it must be checked, if additional data must be complemented
                if (date.when) {
                  [unifiedDate.whenStart] = new Date(date.when)
                    .toISOString()
                    .split("T");
                  if (date.when.match(/[0-2][0-9][0-9][0-9]$/g)) {
                    [unifiedDate.whenEnd] = new Date(
                      String(new Date(date.when).getFullYear()),
                      11,
                      32
                    )
                      .toISOString()
                      .split("T");
                  } else if (
                    date.when.match(/[0-2][0-9][0-9][0-9]\-[0-1][0-9]$/g)
                  ) {
                    const splitdate = date.when.split("-");
                    [unifiedDate.whenEnd] = new Date(
                      splitdate[0],
                      splitdate[1],
                      0
                    )
                      .toISOString()
                      .split("T");
                  } else if (
                    date.when.match(
                      /[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/g
                    )
                  ) {
                    unifiedDate.whenEnd = date.when;
                  }
                }
                if (date.notBefore) {
                  [unifiedDate.notBefore] = new Date(date.notBefore)
                    .toISOString()
                    .split("T");
                }
                if (date.notAfter) {
                  if (date.notAfter.match(/[0-2][0-9][0-9][0-9]$/g)) {
                    [unifiedDate.notAfter] = new Date(
                      String(new Date(date.notAfter).getFullYear()),
                      11,
                      32
                    )
                      .toISOString()
                      .split("T");
                  } else if (
                    date.notAfter.match(/[0-2][0-9][0-9][0-9]\-[0-1][0-9]$/g)
                  ) {
                    const splitdate = date.notAfter.split("-");
                    [unifiedDate.notAfter] = new Date(
                      splitdate[0],
                      splitdate[1],
                      0
                    )
                      .toISOString()
                      .split("T");
                  } else if (
                    date.notAfter.match(
                      /[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/g
                    )
                  ) {
                    unifiedDate.notAfter = date.notAfter;
                  }
                }
                if (date.from)
                  [unifiedDate.from] = new Date(date.from)
                    .toISOString()
                    .split("T");
                if (date.to) {
                  if (date.to.match(/[0-2][0-9][0-9][0-9]$/g)) {
                    [unifiedDate.to] = new Date(
                      String(new Date(date.to).getFullYear()),
                      11,
                      32
                    )
                      .toISOString()
                      .split("T");
                  } else if (
                    date.to.match(/[0-2][0-9][0-9][0-9]\-[0-1][0-9]$/g)
                  ) {
                    const splitdate = date.to.split("-");
                    [unifiedDate.to] = new Date(splitdate[0], splitdate[1], 0)
                      .toISOString()
                      .split("T");
                  } else if (
                    date.to.match(
                      /[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/g
                    )
                  ) {
                    unifiedDate.to = date.to;
                  }
                }
                // build a unified dateString for the querybuilder-api
                const dateStart =
                  date.when !== undefined
                    ? unifiedDate.whenStart
                    : unifiedDate.notBefore !== undefined
                    ? unifiedDate.notBefore
                    : unifiedDate.from
                    ? unifiedDate.from
                    : "";
                const dateEnd =
                  date.when !== undefined
                    ? unifiedDate.whenEnd
                    : date.notAfter !== undefined
                    ? unifiedDate.notAfter
                    : date.to
                    ? unifiedDate.to
                    : "";
                const newDateOccurrence =
                  dateStart === dateEnd
                    ? dateStart
                    : dateStart.concat("-", dateEnd);
                unifiedDates.push(newDateOccurrence);
              } else {
                const dateNoSpace = dr.replace(/\s/g, "");
                unifiedDates.push(dateNoSpace);
              }
            });
            this.url.facets.dates = unifiedDates;
            this.$store.commit("updateUrl", true);
            this.$store.commit("setBadges");
            this.getQuery();
          });
        } else {
          this.$store.commit("updateUrl", true);
          this.$store.commit("setBadges");
          this.getQuery();
        }
      } else if (target === "mapSearch") {

        // set coordinates of the polygons from csmap
        this.store.mapSearch.polygons = [];
        const polygons = data.polygons;
        const histogis = data.histogis;

        if (
          (polygons.length > 0 && polygons[0].length > 0) ||
          histogis.length > 0
        ) {
          if (polygons) {
            polygons.map((p, i) => {
              this.store.mapSearch.polygons[i] = [[]];
              p.map((pp) => {
                this.store.mapSearch.polygons[i][0].push([pp.lng, pp.lat]);
              });
            });
          }
          if (histogis) {
            histogis.map((h, i) => {
              this.store.mapSearch.polygons.push(...h);
            });
          }
          // if dates are set, we need to make sure, they are all in the same format
          if (this.store.mapSearch.dates.length > 0) {
            
            const dates = this.store.mapSearch.dates.map((date) => {
              if (date.value !== "") {
                // If the date contains a term, it needs to start with an uppercase letter, 
                // otherwise the date-api won't recognize it
                const dateArray = date.value.split(" ");
                let arrayToUpperCaseDate = dateArray.map((datePart) => {
                  if (datePart.match(/^[a-z]/g)) {
                    return datePart.charAt(0).toUpperCase() + datePart.slice(1);
                  }

                  return datePart;
                });

                arrayToUpperCaseDate = arrayToUpperCaseDate.join(" ");

                return arrayToUpperCaseDate;
              }
            });

            const yearMonthDayRegex = /[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9](?![0-9])/gm;
            const yearMonthRegex = /[0-2][0-9][0-9][0-9]\-[0-1][0-9](?![0-9])/gm;
            const yearRegex = /(?<![a-zA-Z]+\s)[0-2][0-9][0-9][0-9]/gm;

            const unifiedDates = [];

            const promises = dates.map((date) => {
              if (date) {
                return new Promise((resolve, reject) => {
                  // check if each date matches one of the regexes above (is already in a machine readable format)
                  if (
                    !(
                      yearMonthDayRegex.test(date) ||
                      yearMonthRegex.test(date) ||
                      yearRegex.test(date)
                    )
                  ) {
                    const api =
                      this.store.lang === "en"
                        ? this.dateApi
                            .replace("=de", "=en")
                            .replace("{{DATE}}", date)
                        : this.dateApi.replace("{{DATE}}", date);
                    // if not send it to the dateAPI, to get a machine readable date
                    fetch(api).then((dateResult) => {
                      console.log(dateResult);
                      dateResult.json().then((json) => {
                        resolve(json.results[0]);
                      });
                    });
                  } else {
                    // else just return it
                    return resolve(date);
                  }
                });
              }
            });
            
            Promise.all(promises).then((dateResult) => {
              dateResult.forEach((dr, i) => {
                // Once we got the promises are resolved, we need to check what can of date, we've gotten
                if (dr) {
                  // If it is a date, from the date-api, it contains an isodate
                  if (dr.isodate) {
                    let unifiedDate = "";
                    const date = dr.isodate;

                    // isodate can contain different properties, dependent on the input of the user
                    // the date needs to be in a unified form, so it must be checked, if additional data must be complemented
                    if (date.when) {
                      unifiedDate = new Date(date.when)
                        .toISOString()
                        .split("T");
                      if (date.when.match(/[0-2][0-9][0-9][0-9]$/g)) {
                        unifiedDate = new Date(
                          String(new Date(date.when).getFullYear()),
                          11,
                          32
                        )
                          .toISOString()
                          .split("T")[0];
                          console.log('fullyear', unifiedDate);
                      } else if (
                        date.when.match(/[0-2][0-9][0-9][0-9]\-[0-1][0-9]$/g)
                      ) {
                        const splitdate = date.when.split("-");
                        unifiedDate = new Date(splitdate[0], splitdate[1], 0)
                          .toISOString()
                          .split("T")[0];
                      } else if (
                        date.when.match(
                          /[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/g
                        )
                      ) {
                        unifiedDate = date.when;
                      }
                    }
                    if (date.notBefore) {
                      unifiedDate = new Date(date.notBefore)
                        .toISOString()
                        .split("T");
                    }
                    if (date.notAfter) {
                      if (date.notAfter.match(/[0-2][0-9][0-9][0-9]$/g)) {
                        unifiedDate = new Date(
                          String(new Date(date.notAfter).getFullYear()),
                          11,
                          32
                        )
                          .toISOString()
                          .split("T");
                      } else if (
                        date.notAfter.match(
                          /[0-2][0-9][0-9][0-9]\-[0-1][0-9]$/g
                        )
                      ) {
                        const splitdate = date.notAfter.split("-");
                        unifiedDate = new Date(splitdate[0], splitdate[1], 0)
                          .toISOString()
                          .split("T");
                      } else if (
                        date.notAfter.match(
                          /[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/g
                        )
                      ) {
                        unifiedDate = date.notAfter;
                      }
                    }
                    if (date.from)
                      unifiedDate = new Date(date.from)
                        .toISOString()
                        .split("T");
                    if (date.to) {
                      if (date.to.match(/[0-2][0-9][0-9][0-9]$/g)) {
                        unifiedDate = new Date(
                          String(new Date(date.to).getFullYear()),
                          11,
                          32
                        )
                          .toISOString()
                          .split("T");
                      } else if (
                        date.to.match(/[0-2][0-9][0-9][0-9]\-[0-1][0-9]$/g)
                      ) {
                        const splitdate = date.to.split("-");
                        unifiedDate = new Date(splitdate[0], splitdate[1], 0)
                          .toISOString()
                          .split("T");
                      } else if (
                        date.to.match(
                          /[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/g
                        )
                      ) {
                        unifiedDate = date.to;
                      }
                    }                    
                    unifiedDates.push(unifiedDate);
                  } else {
                    // If it was already in a machine-readable-state, we must still format it correctly
                    // Check if it is the start- or the end-date
                    if (i === 0) {
                      if (dr.match(/[1-2][0-9][0-9][0-9]$/g)) { unifiedDates.push(`${dr}-01-01`); }
                      else if (dr.match(/[1-2][0-9][0-9][0-9]-[0-9][0-9]$/g)) { unifiedDates.push(`${dr}-01`); }
                      else if (dr.match(/[1-2][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/g)) { unifiedDates.push(dr); }
                    } else {
                      if (dr.match(/[1-2][0-9][0-9][0-9]$/g)) { unifiedDates.push(`${dr}-12-31`); }
                      if (dr.match(/[1-2][0-9][0-9][0-9]-[0-9][0-9]$/g)) { unifiedDates.push(`${dr}-31`); }
                      if (dr.match(/[1-2][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/g)) { unifiedDates.push(dr); }
                    }
                  }
                } else {
                  // If dr is undefined, then we add a very early date as start or very late date as end
                  if (i === 0) {
                    unifiedDates.push("0000-01-01");
                  } else {
                    unifiedDates.push(new Date().toISOString().split("T")[0]);
                  }
                }
              });
              // set map-parameter to true
              this.url.map.mapQuery = true;
              // add dates to url-date-param
              this.url.facets.dates = (unifiedDates.length === 2) ? `${unifiedDates[0]}-${unifiedDates[1]}` : (unifiedDates.length === 1) ? unifiedDates[0] : '';
              // set role of places
              if (this.store.mapSearch.role !== "*") {
                this.store.url.map.role = this.store.mapSearch.role;
              } else this.store.url.map.role = "";
          
              this.$store.commit("updateUrl");
              // define coordinates-object
              const coordinates = {
                coordinates: [...this.store.mapSearch.polygons],
              };
              // send coordinates and execute search
              this.getQuery(coordinates);
            });
          } else {
            // Set mapQuery-Param to true
            this.store.url.map.mapQuery = true;

            if (this.store.mapSearch.role !== "*") {
              this.store.url.map.role = this.store.mapSearch.role;
            } else this.store.url.map.role = "";

            this.commit("updateUrl");
            const coordinates = {
              coordinates: [...this.store.mapSearch.polygons],
            };
            this.getQuery(coordinates);
          }
        }
      }
    },

    fetchResults(query, all) {
      // set load status to true
      this.$store.commit("load", true);
      // TODO remove this as soon as possible: Workaround if date is null, because dateAPI returns something unpredictable
      if (query === null) {
        this.$store.commit("setTeaser", this.label.resultCount0);
      } else {
        // fetch data from json
        fetch(this.store.index, {
          method: "POST",
          mode: "cors",
          body: JSON.stringify(query),
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          console.log("RESPONSE", response);
          response.json().then((json) => {
            console.warn("RESULTS:", json);
            this.$store.commit("load", false);
            if (json.hits.hits.length > 0) {
              this.$store.commit("setResults", json);
              this.$store.commit("setFacets", [json.aggregations, all]);
              this.$store.commit("setTeaser", "");
            } else {
              this.$nextTick(() => {
                this.$store.commit("setTeaser", this.label.resultCount0);
              });
              this.$store.commit("setResults", json);
            }
          });
        });
      }
    },

    fetchMapResults(query) {
      fetch(this.store.index, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(query),
        dataType: "json",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        response.json().then((json) => {
          this.$store.commit(
            "getProperPlaceArray",
            json.aggregations.places.places_list.buckets
          );
          this.$store.commit("setResults", json);
          this.url.map.mapQuery = false;
        });
      });
    },

    getPaginationStart() {
      // check if pagiantion start is less than 1 and set p=0, if not set p=(value-1)
      const p =
        this.store.pagination.start < 1 ? 0 : this.store.pagination.start - 1;
      return p * this.store.pagination.count;
    },
    sorting(target, type) {
      // change sort.[target][type].asc to 'false' if sort.[target][type].active is 'true'
      if (this.sort[target][type].active) {
        this.sort[target][type].asc = !this.sort[target][type].asc;
      }
      // set sort to 'active'
      this.sort[target][type].active = true;
      // set none selected sort type to 'false'
      this.sort[target][type === "alpha" ? "numeric" : "alpha"].active = false;
      // sort depending on type and number of results (extended/not extended)
      if (type === "alpha") {
        this[target].sort((a, b) => {
          const keyA = a.name || a.key;
          const keyB = b.name || b.key;
          if (this.sort[target].alpha.asc) {
            if (keyA > keyB) return 1;
            if (keyA < keyB) return -1;
            if (keyA === keyB) return 0;
          } else {
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            if (keyA === keyB) return 0;
          }
          return null;
        });
        this.extended[target].sort((a, b) => {
          const keyA = a.name || a.key;
          const keyB = b.name || b.key;
          if (this.sort[target].alpha.asc) {
            if (keyA > keyB) return 1;
            if (keyA < keyB) return -1;
            if (keyA === keyB) return 0;
          } else {
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            if (keyA === keyB) return 0;
          }
          return null;
        });
      }
      if (type === "numeric") {
        this[target].sort((a, b) => {
          const keyA = a.count || a.doc_count;
          const keyB = b.count || b.doc_count;
          if (this.sort[target].numeric.asc) {
            if (keyA > keyB) return 1;
            if (keyA < keyB) return -1;
            if (keyA === keyB) return 0;
          } else {
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            if (keyA === keyB) return 0;
          }
          return null;
        });
        this.extended[target].sort((a, b) => {
          const keyA = a.count || a.doc_count;
          const keyB = b.count || b.doc_count;
          if (this.sort[target].numeric.asc) {
            if (keyA > keyB) return 1;
            if (keyA < keyB) return -1;
            if (keyA === keyB) return 0;
          } else {
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            if (keyA === keyB) return 0;
          }
          return null;
        });
      }
    },
    setFacet(
      e /* facet-text */,
      type /* name, place, ... */,
      attr = null /* sender || receiver */
    ) {
      // sets facet because a facet has been selected
      this.$store.commit("addFacet", {
        type,
        facet: e,
        role: attr,
      });
      // this.$store.commit('setPageNumber', 1);
      // update the url because a facet has been selected
      this.$store.commit("updateUrl", true);
      // call the trigger-method
      this.trigger("search");
    },
    removeFacet(e /* facet-text */, type /* name, place, ... */) {
      // remove facet because facet has been deselected
      this.$store.commit("removeFacet", {
        type,
        facet: e,
      });
      // this.$store.commit('setPageNumber', 1);
      // update the url because a facet has been selected
      this.$store.commit('updateUrl', true);
      if (this.search.badges.length > 0 ) 
      // && !(this.search.badges.length ===1 && this.search.badges[0].ref === "pdb18")
      {
        this.$store.commit("updateUrl", true);
        // call the trigger-method
        this.trigger("search");
      } 
      // else if (this.search.badges.length ===1 && this.search.badges[0].ref === "pdb18"){
      //   // set pdb18 teaser
      //   this.$store.commit("setBadges");
      //   this.$store.commit('unsetResults', true);
      //   this.$store.commit("setPDBTeaser", (this.store.pdbTeaserHTML));
      // }
      else {
        // Either none or all results
        this.$store.commit("unsetResults", true);
        this.$store.commit("setPageNumber", 1);
        // this.$store.commit("updateUrl", true);
      }
    },
    exceptFacet(e, type, attr = null) {
      // exclude facet from search result
      this.$store.commit("exceptFacet", {
        type,
        facet: e,
        role: attr,
      });
      // this.$store.commit('setPageNumber', 1);
      // update url because facet has been excluded from search result
      this.$store.commit("updateUrl", true);
      // call trigger-method
      this.trigger("search");
    },
    // method for year chart
    updateChart() {
      d3.select("#csYearChart")
        .selectAll("*")
        .remove();
      if (this.visuals.dates.length > 2 && this.visuals.dates.length < 200) {
        const dates = [];
        this.visuals.dates.forEach((d, k) => {
          dates.push({
            name: d.key_as_string,
            count: d.doc_count,
            facetKey: k,
          });
        });

        const margin = {
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        };

        const height = 100 - margin.top - margin.bottom;
        const width = 230 - margin.left - margin.right;

        const x = d3.scaleBand().rangeRound([0, width], 0.05);
        const y = d3.scaleLinear().rangeRound([height, 20]);

        const svg = d3
          .select("#csYearChart")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(0, 0)");
        const p = d3
          .select("#csYearChart")
          .append("p")
          .attr("class", "text-center border-top cs-text-blue")
          .attr("id", "vizLabel")
          .html("&rarr;");
        p.append("span")
          .attr("class", "float-left")
          .text(dates[0].name);
        p.append("span")
          .attr("class", "float-right")
          .text(dates[dates.length - 1].name);

        x.domain(dates.map((d, key) => key));
        y.domain([0, d3.max(dates, (d) => d.count)]);

        svg
          .selectAll("bar")
          .data(dates)
          .enter()
          .append("rect")
          .style("fill", "#205F82")
          .style("cursor", "pointer")
          .attr("id", (d, i) => `b-${i}`)
          .attr("x", (d, key) => x(key))
          .attr("width", x.bandwidth() - 0.5)
          .attr("y", (d) => y(d.count))
          .attr("height", (d) => height)
          .on("mouseover", (d, i) => {
            d3.select(`#b-${i}`).style("fill", "#F7931E");
            svg
              .append("text")
              .text(() => `${d.name} (${d.count})`)
              .attr("id", "yearInfo")
              .attr("fill", "#000")
              .attr("y", 10);
          })
          .on("mouseout", (d, i) => {
            d3.select(`#b-${i}`).style("fill", "#205F82");
            d3.select("#yearInfo").remove();
          })
          .on("click", (d) => {
            this.setFacet(d.name, "d");
          });
      }
    },

    // ### Ende Methods for Facets ###
    // Currently not in use
    async unifyDates() {
      const allDates = [];
      const unifiedDates = [];
      this.url.facets.dates.forEach((d) => {
        allDates.push(d);
      });
      const yearMonthDayRegex = /[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9](?![0-9])/gm;
      const yearMonthRegex = /[0-2][0-9][0-9][0-9]\-[0-1][0-9](?![0-9])/gm;
      const yearRegex = /(?<![a-zA-Z]+\s)[0-2][0-9][0-9][0-9]/gm;

      const promises = allDates.map(
        (date) =>
          new Promise((resolve, reject) => {
            // check if date matches one of the regexes above (is already in a machine readable format)
            if (
              !(
                yearMonthDayRegex.test(date) ||
                yearMonthRegex.test(date) ||
                yearRegex.test(date)
              )
            ) {
              const api =
                this.store.lang === "en"
                  ? this.dateApi
                      .replace("=de", "=en")
                      .replace("{{DATE}}", date)
                  : this.dateApi.replace("{{DATE}}", date);
              // if not send it to the dateAPI, to get a machine readable date
              fetch(api).then((dateResult) => {
                dateResult.json().then((json) => {
                  resolve(json.results[0]);
                });
              });
            } else {
              resolve(date);
            }
          })
      );

      // when all promises are resolved, built the date-query
      Promise.all(promises).then((dateResult) => {
        dateResult.forEach((dr, i) => {
          // query = this.setDateQuery(query, dr);
          if (dr.isodate) {
            const unifiedDate = {};
            const date = dr.isodate;

            // isodate can contain different properties, dependent on the input of the user
            // the date needs to be in a unified form, so it must be checked, if additional data must be complemented
            if (date.when) {
              [unifiedDate.whenStart] = new Date(date.when)
                .toISOString()
                .split("T");
              if (date.when.match(/[0-2][0-9][0-9][0-9]$/g)) {
                [unifiedDate.whenEnd] = new Date(
                  String(new Date(date.when).getFullYear()),
                  11,
                  32
                )
                  .toISOString()
                  .split("T");
              } else if (
                date.when.match(/[0-2][0-9][0-9][0-9]\-[0-1][0-9]$/g)
              ) {
                const splitdate = date.when.split("-");
                [unifiedDate.whenEnd] = new Date(splitdate[0], splitdate[1], 0)
                  .toISOString()
                  .split("T");
              } else if (
                date.when.match(
                  /[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/g
                )
              ) {
                unifiedDate.whenEnd = date.when;
              }
            }
            if (date.notBefore) {
              [unifiedDate.notBefore] = new Date(date.notBefore)
                .toISOString()
                .split("T");
            }
            if (date.notAfter) {
              if (date.notAfter.match(/[0-2][0-9][0-9][0-9]$/g)) {
                [unifiedDate.notAfter] = new Date(
                  String(new Date(date.notAfter).getFullYear()),
                  11,
                  32
                )
                  .toISOString()
                  .split("T");
              } else if (
                date.notAfter.match(/[0-2][0-9][0-9][0-9]\-[0-1][0-9]$/g)
              ) {
                const splitdate = date.notAfter.split("-");
                [unifiedDate.notAfter] = new Date(splitdate[0], splitdate[1], 0)
                  .toISOString()
                  .split("T");
              } else if (
                date.notAfter.match(
                  /[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/g
                )
              ) {
                unifiedDate.notAfter = date.notAfter;
              }
            }
            if (date.from)
              [unifiedDate.from] = new Date(date.from).toISOString().split("T");
            if (date.to) {
              if (date.to.match(/[0-2][0-9][0-9][0-9]$/g)) {
                [unifiedDate.to] = new Date(
                  String(new Date(date.to).getFullYear()),
                  11,
                  32
                )
                  .toISOString()
                  .split("T");
              } else if (date.to.match(/[0-2][0-9][0-9][0-9]\-[0-1][0-9]$/g)) {
                const splitdate = date.to.split("-");
                [unifiedDate.to] = new Date(splitdate[0], splitdate[1], 0)
                  .toISOString()
                  .split("T");
              } else if (
                date.to.match(/[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/g)
              ) {
                unifiedDate.to = date.to;
              }
            }
            // build a unified dateString for the querybuilder-api
            const dateStart =
              date.when !== undefined
                ? unifiedDate.whenStart
                : unifiedDate.notBefore !== undefined
                ? unifiedDate.notBefore
                : unifiedDate.from
                ? unifiedDate.from
                : "";
            const dateEnd =
              date.when !== undefined
                ? unifiedDate.whenEnd
                : date.notAfter !== undefined
                ? unifiedDate.notAfter
                : date.to
                ? unifiedDate.to
                : "";
            const newDateOccurrence =
              dateStart === dateEnd
                ? dateStart
                : dateStart.concat("-", dateEnd);
            unifiedDates.push(newDateOccurrence);
            console.log("After API", unifiedDates);
          } else {
            const dateNoSpace = dr.replace(/\s/g, "");
            unifiedDates.push(dateNoSpace);
            console.log("After replace", unifiedDates);
          }
        });
        console.log("Before return", unifiedDates);
        return unifiedDates;
      });
    },

    async getQuery(data = null) {
      // get url-params
      const currentUrlString = this.url.urlString;
      // check if data exists, if yes we need to execute a post-request
      if (data) {
        if (currentUrlString !== "") {
          // send data in post-request-body
          fetch(
            `${this.querybuilderApi}${currentUrlString}`,
            {
              method: "POST",
              mode: "cors",
              body: JSON.stringify(data),
            }
          ).then((response) => {
            response.json().then((qy) => {
              const query = qy;
              console.log("GETQUERY:", query);
              // because we currently only get data from the mapSearch, we directly call fetchMapResults
              this.fetchMapResults(query);
            });
          });
        }
      } else {
        if (currentUrlString !== "") {
          fetch(
            `${this.querybuilderApi}${currentUrlString}`
          ).then((response) => {
            response.json().then((qy) => {
              const query = qy;
              console.log("getQuery", query);
              // Query is complete
              console.log("QUERY:", query);
              this.fetchResults(query);
            });
          });
        }
      }
    },
  },
};
</script>
