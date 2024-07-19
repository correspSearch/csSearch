<template>
  <div class="vis-button">
    <a v-bind:href="buildCsVisLink()" target="_blank"><font-awesome-icon icon="chart-bar"/></a>
    <p><a v-bind:href="buildCsVisLink()" target="_blank">{{store.labels.vals['visualisation.barGraph']}}</a></p>
  </div>
</template>

<script>

import { mapState } from 'vuex';
export default {
    computed: {
    ...mapState({
      store: state => state,
      })
    },
    methods:{
        buildCsVisLink(){
            return ('vis.html?'+ this.store.url.urlString + '&vistype=0')
        }
    }
}
</script>

<style>

</style>