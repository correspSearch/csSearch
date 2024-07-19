/* CONTENTS ******************* */
/* 1. Map                      */
/* 2. Autocomplete             */
/* 3. Search                   */
/* 4. Extended Search          */
/* 5. INIT                     */
/* 6. Facets / Display Options */
/* *************************** */

/** *** */
/* MAP */
/** *** */
const setMap = (state, mode) => {
  this.map = mode;
};

const mapSetSearchTerm = (state, options) => {
  state.mapSearch.acHistogis[options[0]].value = options[1];
};

const mapCloseAutocomplete = (state, i) => {
  state.mapSearch.acHistogis[i].show = false;
  state.mapSearch.acHistogis[i].suggestions = [];
  state.mapSearch.acHistogis[i].selected = 0;
};

// set Value of date fields @mapsearch
const mapSetDate = (state, options) => {
  state.mapSearch.dates[options[0]].value = options[1];
};

// Clear polygon array
const mapClearPolygons = (state) => {
  state.mapSearch.polygons = [];
  // Clear form
  state.mapSearch.acHistogis[0].value = '';
  state.mapSearch.role = '*';
  state.mapSearch.dates = [
    {
      value: '',
      iso: null,
    },
    {
      value: '',
      iso: null,
    },
  ];
};

// Change role of selected region
const mapSetRoleOfRegion = (state, e) => {
  state.mapSearch.role = e;
};

// Transform bucket place locations for map use
const getProperPlaceArray = (state, arr) => {
  arr.map((poi) => {
    state.mapSearch.places.push({
      ...poi.ref.hits.hits[0]._source,
      doc_count: poi.doc_count,
    });
  });
};

/** ************ */
/* Autocomplete */
/** ************ */

// set selected list item on mouseover @autocomplete
const acSetSelected = (state, options) => {
  if (options.target === 'main') {
    state.autocomplete.main.selected = options.newKey;
  } else if (options.target === 'map') {
    state.mapSearch.acHistogis[options.fieldKey].selected = options.newKey;
  } else {
    state.autocomplete.es[options.target][options.fieldKey].selected = options.newKey;
  }
};

// This is in fact a trigger-function only for AC but was meant to be used
// in a more generic way. See comment in line #774ff
const trigger = (state, options = {
  key: 0,
  target: '',
  autocomplete: true,
  input: '',
  main: false,
}) => {
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
    } else if (options.target === 'map') {
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
};

// close autocompletes and reset suggestion objects
const closeAutocomplete = (state, options = []) => {
  let target = options[1];
  if (options[1] === 'source_text') target = 'edition';
  if (options.length !== 0) {
    state.autocomplete.es[target][options[0]].show = false;
    state.autocomplete.es[target][options[0]].suggestions = [];
    state.autocomplete.es[target][options[0]].selected = 0;
  }
  state.autocomplete.main.suggestions = [];
  state.autocomplete.main.show = false;
  state.autocomplete.main.selected = 0;
};

// set suggestions after getting results from AC-queries
const setSuggestions = (state, options = {
  suggestions: [],
  type: 'names',
  main: true,
  key: 0,
  input: '',
}) => {
  if (options.input.length > 2) {
    const type = (options.type === 'source_text') ? 'edition' : options.type;
    if (options.main) {
      state.autocomplete.main.suggestions = [];
    } else if (options.type !== 'map') {
      state.autocomplete.es[type][options.key].suggestions = [];
    } else if (options.type === 'map') {
      state.mapSearch.acHistogis[options.key].suggestions = [];
    }
    options.suggestions.map((suggestion) => {
      const entry = {};
      if (options.type !== 'source_text' && options.type !== 'cmif' && options.type !== 'places' && options.type !== 'map') {
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
      state.autocomplete.es[type][options.key].show = true;

      state.autocomplete.main.show = false;
      state.autocomplete.main.suggestions = [];

      state.autocomplete.es.names.map((ac, i) => {
        if (!(i === options.key && options.type === 'names')) {
          state.autocomplete.es.names[i].show = false;
          state.autocomplete.es.names[i].suggestions = [];
        }
      });
      state.autocomplete.es.places.map((ac, i) => {
        if (!(i === options.key && options.type === 'places')) {
          state.autocomplete.es.places[i].show = false;
          state.autocomplete.es.places[i].suggestions = [];
        }
      });
      state.autocomplete.es.edition.map((ac, i) => {
        if (!(i === options.key && type === 'edition')) {
          state.autocomplete.es.edition[i].show = false;
          state.autocomplete.es.edition[i].suggestions = [];
        }
      });
    } else if (options.type !== 'map') {
      state.autocomplete.main.show = true;
    } else if (options.type === 'map') {
      state.mapSearch.acHistogis[options.key].show = true;
    }
  }
};

/** ****** */
/* Search */
/** ****** */

const resetField = (state, options) => {
  // reset single fields.
  if (options[1] === 'names') {
    state.exSearch.names[options[0]] = {
      ref: '',
      value: '',
      options: state.exSearch.names[0].options,
      selected: '*',
      index: `esCorrespondent${state.exSearch.names[options[0]].index}`,
    };
  } else if (options[1] === 'places') {
    state.exSearch.places[options[0]] = {
      ref: '',
      value: '',
      options: state.exSearch.places[0].options,
      selected: '*',
      index: `esPlaces${state.exSearch.places[options[0]].index}`,
    };
  } else if (options[1] === 'source_text') {
    state.exSearch.edition[options[0]] = {
      ref: '',
      value: '',
      index: `esEdition${state.exSearch.edition[options[0]].index}`,
    };
  } else if (options[1] === 'cmif') {
    state.exSearch.cmif[options[0]] = {
      ref: '',
      value: '',
      index: `esCmif${state.exSearch.cmif[options[0]].index}`,
    };
  } else if (options[1] === 'map') {
    state.mapSearch.acHistogis[options[0]].value = '';
    state.mapSearch.acHistogis[options[0]].suggestions = [];
    state.mapSearch.acHistogis[options[0]].selected = 0;
    state.mapSearch.acHistogis[options[0]].show = false;
  }
};

const sortResults = (state, target) => {
  // Adjust sorting variables
  if (state.sort[target].active) {
    state.sort[target].asc = !state.sort[target].asc;
  }
  state.sort[target].active = true;
  state.sort[(target === 'alpha') ? 'numeric' : 'alpha'].active = false;

  state.query.base.sort = {};
  state.query.base.sort[(target === 'alpha') ? 'names.text.keyword' : 'dates.start'] = {
    order: (state.sort[target].asc) ? 'asc' : 'desc',
    nested: {
      path: (target === 'alpha') ? 'names' : 'dates',
    },
  };
};

// set Page Number
const setPageNumber = (state, no) => {
  state.pagination.start = no;
};

// set Search Term
const setSearchTerm = (state, term) => {
  state.search.term = term;
};

// remove Badge and adjust exSearch accordingly.
// TODO: Move exSearch-Handling to separate function
const removeBadge = (state, e) => {
  // HOOK: Facets
  if (state.url.search.includes(e.ref)) {
    state.url.search.splice(state.url.search.indexOf(e.ref), 1);
    state.url.searchRole.splice(state.url.search.indexOf(e.ref), 1);
  }
  state.exSearch.names.map((c, i) => {
    if (c.ref === e.ref) {
      if (state.exSearch.names.length === 1) {
        state.exSearch.names[0].ref = '';
        state.exSearch.names[0].value = '';
      } else {
        state.exSearch.names.splice(i, 1);
        state.autocomplete.es.names.splice(i, 1);
      }
    }
  });
  if (state.url.facets.places.includes(e.ref)) {
    state.url.facets.places.splice(state.url.facets.places.indexOf(e.ref), 1);
    state.url.facets.placesRole.splice(state.url.facets.places.indexOf(e.ref), 1);
  }
  state.exSearch.places.map((c, i) => {
    if (c.ref === e.ref) {
      if (state.exSearch.places.length === 1) {
        state.exSearch.places[0].ref = '';
        state.exSearch.places[0].value = '';
      } else {
        state.exSearch.places.splice(i, 1);
        state.autocomplete.es.places.splice(i, 1);
      }
    }
  });
  if (state.url.facets.edition.includes(e.ref)) state.url.facets.edition.splice(state.url.facets.edition.indexOf(e.ref), 1);
  state.exSearch.edition.map((c, i) => {
    if (c.ref === e.ref) {
      if (state.exSearch.edition.length === 1) {
        state.exSearch.edition[0].ref = '';
        state.exSearch.edition[0].value = '';
      } else {
        state.exSearch.edition.splice(i, 1);
        state.autocomplete.es.edition.splice(i, 1);
      }
    }
  });
  if (state.url.facets.cmif.includes(e.ref)) state.url.facets.cmif.splice(state.url.facets.cmif.indexOf(e.ref), 1);
  state.exSearch.cmif.map((c, i) => {
    if (c.ref === e.ref) {
      if (state.exSearch.cmif.length === 1) {
        state.exSearch.cmif[0].ref = '';
        state.exSearch.cmif[0].value = '';
      } else {
        state.exSearch.cmif.splice(i, 1);
        state.autocomplete.es.cmif.splice(i, 1);
      }
    }
  });
  if (e.text === state.labels.vals['form.availability.online']) {
    state.url.facets.availability.splice(state.url.facets.availability.indexOf('online'), 1);
    state.exSearch.availability.selected = '*';
  }
  if (e.text === state.labels.vals['form.availability.print']) {
    state.url.facets.availability.splice(state.url.facets.availability.indexOf('print'), 1);
    state.exSearch.availability.selected = '*';
  }
  if (e.text === state.labels.vals['form.availability.hybrid']) {
    state.url.facets.availability.splice(state.url.facets.availability.indexOf('hybrid'), 1);
    state.exSearch.availability.selected = '*';
  }
  state.url.facets.dates.map((date, i) => {
    state.exSearch.dates.map((d, j) => {
      if (d.value === e.text && state.exSearch.dates.length > 1) {
        state.exSearch.dates.splice(j, 1);
      } else if (d.value === e.text && state.exSearch.dates.length === 1) {
        state.exSearch.dates = [{
          to: '',
          from: '',
          value: '',
        }];
      }
    });
    if (date === e.text) {
      state.url.facets.dates.splice(i, 1);
    }
  });
  for (let i = 0; i < state.search.badges.length; i += 1) {
    if (
        (state.search.badges[i].ref === e.ref && state.search.badges[i].ref.length > 0)
      || (state.search.badges[i].ref.length === 0 && state.search.badges[i].text === e.text)
    ) {
      state.search.badges.splice(i, 1);
      break;
    }
  }

  if (state.url.exceptFacets.persons.includes(e.ref)) {
    state.url.exceptFacets.persons.splice(state.url.exceptFacets.persons.indexOf(e.ref), 1);
    state.url.exceptFacets.personsRole.splice(state.url.exceptFacets.persons.indexOf(e.ref), 1);
  }
  if (state.url.exceptFacets.places.includes(e.ref)) {
    state.url.exceptFacets.places.splice(state.url.exceptFacets.places.indexOf(e.ref), 1);
    state.url.exceptFacets.placesRole.splice(state.url.exceptFacets.places.indexOf(e.ref), 1);
  }
  if (state.url.exceptFacets.edition.includes(e.ref)) state.url.exceptFacets.edition.splice(state.url.exceptFacets.edition.indexOf(e.ref), 1);
  if (state.url.exceptFacets.cmif.includes(e.ref)) state.url.exceptFacets.cmif.splice(state.url.exceptFacets.cmif.indexOf(e.ref), 1);
  if (e.text === state.labels.vals['form.availability.online']) {
    state.url.exceptFacets.availability
        .splice(state.url.exceptFacets.availability
            .indexOf('online'), 1);
  }
  if (e.text === state.labels.vals['form.availability.print']) {
    state.url.exceptFacets.availability
        .splice(state.url.exceptFacets.availability
            .indexOf('print'), 1);
  }
  if (e.text === state.labels.vals['form.availability.hybrid']) {
    state.url.exceptFacets.availability
        .splice(state.url.exceptFacets.availability
            .indexOf('hybrid'), 1);
  }
  state.url.exceptFacets.dates.map((date, i) => {
    if (date === e.text) {
      state.url.exceptFacets.dates.splice(i, 1);
    }
  });
  for (let i = 0; i < state.search.badges.length; i += 1) {
    if (
        (state.search.badges[i].ref === e.ref && state.search.badges[i].ref.length > 0)
        || (state.search.badges[i].ref.length === 0 && state.search.badges[i].text === e.text)
    ) {
      state.search.badges.splice(i, 1);
      break;
    }
  }
  this.$store.commit('updateUrl');
};

// set Badges and exSearch accordingly.
// TODO: Move exSearch Handling to another function
const setBadges = (state) => {
  // HOOK: Facets
  state.search.badges = [];
  // HOOK: add params to exSearch
  let x = 0;
  let y = 0;
  let z = 0;
  let p = 0;
  // Names
  state.url.search.map((ref, i) => {
    const badge = {
      ref,
      text: '',
      type: 'main',
    };
    fetch(`${state.index}`, {
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

            if (state.url.searchRole[i] !== undefined && state.url.searchRole[i] !== '*') {
              badge.text += (state.url.searchRole[i] === 'sent')
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
              if (state.url.searchRole[i] !== undefined) {
                role = state.url.searchRole[i];
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
              state.exSearch.cIndex = x + 1;
            }
            break;
          }
        }
      });
    });
    state.search.badges.push(badge);
  });

  // Places:
  state.url.facets.places.map((ref, i) => {
    if (ref.length > 0) {
      const badge = {
        ref,
        text: '',
        type: 'main',
      };
      fetch(state.index, {
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

              if (state.url.facets.placesRole[i] !== undefined && state.url.facets.placesRole[i] !== '*') {
                badge.text += (state.url.facets.placesRole[i] === 'sent')
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
                if (state.url.facets.placesRole[i] !== undefined) {
                  role = state.url.facets.placesRole[i];
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
                state.exSearch.pIndex = y + 1;
                break;
              }
            }
          }
        });
        state.search.badges.push(badge);
      });
    }
  });

  // Dates
  if (state.url.facets.dates.length > 0) state.exSearch.dates = [];
  state.url.facets.dates.map((date) => {
    state.search.badges.push({
      text: date,
      ref: '',
      type: 'main',
    });
    state.exSearch.dates.push({
      to: '',
      from: '',
      value: date,
    });
  });

  // Editions
  state.url.facets.edition.map((edition, i) => {
    const ref = decodeURI(edition);

    // Get name of edition
    fetch(state.index, {
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
        state.search.badges.push({
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
  state.url.facets.gender.map((ge) => {
    if (state.labels.vals[`facets.gender.${ge}`] === undefined) {
      setTimeout(() => {
        state.search.badges.push({
          text: state.labels.vals[`facets.gender.${ge}`],
          ref: ge,
          type: 'main',
        });
      }, 300);
    } else {
      state.search.badges.push({
        text: state.labels.vals[`facets.gender.${ge}`],
        ref: ge,
        type: 'main',
      });
    }
  });

  // Availability
  state.url.facets.availability.map((av) => {
    state.search.badges.push({
      text: (state.labels.vals['form.availability.all'] === undefined) ? av : state.labels.vals[`form.availability.${av}`],
      ref: '',
      type: 'main',
    });
  });

  // CMIF
  state.url.facets.cmif.map((idno, i) => {
    const ref = decodeURI(idno);

    // Get name of CMIF
    fetch(state.index, {
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
        state.search.badges.push({
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

  // Except names
  state.url.exceptFacets.persons.map((ref, n) => {
    const badge = {
      ref,
      text: '',
      type: 'except',
    };
    fetch(state.index, {
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
            if (state.url.exceptFacets.personsRole[n] !== undefined && state.url.exceptFacets.personsRole[n] !== '*') {
              badge.text += (state.url.exceptFacets.personsRole[n] === 'sent')
                ? state.labels.vals['search.roleNamesSender']
                : state.labels.vals['search.roleNamesReceiver'];
            }
            break;
          }
        }
      });
    });
    state.search.badges.push(badge);
  });

  // Except Places:
  state.url.exceptFacets.places.map((ref, n) => {
    const badge = {
      ref,
      text: '',
      type: 'except',
    };
    fetch(state.index, {
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
            if (state.url.exceptFacets.placesRole[n] !== undefined && state.url.exceptFacets.placesRole[n] !== '*') {
              badge.text += (state.url.exceptFacets.placesRole[n] === 'sent')
                ? state.labels.vals['search.rolePlacesSender']
                : state.labels.vals['search.rolePlacesReceiver'];
            }
            break;
          }
        }
      });
    });
    state.search.badges.push(badge);
  });

  // Except Editions
  state.url.exceptFacets.edition.map((edition) => {
    fetch(state.index, {
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
        state.search.badges.push({
          text: (text.length > 30) ? `${text.substr(0, 30)}...` : text,
          ref: decodeURI(edition),
          type: 'except',
        });
      });
    });
  });

  // Gender
  // TODO: timeout is an ugly workaround to be deleted asap, needs proper
  // async queueing first
  state.url.exceptFacets.gender.map((ge) => {
    if (state.labels.vals[`facets.gender.${ge}`] === undefined) {
      setTimeout(() => {
        state.search.badges.push({
          text: state.labels.vals[`facets.gender.${ge}`],
          ref: ge,
          type: 'except',
        });
      }, 300);
    } else {
      state.search.badges.push({
        text: state.labels.vals[`facets.gender.${ge}`],
        ref: ge,
        type: 'except',
      });
    }
  });

  // Availability
  state.url.exceptFacets.availability.map((av) => {
    state.search.badges.push({
      text: (state.labels.vals['form.availability.all'] === undefined) ? av : state.labels.vals[`form.availability.${av}`],
      ref: '',
      type: 'except',
    });
  });

  // Except CMIF
  state.url.exceptFacets.cmif.map((idno) => {
    const ref = decodeURI(idno);

    fetch(state.index, {
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
        state.search.badges.push({
          text: (text.length > 30) ? `${text.substr(0, 30)}...` : text,
          ref,
          type: 'except',
        });
      });
    });
  });

  // Except Dates
  state.url.exceptFacets.dates.map((date) => {
    state.search.badges.push({
      text: date,
      ref: '',
      type: 'except',
    });
  });
};

// HOOK: URL Parameters
// Adjust URL Parameters
// TODO: Switch to vue router for easier Handling
const updateUrl = (state, setPageNull = false) => {
  const paramStates = [
    0, // s 0
    0, // x 1
    0, // p 2
    0, // w 3
    0, // d 4
    0, // e 5
    0, // c 6
    0, // xs 7
    0, // xe 8
    0, // xd 9
    0, // xp 10
    0, // xc 11
    0, // xa 12
    0, // a  13
    0, // g  14
    0, // xg 15
    0, // o  16 (occupation include)
    0, // xo 17 (occupation exclude)
  ];

  // HOOK: Facets
  let urlRefString = '';
  if (state.url.search.length > 0) {
    const urlRefs = [...state.url.search];
    urlRefs.map((str, i) => {
      if (state.url.searchRole[i] !== undefined && state.url.searchRole[i] !== '*') {
        urlRefs[i] += `::${state.url.searchRole[i]}`;
      }
    });
    urlRefString = JSON.stringify(urlRefs);
    urlRefString = urlRefString.replace(/[\[\]"]/g, '');
  }
  if (urlRefString.length > 0) paramStates[0] = 1;

  let urlPlaceString = '';
  if (state.url.facets.places.length > 0) {
    const urlRefs = [...state.url.facets.places];
    urlRefs.map((str, i) => {
      if (state.url.facets.placesRole[i] !== undefined && state.url.facets.placesRole[i] !== '*') {
        urlRefs[i] += `::${state.url.facets.placesRole[i]}`;
      }
    });
    urlPlaceString = JSON.stringify(urlRefs);
    urlPlaceString = urlPlaceString.replace(/[\[\]"]/g, '');
  }
  if (urlPlaceString.length > 0) paramStates[2] = 1;

  let urlDateString = '';
  if (state.url.facets.dates.length > 0) {
    urlDateString = JSON.stringify(state.url.facets.dates);
    urlDateString = urlDateString.replace(/[\[\]"]/g, '');
  }
  if (urlDateString.length > 0) paramStates[4] = 1;

  let urlEditionString = '';
  if (state.url.facets.edition.length > 0) {
    urlEditionString = JSON.stringify(state.url.facets.edition);
    urlEditionString = urlEditionString.replace(/[\[\]"]/g, '');
  }
  if (urlEditionString.length > 0) paramStates[5] = 1;

  let urlCmifString = '';
  if (state.url.facets.cmif.length > 0) {
    urlCmifString = JSON.stringify(state.url.facets.cmif);
    urlCmifString = urlCmifString.replace(/[\[\]"]/g, '');
  }
  if (urlCmifString.length > 0) paramStates[6] = 1;

  let urlPageString = '';
  if (state.pagination.start !== 0 && !setPageNull) {
    urlPageString = String(state.pagination.start);
  } else if (setPageNull) {
    urlPageString = '1';
    state.pagination.start = 1;
  }
  if (urlPageString.length > 0) paramStates[1] = 1;

  let urlRefStringX = '';
  if (state.url.exceptFacets.persons.length > 0) {
    const urlRefs = [...state.url.exceptFacets.persons];
    urlRefs.map((str, i) => {
      if (state.url.exceptFacets.personsRole[i] !== undefined && state.url.exceptFacets.personsRole[i] !== '*') {
        urlRefs[i] += `::${state.url.exceptFacets.personsRole[i]}`;
      }
    });
    urlRefStringX = JSON.stringify(urlRefs);
    urlRefStringX = urlRefStringX.replace(/[\[\]"]/g, '');
  }
  if (urlRefStringX.length > 0) paramStates[7] = 1;

  let urlPlaceStringX = '';
  if (state.url.exceptFacets.places.length > 0) {
    const urlRefs = [...state.url.exceptFacets.places];
    urlRefs.map((str, i) => {
      if (state.url.exceptFacets.placesRole[i] !== undefined && state.url.exceptFacets.placesRole[i] !== '*') {
        urlRefs[i] += `::${state.url.exceptFacets.placesRole[i]}`;
      }
    });
    urlPlaceStringX = JSON.stringify(urlRefs);
    urlPlaceStringX = urlPlaceStringX.replace(/[\[\]"]/g, '');
  }
  if (urlPlaceStringX.length > 0) paramStates[10] = 1;

  let urlDateStringX = '';
  if (state.url.exceptFacets.dates.length > 0) {
    urlDateStringX = JSON.stringify(state.url.exceptFacets.dates);
    urlDateStringX = urlDateStringX.replace(/[\[\]"]/g, '');
  }
  if (urlDateStringX.length > 0) paramStates[9] = 1;

  let urlEditionStringX = '';
  if (state.url.exceptFacets.edition.length > 0) {
    urlEditionStringX = JSON.stringify(state.url.exceptFacets.edition);
    urlEditionStringX = urlEditionStringX.replace(/[\[\]"]/g, '');
  }
  if (urlEditionStringX.length > 0) paramStates[8] = 1;

  let urlCmifStringX = '';
  if (state.url.exceptFacets.cmif.length > 0) {
    urlCmifStringX = JSON.stringify(state.url.exceptFacets.cmif);
    urlCmifStringX = urlCmifStringX.replace(/[\[\]"]/g, '');
  }
  if (urlCmifStringX.length > 0) paramStates[11] = 1;

  let urlGeStringX = '';
  if (state.url.exceptFacets.gender.length > 0) {
    urlGeStringX = JSON.stringify(state.url.exceptFacets.gender);
    urlGeStringX = urlGeStringX.replace(/[\[\]"]/g, '');
  }
  if (urlGeStringX.length > 0) paramStates[14] = 1;

  let urlGeString = '';
  if (state.url.facets.gender.length > 0) {
    urlGeString = JSON.stringify(state.url.facets.gender);
    urlGeString = urlGeString.replace(/[\[\]"]/g, '');
  }
  if (urlGeString.length > 0) paramStates[15] = 1;

  let urlAvStringX = '';
  if (state.url.exceptFacets.availability.length > 0) {
    urlAvStringX = JSON.stringify(state.url.exceptFacets.availability);
    urlAvStringX = urlAvStringX.replace(/[\[\]"]/g, '');
  }
  if (urlAvStringX.length > 0) paramStates[12] = 1;

  let urlAvString = '';
  if (state.url.facets.availability.length > 0) {
    urlAvString = JSON.stringify(state.url.facets.availability);
    urlAvString = urlAvString.replace(/[\[\]"]/g, '');
  }
  if (urlAvString.length > 0) paramStates[13] = 1;

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
    (urlPageString.length > 0) ? `${paramStates.includes(1) ? '&' : ''}x=${urlPageString}` : ''
  }${
    (urlAvString.length > 0) ? `${paramStates.includes(1) ? '&' : ''}a=${urlAvString}` : ''
  }${
    (urlGeString.length > 0) ? `${paramStates.includes(1) ? '&' : ''}g=${urlGeString}` : ''
  }${
    (paramStates.includes(1)) ? '&' : ''}w=${(state.url.facets.weekdays) ? '1' : '0'
  }${
    (urlDateStringX.length > 0) ? `${paramStates.includes(1) ? '&' : ''}xd=${urlDateStringX}` : ''
  }${
    (urlRefStringX.length > 0) ? `${paramStates.includes(1) ? '&' : ''}xs=${urlRefStringX}` : ''
  }${
    (urlPlaceStringX.length > 0) ? `${paramStates.includes(1) ? '&' : ''}xp=${urlPlaceStringX}` : ''
  }${
    (urlEditionStringX.length > 0) ? `${paramStates.includes(1) ? '&' : ''}xe=${urlEditionStringX}` : ''
  }${
    (urlCmifStringX.length > 0) ? `${paramStates.includes(1) ? '&' : ''}xc=${urlCmifStringX}` : ''
  }${
    (urlAvStringX.length > 0) ? `${paramStates.includes(1) ? '&' : ''}xa=${urlAvStringX}` : ''
  }${
    (urlGeStringX.length > 0) ? `${paramStates.includes(1) ? '&' : ''}xg=${urlGeStringX}` : ''
  }`;
  newUrl = newUrl.replace('?&', '?');
  history.pushState(null, null, newUrl);
};

// Set search option for simple search
const setSearchOption = (state, option) => {
  state.search.options.selected = option;
  // When searchOption is changed, clear autocomplete and searchTerm as it targets another entity now
  state.search.term = '';
  state.autocomplete.main.suggestions = [];
  state.autocomplete.main.show = false;
};

// set Results and do some stuff with the loading that is currently not
// existing. :o)
const setResults = (state, results) => {
  state.landingPage = false; // Hide landingPageInfo FOREVER!!! ... until reload.
  state.results.all = results.hits.hits;
  state.results.count = results.hits.total.value;
};

// unset Results because there is no meaning in anything and why should
// there be anything if there is nothing? You're welcome.
const unsetResults = (state, showTeaser = false) => {
  state.search.badges = [];
  state.results.all = [];
  state.results.count = -1;
  if (showTeaser) state.teaser = state.teaserHTML;
};

const resetSearch = (state) => {
  state.url = {
    search: [],
    searchRole: [],
    facets: {
      dates: [],
      persons: [],
      occupations: [],
      places: [],
      placesRole: [],
      edition: [],
      cmif: [],
      gender: [],
      availability: [],
      weekdays: false,
      externalRefLinks: true,
      showDateAsText: true,
      showRDate: true,
    },
    exceptFacets: {
      dates: [],
      persons: [],
      personsRole: [],
      occupations: [],
      places: [],
      placesRole: [],
      edition: [],
      cmif: [],
      gender: [],
      availability: [],
    },
  };
  this.commit('unsetResults', true);
  this.commit('updateUrl');
};

/** *************** */
/* Extended Search */
/** *************** */

const toggleExtendedSearch = (state) => {
  // Trigger display of extended search
  state.extendedSearch.show = !state.extendedSearch.show;
};

const esResetSearch = (state) => {
  this.commit('resetSearch');
  this.commit('esResetSearchForm');
};

const esResetSearchForm = (state) => {
  // reset extended search completely
  state.exSearch = {
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
    availability: state.exSearch.availability,
    dates: [
      {
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
    edition: [
      {
        ref: '',
        value: '',
        index: 'esEdition0',
      },
    ],
  };
};

const esAddCorrespondent = (state) => {
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
  state.exSearch.names.push({
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
};

const esRemCorrespondent = (state, ref) => {
  // Remove correspondent from extended Search
  for (let i = 0; i < state.exSearch.names.length; i += 1) {
    if (state.exSearch.names[i].ref === ref) {
      state.url.search.splice(i, 1);
      state.exSearch.names.splice(i, 1);
      state.autocomplete.es.names.splice(i, 1);
      break;
    }
  }
};

const esAddDate = (state) => {
  // add Date to exSearch
  state.exSearch.dates.push({
    from: '',
    to: '',
  });
};

const esRemDate = (state, key) => {
  // Remove Date from exSearch
  state.exSearch.dates.splice(key, 1);
};

const esAddPlace = (state) => {
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
  state.exSearch.places.push({
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
};

const esRemPlace = (state, ref) => {
  // Remove Correspondent from exSearch
  for (let i = 0; i < state.exSearch.places.length; i += 1) {
    if (state.exSearch.places[i].ref === ref) {
      state.url.facets.places.splice(i, 1);
      state.exSearch.places.splice(i, 1);
      state.autocomplete.es.places.splice(i, 1);
      break;
    }
  }
};

const esAddEdition = (state) => {
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
  state.exSearch.edition.push({
    value: '',
    ref: '',
    index: `esEdition${x}`,
  });
  state.autocomplete.es.edition.push({
    show: false,
    suggestions: [],
    selected: 0,
  });
};

const esRemEdition = (state, ref) => {
  // remove Correspondent from exSearch
  for (let i = 0; i < state.exSearch.edition.length; i += 1) {
    if (state.exSearch.edition[i].ref === ref) {
      state.url.facets.edition.splice(i, 1);
      state.exSearch.edition.splice(i, 1);
      state.autocomplete.es.edition.splice(i, 1);
      break;
    }
  }
};

const esAddCmif = (state) => {
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
  state.exSearch.cmif.push({
    value: '',
    ref: '',
    index: `esCmif${x}`,
  });
  state.autocomplete.es.cmif.push({
    show: false,
    suggestions: [],
    selected: 0,
  });
};

const esRemCmif = (state, ref) => {
  // Remove Correspondent from exSearch
  for (let i = 0; i < state.exSearch.cmif.length; i += 1) {
    if (state.exSearch.cmif[i].ref === ref) {
      state.url.facets.cmif.splice(i, 1);
      state.exSearch.cmif.splice(i, 1);
      state.autocomplete.es.cmif.splice(i, 1);
      break;
    }
  }
};

const esSetTerm = (state, options = {
  suggestion: {},
  field: Number,
  type: String,
}) => {
  // Helper function to set ref according to selected input and reset Autocomplete
  const c = state.exSearch[options.type];
  c[options.field].value = options.suggestion.text;

  let ref = '';
  if (options.type === 'edition') ref = options.suggestion.id;
  if (options.type === 'names' || options.type === 'places' || options.type === 'cmif') ref = options.suggestion.ref;
  c[options.field].ref = ref;

  state.exSearch[options.type] = [...c];
  state.autocomplete.es[options.type][options.field].suggestions = [];
  state.autocomplete.es[options.type][options.field].show = false;
};

const esSetOption = (state, options = {
  type: Object,
  field: Number,
  value: String,
}) => {
  // Set Options for sender/receiver/all or select field for availability
  switch (options.type) {
    default: break;
    case 'names': {
      const c = state.exSearch.names;
      c[options.field].selected = options.value;
      state.exSearch.names = [...c];
    } break;
    case 'places': {
      const p = state.exSearch.places;
      p[options.field].selected = options.value;
      state.exSearch.places = [...p];
    } break;
    case 'availability':
      state.exSearch.availability.selected = options.value;
    break;
  }
};

/** **** */
/* INIT */
/** **** */

const setWindowWidth = (state, windowWidth) => {
  // Helper for checking on window width
  state.window = windowWidth;
};

const load = (state, status) => {
  // TODO: Either implement working spinner or get rid of loading stuff
  if (status === true) state.loadingActive = true;
  else state.loadingActive = false;
};

const setTeaser = (state, str) => {
  /* state.teaser = str;
  if (init[0] && init[1] === null) state.teaserHTML = str;
  else if (init[0] && init[1] !== null) state.teaserHTML = init[1];
  */
  state.teaser = str;
};

const setTeaserHTML = (state, str) => {
  state.teaserHTML = str;
};

// Set labels before anything else is happening
const setLabels = (state, result) => {
  const parse = new Promise((resolve, reject) => {
    // Change to vue route
    state.lang = (window.location.search.match(/[?&]l=en/) || window.location.href.match(/correspsearch\.net\/en\//)) ? 'en' : 'de';
    const parser = new DOMParser();
    const xml = parser.parseFromString(result, 'application/xml');
    for (let i = 0; i < xml.children[0].children.length; i += 1) {
      if (xml.children[0].children[i].attributes[0].value === String(state.lang)) {
        for (let j = 0; j < xml.children[0].children[i].children.length; j += 1) {
          state.labels.vals[xml.children[0].children[i].children[j].attributes[0].value] = xml.children[0].children[i].children[j].innerHTML;
        }
      }
      if (i === xml.children[0].children.length - 1) {
        resolve();
      }
    }
  });

  parse.then(() => {
    state.labelsLoaded = true;

    state.extendedSearch.link = state.labels.vals['search.extendedSearch'];
    // HOOK: Facets
    state.search.options.options = [
      { value: 'names', text: state.labels.vals['search.correspondent'] },
      { value: 'places', text: state.labels.vals['search.place'] },
      { value: 'date', text: state.labels.vals['search.date'] },
      { value: 'source_text', text: state.labels.vals['form.publications'] },
      { value: 'cmif', text: 'CMIF-Verzeichnis' }, // TODO: Add to labels
    ];

    // Setup extended search
    state.exSearch.names[0] = {
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
    state.exSearch.places[0] = {
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
    console.log(state.labels.vals);
    state.exSearch.availability.options.map((o, i) => {
      if (o.value === '*') state.exSearch.availability.options[i].text = state.labels.vals['form.availability.all'];
      if (o.value === 'print') state.exSearch.availability.options[i].text = state.labels.vals['form.availability.print'];
      if (o.value === 'online') state.exSearch.availability.options[i].text = state.labels.vals['form.availability.online'];
    });
    console.log(state.exSearch.availability);
    // Setup some badges that need setup... i.e. avail
    state.search.badges.map((b, i) => {
      const badge = b;
      if (b.text === 'online') state.search.badges[i].text = state.labels.vals['form.availability.online'];
      if (b.text === 'print') state.search.badges[i].text = state.labels.vals['form.availability.print'];
      if (b.text === 'hybrid') state.search.badges[i].text = state.labels.vals['form.availability.hybrid'];
      if (b.text === '*') state.search.badges[i].text = state.labels.vals['form.availability.all'];
    });
  });
};

// Initiate query base... wouldn't have guessed it, wouldn't ye?
const initiateQueryBase = (state) => {
  // Query base
  state.query.base = {
    from: 0,
    // min_score: state.search.minScore,
    size: state.pagination.count,
    track_total_hits: state.search.maxHits,
    aggregations: {},
    sort: {
      'dates.start': {
        order: 'asc',
        nested: {
          path: 'dates',
        },
      },
    },
  };

  // Names or Places for Autocomplete
  state.query.autocomplete.personOrPlace = {
    NameSuggest: {
      prefix: '',
      completion: {
        field: '',
        size: state.search.maxHits,
        skip_duplicates: true,
      },
    },
  };
  // HOOK: Facets
  // Sorting
  // Editions for Autocomplete
  state.query.autocomplete.edition = {
    NameSuggest: {
      prefix: '',
      completion: {
        field: '',
        size: state.search.maxHits,
        skip_duplicates: true,
      },
    },
  };

  // CMIF for Autocomplete
  state.query.autocomplete.cmif = {
    NameSuggest: {
      prefix: '',
      completion: {
        field: '',
        size: state.search.maxHits,
        skip_duplicates: true,
      },
    },
  };
};

const setLang = (state, lang) => {
  state.lang = lang;
};

// Initiate exSearch... woah, you mean the function name describes its
// purpose?? MINDBLOWING!
const initiateExSearch = (state) => {
  // Step 1: Get names @badges-function
  // Step 2: Set dates to start if no dates are present in facets
  if (state.url.facets.dates[0] !== undefined) {
    state.exSearch.dates = [];
    state.url.facets.dates.map((d) => {
      state.exSearch.dates.push({
        from: '',
        to: '',
        value: d,
      });
    });
  }
  // Step 2: Get cmif & editions for selects
  fetch(`${state.index}/_search`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({
      aggregations: {
        cmif: state.query.aggregations.cmif,
        edition: state.query.aggregations.edition,
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
};

// decode parameters and move them to facet and search
// TODO: Implement vue router for easier handling
const initiateUrlParameters = (state, parameterString) => {
  if (parameterString !== '') {
    const parameters = parameterString.substring(1).split('&');
    parameters.map((param) => {
      const parameter = {
        paramVar: param.split('=')[0],
        paramVal: param.split('=')[1],
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
              state.url.search.push(refUri);
              state.url.searchRole.push(role);
            }
            return null;
          });
        } break;
        case 'd': {
          const date = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
          date.map((d) => {
            state.url.facets.dates.push(decodeURI(d));
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
            state.url.facets.places.push(refUri);
            state.url.facets.placesRole.push(role);
          });
        } break;
        case 'o': {
          const occupation = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
          occupation.map((ref) => {
            let occupationRef;
            let role;
            if (ref.includes('::')) {
              [occupationRef] = ref.split('::');
              [, role] = ref.split('::');
            } else {
              occupationRef = ref;
              role = '*';
            }
            state.url.facets.occupations.push(occupationRef);
            state.url.facets.occupationRole.push(role);
          });
        } break;
        case 'e': {
          const edition = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
          edition.map((id) => {
            // TODO: Validation
            state.url.facets.edition.push(id);
            state.exSearch.edition.selected = id;
          });
        } break;
        case 'c': {
          const cmif = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
          cmif.map((idno) => {
            // TODO: Validation
            state.url.facets.cmif.push(idno);
            state.exSearch.cmif.selected = idno;
          });
        } break;
        case 'a':
          if (parameter.paramVal === 'online'
              || parameter.paramVal === 'print'
              || parameter.paramVal === 'hybrid') {
            state.exSearch.availability.selected = parameter.paramVal;
            state.url.facets.availability.push(parameter.paramVal);
          }
        break;
        case 'g': {
          const gender = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
          gender.map((ge) => {
            // TODO: Validation
            if (ge.match(/male|female|unknown|diverse/)) {
              state.url.facets.gender.push(ge);
            }
          });
        } break;
        case 'x':
          if (parameter.paramVal.match(/[0-9]*/g)) {
            state.pagination.start = parameter.paramVal;
          }
          break;
        case 'w':
          state.url.facets.weekdays = (parameter.paramVal === '1');
          break;
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
              state.url.exceptFacets.persons.push(refUri);
              state.url.exceptFacets.personsRole.push(role);
            }
            return null;
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
            state.url.exceptFacets.places.push(refUri);
            state.url.exceptFacets.placesRole.push(role);
          });
        } break;
        case 'xe': {
          const edition = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
          edition.map((id) => {
            // TODO: Validation
            state.url.exceptFacets.edition.push(id);
          });
        } break;
        case 'xc': {
          const cmif = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
          cmif.map((idno) => {
            // TODO: Validation
            state.url.exceptFacets.cmif.push(idno);
          });
        } break;
        case 'xd': {
          const date = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
          date.map((d) => {
            state.url.exceptFacets.dates.push(decodeURI(d));
          });
        } break;
        case 'xa': {
          const availability = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
          availability.map((av) => {
            // TODO: Validation
            state.url.exceptFacets.availability.push(av);
          });
        } break;
        case 'xg': {
          const gender = parameter.paramVal.replace(/[\[\]]/g, '').split(',');
          gender.map((ge) => {
            // TODO: Validation
            state.url.exceptFacets.gender.push(ge);
          });
        } break;
        case 'l':
          state.lang = (parameter.paramVal === 'en') ? 'en' : 'de';
        break;
      }
      return null;
    });
  }
};

/** ************************ */
/* Facets / Display Options */
/** ************************ */

const setExternalRefLinks = (state) => {
  // Trigger display of external Ref links in results (e.g. gnd, geonames, ...)
  state.url.facets.externalRefLinks = !state.url.facets.externalRefLinks;
};

const setDateAsText = (state) => {
  // Toggle display of "Date as Text"
  state.url.facets.showDateAsText = !state.url.facets.showDateAsText;
};

const setRDate = (state) => {
  // Toggle display of Receive date
  state.url.facets.showRDate = !state.url.facets.showRDate;
};

const setCmifInfo = (state) => {
  state.url.facets.showCmifInfo = !state.url.facets.showCmifInfo;
};

const sortFacets = (state, options) => {
  // Wrapper function for sorting facets asc/desc or numeric/alpha
  const target = options[0];
  const type = options[1];
  const asc = options[2];

  if (type === 'alpha' || type === 'numeric') {
    state.search.facets[target].sort((a, b) => {
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
    state.search.facets[target].sort((a, b) => {
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
};

// move facet information from agg object to main facet object
const setFacets = (state, options = [{}, false]) => {
  const agg = options[0];
  state.search.facets = {
    dates: agg.dates.date_histogram.buckets,
    names: agg.names.names_list.buckets,
    namesRoles: agg.namesRoles.actions.buckets,
    occupations: agg.occupations.occupations_list.buckets,
    places: agg.places.places_list.buckets,
    placesRoles: agg.placesRoles.actions.buckets,
    edition: agg.edition.buckets,
    cmif: agg.cmif.buckets,
    gender: agg.gender.gender_list.buckets,
    availability: agg.availability.buckets,
  };
  state.search.visuals.dates = agg.visualDates.date_histogram.buckets;
};

// Clear Facets
const clearFacets = (state) => {
  state.search.facets = {
    dates: [],
    names: [],
    occupations: [],
    places: [],
    edition: [],
    cmif: [],
    gender: [],
    availability: [],
  };
  state.search.visuals.dates = [];
};

// add Facet to active facet pool
const addFacet = (state, options = {
  type: '',
  facet: {},
  role: null,
}) => {
  switch (options.type) {
    default: break;
    case 'd':
      // TODO: Validation
      if (!state.url.facets.dates.includes(options.facet)) state.url.facets.dates.push(options.facet);
      break;
    case 's':
      if (!state.url.search.includes(options.facet)) state.url.search.push(options.facet);
      if (options.role === 'r') {
        state.url.searchRole[state.url.search.length - 1] = 'received';
      } else if (options.role === 's') {
        state.url.searchRole[state.url.search.length - 1] = 'sent';
      }
      break;
    case 'p':
      if (!state.url.facets.places.includes(options.facet)) state.url.facets.places.push(options.facet);
      if (options.role === 'r') {
        state.url.facets.placesRole[state.url.facets.places.length - 1] = 'received';
      } else if (options.role === 's') {
        state.url.facets.placesRole[state.url.facets.places.length - 1] = 'sent';
      }
      break;
    case 'e':
      if (!state.url.facets.edition.includes(options.facet)) state.url.facets.edition.push(options.facet);
      state.exSearch.edition.selected = options.facet;
      break;
    case 'c':
      if (!state.url.facets.cmif.includes(options.facet)) state.url.facets.cmif.push(options.facet);
      state.exSearch.cmif.selected = options.facet;
      break;
    case 'a':
      if (!state.url.facets.availability.includes(options.facet)) state.url.facets.availability.push(options.facet);
      state.exSearch.availability.selected = (options.facet === 'online') ? state.labels.vals['form.availability.online'] : state.labels.vals['form.availability.print'];
      break;
    case 'g':
      if (!state.url.facets.gender.includes(options.facet)) state.url.facets.gender.push(options.facet);
      break;
  }
};

// Remove Facet from active facet pool
const removeFacet = (state, options = {
  type: '',
  facet: '',
}) => {
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
      this.commit('removeBadge', { text: options.facet, ref: '' });
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
  }
};

// add Facet to active exclude-Facet pool
const exceptFacet = (state, options = {
  type: '',
  facet: {},
}) => {
  switch (options.type) {
    default:
      break;
    case 'd':
      if (!state.url.exceptFacets.dates.includes(options.facet)) {
        state.url.exceptFacets.dates.push(options.facet);
      }
      break;
    case 's':
      if (!state.url.exceptFacets.persons.includes(options.facet)) {
        state.url.exceptFacets.persons.push(options.facet);
        if (options.role === 'r') {
          state.url.exceptFacets.personsRole[state.url.exceptFacets.persons.length - 1] = 'received';
        } else if (options.role === 's') {
          state.url.exceptFacets.personsRole[state.url.exceptFacets.persons.length - 1] = 'sent';
        }
      }
      break;
    case 'p':
      if (!state.url.exceptFacets.places.includes(options.facet)) {
        state.url.exceptFacets.places.push(options.facet);
        if (options.role === 'r') {
          state.url.exceptFacets.placesRole[state.url.exceptFacets.places.length - 1] = 'received';
        } else if (options.role === 's') {
          state.url.exceptFacets.placesRole[state.url.exceptFacets.places.length - 1] = 'sent';
        }
      }
      break;
    case 'e':
      if (!state.url.exceptFacets.edition.includes(options.facet)) {
        state.url.exceptFacets.edition.push(options.facet);
      }
      break;
    case 'c':
      if (!state.url.exceptFacets.cmif.includes(options.facet)) {
        state.url.exceptFacets.cmif.push(options.facet);
      }
      break;
    case 'a':
      if (!state.url.exceptFacets.availability.includes(options.facet)) {
        state.url.exceptFacets.availability.push(options.facet);
      }
      break;
    case 'g':
      if (!state.url.exceptFacets.gender.includes(options.facet)) {
        state.url.exceptFacets.gender.push(options.facet);
      }
      break;
  }
};

// Set or reset option to display weekdays
const updateWeekdays = (state, bool) => {
  state.url.facets.weekdays = (bool === 'true');
  this.commit('updateUrl');
};

export default {
  /* Map */
  setMap,
  mapSetSearchTerm,
  mapCloseAutocomplete,
  mapSetDate,
  mapClearPolygons,
  mapSetRoleOfRegion,
  mapTriggerSearch,
  getProperPlaceArray,
  /* Autocomplete */
  acSetSelected,
  trigger,
  closeAutocomplete,
  setSuggestions,
  /* Search */
  resetField,
  sortResults,
  setPageNumber,
  setSearchTerm,
  removeBadge,
  setBadges,
  updateUrl,
  setSearchOption,
  setResults,
  unsetResults,
  resetSearch,
  /* Extended Search */
  toggleExtendedSearch,
  esResetSearch,
  esResetSearchForm,
  esAddCorrespondent,
  esRemCorrespondent,
  esAddDate,
  esRemDate,
  esAddPlace,
  esRemPlace,
  esAddEdition,
  esRemEdition,
  esAddCmif,
  esRemCmif,
  esSetTerm,
  esSetOption,
  esTriggerSearch,
  /* INIT */
  setWindowWidth,
  load,
  setTeaser,
  setTeaserHTML,
  setLabels,
  initiateQueryBase,
  setLang,
  initiateExSearch,
  initiateUrlParameters,
  /* Facets / Display Options */
  setExternalRefLinks,
  setDateAsText,
  setRDate,
  setCmifInfo,
  sortFacets,
  setFacets,
  clearFacets,
  addFacet,
  removeFacet,
  exceptFacet,
  updateWeekdays,
};
