/* eslint-disable no-underscore-dangle */
import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import facets from './facets';
// import mutations from './mutations';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    lang: 'de', // default: de
    labelsLoaded: false,
    window: window.screen.width,
    map: {},
    // ElasticSearch Index
    index: '',
    acIndex: {
      names: '',
      places: '',
      source_text: '',
      occupations: '',
      cmif: '',
      map: '',
    },
    teaserHTML: '',
    teaser: '',
    pdbTeaserHTML: '',
    pdbTeaser: '',
    // Labels
    labels: {
      loc: '../resources/labels.xml', 
      vals: [],
    },
    statistics:{
      totalFulltext: ''
    },
    landingPage: true,
    loadingActive: false,
    // API for date-transformation
    dateApi: '',
    querybuilderApi: '',
    // Search-related base information
    extendedSearch: {
      link: 'Extended Search',
      show: false,
      terms: {
        names: [],
        places: [],
      },
    },
    search: {
      term: '',
      badges: [],
      options: {
        options: [],
        selected: 'names',
      },
      datasets: [
        {
          ref: '',
          value: '',
          options: [],
          selected: '*',
          index: 'sDatasets0',
        },
      ],
      triggerAutocompleteAt: 3,
      maxHits: 100000, // Former: 60.000
      minScore: 0.5,
      facets: {
        // contains the buckets/content, NOT the chosen entities!
        // store > search > facets = facet contents
        dates: [],
        names: [],
        occupations: [],
        places: [],
        edition: [],
        cmif: [],
        gender: [],
        availability: [],
        datasets:[],
        languages: [],
        fullText: [],
        availableFullText: []
      },
      visuals: {
        dates: [],
      },
    },
    // Search-related results information
    results: {
      all: [],
      count: -1,
    },
    // Pagination
    pagination: {
      start: 1,
      count: 10,
    },
    // Sorting
    sort: {
      numeric: {
        asc: true,
        active: true,
      },
      alpha: {
        asc: true,
        active: false,
      },
    },
    // Autocomplete
    autocomplete: {
      main: {
        suggestions: [],
        show: false,
        selected: 0,
      },
      es: {
        names: [
          {
            suggestions: [],
            show: false,
            selected: 0,
          },
        ],
        places: [
          {
            suggestions: [],
            show: false,
            selected: 0,
          },
        ],
        edition: [
          {
            suggestions: [],
            show: false,
            selected: 0,
          },
        ],
        cmif: [
          {
            suggestions: [],
            show: false,
            selected: 0,
          },
        ],
        occupations: [
          {
            suggestions: [],
            show: false,
            selected: 0,
          },
        ],
        // datasets: [
        //   {
        //     suggestions: [],
        //     show: false,
        //     selected: 0,
        //   },
        // ],
      },
    },
    // Url-parameters
    // HOOK: Facets
    // TODO: inconsistency, search and searchrole regarding persons are not
    // children of facets but places and placesRole are
    // ATTENTION: This object contains the identifiers of the entites that are
    // to be used for search, NOT the bucket/facet-contents!
    // search > url > facets = identifiers of chosen entities
    url: {
      search: [],
      searchRole: [],
      urlString: window.location.href.split('?')[1],
      map: {
        mapQuery: false,
        dates: [],
        role: [],
      },
      facets: {
        dates: [],
        persons: [],
        occupations: [],
        // occupationsRole: [],
        places: [],
        placesRole: [],
        edition: [],
        cmif: [],
        datasets: [],
        gender: [],
        availability: [],
        languages: [],
        fullText: [],
        weekdays: false,
        externalRefLinks: false,
        showDateAsText: false,
        showRDate: false,
        showCmifInfo: false,
      },
      exceptFacets: {
        dates: [],
        persons: [],
        personsRole: [],
        occupations: [],
        // occupationsRole: [],
        places: [],
        placesRole: [],
        edition: [],
        cmif: [],
        datasets: [],
        gender: [],
        availability: [],
        languages: [],
      },
    },
    exSearch: {
      cIndex: 0,
      names: [
        {
          ref: '',
          value: '',
          options: [],
          selected: '*',
          index: 'esCorrespondents0',
        },
      ],
      pIndex: 0,
      places: [
        {
          ref: '',
          value: '',
          options: [],
          selected: '*',
          index: 'esPlaces0',
        },
      ],
      oIndex: 0,
      occupations: [
        {
          ref: '',
          value: '',
          options: [],
          selected: '*',
          index: 'esOccupations0',
        }
      ],
      availability: {
        options: [
          {
            value: 'online',
            text: 'online',
          },
          {
            value: 'print',
            text: 'print',
          },
          {
            value: '*',
            text: 'alle',
          },
        ],
        selected: '*',
      },
      dates: [
        {
          value: '',
          from: '',
          to: '',
        },
      ],
      cmif: [
        {
          ref: '',
          value: '',
          index: 'esCmif0',
        },
      ],
      tIndex: 0,
      datasets: [
        {
          ref: '',
          value: '',
          options: [],
          selected: '*',
          index: 'esDatasets0',
        },
      ],
      edition: [
        {
          ref: '',
          value: '',
          index: 'esEdition0',
        },
      ],
    },
    mapSearch: {
      polygons: [],
      role: '*', // TODO: Array to select role for separate polygons. Needs further work on UI, though.
      places: [],
      acHistogis: [
        {
          value: '',
          suggestions: [],
          selected: 0,
          show: false,
        },
      ],
      dates: [
        {
          value: '',
          iso: null,
        },
        {
          value: '',
          iso: null,
        },
      ],
    },
  },
  actions,
  mutations: {
    // Show map or search
    setMap(state, mode) {
      this.map = mode;
    },
    setExternalRefLinks() {
      // Trigger display of external Ref links in results (e.g. gnd, geonames, ...)
      this.state.url.facets.externalRefLinks = !this.state.url.facets.externalRefLinks;
    },
    setDateAsText() {
      // Toggle display of "Date as Text"
      this.state.url.facets.showDateAsText = !this.state.url.facets.showDateAsText;
    },
    setRDate() {
      // Toggle display of Receive date
      this.state.url.facets.showRDate = !this.state.url.facets.showRDate;
    },
    setCmifInfo() {
      // Toggle display of CmifInfo
      this.state.url.facets.showCmifInfo = !this.state.url.facets.showCmifInfo;
    },
    setWindowWidth(state, windowWidth) {
      // Helper for checking on window width
      this.state.window = windowWidth;
    },
    load(status) {
      // TODO: Either implement working spinner or get rid of loading stuff
      if (status === true) this.state.loadingActive = true;
      else this.state.loadingActive = false;
    },
    toggleExtendedSearch(state) {
      // Trigger display of extended search
      this.state.extendedSearch.show = !state.extendedSearch.show;
    },
    mapSetSearchTerm(state, options) {
      this.state.mapSearch.acHistogis[options[0]].value = options[1];
    },
    mapCloseAutocomplete(state, i) {
      this.state.mapSearch.acHistogis[i].show = false;
      this.state.mapSearch.acHistogis[i].suggestions = [];
      this.state.mapSearch.acHistogis[i].selected = 0;
    },
    // set Value of date fields @mapsearch
    mapSetDate(state, options) {
      this.state.mapSearch.dates[options[0]].value = options[1];
    },
    // Clear polygon array
    mapClearPolygons(state) {
      this.state.mapSearch.polygons = [];
      // Clear form
      this.state.mapSearch.acHistogis[0].value = '';
      this.state.mapSearch.role = '*';
      this.state.mapSearch.dates = [
        {
          value: '',
          iso: null,
        },
        {
          value: '',
          iso: null,
        },
      ];
    },
    // Change role of selected region
    mapSetRoleOfRegion(state, e) {
      this.state.mapSearch.role = e;
    },
    // Transform bucket place locations for map use
    getProperPlaceArray(state, arr) {
      arr.map((poi) => {
        this.state.mapSearch.places.push({
          ...poi.ref.hits.hits[0]._source,
          doc_count: poi.doc_count,
        });
      });
    },
    // set selected list item on mouseover @autocomplete
    acSetSelected(state, options) {
      if (options.target === 'main') {
        this.state.autocomplete.main.selected = options.newKey;
      } else if (options.target === 'map') {
        this.state.mapSearch.acHistogis[options.fieldKey].selected = options.newKey;
      } else {
        this.state.autocomplete.es[options.target][options.fieldKey].selected = options.newKey;
      }
    },
    resetField(state, options) {
      // reset single fields.
      if (options[1] === 'names') {
        this.state.exSearch.names[options[0]] = {
          ref: '',
          value: '',
          options: state.exSearch.names[0].options,
          selected: '*',
          index: `esCorrespondent${this.state.exSearch.names[options[0]].index}`,
        };
      } else if (options[1] === 'occupations') {
        this.state.exSearch.occupations[options[0]] = {
          ref: '',
          value: '',
          options: state.exSearch.occupations[0].options,
          selected: '*',
          index: `esOccupations${this.state.exSearch.occupations[options[0]].index}`,
        };
      } else if (options[1] === 'places') {
        this.state.exSearch.places[options[0]] = {
          ref: '',
          value: '',
          options: state.exSearch.places[0].options,
          selected: '*',
          index: `esPlaces${this.state.exSearch.places[options[0]].index}`,
        };
      } else if (options[1] === 'source_text') {
        this.state.exSearch.edition[options[0]] = {
          ref: '',
          value: '',
          index: `esEdition${this.state.exSearch.edition[options[0]].index}`,
        };
      } else if (options[1] === 'cmif') {
        this.state.exSearch.cmif[options[0]] = {
          ref: '',
          value: '',
          index: `esCmif${this.state.exSearch.cmif[options[0]].index}`,
        };
      } else if (options[1] === 'datasets') {
        this.state.exSearch.datasets[options[0]] = {
          ref: '',
          value: '',
          options: state.exSearch.datasets[0].options,
          selected: '*',
          index: `esDatasets${this.state.exSearch.datasets[options[0]].index}`,
        };
      } else if (options[1] === 'map') {
        this.state.mapSearch.acHistogis[options[0]].value = '';
        this.state.mapSearch.acHistogis[options[0]].suggestions = [];
        this.state.mapSearch.acHistogis[options[0]].selected = 0;
        this.state.mapSearch.acHistogis[options[0]].show = false;
      }
    },
    esResetSearch(state) {
      this.commit('resetSearch');
      this.commit('esResetSearchForm');
    },
    esResetSearchForm(state) {
      // reset extended search completely
      this.state.exSearch = {
        cIndex: 0,
        names: [
          {
            ref: '',
            value: '',
            options: state.exSearch.names[0].options,
            selected: '*',
            index: 'esCorrespondent0',
          },
        ],
        pIndex: 0,
        places: [
          {
            ref: '',
            value: '',
            options: state.exSearch.places[0].options,
            selected: '*',
            index: 'esPlaces0',
          },
        ],
        oIndex: 0,
        occupations: [
          {
            ref: '',
            value: '',
            options: state.exSearch.occupations[0].options,
            selected: '*',
            index: 'esOccupations0',
          },
        ],
        availability: state.exSearch.availability,
        dates: [
          {
            value: '',
            from: '',
            to: '',
          },
        ],
        cmif: [
          {
            ref: '',
            value: '',
            index: 'esCmif0',
          },
        ],
        datasets: [
          {
            ref: '',
            value: '',
            options: state.exSearch.datasets[0].options,
            selected: '*',
            index: 'esDatasets0',
          },
        ],
        edition: [
          {
            ref: '',
            value: '',
            index: 'esEdition0',
          },
        ],
      };
    },
    esAddCorrespondent(state) {
      // add Correspondent to exSearch
      let x = 0;
      let goOn = false;
      while (!goOn) {
        let keyExists = false;
        for (let u = 0; u < state.exSearch.names.length; u += 1) {
          if (state.exSearch.names[u].index === `esCorrespondents${x}`) {
            x += 1;
            keyExists = true;
            break;
          }
        }
        if (!keyExists) goOn = true;
      }
      this.state.exSearch.names.push({
        value: '',
        ref: '',
        options: [
          {
            value: 'sent',
            text: state.labels.vals['form.sender'],
          },
          {
            value: 'received',
            text: state.labels.vals['form.addressee'],
          },
          {
            value: '*',
            text: state.labels.vals['form.senderAndAddressee'],
          },
        ],
        selected: '*',
        index: `esCorrespondents${x}`,
      });
      state.autocomplete.es.names.push({
        show: false,
        suggestions: [],
        selected: 0,
      });
    },
    esRemCorrespondent(state, ref) {
      // Remove correspondent from extended Search
      for (let i = 0; i < state.exSearch.names.length; i += 1) {
        if (state.exSearch.names[i].ref === ref) {
          state.url.search.splice(i, 1);
          state.exSearch.names.splice(i, 1);
          state.autocomplete.es.names.splice(i, 1);
          break;
        }
      }
    },
    esAddDate() {
      // add Date to exSearch
      this.state.exSearch.dates.push({
        from: '',
        to: '',
      });
    },
    esRemDate(state, key) {
      // Remove Date from exSearch
      this.state.exSearch.dates.splice(key, 1);
    },
    esAddPlace(state) {
      // add Place to exSearch
      let x = 0;
      let goOn = false;
      while (!goOn) {
        let keyExists = false;
        for (let u = 0; u < state.exSearch.places.length; u += 1) {
          if (state.exSearch.places[u].index === `esPlaces${x}`) {
            x += 1;
            keyExists = true;
            break;
          }
        }
        if (!keyExists) goOn = true;
      }
      this.state.exSearch.places.push({
        value: '',
        ref: '',
        options: [
          {
            value: 'sent',
            text: state.labels.vals['form.placeRole.placeSender'],
          },
          {
            value: 'received',
            text: state.labels.vals['form.placeRole.placeAddressee'],
          },
          {
            value: '*',
            text: state.labels.vals['form.placeRole.place'],
          },
        ],
        selected: '*',
        index: `esPlaces${x}`,
      });
      state.autocomplete.es.places.push({
        show: false,
        suggestions: [],
        selected: 0,
      });
    },
    esRemPlace(state, ref) {
      // Remove Correspondent from exSearch
      for (let i = 0; i < state.exSearch.places.length; i += 1) {
        if (state.exSearch.places[i].ref === ref) {
          state.url.facets.places.splice(i, 1);
          state.exSearch.places.splice(i, 1);
          state.autocomplete.es.places.splice(i, 1);
          break;
        }
      }
    },
    // exSearch Add Occupation
    esAddOccupation(state) {
      // add Edition to exSearch
      let x = 0;
      let goOn = false;
      while (!goOn) {
        let keyExists = false;
        for (let u = 0; u < state.exSearch.occupations.length; u += 1) {
          if (state.exSearch.occupations[u].index === `esOccupations${x}`) {
            x += 1;
            keyExists = true;
            break;
          }
        }
        if (!keyExists) goOn = true;
      }
      this.state.exSearch.occupations.push({
        value: '',
        ref: '',
        index: `esOccupations${x}`,
      });
      state.autocomplete.es.occupations.push({
        show: false,
        suggestions: [],
        selected: 0,
      });
    },
    // exSearch Remove Occupation
    esRemOccupation(state, ref) {
      for (let i = 0; i < state.exSearch.occupations.length; i += 1) {
        if (state.exSearch.occupations[i].ref === ref) {
          state.url.facets.occupations.splice(i, 1);
          state.exSearch.occupations.splice(i, 1);
          state.autocomplete.es.occupations.splice(i, 1);
          break;
        }
      }
    },
    esAddEdition(state) {
      // add Edition to exSearch
      let x = 0;
      let goOn = false;
      while (!goOn) {
        let keyExists = false;
        for (let u = 0; u < state.exSearch.edition.length; u += 1) {
          if (state.exSearch.edition[u].index === `esEdition${x}`) {
            x += 1;
            keyExists = true;
            break;
          }
        }
        if (!keyExists) goOn = true;
      }
      this.state.exSearch.edition.push({
        value: '',
        ref: '',
        index: `esEdition${x}`,
      });
      state.autocomplete.es.edition.push({
        show: false,
        suggestions: [],
        selected: 0,
      });
    },
    esRemEdition(state, ref) {
      // remove Editon from exSearch
      for (let i = 0; i < state.exSearch.edition.length; i += 1) {
        if (state.exSearch.edition[i].ref === ref) {
          state.url.facets.edition.splice(i, 1);
          state.exSearch.edition.splice(i, 1);
          state.autocomplete.es.edition.splice(i, 1);
          break;
        }
      }
    },
    esAddDataset(state) {
      // add Dataset to exSearch
      let x = 0;
      let goOn = false;
      while (!goOn) {
        let keyExists = false;
        for (let u = 0; u < state.exSearch.datasets.length; u += 1) {
          if (state.exSearch.datasets[u].index === `esDatasets${x}`) {
            x += 1;
            keyExists = true;
            break;
          }
        }
        if (!keyExists) goOn = true;
      }
      this.state.exSearch.datasets.push({
        value: '',
        ref: '',
        options: [
          {
            value: 'pdb18',
            text: state.labels.vals['form.dataset.PDB18'],
          },
          {
            value: 'aupro',
            text: state.labels.vals['form.dataset.academyProgram'],
          },
          {
            value: 'norkorr',
            text: state.labels.vals['form.dataset.norkorr'],
          },
          {
            value: '*',
            text: state.labels.vals['form.dataset.all'],
          },
        ],
        selected: '*',
        index: `esDatasets${x}`,
      });
    },
    esRemDataset(state, tSelected) {
      // Remove Dataset from exSearch
      for (let i = 0; i < state.exSearch.datasets.length; i += 1) {
        if (state.exSearch.datasets[i].selected === tSelected) {
          state.url.facets.datasets.splice(i, 1);
          state.exSearch.datasets.splice(i, 1);
          //state.autocomplete.es.datasets.splice(i, 1);
          break;
        }
      }
    },
    esAddCmif(state) {
      // add CMIF to exSearch
      let x = 0;
      let goOn = false;
      while (!goOn) {
        let keyExists = false;
        for (let u = 0; u < state.exSearch.cmif.length; u += 1) {
          if (state.exSearch.cmif[u].index === `esCmif${x}`) {
            x += 1;
            keyExists = true;
            break;
          }
        }
        if (!keyExists) goOn = true;
      }
      this.state.exSearch.cmif.push({
        value: '',
        ref: '',
        index: `esCmif${x}`,
      });
      state.autocomplete.es.cmif.push({
        show: false,
        suggestions: [],
        selected: 0,
      });
    },
    esRemCmif(state, ref) {
      // Remove CMIF from exSearch
      for (let i = 0; i < state.exSearch.cmif.length; i += 1) {
        if (state.exSearch.cmif[i].ref === ref) {
          state.url.facets.cmif.splice(i, 1);
          state.exSearch.cmif.splice(i, 1);
          state.autocomplete.es.cmif.splice(i, 1);
          break;
        }
      }
    },
    esSetTerm(state, options = { suggestion: {}, field: Number, type: String }) {
      // Helper function to set ref according to selected input and reset Autocomplete
      const c = state.exSearch[options.type];
      c[options.field].value = options.suggestion.text;

      let ref = '';
      if (options.type === 'edition') ref = options.suggestion.id;
      if (options.type === 'names' || options.type === 'places' || options.type === 'cmif' || options.type === 'occupations') ref = options.suggestion.ref;
      c[options.field].ref = ref;

      this.state.exSearch[options.type] = [...c];
      this.state.autocomplete.es[options.type][options.field].suggestions = [];
      this.state.autocomplete.es[options.type][options.field].show = false;
    },
    esSetOption(state, options = {
      type: Object,
      field: Number,
      value: String,
    }) {
      // Set Options for sender/receiver/all or select field for availability
      switch (options.type) {
        default: break;
        case 'names': {
          const c = state.exSearch.names;
          c[options.field].selected = options.value;
          this.state.exSearch.names = [...c];
        } break;
        case 'places': {
          const p = state.exSearch.places;
          p[options.field].selected = options.value;
          this.state.exSearch.places = [...p];
        } break;
        case 'availability':
          this.state.exSearch.availability.selected = options.value;
        break;
        case 'exSearchDatasets':
          const t = state.exSearch.datasets;
          t[options.field].selected = options.value;
          this.state.exSearch.datasets = [...t];
        break;
        case 'searchDatasets':
          const sd = state.search.datasets;
          sd[options.field].selected = options.value;
          this.state.search.datasets = [...sd];
        break;
      }
    },
    esGetInputData(state) {
      // Wrapper for triggering extended Search
      // TODO: Merge this and the trigger-function in App component the
      // following way:
      // TRIGGER
      // |-> Autocomplete || Search
      // |-> Generate Query
      // |=> return
      this.commit('load', true);
      this.commit('unsetResults');
      this.state.url.facets.dates = [];
      // Calculate date ranges
      const dates = [];
      state.exSearch.dates.map((date) => {
        if (date.value.length > 0) {
          
          const dateArray = date.value.split(' ');
          let arrayToUpperCaseDate = dateArray.map((datePart) => {
           if (datePart.match(/^[a-z]/g)) {
              return datePart.charAt(0).toUpperCase() + datePart.slice(1);
            }

            return datePart;              
          });

          arrayToUpperCaseDate = arrayToUpperCaseDate.join(' ');
          this.state.url.facets.dates.push(arrayToUpperCaseDate);
        }
      });
      
              this.state.url.search = [];
              this.state.url.searchRole = [];
              let killIt = null;
              state.exSearch.names.map((c, i) => {
                if (c.ref !== undefined && c.ref !== '') {
                  this.state.url.search.push(c.ref);
                  this.state.url.searchRole.push(c.selected);
                } else {
                  killIt = i;
                }
              });
              if (killIt !== null && this.state.exSearch.names.length > 1) this.state.exSearch.names.splice(killIt, 1);

              killIt = null;
              this.state.url.facets.places = [];
              this.state.url.facets.placesRole = [];
              state.exSearch.places.map((p, i) => {
                if (p.ref !== undefined && p.ref !== '') {
                  this.state.url.facets.places.push(p.ref);
                  this.state.url.facets.placesRole.push(p.selected);
                } else {
                  killIt = i;
                }
              });
              if (killIt !== null && this.state.exSearch.places.length > 1) this.state.exSearch.places.splice(killIt, 1);

              // Occupations
              killIt = null;
              this.state.url.facets.occupations = [];
              state.exSearch.occupations.map((o, i) => {
                if (o.ref !== undefined && o.ref !== '') {
                  this.state.url.facets.occupations.push(o.ref);
                  // this.state.url.facets.occupationsRole.push(o.selected);
                } else {
                  killIt = i;
                }
              });
              if (killIt !== null && this.state.exSearch.occupations.length > 1) this.state.exSearch.occupations.splice(killIt, 1);

              killIt = null;
              this.state.url.facets.cmif = [];
              state.exSearch.cmif.map((c, i) => {
                if (c.ref !== undefined && c.ref !== '') {
                  this.state.url.facets.cmif.push(c.ref);
                } else {
                  killIt = i;
                }
              });
              if (killIt !== null && this.state.exSearch.cmif.length > 1) this.state.exSearch.cmif.splice(killIt, 1);
              // DATASET
              killIt = null;
              this.state.url.facets.datasets = [];
              state.exSearch.datasets.map((t, i) => {
                if (t.selected !== undefined && t.selected !== '' && t.selected !== '*') {
                  if (!this.state.url.facets.datasets.includes(t.selected)) {
                    this.state.url.facets.datasets.push(t.selected);
                  }
                } else {
                  killIt = i;
                }
              });
              if (killIt !== null && this.state.exSearch.datasets.length > 1) {
                this.state.exSearch.datasets.splice(killIt, 1);
              }

              killIt = null;
              this.state.url.facets.edition = [];
              state.exSearch.edition.map((e, i) => {
                if (e.ref !== undefined && e.ref !== '') {
                  this.state.url.facets.edition.push(e.ref);
                } else {
                  killIt = i;
                }
              });
              if (killIt !== null && this.state.exSearch.edition.length > 1) this.state.exSearch.edition.splice(killIt, 1);

              this.state.url.facets.availability = [];
              if (state.exSearch.availability.selected !== '*') {
                this.state.url.facets.availability = [state.exSearch.availability.selected];
              }
    },
    setTeaser(state, str) {
      /* this.state.teaser = str;
      if (init[0] && init[1] === null) this.state.teaserHTML = str;
      else if (init[0] && init[1] !== null) this.state.teaserHTML = init[1];
      */
      this.state.teaser = str;
    },
    setTeaserHTML(state, str) {
      this.state.teaserHTML = str;
    },
    setPDBTeaser(state, str) {
      this.state.pdbTeaser = str;
    },
    setPDBTeaserHTML(state, str) {
      this.state.pdbTeaserHTML = str;
    },
    sortFacets(state, options) {
      // Wrapper function for sorting facets asc/desc or numeric/alpha
      const target = options[0];
      const type = options[1];
      const asc = options[2];

      if (type === 'alpha' || type === 'numeric') {
        this.state.search.facets[target].sort((a, b) => {
          if (asc) {
            if (a.key > b.key) return 1;
            if (a.key < b.key) return -1;
            if (a.key === b.key) return 0;
          } else {
            if (a.key > b.key) return -1;
            if (a.key < b.key) return 1;
            if (a.key === b.key) return 0;
          }
          return null;
        });
      }
      if (type === 'numeric') {
        this.state.search.facets[target].sort((a, b) => {
          if (asc) {
            if (a.doc_count > b.doc_count) return 1;
            if (a.doc_count < b.doc_count) return -1;
            if (a.doc_count === b.doc_count) return 0;
          } else {
            if (a.doc_count > b.doc_count) return -1;
            if (a.doc_count < b.doc_count) return 1;
            if (a.doc_count === b.doc_count) return 0;
          }
          return null;
        });
      }
    },
    
    // sorts results alphabetical or numerical in ascending or descending order
    // currently only numerical sorting is used
    sortResults(state, target) {
      // Adjust sorting variables
      if (this.state.sort[target].active) {
        this.state.sort[target].asc = !this.state.sort[target].asc;
      }
      this.state.sort[target].active = true;
      this.state.sort[(target === 'alpha') ? 'numeric' : 'alpha'].active = false;

      this.commit('updateUrl');
      
    },
    // This is in fact a trigger-function only for AC but was meant to be used
    // in a more generic way. See comment in line #774ff
    trigger(state, options = {
      key: 0,
      target: '',
      autocomplete: true,
      input: '',
      main: false,
    }) {
      if (options.autocomplete) {
        let query = {};
        if (options.target === 'names' || options.target === 'places') {
          query = {
            query: {
              simple_query_string: {
                query: options.input,
                fields: [
                    'text',
                ],
                default_operator: 'and',
              },
            },
            highlight: {
              number_of_fragments: 0,
              fields: {
                text: {},
              },
            },
          };
        } else if (options.target === 'source_text') {
          query = {
            query: {
              simple_query_string: {
                query: options.input,
                fields: [
                    'source_text',
                ],
                default_operator: 'and',
              },
            },
            highlight: {
              number_of_fragments: 0,
              fields: {
                source_text: {},
              },
            },
          };
        } else if (options.target === 'cmif') {
          query = {
            query: {
              simple_query_string: {
                query: options.input,
                fields: [
                    'cmif_title',
                ],
                default_operator: 'and',
              },
            },
            highlight: {
              number_of_fragments: 0,
              fields: {
                cmif_title: {},
              },
            },
          };
        } else if (options.target === 'datasets') {
          if (this.state.lang === 'de') {
            query = {
              query: {
                simple_query_string: {
                  query: options.input,
                  fields: [
                        'label_de',
                  ],
                  default_operator: 'and',
                },
              },
              highlight: {
                number_of_fragments: 0,
                fields: {
                  label_de: {},
                },
              },
            };
          }
        }
        else if (options.target === 'map') {
          query = {
            sort: {
              start_date: {
                order: 'asc',
              },
            },
            query: {
              simple_query_string: {
                query: options.input,
                fields: [
                    'title',
                ],
                default_operator: 'and',
              },
            },
            highlight: {
              number_of_fragments: 0,
              fields: {
                title: {},
              },
            },
          };
        } 
        else if (options.target === 'occupations') {
          if (this.state.lang === 'de') {
            query = {
              query: {
                simple_query_string: {
                  query: options.input,
                  fields: [
                        'label_de',
                  ],
                  default_operator: 'and',
                },
              },
              highlight: {
                number_of_fragments: 0,
                fields: {
                  label_de: {},
                },
              },
            };
          }
          else if (this.state.lang === 'en') {
            query = {
              query: {
                simple_query_string: {
                  query: options.input,
                  fields: [
                        'label_en',
                  ],
                  default_operator: 'and',
                },
              },
              highlight: {
                number_of_fragments: 0,
                fields: {
                  label_en: {},
                },
              },
            };
          }
        }
        console.log('AC-QUERY', JSON.stringify(query));
        fetch(state.acIndex[options.target], {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(query),
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          response.json().then((json) => {
            console.log('AC-hits', json.hits);
            if (json.hits.hits && json.hits.hits.length > 0) {
              console.log('AC-RESULT', json);
              this.commit('setSuggestions', {
                suggestions: json.hits.hits,
                type: options.target,
                key: options.key,
                main: options.main,
                input: options.input,
              });
              // necessary to activate key-navigation within autocomplete
              if (state.extendedSearch.show) {
                document.getElementById(`acExS-${(options.target === 'source_text') ? 'edition' : options.target}-${options.key}`).focus();
              }
            }
          });
        }).catch(error => console.error(error));
      }
    },
    // Set labels before anything else is happening
    setLabels(state, result) {
      const parse = new Promise((resolve, reject) => {
        // Change to vue route
        this.state.lang = (window.location.search.match(/[?&]l=en/) || window.location.href.match(/correspsearch\.net\/en\//)) ? 'en' : 'de';
        const parser = new DOMParser();
        const xml = parser.parseFromString(result, 'application/xml');
        for (let i = 0; i < xml.children[0].children.length; i += 1) {
          if (xml.children[0].children[i].attributes[0].value === String(this.state.lang)) {
            for (let j = 0; j < xml.children[0].children[i].children.length; j += 1) {
              this.state.labels.vals[xml.children[0].children[i].children[j].attributes[0].value] = xml.children[0].children[i].children[j].innerHTML;
            }
          }
          if (i === xml.children[0].children.length - 1) {
            resolve();
          }
        }
      });

      parse.then(() => {
        this.state.labelsLoaded = true;

        this.state.extendedSearch.link = state.labels.vals['search.extendedSearch'];
        // HOOK: Facets
        this.state.search.options.options = [
          { value: 'names', text: state.labels.vals['search.correspondent'] },
          { value: 'places', text: state.labels.vals['search.place'] },
          { value: 'occupations', text: state.labels.vals['search.occupation'] },
          { value: 'date', text: state.labels.vals['search.date'] },
          { value: 'full_text', text: state.labels.vals['search.full_text'] },
          { value: 'source_text', text: state.labels.vals['form.publications'] },
          { value: 'cmif', text: state.labels.vals['search.cmif'] },
          { value: 'datasets', text: state.labels.vals['search.datasets'] },
        ];

        // Setup extended search
        this.state.exSearch.names[0] = {
          options: [
            {
              value: 'sent',
              text: state.labels.vals['form.sender'],
            },
            {
              value: 'received',
              text: state.labels.vals['form.addressee'],
            },
            {
              value: '*',
              text: state.labels.vals['form.senderAndAddressee'],
            },
          ],
          selected: '*',
          index: 'esCorrespondents0',
          value: '',
          ref: '',
        };
        this.state.exSearch.places[0] = {
          options: [
            {
              value: 'sent',
              text: state.labels.vals['form.placeRole.placeSender'],
            },
            {
              value: 'received',
              text: state.labels.vals['form.placeRole.placeAddressee'],
            },
            {
              value: '*',
              text: state.labels.vals['form.placeRole.place'],
            },
          ],
          selected: '*',
          index: 'esPlaces0',
          value: '',
          ref: '',
        };
        this.state.exSearch.datasets[0] = {
          options: [
            {
              value: 'pdb18',
              text: state.labels.vals['form.dataset.PDB18'],
            },
            {
              value: 'aupro',
              text: state.labels.vals['form.dataset.academyProgram'],
            },
            {
              value: 'norkorr',
              text: state.labels.vals['form.dataset.norkorr'],
            },
            {
              value: '*',
              text: state.labels.vals['form.dataset.all'],
            },
          ],
          selected: '*',
          index: 'esDatasets0',
          value: '',
          ref: '',
        };
        this.state.exSearch.availability.options.map((o, i) => {
          if (o.value === '*') this.state.exSearch.availability.options[i].text = state.labels.vals['form.availability.all'];
          if (o.value === 'print') this.state.exSearch.availability.options[i].text = state.labels.vals['form.availability.print'];
          if (o.value === 'online') this.state.exSearch.availability.options[i].text = state.labels.vals['form.availability.online'];
        });
        // Setup some badges that need setup... i.e. avail
        this.state.search.badges.map((b, i) => {
          const badge = b;
          if (b.text === 'online') this.state.search.badges[i].text = state.labels.vals['form.availability.online'];
          if (b.text === 'print') this.state.search.badges[i].text = state.labels.vals['form.availability.print'];
          if (b.text === 'hybrid') this.state.search.badges[i].text = state.labels.vals['form.availability.hybrid'];
          if (b.text === '*') this.state.search.badges[i].text = state.labels.vals['form.availability.all'];
        });

        this.state.search.datasets[0] = {
          options: [
            {
              value: 'pdb18',
              text: state.labels.vals['form.dataset.PDB18'],
            },
            {
              value: 'aupro',
              text: state.labels.vals['form.dataset.academyProgram'],
            },
            {
              value: 'norkorr',
              text: state.labels.vals['form.dataset.norkorr'],
            },
            {
              value: '*',
              text: state.labels.vals['form.dataset.all'],
            },
          ],
          selected: '*',
          index: 'sDatasets0',
          value: '',
          ref: '',
        };
      });
    },
    // Set statistics in beforeCreate
    setStatisitcs(state, statXML){
      const parser = new DOMParser();
      // parse the xml file that we fetched in the beforeCreate
      const xml = parser.parseFromString(statXML, 'application/xml');
      // set totalFulltext to the value of the <row name="available_fulltext"> found in the last <statistic> Element
      let rootChildren = xml.children[0];
      let firstLevelLastChild = rootChildren.children[rootChildren.children.length - 1];
      let secondLevelLastChild = firstLevelLastChild.children[firstLevelLastChild.children.length - 1];
      if(secondLevelLastChild.attributes[0].value ==='available_fulltext'){
        this.state.statistics.totalFulltext = secondLevelLastChild.innerHTML
      }
  },

    // set Page Number
    setPageNumber(state, no) {
      this.state.pagination.start = no;
    },
    // set Search Term
    setSearchTerm(state, term) {
      this.state.search.term = term;
    },
    // move facet information from agg object to main facet object
    setFacets(state, options = [{}, false]) {
      const agg = options[0];
      this.state.search.facets = {
        dates: agg.dates.date_histogram.buckets,
        names: agg.names.names_list.buckets,
        occupations: agg.occupations.occupations_list.buckets,
        namesRoles: agg.namesRoles.actions.buckets,
        places: agg.places.places_list.buckets,
        placesRoles: agg.placesRoles.actions.buckets,
        edition: agg.edition.buckets,
        cmif: agg.cmif.buckets,
        datasets: agg.datasets.datasets_list.buckets,
        gender: agg.gender.gender_list.buckets,
        availability: agg.availability.buckets,
        languages: agg.languages.languages_list.buckets,
        availableFullText: agg.available_full_text.buckets,
      };
      this.state.search.visuals.dates = agg.visualDates.date_histogram.buckets;
    },
    // Clear Facets
    clearFacets(state) {
      this.state.search.facets = {
        dates: [],
        names: [],
        places: [],
        occupations: [],
        edition: [],
        cmif: [],
        datasets: [],
        gender: [],
        availability: [],
        languages: [],
      };
      this.state.search.visuals.dates = [];
    },
    // remove Badge and adjust exSearch accordingly.
    // TODO: Move exSearch-Handling to separate function
    removeBadge(state, e) {
      // HOOK: Facets
      if (this.state.url.search.includes(e.ref)) {
        this.state.url.searchRole.splice(this.state.url.search.indexOf(e.ref), 1);
        this.state.url.search.splice(this.state.url.search.indexOf(e.ref), 1);
      }
      this.state.exSearch.names.map((c, i) => {
        if (c.ref === e.ref) {
          if (this.state.exSearch.names.length === 1) {
            this.state.exSearch.names[0].ref = '';
            this.state.exSearch.names[0].value = '';
          } else {
            this.state.exSearch.names.splice(i, 1);
            this.state.autocomplete.es.names.splice(i, 1);
          }
        }
      });

      if (this.state.url.facets.occupations.includes(e.ref)) {
        this.state.url.facets.occupations.splice(this.state.url.facets.occupations.indexOf(e.ref), 1);
      }
      this.state.exSearch.occupations.map((c, i) => {
        if (c.ref === e.ref) {
          if (this.state.exSearch.occupations.length === 1) {
            this.state.exSearch.occupations[0].ref = '';
            this.state.exSearch.occupations[0].value = '';
          } else {
            this.state.exSearch.occupations.splice(i, 1);
            this.state.autocomplete.es.occupations.splice(i, 1);
          }
        }
      });
      if (this.state.url.facets.places.includes(e.ref)) {
        this.state.url.facets.placesRole.splice(this.state.url.facets.places.indexOf(e.ref), 1);
        this.state.url.facets.places.splice(this.state.url.facets.places.indexOf(e.ref), 1);
        
      }
      this.state.exSearch.places.map((c, i) => {
        if (c.ref === e.ref) {
          if (this.state.exSearch.places.length === 1) {
            this.state.exSearch.places[0].ref = '';
            this.state.exSearch.places[0].value = '';
          } else {
            this.state.exSearch.places.splice(i, 1);
            this.state.autocomplete.es.places.splice(i, 1);
          }
        }
      });
      if (this.state.url.facets.edition.includes(e.ref)) this.state.url.facets.edition.splice(this.state.url.facets.edition.indexOf(e.ref), 1);
      this.state.exSearch.edition.map((c, i) => {
        if (c.ref === e.ref) {
          if (this.state.exSearch.edition.length === 1) {
            this.state.exSearch.edition[0].ref = '';
            this.state.exSearch.edition[0].value = '';
          } else {
            this.state.exSearch.edition.splice(i, 1);
            this.state.autocomplete.es.edition.splice(i, 1);
          }
        }
      });
      if (this.state.url.facets.cmif.includes(e.ref)) this.state.url.facets.cmif.splice(this.state.url.facets.cmif.indexOf(e.ref), 1);
      this.state.exSearch.cmif.map((c, i) => {
        if (c.ref === e.ref) {
          if (this.state.exSearch.cmif.length === 1) {
            this.state.exSearch.cmif[0].ref = '';
            this.state.exSearch.cmif[0].value = '';
          } else {
            this.state.exSearch.cmif.splice(i, 1);
            this.state.autocomplete.es.cmif.splice(i, 1);
          }
        }
      });

      if (this.state.url.facets.datasets.includes(e.ref)) this.state.url.facets.datasets.splice(this.state.url.facets.datasets.indexOf(e.ref), 1);
      this.state.exSearch.datasets.map((t, i) => {
        if (t.selected === e.ref) {
          if (this.state.exSearch.datasets.length === 1) {
            this.state.exSearch.datasets[0].selected = '*';
          } else {
            this.state.exSearch.datasets.splice(i, 1);
      }
        }
      });
      // languages
      if (this.state.url.facets.languages.includes(e.ref)) this.state.url.facets.languages.splice(this.state.url.facets.languages.indexOf(e.ref), 1);
      // fullText
      if (this.state.url.facets.fullText.includes(e.ref)) this.state.url.facets.fullText.splice(this.state.url.facets.fullText.indexOf(e.ref), 1);

      if (this.state.url.facets.gender.includes(e.ref)) {
        this.state.url.facets.gender.splice(this.state.url.facets.gender.indexOf(e.ref), 1);
      }
      if (e.text === state.labels.vals['form.availability.online']) {
        this.state.url.facets.availability.splice(this.state.url.facets.availability.indexOf('online'), 1);
        this.state.exSearch.availability.selected = '*';
      }
      if (e.text === state.labels.vals['form.availability.print']) {
        this.state.url.facets.availability.splice(this.state.url.facets.availability.indexOf('print'), 1);
        this.state.exSearch.availability.selected = '*';
      }
      if (e.text === state.labels.vals['form.availability.hybrid']) {
        this.state.url.facets.availability.splice(this.state.url.facets.availability.indexOf('hybrid'), 1);
        this.state.exSearch.availability.selected = '*';
      }
      this.state.url.facets.dates.map((date, i) => {
        this.state.exSearch.dates.map((d, j) => {
          if (d.value === e.text && this.state.exSearch.dates.length > 1) {
            this.state.exSearch.dates.splice(j, 1);
          } else if (d.value === e.text && this.state.exSearch.dates.length === 1) {
            this.state.exSearch.dates = [{
              to: '',
              from: '',
              value: '',
            }];
          }
        });
        if (date === e.text) {
          this.state.url.facets.dates.splice(i, 1);
        }
      });
      for (let i = 0; i < this.state.search.badges.length; i += 1) {
        if (
            (this.state.search.badges[i].ref === e.ref && this.state.search.badges[i].ref.length > 0)
          || (this.state.search.badges[i].ref.length === 0 && this.state.search.badges[i].text === e.text)
        ) {
          this.state.search.badges.splice(i, 1);
          break;
        }
      }

      if (this.state.url.exceptFacets.persons.includes(e.ref)) {
        this.state.url.exceptFacets.personsRole.splice(this.state.url.exceptFacets.persons.indexOf(e.ref), 1);
        this.state.url.exceptFacets.persons.splice(this.state.url.exceptFacets.persons.indexOf(e.ref), 1);
      }
      if (this.state.url.exceptFacets.places.includes(e.ref)) {
        this.state.url.exceptFacets.placesRole.splice(this.state.url.exceptFacets.places.indexOf(e.ref), 1);
        this.state.url.exceptFacets.places.splice(this.state.url.exceptFacets.places.indexOf(e.ref), 1);
        
      }
      if (this.state.url.exceptFacets.occupations.includes(e.ref)) {
        this.state.url.exceptFacets.occupations.splice(this.state.url.exceptFacets.occupations.indexOf(e.ref), 1);
        // this.state.url.exceptFacets.occupationsRole.splice(this.state.url.exceptFacets.occupations.indexOf(e.ref), 1);
      }
      if (this.state.url.exceptFacets.edition.includes(e.ref)) 
        this.state.url.exceptFacets.edition.splice(this.state.url.exceptFacets.edition.indexOf(e.ref), 1);
      if (this.state.url.exceptFacets.cmif.includes(e.ref)) 
        this.state.url.exceptFacets.cmif.splice(this.state.url.exceptFacets.cmif.indexOf(e.ref), 1);
      if (this.state.url.exceptFacets.datasets.includes(e.ref)) 
        this.state.url.exceptFacets.datasets.splice(this.state.url.exceptFacets.datasets.indexOf(e.ref), 1);
        // except languages
      if (this.state.url.exceptFacets.languages.includes(e.ref)) 
        this.state.url.exceptFacets.languages.splice(this.state.url.exceptFacets.languages.indexOf(e.ref), 1);
      if (this.state.url.exceptFacets.gender.includes(e.ref)) {
        this.state.url.exceptFacets.gender.splice(this.state.url.exceptFacets.gender.indexOf(e.ref), 1);
      }
      if (e.text === state.labels.vals['form.availability.online']) {
        this.state.url.exceptFacets.availability
            .splice(this.state.url.exceptFacets.availability
                .indexOf('online'), 1);
      }
      if (e.text === state.labels.vals['form.availability.print']) {
        this.state.url.exceptFacets.availability
            .splice(this.state.url.exceptFacets.availability
                .indexOf('print'), 1);
      }
      if (e.text === state.labels.vals['form.availability.hybrid']) {
        this.state.url.exceptFacets.availability
            .splice(this.state.url.exceptFacets.availability
                .indexOf('hybrid'), 1);
      }
      this.state.url.exceptFacets.dates.map((date, i) => {
        if (date === e.text) {
          this.state.url.exceptFacets.dates.splice(i, 1);
        }
      });
      for (let i = 0; i < this.state.search.badges.length; i += 1) {
        if (
            (this.state.search.badges[i].ref === e.ref && this.state.search.badges[i].ref.length > 0)
            || (this.state.search.badges[i].ref.length === 0 && this.state.search.badges[i].text === e.text)
        ) {
          this.state.search.badges.splice(i, 1);
          break;
        }
      }
      //setPage back to 1
      this.commit('updateUrl', true);
    },
    // set Badges and exSearch accordingly.
    // TODO: Move exSearch Handling to another function
    setBadges(state) {
      // HOOK: Facets
      this.state.search.badges = [];
      // HOOK: add params to exSearch
      let x = 0;
      let y = 0;
      let o = 0;
      let z = 0;
      let p = 0;
      let t = 0;
      // Names
      this.state.url.search.map((ref, i) => {
        const badge = {
          ref,
          text: '',
          type: 'main',
        };
        fetch(`${this.state.index}`, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({
            _source: 'names',
            query: {
              nested: {
                path: 'names',
                query: {
                  match: {
                    'names.canonical_ref': ref,
                  },
                },
              },
            },
          }),
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          response.json().then((json) => {
            for (let j = 0; j < json.hits.hits[0]._source.names.length; j += 1) {
              if (json.hits.hits[0]._source.names[j].canonical_ref === ref) {
                badge.text = json.hits.hits[0]._source.names[j].canonical_name;

                if (this.state.url.searchRole[i] !== undefined && this.state.url.searchRole[i] !== '*') {
                  badge.text += (this.state.url.searchRole[i] === 'sent')
                    ? state.labels.vals['search.roleNamesSender']
                    : state.labels.vals['search.roleNamesReceiver'];
                }

                // Also add to exSearch
                if (state.exSearch.names[0].ref === '' && state.exSearch.names[0].value === '') {
                  state.exSearch.names.shift();
                  state.autocomplete.es.names.shift();
                }
                let bool = false;
                state.exSearch.names.map((c) => {
                  if (c.ref === ref) bool = true;
                });
                if (!bool) {
                  let role = '*';
                  if (this.state.url.searchRole[i] !== undefined) {
                    role = this.state.url.searchRole[i];
                  }
                  // avoid key overlapping: Test if Element with ID exists =>
                  // add 1 to Key
                  let goOn = false;
                  while (!goOn) {
                    let keyExists = false;
                    for (let u = 0; u < state.exSearch.names.length; u += 1) {
                      if (state.exSearch.names[u].index === `esCorrespondents${x}`) {
                        x += 1;
                        keyExists = true;
                        break;
                      }
                    }
                    if (!keyExists) goOn = true;
                  }

                  state.exSearch.names.push({
                    index: `esCorrespondents${x}`,
                    ref,
                    value: json.hits.hits[0]._source.names[j].text,
                    options: [
                      {
                        value: 'sent',
                        text: state.labels.vals['form.sender'],
                      },
                      {
                        value: 'received',
                        text: state.labels.vals['form.addressee'],
                      },
                      {
                        value: '*',
                        text: state.labels.vals['form.senderAndAddressee'],
                      },
                    ],
                    selected: role,
                  });
                  state.autocomplete.es.names.push({
                    show: false,
                    suggestions: [],
                    selected: 0,
                  });
                  x += 1;
                  this.state.exSearch.cIndex = x + 1;
                }
                break;
              }
            }
          });
        });
        this.state.search.badges.push(badge);
      });

      // Occupations
      this.state.url.facets.occupations.map((ref, i) => {
        fetch(this.state.acIndex.occupations, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({
            query: {
              match: {
                canonical_ref: ref,
                  },
            },
          }),
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          response.json().then((json) => {
            const text = json.hits.hits[0]._source[`label_${this.state.lang}`];
            this.state.search.badges.push({
              text: text,
              ref,
              type: 'main',
            });
          // Also add to exSearch
          if (state.exSearch.occupations[0].ref === '' && state.exSearch.occupations[0].value === '') {
            state.exSearch.occupations.shift();
            state.autocomplete.es.occupations.shift();
          }
          let bool = false;
          state.exSearch.occupations.map((c) => {
            if (c.ref === ref) bool = true;
          });
          if (!bool) {
            // avoid key overlapping: Test if Element with ID exists =>
            // add 1 to Key
            let goOn = false;
            while (!goOn) {
              let keyExists = false;
              for (let u = 0; u < state.exSearch.occupations.length; u += 1) {
                if (state.exSearch.occupations[u].index === `esOccupations${o}`) {
                  o += 1;
                  keyExists = true;
                  break;
                }
              }
              if (!keyExists) goOn = true;
            }

            state.exSearch.occupations.push({
              index: `esOccupations${o}`,
              ref,
              value: text,
            });
            state.autocomplete.es.occupations.push({
              show: false,
              suggestions: [],
              selected: 0,
          });
            o += 1;
          }
        });
      })
      });
      // Places:
      this.state.url.facets.places.map((ref, i) => {
        if (ref.length > 0) {
          const badge = {
            ref,
            text: '',
            type: 'main',
          };
          fetch(this.state.index, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
              _source: 'places',
              query: {
                nested: {
                  path: 'places',
                  query: {
                    match: {
                      'places.canonical_ref': ref,
                    },
                  },
                },
              },
            }),
            dataType: 'json',
            headers: {
              'Content-Type': 'application/json',
            },
          }).then((response) => {
            response.json().then((json) => {
              for (let j = 0; j < json.hits.hits[0]._source.places.length; j += 1) {
                if (json.hits.hits[0]._source.places[j].canonical_ref.includes(ref)) {
                  badge.text = json.hits.hits[0]._source.places[j].text;

                  if (this.state.url.facets.placesRole[i] !== undefined && this.state.url.facets.placesRole[i] !== '*') {
                    badge.text += (this.state.url.facets.placesRole[i] === 'sent')
                      ? state.labels.vals['search.rolePlacesSender']
                      : state.labels.vals['search.rolePlacesReceiver'];
                  }

                  // Also add to exSearch
                  if (state.exSearch.places[0].ref === '' && state.exSearch.places[0].value === '') {
                    state.exSearch.places.shift();
                    state.autocomplete.es.places.shift();
                  }
                  let bool = false;
                  state.exSearch.places.map((c) => {
                    if (c.ref === ref) bool = true;
                  });
                  if (!bool) {
                    let role = '*';
                    if (this.state.url.facets.placesRole[i] !== undefined) {
                      role = this.state.url.facets.placesRole[i];
                    }
                    // Check for existing keys, just as with names
                    let goOn = false;
                    while (!goOn) {
                      let keyExists = false;
                      for (let u = 0; u < state.exSearch.places.length; u += 1) {
                        if (state.exSearch.places[u].index === `esPlaces${y}`) {
                          y += 1;
                          keyExists = true;
                          break;
                        }
                      }
                      if (!keyExists) goOn = true;
                    }

                    state.exSearch.places.push({
                      index: `esPlaces${y}`,
                      ref,
                      value: json.hits.hits[0]._source.places[j].text,
                      options: [
                        {
                          value: 'sent',
                          text: state.labels.vals['form.sender'],
                        },
                        {
                          value: 'received',
                          text: state.labels.vals['form.addressee'],
                        },
                        {
                          value: '*',
                          text: state.labels.vals['form.senderAndAddressee'],
                        },
                      ],
                      selected: role,
                    });
                    state.autocomplete.es.places.push({
                      show: false,
                      suggestions: [],
                      selected: 0,
                    });
                    y += 1;
                    this.state.exSearch.pIndex = y + 1;
                    break;
                  }
                }
              }
            });
            this.state.search.badges.push(badge);
          });
        }
      });

      // Dates
      if (this.state.url.facets.dates.length > 0) this.state.exSearch.dates = [];
      this.state.url.facets.dates.map((date) => {
        this.state.search.badges.push({
          text: date,
          ref: '',
          type: 'main',
        });
        this.state.exSearch.dates.push({
          to: '',
          from: '',
          value: date,
        });
      });

      // Editions
      this.state.url.facets.edition.map((edition, i) => {
        const ref = decodeURI(edition);

        // Get name of edition
        fetch(this.state.index, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({
            _source: 'source_text',
            size: 1,
            query: {
              match: {
                source_id: ref,
              },
            },
          }),
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          response.json().then((json) => {
            const text = json.hits.hits[0]._source.source_text;
            this.state.search.badges.push({
              text: (text.length > 30) ? `${text.substr(0, 30)}...` : text,
              ref,
              type: 'main',
            });

            // Also add to exSearch
            if (state.exSearch.edition[0].ref === '' && state.exSearch.edition[0].value === '') {
              state.exSearch.edition.shift();
              state.autocomplete.es.edition.shift();
            }
            let bool = false;
            state.exSearch.edition.map((c) => {
              if (c.ref === ref) bool = true;
            });
            if (!bool) {
              // avoid key overlapping: Test if Element with ID exists =>
              // add 1 to Key
              let goOn = false;
              while (!goOn) {
                let keyExists = false;
                for (let u = 0; u < state.exSearch.edition.length; u += 1) {
                  if (state.exSearch.edition[u].index === `esEdition${z}`) {
                    z += 1;
                    keyExists = true;
                    break;
                  }
                }
                if (!keyExists) goOn = true;
              }

              state.exSearch.edition.push({
                index: `esEdition${z}`,
                ref,
                value: text,
              });
              state.autocomplete.es.edition.push({
                show: false,
                suggestions: [],
                selected: 0,
              });
              z += 1;
            }
          });
        });
      });

      // Gender
      // TODO: timeout is an ugly workaround to be deleted asap, needs proper
      // async queueing first
      this.state.url.facets.gender.map((ge) => {
        this.state.search.badges.push({
          text: (!state.labels.vals[`facets.gender.${ge}`]) ? ge : state.labels.vals[`facets.gender.${ge}`],
          ref: ge,
          type: 'main',
        });
      });

      // Availability
      this.state.url.facets.availability.map((av) => {
        this.state.search.badges.push({
          text: (state.labels.vals['form.availability.all'] === undefined) ? av : state.labels.vals[`form.availability.${av}`],
          ref: '',
          type: 'main',
        });
      });

      // CMIF
      this.state.url.facets.cmif.map((idno, i) => {
        const ref = decodeURI(idno);

        // Get name of CMIF
        fetch(this.state.index, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({
            _source: 'cmif_title',
            size: 1,
            query: {
              match: {
                cmif_idno: idno,
              },
            },
          }),
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          response.json().then((json) => {
            const text = json.hits.hits[0]._source.cmif_title;
            this.state.search.badges.push({
              text: (text.length > 30) ? `${text.substr(0, 30)}...` : text,
              ref,
              type: 'main',
            });

            // Also add to exSearch
            if (state.exSearch.cmif[0].ref === '' && state.exSearch.cmif[0].value === '') {
              state.exSearch.cmif.shift();
              state.autocomplete.es.cmif.shift();
            }
            let bool = false;
            state.exSearch.cmif.map((c) => {
              if (c.ref === ref) bool = true;
            });
            if (!bool) {
              // avoid key overlapping: Test if Element with ID exists =>
              // add 1 to Key
              let goOn = false;
              while (!goOn) {
                let keyExists = false;
                for (let u = 0; u < state.exSearch.cmif.length; u += 1) {
                  if (state.exSearch.cmif[u].index === `esCmif${p}`) {
                    p += 1;
                    keyExists = true;
                    break;
                  }
                }
                if (!keyExists) goOn = true;
              }

              state.exSearch.cmif.push({
                index: `esCmif${p}`,
                ref,
                value: text,
              });
              state.autocomplete.es.cmif.push({
                show: false,
                suggestions: [],
                selected: 0,
              });
              p += 1;
            }
          });
        });
      });

      // Datasets
      this.state.url.facets.datasets.map((ref, i) => {
        const badge = {
          ref,
          text: '',
          type: 'main',
        };
        fetch(this.state.index, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({
            _source: 'datasets',
            size: 1,
            query: {
              nested: {
                path: 'datasets',
                query: {
                  match: {
                    'datasets.ref': ref,
                  },
                },
              },
            },
          }),
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          response.json().then((json) => {
            if (json.hits.hits[0] === undefined) {
              let option = this.state.search.datasets[0].options.find( (option) =>  option.value === ref )
              badge.text = option.text
            } else {
              (ref === 'pdb18-retro')? badge.text = json.hits.hits[0]._source.datasets[1][`label_${this.state.lang}`]: // text for pdb18-retro is found in the 2nd item. The 1st item contains the label for pdb18
              badge.text = json.hits.hits[0]._source.datasets[0][`label_${this.state.lang}`]
            }
           
            this.state.search.badges.push(badge);
             // Also add to exSearch
            let bool = false;
            if (state.exSearch.datasets.find(dataset => dataset.selected === ref)) bool = true;
            if (!bool) {
              let goOn = false;
              while (!goOn) {
                let keyExists = false;
                for (let u = 0; u < state.exSearch.datasets.length; u += 1) {
                  if (state.exSearch.datasets[u].index === `esDatasets${t}`) {
                    t += 1;
                    keyExists = true;
                    break;
                  }
                }
                if (!keyExists) goOn = true;
              }
              if (this.state.exSearch.datasets[0].selected === '*') {
                this.state.exSearch.datasets[0].selected = ref;
              } else {
                this.state.exSearch.datasets.push({
                  value: '',
                  ref: '',
                  options: [
                    {
                      value: 'pdb18',
                      text: state.labels.vals['form.dataset.PDB18'],
                    },
                    {
                      value: 'aupro',
                      text: state.labels.vals['form.dataset.academyProgram'],
                    },
                    {
                      value: 'norkorr',
                      text: state.labels.vals['form.dataset.norkorr'],
                    },
                    {
                      value: '*',
                      text: state.labels.vals['form.dataset.all'],
                    },
                  ],
                  selected: ref,
                  index: `esDatasets${t}`,
                });
                // state.autocomplete.es.datasets.push({
                //   show: false,
                //   suggestions: [],
                //   selected: 0,
                // });
              }
              t += 1;
            }
            // clear selected Dataset in Search / extendedSearch
            // this.state.exSearch.datasets[0].selected = '*';
            this.state.search.datasets[0].selected = '*';
          });
        });
      });

      // Languages
      
      this.state.url.facets.languages.map((ref, i) => {
        const badge = {
          ref,
          text: '',
          type: 'main',
        };
        fetch(this.state.index, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({
            _source: 'languages',
            size: 1,
            query: {
              nested: {
                path: 'languages',
                query: {
                  match: {
                    'languages.ref': ref,
                  },
                },
              },
            },
          }),
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          response.json().then((json) => {
            if (json.hits.hits[0] === undefined) {
              let option = this.state.search.languages[0].options.find( (option) =>  option.value === ref )
              badge.text = option.text
            } else {
              badge.text = json.hits.hits[0]._source.languages[0][`label_${this.state.lang}`];
            }
           
            this.state.search.badges.push(badge);
        });
      })
      });
      // fullText

      this.state.url.facets.fullText.map((ref, i) => {
        const badge = {
          ref,
          text: '',
          type: 'main',
        };
        badge.text = ref
        this.state.search.badges.push(badge);
      });
      // Except names
      this.state.url.exceptFacets.persons.map((ref, n) => {
        const badge = {
          ref,
          text: '',
          type: 'except',
        };
        fetch(this.state.index, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({
            _source: 'names',
            query: {
              nested: {
                path: 'names',
                query: {
                  match: {
                    'names.canonical_ref': ref,
                  },
                },
              },
            },
          }),
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          response.json().then((json) => {
            for (let j = 0; j < json.hits.hits[0]._source.names.length; j += 1) {
              if (json.hits.hits[0]._source.names[j].ref.includes(ref)) {
                badge.text = json.hits.hits[0]._source.names[j].text;
                if (this.state.url.exceptFacets.personsRole[n] !== undefined && this.state.url.exceptFacets.personsRole[n] !== '*') {
                  badge.text += (this.state.url.exceptFacets.personsRole[n] === 'sent')
                    ? state.labels.vals['search.roleNamesSender']
                    : state.labels.vals['search.roleNamesReceiver'];
                }
                break;
              }
            }
          });
        });
        this.state.search.badges.push(badge);
      });

      // Except Occupations:
      this.state.url.exceptFacets.occupations.map((ref, n) => {
        const badge = {
          ref,
          text: '',
          type: 'except',
        };
        fetch(this.state.acIndex.occupations, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({
            query: {
              match: {
                canonical_ref: ref,
                  },
            },
          }),
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          response.json().then((json) => {
            badge.text = json.hits.hits[0]._source[`label_${this.state.lang}`];
          });
          this.state.search.badges.push(badge);
        });
      });

      // Except Places:
      this.state.url.exceptFacets.places.map((ref, n) => {
        const badge = {
          ref,
          text: '',
          type: 'except',
        };
        fetch(this.state.index, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({
            _source: 'places',
            query: {
              nested: {
                path: 'places',
                query: {
                  match: {
                    'places.canonical_ref': ref,
                  },
                },
              },
            },
          }),
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          response.json().then((json) => {
            for (let j = 0; j < json.hits.hits[0]._source.places.length; j += 1) {
              if (json.hits.hits[0]._source.places[j].ref.includes(ref)) {
                badge.text = json.hits.hits[0]._source.places[j].text;
                if (this.state.url.exceptFacets.placesRole[n] !== undefined && this.state.url.exceptFacets.placesRole[n] !== '*') {
                  badge.text += (this.state.url.exceptFacets.placesRole[n] === 'sent')
                    ? state.labels.vals['search.rolePlacesSender']
                    : state.labels.vals['search.rolePlacesReceiver'];
                }
                break;
              }
            }
          });
        });
        this.state.search.badges.push(badge);
      });

      // Except Editions
      this.state.url.exceptFacets.edition.map((edition) => {
        fetch(this.state.index, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({
            _source: 'source_text',
            size: 1,
            query: {
              match: {
                source_id: decodeURI(edition),
              },
            },
          }),
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          response.json().then((json) => {
            const text = json.hits.hits[0]._source.source_text;
            this.state.search.badges.push({
              text: (text.length > 30) ? `${text.substr(0, 30)}...` : text,
              ref: decodeURI(edition),
              type: 'except',
            });
          });
        });
      });

      // Except Gender
      this.state.url.exceptFacets.gender.map((ge) => {
        this.state.search.badges.push({
          text: (!state.labels.vals[`facets.gender.${ge}`]) ? ge : state.labels.vals[`facets.gender.${ge}`],
          ref: ge,
          type: 'except',
        });
      });

      // Except Availability
      this.state.url.exceptFacets.availability.map((av) => {
        this.state.search.badges.push({
          text: (state.labels.vals['form.availability.all'] === undefined) ? av : state.labels.vals[`form.availability.${av}`],
          ref: '',
          type: 'except',
        });
      });

      // Except CMIF
      this.state.url.exceptFacets.cmif.map((idno) => {
        const ref = decodeURI(idno);

        fetch(this.state.index, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({
            _source: 'cmif_title',
            size: 1,
            query: {
              match: {
                cmif_idno: idno,
              },
            },
          }),
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          response.json().then((json) => {
            const text = json.hits.hits[0]._source.cmif_title;
            this.state.search.badges.push({
              text: (text.length > 30) ? `${text.substr(0, 30)}...` : text,
              ref,
              type: 'except',
            });
          });
        });
      });

      // Except Datasets
      this.state.url.exceptFacets.datasets.map((ref, i) => {
        const badge = {
          ref,
          text: '',
          type: 'except',
        };
        fetch(this.state.index, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({
            _source: 'datasets',
            size: 1,
            query: {
              nested: {
                path: 'datasets',
                query: {
                  match: {
                    'datasets.ref': ref,
                  },
                },
              },
            },
          }),
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          response.json().then((json) => {
            badge.text = json.hits.hits[0]._source.datasets[0][`label_${this.state.lang}`];
          });
          this.state.search.badges.push(badge);
        });
      });

      // Except Dates
      this.state.url.exceptFacets.dates.map((date) => {
        this.state.search.badges.push({
          text: date,
          ref: '',
          type: 'except',
        });
      });

      //Except Languages
      this.state.url.exceptFacets.languages.map((ref, n) => {
        const badge = {
          ref,
          text: '',
          type: 'except',
        };
        fetch(this.state.index, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({
            _source: 'languages',
            size: 1,
            query: {
              nested: {
                path: 'languages',
                query: {
                  match: {
                    'languages.ref': ref,
                  },
                },
              },
            },
          }),
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          response.json().then((json) => {
            badge.text = json.hits.hits[0]._source.languages[0][`label_${this.state.lang}`];
          });
          this.state.search.badges.push(badge);
        });
      });

    },
    

    // HOOK: URL Parameters
    // Adjust URL Parameters
    // TODO: Switch to vue router for easier Handling
    updateUrl(state, setPageNull = false) {
      const paramStates = [
        0, // s 0 (search) x
        0, // x 1 (pagination.start) x
        0, // p 2 (facets.places) x
        0, // w 3 (facets.weekdays) x
        0, // d 4 (facets.dates) x
        0, // e 5 (facets.edition) x
        0, // c 6 (facets.cmif) x
        0, // xs 7 (exceptFacets.persons) x
        0, // xe 8 (exceptFacets.edition) x
        0, // xd 9 (exceptFacets.dates) 
        0, // xp 10 (exceptFacets.places) x
        0, // xc 11 (exceptFacets.cmif) x
        0, // xa 12 (exceptFacets.availability) x
        0, // a  13 (facets.availability) x
        0, // g  14 (exceptFacets.gender) should switch places with 15
        0, // xg 15 (facets.gender)
        0, // o  16 (occupation include) (facets.occupations) x
        0, // xo 17 (occupation exclude) (exceptFacets.occupations), x
        0, // t  18 (datasets include) (facet.datasets) x
        0, // xt 19 (datasets exclude) (exceptFacets.datasets) x
        0, // wl 20 (facet.languages)
        0, // xwl 21 (exceptFacet.languages)
        0, // q 22 (facet.fullText) x
        0, // map 23 (mapquery)
        0, // mapr 24 (mapRole)
        0, // order 25 (sortOrder) only set, when order is set to desc
      ];

      // HOOK: Facets
      let urlRefString = '';
      // if search is not empty
      if (this.state.url.search.length > 0) {
        const urlRefs = [...this.state.url.search];
        // go through all entries and add the searchrole to each entry
        urlRefs.map((str, i) => {
          if (this.state.url.searchRole[i] !== undefined && this.state.url.searchRole[i] !== '*') {
            urlRefs[i] += `::${this.state.url.searchRole[i]}`;
          }
        });
        // convert the urlRefs-Array to a string
        urlRefString = JSON.stringify(urlRefs);
        //remove unnecessary symbols
        urlRefString = urlRefString.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param s from 0 to 1
      if (urlRefString.length > 0) paramStates[0] = 1;

      // Do the same for the occupation
      let urlOccupationString = '';
      if (this.state.url.facets.occupations.length > 0) {
        const occupationRefs = [...this.state.url.facets.occupations];
        // occupationRefs.map((str, i) => {
        //   if (this.state.url.facets.occupationsRole[i] !== undefined && this.state.url.facets.occupationsRole[i] !== '*') {
        //     occupationRefs[i] += `::${this.state.url.facets.occupationsRole[i]}`;
        //   }
        // });
        urlOccupationString = JSON.stringify(occupationRefs);
        urlOccupationString = urlOccupationString.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param o from 0 to 1
      if (urlOccupationString.length > 0) paramStates[16] = 1;

      let urlPlaceString = '';
      if (this.state.url.facets.places.length > 0) {
        const urlRefs = [...this.state.url.facets.places];
        urlRefs.map((str, i) => {
          if (this.state.url.facets.placesRole[i] !== undefined && this.state.url.facets.placesRole[i] !== '*') {
            urlRefs[i] += `::${this.state.url.facets.placesRole[i]}`;
          }
        });
        urlPlaceString = JSON.stringify(urlRefs);
        urlPlaceString = urlPlaceString.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param p from 0 to 1
      if (urlPlaceString.length > 0) paramStates[2] = 1;

      let urlDateString = '';
      if (this.state.url.facets.dates.length > 0) {
        urlDateString = JSON.stringify(this.state.url.facets.dates);
        urlDateString = urlDateString.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param d from 0 to 1
      if (urlDateString.length > 0) paramStates[4] = 1;

      let urlEditionString = '';
      if (this.state.url.facets.edition.length > 0) {
        urlEditionString = JSON.stringify(this.state.url.facets.edition);
        urlEditionString = urlEditionString.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param e from 0 to 1
      if (urlEditionString.length > 0) paramStates[5] = 1;

      let urlCmifString = '';
      if (this.state.url.facets.cmif.length > 0) {
        urlCmifString = JSON.stringify(this.state.url.facets.cmif);
        urlCmifString = urlCmifString.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param c from 0 to 1
      if (urlCmifString.length > 0) paramStates[6] = 1;

      // datasets
      let urlDatasetsString = '';
      if (this.state.url.facets.datasets.length > 0) {
        urlDatasetsString = JSON.stringify(this.state.url.facets.datasets);
        urlDatasetsString = urlDatasetsString.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param t from 0 to 1
      if (urlDatasetsString.length > 0) paramStates[18] = 1;

      // languages
      let urlLanguagesString = '';
      if (this.state.url.facets.languages.length > 0) {
        urlLanguagesString = JSON.stringify(this.state.url.facets.languages);
        urlLanguagesString = urlLanguagesString.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param wl from 0 to 1
      if (urlLanguagesString.length > 0) paramStates[20] = 1;

      // fullText
      let urlfullTextString = '';
      if (this.state.url.facets.fullText.length > 0) {
        urlfullTextString = JSON.stringify(this.state.url.facets.fullText);
        urlfullTextString = urlfullTextString.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param wl from 0 to 1
      if (urlfullTextString.length > 0) paramStates[22] = 1;

      let urlPageString = '';
      if (this.state.pagination.start !== 0 && !setPageNull) {
        urlPageString = String(this.state.pagination.start);
      } else if (setPageNull) {
        urlPageString = '1';
        this.state.pagination.start = 1;
      }
      // if String is not empty, set param x from 0 to 1
      if (urlPageString.length > 0) paramStates[1] = 1;

      let urlRefStringX = '';
      if (this.state.url.exceptFacets.persons.length > 0) {
        const urlRefs = [...this.state.url.exceptFacets.persons];
        urlRefs.map((str, i) => {
          if (this.state.url.exceptFacets.personsRole[i] !== undefined && this.state.url.exceptFacets.personsRole[i] !== '*') {
            urlRefs[i] += `::${this.state.url.exceptFacets.personsRole[i]}`;
          }
        });
        urlRefStringX = JSON.stringify(urlRefs);
        urlRefStringX = urlRefStringX.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param xs from 0 to 1
      if (urlRefStringX.length > 0) paramStates[7] = 1;

      let urlOccupationStringX = '';
      if (this.state.url.exceptFacets.occupations.length > 0) {
        const occupationRefs = [...this.state.url.exceptFacets.occupations];
        // occupationRefs.map((str, i) => {
        //   if (this.state.url.exceptFacets.occupationsRole[i] !== undefined && this.state.url.exceptFacets.occupationsRole[i] !== '*') {
        //     occupationRefs[i] += `::${this.state.url.exceptFacets.occupationsRole[i]}`;
        //   }
        // });
        urlOccupationStringX = JSON.stringify(occupationRefs);
        urlOccupationStringX = urlOccupationStringX.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param xo from 0 to 1
      if (urlOccupationStringX.length > 0) paramStates[17] = 1;

      let urlPlaceStringX = '';
      if (this.state.url.exceptFacets.places.length > 0) {
        const urlRefs = [...this.state.url.exceptFacets.places];
        urlRefs.map((str, i) => {
          if (this.state.url.exceptFacets.placesRole[i] !== undefined && this.state.url.exceptFacets.placesRole[i] !== '*') {
            urlRefs[i] += `::${this.state.url.exceptFacets.placesRole[i]}`;
          }
        });
        urlPlaceStringX = JSON.stringify(urlRefs);
        urlPlaceStringX = urlPlaceStringX.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param xp from 0 to 1
      if (urlPlaceStringX.length > 0) paramStates[10] = 1;

      let urlDateStringX = '';
      if (this.state.url.exceptFacets.dates.length > 0) {
        urlDateStringX = JSON.stringify(this.state.url.exceptFacets.dates);
        urlDateStringX = urlDateStringX.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param xd from 0 to 1
      if (urlDateStringX.length > 0) paramStates[9] = 1;

      let urlEditionStringX = '';
      if (this.state.url.exceptFacets.edition.length > 0) {
        urlEditionStringX = JSON.stringify(this.state.url.exceptFacets.edition);
        urlEditionStringX = urlEditionStringX.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param xe from 0 to 1
      if (urlEditionStringX.length > 0) paramStates[8] = 1;

      let urlCmifStringX = '';
      if (this.state.url.exceptFacets.cmif.length > 0) {
        urlCmifStringX = JSON.stringify(this.state.url.exceptFacets.cmif);
        urlCmifStringX = urlCmifStringX.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param xc from 0 to 1
      if (urlCmifStringX.length > 0) paramStates[11] = 1;

      // Except datasets
      let urlDatasetsStringX = '';
      if (this.state.url.exceptFacets.datasets.length > 0) {
        urlDatasetsStringX = JSON.stringify(this.state.url.exceptFacets.datasets);
        urlDatasetsStringX = urlDatasetsStringX.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param xt from 0 to 1
      if (urlDatasetsStringX.length > 0) paramStates[19] = 1;

      // Except languages
      let urlLanguagesStringX = '';
      if (this.state.url.exceptFacets.languages.length > 0) {
        urlLanguagesStringX = JSON.stringify(this.state.url.exceptFacets.languages);
        urlLanguagesStringX = urlLanguagesStringX.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param xwl from 0 to 1
      if (urlLanguagesStringX.length > 0) paramStates[21] = 1;

      let urlGeStringX = '';
      if (this.state.url.exceptFacets.gender.length > 0) {
        urlGeStringX = JSON.stringify(this.state.url.exceptFacets.gender);
        urlGeStringX = urlGeStringX.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param g from 0 to 1
      if (urlGeStringX.length > 0) paramStates[14] = 1;

      let urlGeString = '';
      if (this.state.url.facets.gender.length > 0) {
        urlGeString = JSON.stringify(this.state.url.facets.gender);
        urlGeString = urlGeString.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param xg from 0 to 1
      if (urlGeString.length > 0) paramStates[15] = 1;

      let urlAvStringX = '';
      if (this.state.url.exceptFacets.availability.length > 0) {
        urlAvStringX = JSON.stringify(this.state.url.exceptFacets.availability);
        urlAvStringX = urlAvStringX.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param xa from 0 to 1
      if (urlAvStringX.length > 0) paramStates[12] = 1;

      let urlAvString = '';
      if (this.state.url.facets.availability.length > 0) {
        urlAvString = JSON.stringify(this.state.url.facets.availability);
        urlAvString = urlAvString.replace(/[\[\]"]/g, '');
      }
      // if String is not empty, set param a from 0 to 1
      if (urlAvString.length > 0) paramStates[13] = 1;

      let urlMapRoleString = '';
      if (this.state.url.map.role.length > 0) {
        urlMapRoleString = JSON.stringify(this.state.url.map.role);
        urlMapRoleString = urlMapRoleString.replace(/[\[\]"]/g, '');
      }
      if (urlMapRoleString.length > 0) paramStates[24] = 1;

      if (this.state.sort.numeric.active && !this.state.sort.numeric.asc) 
        paramStates[25] = 1;

      // update the Url with all non empty strings, add a '&'-Symbol, if any param is set to 1
      let newUrl = `${
        window.location.href.split('?')[0]
      }?${
        (urlRefString.length > 0) ? `${paramStates.includes(1) ? '&' : ''}s=${urlRefString}` : ''
      }${
        (urlPlaceString.length > 0) ? `${paramStates.includes(1) ? '&' : ''}p=${urlPlaceString}` : ''
      }${
        (urlDateString.length > 0) ? `${paramStates.includes(1) ? '&' : ''}d=${urlDateString}` : ''
      }${
        (urlEditionString.length > 0) ? `${paramStates.includes(1) ? '&' : ''}e=${urlEditionString}` : ''
      }${
        (urlCmifString.length > 0) ? `${paramStates.includes(1) ? '&' : ''}c=${urlCmifString}` : ''
      }${
        (urlDatasetsString.length > 0) ? `${paramStates.includes(1) ? '&' : ''}t=${urlDatasetsString}`: ''
      }${
        (urlLanguagesString.length > 0) ? `${paramStates.includes(1) ? '&' : ''}wl=${urlLanguagesString}`: ''
      }${
        (urlfullTextString.length > 0) ? `${paramStates.includes(1) ? '&' : ''}q=${urlfullTextString}`: ''
      }${
        (urlPageString.length > 0) ? `${paramStates.includes(1) ? '&' : ''}x=${urlPageString}` : ''
      }${
        (urlAvString.length > 0) ? `${paramStates.includes(1) ? '&' : ''}a=${urlAvString}` : ''
      }${
        (urlGeString.length > 0) ? `${paramStates.includes(1) ? '&' : ''}g=${urlGeString}` : ''
      }${
        (urlOccupationString.length > 0) ? `${paramStates.includes(1) ? '&' : ''}o=${urlOccupationString}`: ''
      }${
        (paramStates.includes(1) && this.state.url.map.mapQuery) ? '&map=1' : (this.state.url.map.mapQuery) ? 'map=1' : ''
      }${
        (urlMapRoleString.length > 0) ? `${paramStates.includes(1) ? '&' : ''}mapr=${urlMapRoleString}`: ''
      }${
        (paramStates.includes(1)) ? '&' : ''}w=${(this.state.url.facets.weekdays) ? '1' : '0'
      }${
        (paramStates.includes(1) && this.state.sort.numeric.active && !this.state.sort.numeric.asc) ? '&order=desc' : (this.state.sort.numeric.active && !this.state.sort.numeric.asc) ? 'order=desc' : ''
      }${
        (urlDateStringX.length > 0) ? `${paramStates.includes(1) ? '&' : ''}xd=${urlDateStringX}` : ''
      }${
        (urlRefStringX.length > 0) ? `${paramStates.includes(1) ? '&' : ''}xs=${urlRefStringX}` : ''
      }${
        (urlOccupationStringX.length > 0) ? `${paramStates.includes(1) ? '&' : ''}xo=${urlOccupationStringX}` : ''
      }${
        (urlPlaceStringX.length > 0) ? `${paramStates.includes(1) ? '&' : ''}xp=${urlPlaceStringX}` : ''
      }${
        (urlEditionStringX.length > 0) ? `${paramStates.includes(1) ? '&' : ''}xe=${urlEditionStringX}` : ''
      }${
        (urlCmifStringX.length > 0) ? `${paramStates.includes(1) ? '&' : ''}xc=${urlCmifStringX}` : ''
      }${
        (urlDatasetsStringX.length > 0) ? `${paramStates.includes(1) ? '&' : ''}xt=${urlDatasetsStringX}` : ''
      }${
        (urlLanguagesStringX.length > 0) ? `${paramStates.includes(1) ? '&' : ''}xwl=${urlLanguagesStringX}` : ''
      }${
        (urlAvStringX.length > 0) ? `${paramStates.includes(1) ? '&' : ''}xa=${urlAvStringX}` : ''
      }${
        (urlGeStringX.length > 0) ? `${paramStates.includes(1) ? '&' : ''}xg=${urlGeStringX}` : ''
      }`;
      newUrl = newUrl.replace('?&', '?');
      this.state.url.urlString = newUrl.substring(newUrl.indexOf('?')+1)
      // update the browser-history
      history.pushState(null, null, newUrl);
    },

    // Set search option for simple search
    setSearchOption(state, option) {
      this.state.search.options.selected = option;
      // When searchOption is changed, clear autocomplete and searchTerm as it targets another entity now
      this.state.search.term = '';
      this.state.autocomplete.main.suggestions = [];
      this.state.autocomplete.main.show = false;
    },
    setLang(state, lang) {
      this.state.lang = lang;
    },
    // Initiate exSearch... woah, you mean the function name describes its
    // purpose?? MINDBLOWING!
    initiateExSearch(state) {
      // Step 1: Get names @badges-function
      // Step 2: Set dates to start if no dates are present in facets
      if (state.url.facets.dates[0] !== undefined) {
        this.state.exSearch.dates = [];
        state.url.facets.dates.map((d) => {
          this.state.exSearch.dates.push({
            from: '',
            to: '',
            value: d,
          });
        });
      }
      // Step 2: Get cmif & editions for selects
      fetch(`${state.index.replace('?request_cache=true','')}/_search?request_cache=true`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          aggregations: {
            cmif: {
              terms: {
                field: 'cmif_title.keyword',
                size: 10000, // default max entries in index
              },
              aggs: {
                idno: {
                  terms: {
                    field: 'cmif_idno',
                    size: 1,
                  },
                },
              },
            },
            edition: {
              terms: {
                field: 'source_text.keyword',
                size: 10000, // default max entries in index
              },
              aggs: {
                id: {
                  terms: {
                    field: 'source_id',
                    size: 1,
                  },
                },
              },
            },
          },
          _source: [''],
          query: {
            match_all: {},
          },
        }),
        dataType: 'json',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((json) => {
          console.warn('RESULTS OF BUCKETS: ', json);
          json.aggregations.cmif.buckets.map((b) => {
            state.exSearch.cmif.options.push({
              text: b.key,
              value: b.idno.buckets[0].key,
            });
          });
          json.aggregations.edition.buckets.map((b) => {
            state.exSearch.edition.options.push({
              text: b.key,
              value: b.id.buckets[0].key,
            });
          });
        });
      });
    },
    // decode parameters and move them to facet and search
    // TODO: Implement vue router for easier handling
    initiateUrlParameters(state, parameterString) {
      if (parameterString !== '') {
        const parameters = parameterString.substring(1).split('&');
        parameters.map((param) => {
          const parameter = {
            paramVar: param.split('=')[0],
            paramVal: param.substring(param.indexOf('=')+1)
          };
          switch (parameter.paramVar) {
            default: break;
            case 's': {
              const person = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              person.map((ref) => {
                let refUri;
                let role;
                if (ref.includes('::')) {
                  [refUri] = ref.split('::');
                  [, role] = ref.split('::');
                } else {
                  refUri = ref;
                  role = '*';
                }
                if (this.dispatch('validate', ['ref', refUri])) {
                  this.state.url.search.push(refUri);
                  this.state.url.searchRole.push(role);
                }
                return null;
              });
            } break;
            case 'o': {
              const occupation = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              occupation.map((ref) => {
                let occupationUri;
                // let role;
                if (ref.includes('::')) {
                  [occupationUri] = ref.split('::');
                  // [, role] = ref.split('::');
                } else {
                  occupationUri = ref;
                  // role = '*';
                }
                // TODO: Validation
                this.state.url.facets.occupations.push(occupationUri);
                // this.state.url.facets.occupationsRole.push(role);
              });
            } break;
            case 'd': {
              const date = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              date.map((d) => {
                this.state.url.facets.dates.push(decodeURI(d));
              });
            } break;
            case 'p': {
              const place = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              place.map((ref) => {
                let refUri;
                let role;
                if (ref.includes('::')) {
                  [refUri] = ref.split('::');
                  [, role] = ref.split('::');
                } else {
                  refUri = ref;
                  role = '*';
                }
                // TODO: Validation
                this.state.url.facets.places.push(refUri);
                this.state.url.facets.placesRole.push(role);
              });
            } break;
            case 'e': {
              const edition = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              edition.map((id) => {
                // TODO: Validation
                this.state.url.facets.edition.push(id);
                this.state.exSearch.edition.selected = id;
              });
            } break;
            case 'c': {
              const cmif = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              cmif.map((idno) => {
                // TODO: Validation
                this.state.url.facets.cmif.push(idno);
                this.state.exSearch.cmif.selected = idno;
              });
            } break;
            case 'a':
              if (parameter.paramVal === 'online'
                  || parameter.paramVal === 'print'
                  || parameter.paramVal === 'hybrid') {
                this.state.exSearch.availability.selected = parameter.paramVal;
                this.state.url.facets.availability.push(parameter.paramVal);
              }
            break;
            case 'g': {
              const gender = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              gender.map((ge) => {
                // TODO: Validation
                if (ge.match(/male|female|unknown|diverse/)) {
                  this.state.url.facets.gender.push(ge);
                }
              });
            } break;
            case 'x':
              if (parameter.paramVal.match(/[0-9]*/g)) {
                this.state.pagination.start = Number(parameter.paramVal);
              }
              break;
            case 'w':
              this.state.url.facets.weekdays = (parameter.paramVal === '1');
              break;
            case 't': {
              // const dataset = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              // dataset.map((ref) => {
              //   let datasetUri;
              //   let role;
              //   if (ref.includes('::')) {
              //     [datasetUri] = ref.split('::');
              //     [, role] = ref.split('::');
              //   } else {
              //     datasetUri = ref;
              //     role = '*';
              //   }
              //   // TODO: Validation
              //   this.state.url.facets.datasets.push(datasetUri);
              //   this.state.url.facets.datasetsRole.push(role);
              const datasets = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              datasets.map((ref) => {
                // TODO: Validation
                this.state.url.facets.datasets.push(ref);
                this.state.exSearch.datasets.selected = ref;
              });
            } break;
            case 'wl': {
              const languages = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              languages.map((ref) => {
                // TODO: Validation
                this.state.url.facets.languages.push(ref);
                // this.state.exSearch.languages.selected = ref;
              });
            } break;
            case 'q': {
              const fullText = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              fullText.map((ref) => {
                // TODO: Validation
                this.state.url.facets.fullText.push(ref);
              });
            } break;
            case 'xs': {
              const person = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              person.map((ref) => {
                let refUri;
                let role;
                if (ref.includes('::')) {
                  [refUri] = ref.split('::');
                  [, role] = ref.split('::');
                } else {
                  refUri = ref;
                  role = '*';
                }
                if (this.dispatch('validate', ['ref', refUri])) {
                  this.state.url.exceptFacets.persons.push(refUri);
                  this.state.url.exceptFacets.personsRole.push(role);
                }
                return null;
              });
            } break;
            case 'xo': {
              const occupation = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              occupation.map((ref) => {
                let occupationUri;
                // let role;
                if (ref.includes('::')) {
                  [occupationUri] = ref.split('::');
                  // [, role] = ref.split('::');
                } else {
                  occupationUri = ref;
                  // role = '*';
                }
                // TODO: Validation
                this.state.url.exceptFacets.occupations.push(occupationUri);
                // this.state.url.exceptFacets.occupationsRole.push(role);
              });
            } break;
            case 'xp': {
              const place = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              place.map((ref) => {
                // TODO: Validation
                let refUri;
                let role;
                if (ref.includes('::')) {
                  [refUri] = ref.split('::');
                  [, role] = ref.split('::');
                } else {
                  refUri = ref;
                  role = '*';
                }
                this.state.url.exceptFacets.places.push(refUri);
                this.state.url.exceptFacets.placesRole.push(role);
              });
            } break;
            case 'xe': {
              const edition = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              edition.map((id) => {
                // TODO: Validation
                this.state.url.exceptFacets.edition.push(id);
              });
            } break;
            case 'xc': {
              const cmif = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              cmif.map((idno) => {
                // TODO: Validation
                this.state.url.exceptFacets.cmif.push(idno);
              });
            }break;
            case 'xt': {
              const datasets = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              datasets.map((ref) => {
                // TODO: Validation
                this.state.url.exceptFacets.datasets.push(ref);
              });
            } break;
            case 'xd': {
              const date = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              date.map((d) => {
                this.state.url.exceptFacets.dates.push(decodeURI(d));
              });
            } break;
            case 'xa': {
              const availability = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              availability.map((av) => {
                // TODO: Validation
                this.state.url.exceptFacets.availability.push(av);
              });
            } break;
            case 'xg': {
              const gender = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              gender.map((ge) => {
                // TODO: Validation
                this.state.url.exceptFacets.gender.push(ge);
              });
            } break;
            case 'xwl': {
              const languages = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
              languages.map((ref) => {
                // TODO: Validation
                this.state.url.exceptFacets.languages.push(ref);
              });
            } break;
            case 'l':
              this.state.lang = (parameter.paramVal === 'en') ? 'en' : 'de';
            break;
            case 'map' :
            case 'mapr' :
              window.location.href = window.location.href.split('?')[0];              
              break;
          }
          return null;
        });
      }
    },
    // add Facet to active facet pool
    addFacet(state, options = {
      type: '',
      facet: {},
      role: null,
    }) {
      switch (options.type) {
        default: break;
        case 'd':
          // TODO: Validation
          if (!this.state.url.facets.dates.includes(options.facet)) this.state.url.facets.dates.push(options.facet);
          break;
        case 's':
          if (!this.state.url.search.includes(options.facet)) this.state.url.search.push(options.facet);
          if (options.role === 'r') {
            this.state.url.searchRole[this.state.url.search.length - 1] = 'received';
          } else if (options.role === 's') {
            this.state.url.searchRole[this.state.url.search.length - 1] = 'sent';
          }
          break;
        case 'p':
          if (!this.state.url.facets.places.includes(options.facet)) this.state.url.facets.places.push(options.facet);
          if (options.role === 'r') {
            this.state.url.facets.placesRole[this.state.url.facets.places.length - 1] = 'received';
          } else if (options.role === 's') {
            this.state.url.facets.placesRole[this.state.url.facets.places.length - 1] = 'sent';
          }
          break;
        case 'e':
          if (!this.state.url.facets.edition.includes(options.facet)) this.state.url.facets.edition.push(options.facet);
          this.state.exSearch.edition.selected = options.facet;
          break;
        case 'c':
          if (!this.state.url.facets.cmif.includes(options.facet)) this.state.url.facets.cmif.push(options.facet);
          this.state.exSearch.cmif.selected = options.facet;
          break;
        case 'a':
          if (!this.state.url.facets.availability.includes(options.facet)) this.state.url.facets.availability.push(options.facet);
          this.state.exSearch.availability.selected = (options.facet === 'online') ? state.labels.vals['form.availability.online'] : state.labels.vals['form.availability.print'];
          break;
        case 'g':
          if (!this.state.url.facets.gender.includes(options.facet)) this.state.url.facets.gender.push(options.facet);
          break;
        case 'o':
          if (!this.state.url.facets.occupations.includes(options.facet)) this.state.url.facets.occupations.push(options.facet);
          this.state.exSearch.occupations.selected = options.facet;
          break;
        case 't':
          if (!this.state.url.facets.datasets.includes(options.facet)) this.state.url.facets.datasets.push(options.facet);
          this.state.exSearch.datasets.selected = options.facet;
          break;
        case 'wl':
          if (!this.state.url.facets.languages.includes(options.facet)) this.state.url.facets.languages.push(options.facet);
          //this.state.exSearch.languages.selected = options.facet;
          break;
      }
    },
    // Remove Facet from active facet pool
    removeFacet(state, options = {
      type: '',
      facet: '',
    }) {
      switch (options.type) {
        default: break;
        case 'd':
          this.commit('removeBadge', { text: options.facet, ref: '' });
          break;
        case 's':
          this.commit('removeBadge', { text: '', ref: options.facet });
          break;
        case 'p':
          this.commit('removeBadge', { text: '', ref: options.facet });
          break;
        case 'e':
          this.commit('removeBadge', { text:'', ref:  options.facet });
          break;
        case 'c':
          this.commit('removeBadge', { text: '', ref: options.facet });
          break;
        case 'g':
          this.commit('removeBadge', { text: '', ref: options.facet });
          break;
        case 'a':
          this.commit('removeBadge', {
            text: (options.facet === 'online') ? state.labels.vals['form.availability.online']
              : (options.facet === 'print') ? state.labels.vals['form.availability.print']
                : state.labels.vals['form.availability.hybrid'],
                ref: '',
              });
          break;
        case 'o':
          this.commit('removeBadge', { text: '', ref: options.facet });
          break;
        case 't':
          this.commit('removeBadge', { text: '', ref: options.facet });
          break;
        case 'wl':
          this.commit('removeBadge', { text: '', ref: options.facet });
          break;
      }
    },
    // add Facet to active exclude-Facet pool
    exceptFacet(state, options = {
      type: '',
      facet: {},
    }) {
      switch (options.type) {
        default:
          break;
        case 'd':
          if (!this.state.url.exceptFacets.dates.includes(options.facet)) {
            this.state.url.exceptFacets.dates.push(options.facet);
          }
          break;
        case 's':
          if (!this.state.url.exceptFacets.persons.includes(options.facet)) {
            this.state.url.exceptFacets.persons.push(options.facet);
            if (options.role === 'r') {
              this.state.url.exceptFacets.personsRole[this.state.url.exceptFacets.persons.length - 1] = 'received';
            } else if (options.role === 's') {
              this.state.url.exceptFacets.personsRole[this.state.url.exceptFacets.persons.length - 1] = 'sent';
            }
          }
          break;
        case 'o':
          if (!this.state.url.exceptFacets.occupations.includes(options.facet)) {
            this.state.url.exceptFacets.occupations.push(options.facet);
          }
          break;
        case 'p':
          if (!this.state.url.exceptFacets.places.includes(options.facet)) {
            this.state.url.exceptFacets.places.push(options.facet);
            if (options.role === 'r') {
              this.state.url.exceptFacets.placesRole[this.state.url.exceptFacets.places.length - 1] = 'received';
            } else if (options.role === 's') {
              this.state.url.exceptFacets.placesRole[this.state.url.exceptFacets.places.length - 1] = 'sent';
            }
          }
          break;
        case 'e':
          if (!this.state.url.exceptFacets.edition.includes(options.facet)) {
            this.state.url.exceptFacets.edition.push(options.facet);
          }
          break;
        case 'c':
          if (!this.state.url.exceptFacets.cmif.includes(options.facet)) {
            this.state.url.exceptFacets.cmif.push(options.facet);
          }
          break;
        case 'a':
          if (!this.state.url.exceptFacets.availability.includes(options.facet)) {
            this.state.url.exceptFacets.availability.push(options.facet);
          }
          break;
        case 'g':
          if (!this.state.url.exceptFacets.gender.includes(options.facet)) {
            this.state.url.exceptFacets.gender.push(options.facet);
          }
          break;
        case 't':
          if (!this.state.url.exceptFacets.datasets.includes(options.facet)) {
            this.state.url.exceptFacets.datasets.push(options.facet);
          }
          break;
        case 'wl':
          if (!this.state.url.exceptFacets.languages.includes(options.facet)) {
            this.state.url.exceptFacets.languages.push(options.facet);
          }
          break;
      }
    },
    // set Results and do some stuff with the loading that is currently not
    // existing. :o)
    setResults(state, results) {
      this.state.landingPage = false; // Hide landingPageInfo FOREVER!!! ... until reload.
      this.state.results.all = results.hits.hits;
      this.state.results.count = results.hits.total.value;
    },
    // unset Results because there is no meaning in anything and why should
    // there be anything if there is nothing? 
    unsetResults(state, showTeaser = false) {
      this.state.search.badges = [];
      this.state.results.all = [];
      this.state.results.count = -1;
      if (showTeaser) this.state.teaser = this.state.teaserHTML;
    },
    resetSearch() {
      this.state.url = {
        search: [],
        searchRole: [],
        urlString: window.location.href.split("?")[1],
        map: {
          mapQuery: false,
          dates: [],
          role: [],
        },
        facets: {
          dates: [],
          persons: [],
          occupations: [],
          // occupationsRole: [],
          places: [],
          placesRole: [],
          edition: [],
          cmif: [],
          datasets: [],
          gender: [],
          availability: [],
          languages: [],
          fullText: [],
          weekdays: false,
          externalRefLinks: true,
          showDateAsText: true,
          showRDate: true,
          showCmifInfo: false,
        },
        exceptFacets: {
          dates: [],
          persons: [],
          personsRole: [],
          occupations: [],
          // occupationsRole: [],
          places: [],
          placesRole: [],
          edition: [],
          cmif: [],
          datasets: [],
          gender: [],
          availability: [],
          languages: [],
        },
      };
      this.commit('unsetResults', true);
      this.commit('updateUrl', true);
    },
    // set suggestions after getting results from AC-queries
    setSuggestions(state, options = {
      suggestions: [],
      type: 'names',
      main: true,
      key: 0,
      input: '',
    }) {
      if (options.input.length > 2) {
        const type = (options.type === 'source_text') ? 'edition' : options.type;
        if (options.main) {
          this.state.autocomplete.main.suggestions = [];
        } else if (options.type !== 'map') {
          this.state.autocomplete.es[type][options.key].suggestions = [];
        } else if (options.type === 'map') {
          this.state.mapSearch.acHistogis[options.key].suggestions = [];
        }
        options.suggestions.map((suggestion) => {
          const entry = {};
          if (options.type !== 'source_text' && options.type !== 'cmif' && options.type !== 'places' && options.type !== 'map' && options.type !== 'occupations') {
            const entity = suggestion._source;
              // Depending on searchOption, change properties to be assigned to suggested entities
            switch (entity.name_type) {
              case 'persName':
                  entry.text = entity.canonical_name;
                  entry.highlight = suggestion.highlight.text[0];
                  entry.ref = entity.canonical_ref;
                  entry.birth_date = entity.birth_date;
                  entry.death_date = entity.death_date;
                break;
              case 'orgName':
                  entry.text = entity.canonical_name;
                  entry.highlight = suggestion.highlight.text[0];
                  entry.ref = entity.canonical_ref;
                break;
              default: break;
            }
          } else if (options.type === 'places') {
            entry.text = suggestion._source.canonical_name_de;
            entry.highlight = suggestion.highlight.text[0];
            entry.ref = suggestion._source.canonical_ref;
          } else if (options.type === 'source_text') {
            entry.text = suggestion._source.source_text;
            entry.highlight = suggestion.highlight.source_text[0];
            entry.ref = suggestion._source.source_ref;
            entry.id = suggestion._source.source_id;
          } else if (options.type === 'cmif') {
            entry.text = suggestion._source.cmif_title;
            entry.highlight = suggestion.highlight.cmif_title[0];
            entry.ref = suggestion._source.cmif_idno;
          } else if (options.type === 'map') {
            entry.highlight = suggestion.highlight.title;
            entry.text = suggestion._source.title;
            entry.ref = suggestion._source.url;
            entry.dates = [
              suggestion._source.start_date,
              suggestion._source.end_date,
            ];
          } else if (options.type === 'occupations') {
            entry.ref = suggestion._source.canonical_ref;
            if (this.state.lang === 'de') {
              entry.highlight = suggestion.highlight.label_de[0];
              entry.text = suggestion._source.label_de;
            } else if (this.state.lang === 'en') {
              entry.highlight = suggestion.highlight.label_en[0];
              entry.text = suggestion._source.label_en;
            }
          }
          // ATTENTION: Line-to-line (almost) documentation coming up. Prepare
          // for unusally helpful documentation!
          if (entry.text !== '') {
            // Only let suggestion board the autocomplete when it has bought a ticket
            let ticket = true; // I would suppose it bought one beforehands, as it is required.
            if (options.main) {
              state.autocomplete.main.suggestions.map((as) => {
                if (as.text.toLowerCase() === entry.text.toLowerCase()) {
                  // If names are the same check the refs
                  if (as.ref === entry.ref) ticket = false;
                  // If there is no ref but same name, probably means same person => no ticket
                  if (entry.ref.length === 0) ticket = false;
                }
                return null;
              });
              // Does it have a ticket? Fine, let it onboard.
              if (ticket) state.autocomplete.main.suggestions.push(entry);
            } else if (options.type !== 'map') {
              state.autocomplete.es[type][options.key].suggestions.map((as) => {
                if (as.text.toLowerCase() === entry.text.toLowerCase()) {
                  // If names are the same check the refs
                  if (as.ref === entry.ref) ticket = false;
                  // If there is no ref but same name, probably means same person => no ticket
                  if (entry.ref.length === 0) ticket = false;
                }
                return null;
              });
              // Does it have a ticket? Fine, let it onboard.
              if (ticket) state.autocomplete.es[type][options.key].suggestions.push(entry);
            } else if (options.type === 'map') {
              // Validation not necessary because we rely on
              // histogis-accuracy...?
              if (ticket) state.mapSearch.acHistogis[options.key].suggestions.push(entry);
            }
          }
          return null;
        });
        // In case of exSearch-ACs...
        if (!options.main && options.type !== 'map') {
          this.state.autocomplete.es[type][options.key].show = true;

          this.state.autocomplete.main.show = false;
          this.state.autocomplete.main.suggestions = [];

          this.state.autocomplete.es.names.map((ac, i) => {
            if (!(i === options.key && options.type === 'names')) {
              this.state.autocomplete.es.names[i].show = false;
              this.state.autocomplete.es.names[i].suggestions = [];
            }
          });
          this.state.autocomplete.es.places.map((ac, i) => {
            if (!(i === options.key && options.type === 'places')) {
              this.state.autocomplete.es.places[i].show = false;
              this.state.autocomplete.es.places[i].suggestions = [];
            }
          });
          this.state.autocomplete.es.edition.map((ac, i) => {
            if (!(i === options.key && type === 'edition')) {
              this.state.autocomplete.es.edition[i].show = false;
              this.state.autocomplete.es.edition[i].suggestions = [];
            }
          });
        } else if (options.type !== 'map') {
          this.state.autocomplete.main.show = true;
        } else if (options.type === 'map') {
          this.state.mapSearch.acHistogis[options.key].show = true;
        }
      }
    },
    // close autocompletes and reset suggestion objects
    closeAutocomplete(state, options = []) {
      let target = options[1];
      if (options[1] === 'source_text') target = 'edition';
      if (options.length !== 0) {
        this.state.autocomplete.es[target][options[0]].show = false;
        this.state.autocomplete.es[target][options[0]].suggestions = [];
        this.state.autocomplete.es[target][options[0]].selected = 0;
      }
      this.state.autocomplete.main.suggestions = [];
      this.state.autocomplete.main.show = false;
      this.state.autocomplete.main.selected = 0;
    },
    // Set or reset option to display weekdays
    updateWeekdays(state, bool) {
      this.state.url.facets.weekdays = (bool === 'true');
      this.commit('updateUrl');
    },
  },
  modules: {
    facets:facets,
    
  }
});
