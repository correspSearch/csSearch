<template>
  <font-awesome-icon
    icon="minus-circle"
    class="mt-1 float-right ml-1 facet-icons"
    v-on:click="exceptFacet(target, param, role)"
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
    exceptFacet(e, type, attr = null) {
      // exclude facet from search result
      this.$store.commit('exceptFacet', {
        type,
        facet: e,
        role: attr,
      });
      // this.$store.commit('setPageNumber', 1);
      // update url because facet has been excluded from search result
      this.$store.commit('updateUrl', true);
      // call trigger-method
      this.$emit('call-trigger-search')
    },
  }
}
</script>

<style>

</style>