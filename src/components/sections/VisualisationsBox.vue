<template>
  <div 
   v-bind:class="(store.results.count < 20000 && store.results.count > 0)? 'vis-box-outer active': 'vis-box-outer disabled'">
    <h3>{{ store.labels.vals['visualisation.box'] }}</h3>
    <div class="vis-box-inner" v-if="store.results.count < 20000 && store.results.count > 0">
      <bar-graph-button></bar-graph-button>
      <map-vis-button></map-vis-button>
      <network-vis-button></network-vis-button>
    </div>
    <div v-if="store.results.count > 20000" class="vis-info">
      {{ store.labels.vals['visualisation.info'] }}
    </div>
  </div>
</template>

<script>
import BarGraphButton from '../buttons/BarGraphButton.vue';
import MapVisButton from '../buttons/MapVisButton.vue';
import NetworkVisButton from '../buttons/NetworkVisButton.vue';

import { mapState } from 'vuex';

export default {
    components: {
        BarGraphButton,
        MapVisButton,
        NetworkVisButton
    },
    computed: {
    ...mapState({
      store: state => state,
      })
  },
}
</script>

<style>

</style>