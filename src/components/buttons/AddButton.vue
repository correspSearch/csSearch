<template>
  <font-awesome-icon
    icon="plus-circle"
    class="mt-1 float-right ml-1 facet-icons"
    v-on:click="setFacet(target, param, role)"
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
        facets: state => state.search.facets})
    },
  methods: {
    setFacet(e /* facet-text */, type /* name, place, ... */, attr = null /* sender || receiver */) {
      // sets facet because a facet has been selected
      this.$store.commit('addFacet', {
        type,
        facet: e,
        role: attr,
      });
      // this.$store.commit('setPageNumber', 1);
      // update the url because a facet has been selected
      this.$store.commit('updateUrl', true);
      // call the trigger-method 
      this.$emit('call-trigger-search')
      //this.trigger('search');
    },
  }
}
</script>

<style>

</style>
