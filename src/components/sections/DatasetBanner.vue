<template>
  <div v-html="html">
</div>
</template>

<script>

import { mapState } from 'vuex';
export default {
props: {
    dataset: {
        type: String,
        required: true
        }
},
data(){
  return{
    html : ''
  }
},
 computed: {
      ...mapState({
        store: state => state,
      })},
watch: {
  dataset:function(newValue){
    this.updateBanner(newValue)
  }
},
methods: {
  updateBanner(datasetID){
    fetch(`https://correspsearch.net/resources/dataset-banners.xql?dataset=${datasetID}&${(this.store.lang === 'en') ? 'l=en' : ''}`)
        .then((response) => {
          response.text().then((html) => {
            console.log(this.$store.lang)
            console.log('responce html: ', html)
            this.html = html
          });
        });
  }
},
created(){
  fetch(`https://correspsearch.net/resources/dataset-banners.xql?dataset=${this.dataset}&${(this.store.lang === 'en') ? 'l=en' : ''}`)
        .then((response) => {
          response.text().then((html) => {
            console.log(this.$store.lang)
            console.log('responce html: ', html)
            this.html = html
          });
        });
}
}
</script>

<style>

</style>