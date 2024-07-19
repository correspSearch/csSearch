<template>
<!-- aria-controls="genderCollapse" -->
  <b-link
    v-bind:disabled="facets[targetFacet].length === 0"
    v-bind:aria-expanded="disableTarget ? 'true' : 'false'"
    
    v-on:click="collapsed[!targetFacetAll ? targetFacet : targetFacetAll] = !collapsed[!targetFacetAll ? targetFacet : targetFacetAll]"
    >
    <font-awesome-icon
        v-bind:icon="'chevron-' + ((!collapsed[!targetFacetAll ? targetFacet : targetFacetAll] ||
        facets[targetFacet].length === 0) ? 'right' : 'down')"
        class="mr-1"
    />
    </b-link>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: {
        targetFacet: {
            type: String,
            required: true
        },
        targetFacetAll: {
            type: String,
        },
    },
    data(){
        return{
            controls: this.targetFacet+'Collapse',
            nameChosenTarget: ''
        }
    },
    computed: {
        ...mapState({
            store: state => state,
            collapsed: state => state.facets.collapsed,
            sort: state => state.facets.sort,
            url: state => state.url,
            facets: state => state.search.facets})
            
        },
    methods:{
        disableTarget(){
            const OnOff = ''
            // this.targetFacet !='' ? collapsed[targetFacet] ? OnOff='true' : OnOff='false' : ''
            this.targetFacetAll !='' ? collapsed[targetFacetAll] ? OnOff ='true' : OnOff='false' : collapsed[targetFacet] ? OnOff='true' : OnOff='false'
            return OnOff
        }
    }
}
</script>

<style>

</style>