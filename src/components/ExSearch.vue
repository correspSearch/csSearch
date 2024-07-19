<template>
  <div class="clearfix">
    <b-link
      class="float-right"
      v-bind:class="store.extendedSearch.show ? null : 'collapsed'"
      aria-controls="collapseExtendedSearch"
      v-bind:aria-expanded="store.extendedSearch.show"
      v-on:click="toggleExSearch"
    >
      {{ store.extendedSearch.link }}
    </b-link>
    <b-collapse
      id="collapseExtendedSearch"
      v-model="store.extendedSearch.show"
    >
      <b-form>
        <!-- Search Bar Names -->
        <b-row
          v-for="(c, i) in store.exSearch.names"
          v-bind:key="c.index"
        >
          <b-col cols="11">
            <b-input-group
              v-bind:prepend="label['search.correspondent']"
            >
              <b-form-input
                v-bind:id="`acExS-names-${i}`"
                v-bind:value="c.value"
                v-on:input="setSearchTerm($event, i, 'names', c.value)"
                v-on:keydown.esc="closeAutocomplete(i, 'names')"
                v-on:keydown.up.prevent="acSetSelected(i, 'none', 'names', -1)"
                v-on:keydown.down.prevent="acSetSelected(i, 'none', 'names', 1)"
                v-on:keydown.enter="chooseFromAutocomplete(i, ac.names[i].suggestions[ac.names[i].selected], 'names')"
              >
                {{ c.value }}
              </b-form-input>
              <template v-slot:append>
                <b-form-select
                  v-bind:options="c.options"
                  v-bind:value="c.selected"
                  v-on:change="setSearchOption($event, i, 'names')"
                />
              </template>
            </b-input-group>
            <div
              v-if="ac.names[i].show"
            >
              <div class="autocomplete">
                <b-list-group>
                  <b-list-group-item
                    v-for="(suggestion, key) in ac.names[i].suggestions"
                    v-bind:id="`acExS-names-${i}-${key}`"
                    v-bind:key="key"
                    v-bind:class="(ac.names[i].selected === key) ? 'highlighted' :
                      ''"
                    v-on:mouseover="acSetSelected(i, key, 'names')"
                    v-on:click="chooseFromAutocomplete(i, suggestion, 'names')"
                  >
                    <span
                      class="highlighted-text"
                      v-html="suggestion.highlight"
                    />&#32;
                    {{ $parent.liveAndDeath(suggestion.birth_date, suggestion.death_date) }}
                  </b-list-group-item>
                </b-list-group>
              </div>
            </div>
          </b-col>
          <b-col>
            <font-awesome-icon
              icon="plus-circle"
              class="ml-1"
              v-on:click="addCorrespondent"
            />
            <font-awesome-icon
              v-if="store.exSearch.names.length > 1"
              icon="times-circle"
              class="ml-1"
              v-on:click="remCorrespondent(c.ref)"
            />
          </b-col>
        </b-row>
        <!-- Search Bar Dates -->
        <b-row
          v-for="(d, dKey) in store.exSearch.dates"
          v-bind:key="dKey"
        >
          <b-col cols="11">
            <b-input-group
              v-bind:prepend="label['search.date']"
            >
              <b-form-input
                v-model="d.value"
                v-bind:placeholder="(dKey > 0) ? label['form.date.input.placeholder2'] : label['form.date.input.placeholder']"
              />
            </b-input-group>
          </b-col>
          <b-col>
            <font-awesome-icon
              icon="plus-circle"
              class="ml-1"
              v-on:click="addDate"
            />
            <font-awesome-icon
              v-if="store.exSearch.dates.length > 1"
              icon="times-circle"
              class="ml-1"
              v-on:click="remDate(dKey)"
            />
          </b-col>
        </b-row>
        <!-- Search Bar Places -->
        <b-row
          v-for="(p, i) in store.exSearch.places"
          v-bind:key="p.index"
        >
          <b-col cols="11">
            <b-input-group
              v-bind:prepend="label['form.places']"
            >
              <b-form-input
                v-bind:id="`acExS-places-${i}`"
                v-bind:value="p.value"
                v-on:input="setSearchTerm($event, i, 'places', p.value)"
                v-on:keydown.esc="closeAutocomplete(i, 'places')"
                v-on:keydown.up.prevent="acSetSelected(i, 'none', 'places', -1)"
                v-on:keydown.down.prevent="acSetSelected(i, 'none', 'places', 1)"
                v-on:keydown.enter="chooseFromAutocomplete(i, ac.places[i].suggestions[ac.places[i].selected], 'places')"
              >
                {{ p.value }}
              </b-form-input>
              <template v-slot:append>
                <b-form-select
                  v-bind:options="p.options"
                  v-bind:value="p.selected"
                  v-on:input="setSearchOption($event, i, 'places')"
                />
              </template>
            </b-input-group>
            <div
              v-if="ac.places[i].show"
            >
              <div id="autocomplete">
                <b-list-group>
                  <b-list-group-item
                    v-for="(suggestion, key) in ac.places[i].suggestions"
                    v-bind:id="`acExS-places-${i}-${key}`"
                    v-bind:key="key"
                    v-bind:class="(ac.places[i].selected === key) ? 'highlighted' :
                      ''"
                    v-on:mouseover="acSetSelected(i, key, 'places')"
                    v-on:click="chooseFromAutocomplete(i, suggestion, 'places')"
                  >
                    <span
                      class="highlighted-text"
                      v-html="suggestion.highlight"
                    />
                  </b-list-group-item>
                </b-list-group>
              </div>
            </div>
          </b-col>
          <b-col>
            <font-awesome-icon
              icon="plus-circle"
              class="ml-1"
              v-on:click="addPlace"
            />
            <font-awesome-icon
              v-if="store.exSearch.places.length > 1"
              icon="times-circle"
              class="ml-1"
              v-on:click="remPlace(p.ref)"
            />
          </b-col>
        </b-row>
        <!-- Search Bar Occupation -->
        <b-row
          v-for="(o, i) in store.exSearch.occupations"
          v-bind:key="o.index"
        >
          <b-col cols="11">
            <b-input-group
              v-bind:prepend="label['search.occupation']"
            >
              <b-form-input
                v-bind:id="`acExS-occupations-${i}`"
                v-bind:value="o.value"
                v-on:input="setSearchTerm($event, i, 'occupations', o.value)"
                v-on:keydown.esc="closeAutocomplete(i, 'occupations')"
                v-on:keydown.up.prevent="acSetSelected(i, 'none', 'occupations', -1)"
                v-on:keydown.down.prevent="acSetSelected(i, 'none', 'occupations', 1)"
                v-on:keydown.enter="chooseFromAutocomplete(i, ac.occupations[i].suggestions[ac.occupations[i].selected], 'occupations')"
              >
                {{ o.value }}
              </b-form-input>
            </b-input-group>
            <div
              v-if="ac.occupations[i].show"
            >
              <div id="autocomplete">
                <b-list-group>
                  <b-list-group-item
                    v-for="(suggestion, key) in ac.occupations[i].suggestions"
                    v-bind:id="`acExS-occupations-${i}-${key}`"
                    v-bind:key="key"
                    v-bind:class="(ac.occupations[i].selected === key) ? 'highlighted' :
                      ''"
                    v-on:mouseover="acSetSelected(i, key, 'occupations')"
                    v-on:click="chooseFromAutocomplete(i, suggestion, 'occupations')"
                  >
                    <span
                      class="highlighted-text"
                      v-html="suggestion.highlight"
                    />
                  </b-list-group-item>
                </b-list-group>
              </div>
            </div>
          </b-col>
          <b-col>
            <font-awesome-icon
              icon="plus-circle"
              class="ml-1"
              v-on:click="addOccupation"
            />
            <font-awesome-icon
              v-if="store.exSearch.occupations.length > 1"
              icon="times-circle"
              class="ml-1"
              v-on:click="remOccupation(o.ref)"
            />
          </b-col>
        </b-row>
        <!-- Search Bar Dataset -->
        <b-row
          v-for="(t, i) in store.exSearch.datasets"
          v-bind:key="t.index"
        >
          <b-col cols="11">
            <b-input-group
              v-bind:prepend="label['search.datasets']">
              <b-form-select
                  v-bind:options="t.options"
                  v-bind:value="t.selected"
                  v-on:change="setSearchOption($event, i, 'exSearchDatasets')"
                />
            </b-input-group>
          </b-col>
          <b-col>
            <font-awesome-icon
              icon="plus-circle"
              class="ml-1"
              v-on:click="addDataset"
            />
            <font-awesome-icon
              v-if="store.exSearch.datasets.length > 1"
              icon="times-circle"
              class="ml-1"
              v-on:click="remDataset(t.selected)"
            />
          </b-col>
        </b-row>
        <!-- Search Bar Edition -->
        <b-row
          v-for="(e, i) in store.exSearch.edition"
          v-bind:key="e.index"
        >
          <b-col cols="11">
            <b-input-group
              v-bind:prepend="label['form.publications']"
            >
              <b-form-input
                v-bind:id="`acExS-edition-${i}`"
                v-bind:value="e.value"
                v-on:input="setSearchTerm($event, i, 'source_text', e.value)"
                v-on:keydown.esc="closeAutocomplete(i, 'edition')"
                v-on:keydown.up.prevent="acSetSelected(i, 'none', 'edition', -1)"
                v-on:keydown.down.prevent="acSetSelected(i, 'none', 'edition', 1)"
                v-on:keydown.enter="chooseFromAutocomplete(i, ac.edition[i].suggestions[ac.edition[i].selected], 'edition')"
              >
                {{ e.value }}
              </b-form-input>
            </b-input-group>
            <div
              v-if="ac.edition[i].show"
            >
              <div class="autocomplete">
                <b-list-group>
                  <b-list-group-item
                    v-for="(suggestion, key) in ac.edition[i].suggestions"
                    v-bind:id="`acExS-edition-${i}-${key}`"
                    v-bind:key="key"
                    v-bind:class="(ac.edition[i].selected === key) ? 'highlighted' :
                      ''"
                    v-on:mouseover="acSetSelected(i, key, 'edition')"
                    v-on:click="chooseFromAutocomplete(i, suggestion, 'edition')"
                  >
                    <span
                      class="highlighted-text"
                      v-html="suggestion.highlight"
                    />
                  </b-list-group-item>
                </b-list-group>
              </div>
            </div>
          </b-col>
          <b-col>
            <font-awesome-icon
              icon="plus-circle"
              class="ml-1"
              v-on:click="addEdition"
            />
            <font-awesome-icon
              v-if="store.exSearch.edition.length > 1"
              icon="times-circle"
              class="ml-1"
              v-on:click="remEdition(e.ref)"
            />
          </b-col>
        </b-row>
        <!-- Search Bar CMIF -->
        <b-row
          v-for="(e, i) in store.exSearch.cmif"
          v-bind:key="e.index"
        >
          <b-col cols="11">
            <b-input-group
              v-bind:prepend="label['search.cmifFile']"
            >
              <b-form-input
                v-bind:id="`acExS-cmif-${i}`"
                v-bind:value="e.value"
                v-on:input="setSearchTerm($event, i, 'cmif', e.value)"
                v-on:keydown.esc="closeAutocomplete(i, 'cmif')"
                v-on:keydown.up.prevent="acSetSelected(i, 'none', 'cmif', -1)"
                v-on:keydown.down.prevent="acSetSelected(i, 'none', 'cmif', 1)"
                v-on:keydown.enter="chooseFromAutocomplete(i, ac.cmif[i].suggestions[ac.cmif[i].selected], 'cmif')"
              >
                {{ e.value }}
              </b-form-input>
            </b-input-group>
            <div
              v-if="ac.cmif[i].show"
            >
              <div class="autocomplete">
                <b-list-group>
                  <b-list-group-item
                    v-for="(suggestion, key) in ac.cmif[i].suggestions"
                    v-bind:id="`acExS-cmif-${i}-${key}`"
                    v-bind:key="key"
                    v-bind:class="(ac.cmif[i].selected === key) ? 'highlighted' :
                      ''"
                    v-on:mouseover="acSetSelected(i, key, 'cmif')"
                    v-on:click="chooseFromAutocomplete(i, suggestion, 'cmif')"
                  >
                    <span
                      class="highlighted-text"
                      v-html="suggestion.highlight"
                    />
                  </b-list-group-item>
                </b-list-group>
              </div>
            </div>
          </b-col>
          <b-col>
            <font-awesome-icon
              icon="plus-circle"
              class="ml-1"
              v-on:click="addCmif"
            />
            <font-awesome-icon
              v-if="store.exSearch.cmif.length > 1"
              icon="times-circle"
              class="ml-1"
              v-on:click="remCmif(e.ref)"
            />
          </b-col>
        </b-row>
        <!-- Search Bar Availability -->
        <b-row>
          <b-col>
            <b-input-group
              v-bind:prepend="label['form.availability']"
            >
              <b-form-select
                v-bind:options="store.exSearch.availability.options"
                v-bind:value="store.exSearch.availability.selected"
                v-on:input="setSearchOption($event, 0, 'availability')"
              />
            </b-input-group>
          </b-col>
        </b-row>
        <b-button
          v-on:click="triggerSearch"
        >
          {{ label['search.startSearch'] }}
        </b-button>
        <b-button
          v-on:click="resetSearchForm"
        >
          {{ label['search.resetSearchForm'] }}
        </b-button>
        <b-button
          v-on:click="resetSearch"
        >
          {{ label['search.resetSearch'] }}
        </b-button>
      </b-form>
    </b-collapse>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    label: {
        type: Array,
        required: true,
    },
    // store: {
    //     type: Object,
    //     required: true,
    // },
    ac: {
        type: Object,
        required: true,
    },
  },
  computed: {
    ...mapState({
      store: (state) => state,
      search: (state) => state.search,
      //results: (state) => state.results,
      //url: (state) => state.url,
    }) },
  data() {
    return {
      datasetList : []
    };

  },
  methods: {
    // compare comments in Search.vue
    acSetSelected(fieldKey, key, target, direction = 0) {
      document.getElementById(`acExS-${target}-${fieldKey}`).focus();
      let newKey = (key !== 'none') ? key : this.ac[target][fieldKey].selected;
      const suggestionsCount = this.ac[target][fieldKey].suggestions.length - 1;
      if (direction === -1) {
        if (newKey - 1 >= 0) newKey -= 1;
        else if (newKey - 1 < 0) newKey = suggestionsCount;
        document.getElementById(`acExS-${target}-${fieldKey}-${newKey}`).scrollIntoView(true);
      } else if (direction === 1) {
        if (newKey + 1 > suggestionsCount) newKey = 0;
        else if (newKey + 1 <= suggestionsCount) newKey += 1;
        document.getElementById(`acExS-${target}-${fieldKey}-${newKey}`).scrollIntoView(false);
      }
      this.$store.commit('acSetSelected', {
        newKey,
        target,
        fieldKey,
      });
    },
    addCorrespondent() {
        this.$store.commit('esAddCorrespondent');
    },
    remCorrespondent(ref) {
        this.$store.commit('esRemCorrespondent', ref);
    },
    addDate() {
      this.$store.commit('esAddDate');
    },
    remDate(key) {
      this.$store.commit('esRemDate', key);
    },
    addPlace() {
        this.$store.commit('esAddPlace');
    },
    remPlace(ref) {
        this.$store.commit('esRemPlace', ref);
    },
    addOccupation() {
        this.$store.commit('esAddOccupation');
    },
    remOccupation(ref) {
        this.$store.commit('esRemOccupation', ref);
    },
    addDataset() {
      this.$store.commit('esAddDataset');
    },
    remDataset(tSelected) {
        this.$store.commit('esRemDataset', tSelected);
    },
    addEdition() {
      this.$store.commit('esAddEdition');
    },
    remEdition(ref) {
      this.$store.commit('esRemEdition', ref);
    },
    addCmif() {
      this.$store.commit('esAddCmif');
    },
    remCmif(ref) {
        this.$store.commit('esRemCmif', ref);
    },
    toggleExSearch() {
        this.$store.commit('toggleExtendedSearch');
    },
    resetSearchForm() {
      this.$store.commit('esResetSearchForm');
    },
    resetSearch() {
      this.$store.commit('esResetSearch');
    },
    resetField(i, target) {
      this.$store.commit('resetField', [i, target]);
    },
    // Closes autocomplete and resets fields, if no input value is given
    // Triggers search for suggestions otherwise
    setSearchTerm(e, i, target, term) {
        if (e.length === 0) {
          this.$store.commit('closeAutocomplete', [i, target]);
          this.$store.commit('resetField', [i, target]);
        } else if (e.length > 2) {
          // focus on field to make navigation by keys available
          this.$store.commit('trigger', {
            autocomplete: true,
            key: i,
            target,
            input: e,
          });
        }
    },
    // Sets the chosen suggestion from autocomplete as inputvalue to the corresponding field
    chooseFromAutocomplete(p, s, type) {
        this.$store.commit('esSetTerm', {
            suggestion: s,
            field: p,
            type,
        });
    },
    closeAutocomplete(key, target) {
        this.$store.commit('closeAutocomplete', [key, target]);
    },
    // Triggers the search if at least one of the inputfields isn't empty
    triggerSearch() {
      this.$store.commit('clearFacets', true);
      let c = true;
      let d = true;
      let p = true;
      let o = true;
      let t = true;
      let e = true;
      let cmif = true;
      let dataset = true;
      if (this.store.exSearch.names.length <= 1 && this.store.exSearch.names[0].value.length === 0) c = false;
      if (this.store.exSearch.places.length <= 1 && this.store.exSearch.places[0].value.length === 0) p = false;
      if (this.store.exSearch.dates.length <= 1 && this.store.exSearch.dates[0].value.length === 0) d = false;
      if (this.store.exSearch.occupations.length <= 1 && this.store.exSearch.occupations[0].value.length === 0) o = false;
      
      if (this.store.exSearch.edition.length <= 1 && this.store.exSearch.edition[0].value.length === 0) e = false;
      if (this.store.exSearch.cmif.length <= 1 && this.store.exSearch.cmif[0].value.length === 0) cmif = false;
      if (
          this.store.exSearch.names.length <= 1 && 
          this.store.exSearch.places.length <= 1 && 
          this.store.exSearch.dates.length <= 1 && 
          this.store.exSearch.edition.length <= 1 && 
          this.store.exSearch.cmif.length <= 1 && 
          this.store.exSearch.occupations.length <= 1) t = false;
      if (this.store.exSearch.datasets.length <= 1 && 
          this.store.exSearch.datasets[0].selected === '*') dataset= false;
      //if ((!e && !c && !d && !p && !o && !t && !cmif && dataset) && ((this.search.badges.length === 0 || (this.search.badges.length === 1 && this.store.exSearch.datasets.length === 1)) && this.store.exSearch.datasets[0].selected  ==='pdb18')) this.triggerPDB18();
      if (!(!e && !c && !d && !p && !o && !t && !cmif && !dataset) ) (this.$emit('trigger-ex-search', 'exSearch'))
      },
    // && !(this.search.badges.length === 0 && this.store.exSearch.datasets[0].selected ==='pdb18')
    triggerPDB18(){
      this.$store.commit("esGetInputData"); 
      this.$store.commit("updateUrl", true); 
      this.$store.commit("setBadges"); 
      this.$store.commit("setPDBTeaser", (this.store.pdbTeaserHTML));
    },
    // Sets options for sender/receiver/all or select field for availability
    setSearchOption(e, key, type) {
        this.$store.commit('esSetOption', {
            field: key,
            type,
            value: e,
        });
    }
  },
 
};
</script>
