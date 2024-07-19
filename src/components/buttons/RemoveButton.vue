<template>
  <font-awesome-icon
    icon="times-circle"
    class="mt-1 float-right ml-1 facet-icons"
    v-on:click="removeFacet(target, param)"
    />
</template>

<script>
import { mapState } from 'vuex';

export default {
    props:{
        target:{
            type: String,
            required: true
        },
        role: {
          type: String
        },
        param:{
          type: String,
          required: true
        }
    },
    data(){
        return{
          }
    },
    computed: {
      ...mapState({
        store: state => state,
        url: state => state.url,
        facets: state => state.search.facets,
        search: state => state.search,})
    },
    methods:{
        removeFacet(e /* facet-text */, type /* name, place, ... */) {
      // remove facet because facet has been deselected
      this.$store.commit('removeFacet', {
        type,
        facet: e,
      });
      // this.$store.commit('setPageNumber', 1);
      // update the url because a facet has been selected
      this.$store.commit('updateUrl', true);
     if (this.search.badges.length > 0) 
     // && !(this.search.badges.length ===1 && this.search.badges[0].ref === "pdb18")
    {
        // call the trigger-method 
        // this.trigger('search');
        this.$emit('call-trigger-search')
      }
      // else if (this.search.badges.length ===1 && this.search.badges[0].ref === "pdb18"){
      //   // set pdb18 teaser
      //   this.$store.commit("setBadges");
      //   this.$store.commit('unsetResults', true);
      //   this.$store.commit("setPDBTeaser", ('<div>TEST<div>'+this.store.pdbTeaserHTML));
      // }
      else {
      // Either none or all results
        this.$store.commit('unsetResults', true);
        this.$store.commit('setPageNumber', 1);
        // this.$store.commit('updateUrl', true);
      }
    }
    }
}
</script>

<style>

</style>