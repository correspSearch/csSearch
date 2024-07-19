import Vue from 'vue';
import Vuex from 'vuex';
import {
  LayoutPlugin,
  FormPlugin,
  InputGroupPlugin,
  PaginationNavPlugin,
  CardPlugin,
  BadgePlugin,
  ListGroupPlugin,
  PopoverPlugin,
  FormInputPlugin,
  FormSelectPlugin,
  LinkPlugin,
  CollapsePlugin,
  AlertPlugin,
  ButtonPlugin,
  FormCheckboxPlugin,
  PaginationPlugin,
} from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faQuestionCircle}  from '@fortawesome/free-regular-svg-icons';
import {
  faMapMarkerAlt,
  faLongArrowAltRight,
  faLocationArrow,
  faArrowCircleRight,
  faUserEdit,
  faTimesCircle,
  faCircleNotch,
  faChevronCircleRight,
  faChevronCircleUp,
  faBan,
  faEnvelopeOpenText,
  faPaperPlane,
  faSortNumericDown,
  faSortNumericUp,
  faSortAlphaDown,
  faSortAlphaUp,
  faChevronRight,
  faChevronDown,
  faPlusCircle,
  faMinusCircle,
  faExternalLinkAlt,
  faSignInAlt,
  faSignOutAlt,
  faSquare,
  faCircle,
  faDrawPolygon,
  faTrashAlt,
  faGlobeEurope,
  faCalendarAlt,
  faSearch,
  faChartBar,
  faProjectDiagram,
  faMapMarkedAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  LMap,
  LTileLayer,
  LPopup,
  LControl,
  LCircleMarker,
  LLayerGroup,
  LFeatureGroup,
  LPolygon,
} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import LFreeDraw from 'vue2-leaflet-freedraw';

// import VueRouter from 'vue-router';
import App from './components/App.vue';
import '../assets/app.css';
import store from './store';

library.add(
  faCircleNotch,
  faMapMarkerAlt,
  faLongArrowAltRight,
  faLocationArrow,
  faArrowCircleRight,
  faUserEdit,
  faTimesCircle,
  faChevronCircleRight,
  faChevronCircleUp,
  faBan,
  faEnvelopeOpenText,
  faPaperPlane,
  faSortNumericDown,
  faSortNumericUp,
  faSortAlphaDown,
  faSortAlphaUp,
  faChevronRight,
  faChevronDown,
  faPlusCircle,
  faMinusCircle,
  faExternalLinkAlt,
  faSignInAlt,
  faSignOutAlt,
  faSquare,
  faCircle,
  faDrawPolygon,
  faTrashAlt,
  faGlobeEurope,
  faCalendarAlt,
  faSearch,
  faQuestionCircle,
  faChartBar,
  faProjectDiagram,
  faMapMarkedAlt
);

// Vue.use(VueRouter);

Vue.use(LayoutPlugin);
Vue.use(FormPlugin);
Vue.use(ListGroupPlugin);
Vue.use(CardPlugin);
Vue.use(InputGroupPlugin);
Vue.use(FormInputPlugin);
Vue.use(FormSelectPlugin);
Vue.use(LinkPlugin);
Vue.use(BadgePlugin);
Vue.use(PopoverPlugin);
Vue.use(AlertPlugin);
Vue.use(CollapsePlugin);
Vue.use(ButtonPlugin);
Vue.use(FormCheckboxPlugin);
Vue.use(PaginationPlugin);
Vue.use(Vuex);

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-popup', LPopup);
Vue.component('l-circle-marker', LCircleMarker);
Vue.component('l-layer-group', LLayerGroup);
Vue.component('l-feature-group', LFeatureGroup);
Vue.component('l-control', LControl);
Vue.component('l-freedraw', LFreeDraw);
Vue.component('l-polygon', LPolygon);

Vue.component('font-awesome-icon', FontAwesomeIcon);

/*

  TODO:
  * Datenvisualisierung klickbar machen
  * Doppelte Funktionen aufräumen
  * Autocomplete ggf. zu eigener Component machen
  * Edition param -> exSearch
  * CMIF param -> exSearch

  * Router-implementation:
    * search: normal search without all the leaflet-stuff.
    * map: freedraw'n'stuff, makes huge part of the build, better to be only
      loaded for mapsearch.

 */


/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  store,
  beforeCreate() {
    fetch(store.state.labels.loc)
      .then((response) => {
        console.info('Loading XML File... :', response);
        response.text().then((xml) => {
          store.commit('setLabels', xml);
        });
      });
    fetch('https://correspsearch.net/resources/statistic.xml')
      .then((response) => {
         console.info('Loading XML File... :', response);
         response.text().then((statXML) => {
            store.commit('setStatisitcs', statXML)
         });
      });
  },
  created() {
    store.commit('setLang', (window.location.search.match(/[?&]l=en/) || window.location.href.match(/correspsearch\.net\/en\//)) ? 'en' : 'de');
    if (!Object.keys(store.state.map).length) {
      store.commit('initiateUrlParameters', window.location.search);
      store.commit('initiateExSearch');
    }
  },
  render: h => h(App),
});
