<template>
  <div class="vis-button">
    <a v-bind:href="buildCsVisLink()" target="_blank"><font-awesome-icon icon="project-diagram"/></a>
    <p><a v-bind:href="buildCsVisLink()" target="_blank">{{store.labels.vals['visualisation.network']}}</a></p>
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
            return ('vis.html?'+ this.store.url.urlString + '&vistype=2')
        }
    }
}
</script>

<style>

</style>