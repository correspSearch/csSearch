<template>
  <b-row
    v-if="showMapSearch"
    class="h-100 mr-0 cs-map-content"
  >
    <b-col>
      <div class="cs-map-container h-100">
        <l-map
          ref="csSearchMap"
          class="cs-map"
          v-bind:zoom="8"
          v-bind:center="[50.979492, 11.323544]"
          v-on:keydown.esc.native="isActive=false"
        >
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <l-layer-group ref="csSearchMapCircles">
            <l-circle-marker
              v-for="(poi, poiKey) in mapsearch.places"
              v-bind:key="poiKey"
              v-bind:lat-lng="poi.location"
              v-bind:radius="8"
              fill-color="#fff"
              v-bind:fill-opacity="0.75"
              color="#205F82"
              v-bind:weight="2"
            >
              <l-popup>
                <h4 class="mb-0">
                  {{ poi.canonical_name_de }}
                </h4>
                <a
                  v-bind:href="poi.canonical_ref"
                  v-bind:title="poi.canonical_ref"
                  target="_blank"
                >
                  <svg
                    width="15"
                    class="mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0
                        002-2v-4M14 4h6m0   0v6m0-6L10 14"
                    />
                  </svg>{{ poi.canonical_ref }}</a>
                <p>
                  <span class="h5">{{ poi.doc_count }} {{ label['map.hits']
                  }}</span>
                  <br>
                  <!-- TODO: Link anpassen für vue-router mit lang-param... -->
                  <a
                    v-bind:href="`/de/search.html?p=${poi.canonical_ref}${
                      (mapsearch.role !== '*') ? `::${mapsearch.role}` : ''
                    }${dateString}`"
                    v-bind:title="`${label['map.goToSearch'] } ${ poi.canonical_name_de }`"
                    target="_blank"
                    class="mt-2"
                  >
                    <font-awesome-icon
                      icon="arrow-circle-right"
                      class="mr-2"
                    />{{ label['map.goToSearch'] }}{{ poi.canonical_name_de }}</a>
                </p>
              </l-popup>
            </l-circle-marker>
          </l-layer-group>
          <l-freedraw
            ref="csSearchMapDraw"
            v-model="polygons"
            v-bind:mode="mode"
          />
          <l-feature-group ref="csSearchMapPolygons">
            <l-polygon
              v-for="(p, pKey) in histogis"
              v-bind:ref="`polygon${pKey}`"
              v-bind:key="pKey"
              v-bind:lat-lngs="p"
              fill-color="#F7931E"
              color="#fff"
              v-bind:weight="2"
              v-bind:fill-opacity="0.50"
            />
          </l-feature-group>
          <l-control
            class="mt-1 cs-map-btn-bar"
            position="topright"
          >
            <b-btn
              class="border border-secondary border-3"
              v-bind:class="(isActive) ? 'bg-secondary text-white' : 'bg-white text-dark'"
              v-on:click="flipActive"
            >
              <font-awesome-icon
                icon="draw-polygon"
              />
            </b-btn>
          </l-control>
          <l-control
            class="mt-1 cs-map-btn-bar"
            position="topright"
          >
            <b-btn
              class="bg-white text-dark border border-secondary border-3"
              v-on:click="clearMap"
            >
              <font-awesome-icon
                icon="trash-alt"
              />
            </b-btn>
          </l-control>
        </l-map>
      </div>
    </b-col>
    <b-col class="cs-content-box pl-0 overflow-auto h-100">
      <h1 class="mb-3">
        {{ label['map.mapSearch'] }}
      </h1>
      <b-row class="mb-3">
        <b-col>
          <b-row>
            <b-col cols="1">
              <font-awesome-icon
                icon="draw-polygon"
                class="cs-map-draw-instructions mt-1"
              />
            </b-col>
            <b-col class="">
              {{ label['map.instructions'] }}
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col>
          <b-row>
            <b-col cols="1">
              <font-awesome-icon
                icon="globe-europe"
                class="cs-map-histogis-instructions mt-1"
              />
            </b-col>
            <b-col class="">
              {{ label['map.histogisInstructions'] }}
              <br>
              <div class="small">
                {{ label['search.mapDataBy'] }}
                {{ label['search.mapHistogisBibl1'] }}
                <a
                  href="https://histogis.acdh.oeaw.ac.at/"
                  target="_blank"
                >https://histogis.acdh.oeaw.ac.at/</a>
                {{ label['search.mapHistogisBibl2'] }}
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col>
          <b-row>
            <b-col cols="1">
              <font-awesome-icon
                icon="calendar-alt"
                class="cs-map-cal-instructions mt-1"
              />
            </b-col>
            <b-col class="">
              {{ label['map.dateInstructions'] }}
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form>
            <b-row
              v-for="(c, i) in mapsearch.acHistogis"
              v-bind:key="c.index"
            >
              <b-col>
                <b-input-group
                  v-bind:prepend="label['map.histogis']"
                  class="mb-1"
                >
                  <b-form-input
                    v-bind:id="`acMapS-histogis-${i}`"
                    v-bind:value="c.value"
                    v-on:input="setSearchTerm($event, i, c.value)"
                    v-on:keydown.esc="closeAutocomplete(i)"
                    v-on:keydown.up.prevent="acSetSelected(i, null, -1)"
                    v-on:keydown.down.prevent="acSetSelected(i, null, 1)"
                    v-on:keydown.enter="chooseFromAutocomplete(i)"
                  >
                    {{ c.value }}
                  </b-form-input>
                </b-input-group>
                <div
                  v-if="mapsearch.acHistogis[i].show"
                >
                  <div class="autocomplete">
                    <b-list-group>
                      <b-list-group-item
                        v-for="(suggestion, key) in mapsearch.acHistogis[i].suggestions"
                        v-bind:id="`acMapS-histogis-${i}-${key}`"
                        v-bind:key="key"
                        v-bind:class="(mapsearch.acHistogis[i].selected === key) ? 'highlighted' :
                          ''"
                        v-on:mouseover="acSetSelected(i, key)"
                        v-on:click="chooseFromAutocomplete(i, suggestion)"
                      >
                        <span
                          class="highlighted-text"
                          v-html="suggestion.highlight[0]"
                        />&#32;
                        ({{ transformDates(suggestion.dates).join(' - ') }})
                      </b-list-group-item>
                    </b-list-group>
                  </div>
                </div>
              </b-col>
              <!-- has to be added for > 1 historical regions
              <b-col>
                <font-awesome-icon
                  icon="plus-circle"
                  class="ml-1"
                  v-on:click="addCorrespondent"
                />
                <font-awesome-icon
                  v-if="mapsearch.acHistogis.length > 1"
                  icon="times-circle"
                  class="ml-1"
                  v-on:click="remCorrespondent(c.ref)"
                />
              </b-col>
              -->
            </b-row>
            <b-input-group
              class="mb-1"
              v-bind:prepend="label['map.datesFrom']"
            >
              <b-form-input
                id="mapDate0"
                v-bind:value="mapsearch.dates[0].value"
                v-on:input="setDate($event, 0)"
              >
                {{ mapsearch.dates[0].value }}
              </b-form-input>
            </b-input-group>
            <b-input-group
              class="mb-1"
              v-bind:prepend="label['map.datesTo']"
            >
              <b-form-input
                id="mapDate1"
                v-bind:value="mapsearch.dates[1].value"
                v-on:input="setDate($event, 1)"
              >
                {{ mapsearch.dates[1].value }}
              </b-form-input>
            </b-input-group>
            <b-input-group
              v-bind:prepend="label['map.action']"
            >
              <b-form-select
                id="mapPlaceRole"
                v-bind:value="mapsearch.role"
                v-on:change="setRole"
              >
                <b-form-select-option value="*">
                  {{ label['map.bothRoles'] }}
                </b-form-select-option>
                <b-form-select-option value="sent">
                  {{ label['facetHeadings.sendingPlace'] }}
                </b-form-select-option>
                <b-form-select-option value="received">
                  {{ label['facetHeadings.receivingPlace'] }}
                </b-form-select-option>
              </b-form-select>
            </b-input-group>
            <b-button
              class="mt-1 w-100"
              v-bind:disabled="(polygons.length === 0 && histogis.length === 0)"
              v-on:click="triggerSearch"
            >
              {{ label['search.startSearch'] }}
            </b-button>
          </b-form>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col />
        <b-col>
          <b-pagination
            v-if="results.count > 10"
            v-bind:value="page"
            v-bind:total-rows="results.count"
            v-bind:per-page="10"
            size="sm"
            align="center"
            v-on:change="setNewPage"
          />
        </b-col>
        <b-col />
      </b-row>
      <b-row class="mt-0">
        <b-col>
          <div>
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
              class="my-1"
            />
            <span v-if="searchCommitted && results.count === 0">Keine Treffer.</span>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col />
        <b-col>
          <b-pagination
            v-if="results.count > 10"
            v-bind:value="page"
            v-bind:total-rows="results.count"
            v-bind:per-page="10"
            size="sm"
            align="center"
            v-on:change="setNewPage"
          />
        </b-col>
        <b-col />
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import { NONE, ALL } from 'leaflet-freedraw';
import result from './Result.vue';

export default {
  components: {
    result,
  },
  props: {
    label: {
      type: Array,
      required: true,
    },
    mapobject: {
      type: Object,
      required: true,
    },
    mapsearch: {
      type: Object,
      required: true,
    },
    results: {
      type: Object,
      required: true,
    },
    url: {
      type: Object,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      cleanShape: false,
      searchCommitted: false,
      showMapSearch: false,
      polygons: [],
      dates: ['', ''],
      histogis: [],
      markers: [],
      dateString: '',
      isActive: false,
    };
  },
  computed: {
    mode() {
      return this.isActive ? ALL : NONE;
    },
    lines() {
      return [];
    },
  },
  beforeCreate() {
    // Helper... better to get rid of the async chaos and load page only after
    // labels. This helps to prevent labels not loading before mapsearch is displayed
    setTimeout(() => {
      this.showMapSearch = true;
    }, 500);
  },
  created() {
  },
  mounted() {
  },
  methods: {
    transformDates(dates) {
      // TODO: Adjust to page language
      return [
        new Date(dates[0]).toLocaleDateString('de', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        new Date(dates[1]).toLocaleDateString('de', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      ];
    },
    setSearchTerm(e, i, value) {
      if (e.length === 0) {
        this.$store.commit('resetField', [i, 'map']);
      } else if (e.length > 2) {
        // focus on field to make navigation by keys available
        this.$store.commit('trigger', {
          autocomplete: true,
          key: i,
          target: 'map',
          input: e,
        });
      }
    },
    closeAutocomplete(i) {
      this.$store.commit('mapCloseAutocomplete', i);
    },
    acSetSelected(key, i, direction = null) {
      let newKey = (direction === null) ? i : 0 || this.mapsearch.acHistogis[key].selected;
      const suggestionsCount = this.mapsearch.acHistogis[key].suggestions.length - 1;
      if (direction === -1) {
        if (newKey - 1 >= 0) newKey -= 1;
        else if (newKey - 1 < 0) newKey = suggestionsCount;
        document.getElementById(`acMapS-histogis-${key}-${newKey}`).scrollIntoView(true);
      } else if (direction === 1) {
        if (newKey + 1 > suggestionsCount) newKey = 0;
        else if (newKey + 1 <= suggestionsCount) newKey += 1;
        document.getElementById(`acMapS-histogis-${key}-${newKey}`).scrollIntoView(false);
      }
      this.$store.commit('acSetSelected', {
        fieldKey: key,
        newKey,
        target: 'map',
      });
    },
    chooseFromAutocomplete(i, suggestion) {
      this.cleanShape = false;
      this.histogis = [];
      let s = {};
      if (!suggestion) {
        s = this.mapsearch.acHistogis[i].suggestions[this.mapsearch.acHistogis[i].selected];
      } else s = suggestion;
      this.mapsearch.acHistogis[i].value = s.text;
      fetch(s.ref)
      .then((response) => {
        console.warn(response);
        response.json().then((json) => {
          const shape = this.tidyUpShape(json.geometry.coordinates);
          this.histogis.push(shape);
          this.$nextTick(() => {
            this.$refs.csSearchMap.mapObject.fitBounds(this.$refs.csSearchMapPolygons.mapObject.getBounds());
          });
          s.dates.map((d, di) => {
            this.setDate(d, di);
            this.dates[di] = d;
          });
          console.log(s);
          this.closeAutocomplete(i);
        });
      });
    },
    // Twist array to put lat lng to lng lat (or vice versa, no idea what's the
    // "right" way)
    tidyUpShape(shape) {
      shape.map((p) => {
        if (typeof p[0] === 'number' && typeof p[1] === 'number') {
          const proxy = [...p];
          p[0] = proxy[1];
          p[1] = proxy[0];
        } else {
          this.tidyUpShape(p);
        }
      });
      return shape;
    },
    remRegion(ref) {},
    addRegion(ref) {},
    flipActive() {
      this.isActive = !this.isActive;
    },
    clearMap() {
      this.polygons = [];
      this.histogis = [];
      this.cleanShape = false;
      this.$refs.csSearchMapDraw.mapObject.clear();
      this.$refs.csSearchMapCircles.mapObject.eachLayer((l) => {
        l.remove();
      });
      this.$refs.csSearchMapPolygons.mapObject.eachLayer((l) => {
        l.remove();
      });
      this.$store.commit('mapClearPolygons');
      this.$store.commit('unsetResults');
      this.searchCommitted = false;
      this.$nextTick(() => {
        document.getElementById('acMapS-histogis-0').value = '';
      });
      // TODO: Reset Form, doesn't work yet
      /* this.$store.commit('resetField', [0, 'map']);
      this.$store.commit('mapSetRoleOfRegion', '*');
      this.dates = ['', ''];
      */
    },
    setDate(e, i) {
      this.$store.commit('mapSetDate', [i, e]);
      // for linkgeneration
      this.dateString = (this.mapsearch.dates[0].value !== '' && this.mapsearch.dates[1].value !== '')
      ? `&d=${this.mapsearch.dates[0].value}-${this.mapsearch.dates[1].value}` : '';
    },
    triggerSearch(e, paginated = false) {
      if (this.mapsearch.polygons.length > 0) {
        this.$refs.csSearchMapCircles.mapObject.eachLayer((l) => {
          l.remove();
        });
      }
      this.$store.commit('unsetResults');
      this.isActive = false;
      this.$emit('trigger', 'mapSearch', {
        polygons: this.polygons,
        histogis: (this.cleanShape) ? this.histogis : this.tidyUpShape(this.histogis),
      });
      // this.$store.commit('mapTriggerSearch', {
      //   polygons: this.polygons,
      //   histogis: (this.cleanShape) ? this.histogis : this.tidyUpShape(this.histogis),
      // });
      this.cleanShape = true;
      this.searchCommitted = true;
    },
    getPageNumber() {
      if (this.results.count % 10 !== 0) {
        return Math.ceil(this.results.count / 10);
      }
      return this.results.count / 10;
    },
    setNewPage(p) {
      this.searchCommitted = false;
      // TODO: set page param, but not until vue-router implementation
      this.$store.commit('setPageNumber', p);
      this.triggerSearch(null, true);
    },
    generatePageLink(p) {
      return '#';
    },
    setRole(e) {
      this.$store.commit('mapSetRoleOfRegion', e);
    },
  },
};
</script>
