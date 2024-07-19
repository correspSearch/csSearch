<template>
  <div class="full-text-statistics">
    <p v-if="((search.options.selected==='full_text') && search.badges.length ===0)? getGlobalStatisitcs(): (((search.options.selected==='full_text') && results.count>=1) && url.facets.fullText.length===0)? getResultsStatisitcs():''">
        {{statisiticText}} <a v-bind:href="(this.store.lang === 'en')? 'https://correspsearch.net/en/FAQ.html#searchui' : 'https://correspsearch.net/de/FAQ.html#suchoberflaeche'" target="_blank"><font-awesome-icon :icon="['far', 'question-circle']" class="full-text-question-icon"/></a>
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex';


export default {
 computed: {
    ...mapState({
      store: state => state,
      facets: state => state.search.facets,
      search: state => state.search,
      results: state => state.results,
      url: state => state.url,
      statistics: state => state.statistics.totalFulltext
    })},
    data(){
        return{
        statisiticText: '',
    }},
    methods:{
        getResultsStatisitcs(){
            let num_full_text = 0
            for(let i = 0; i < this.facets.availableFullText.length; i+=1){
                if (this.facets.availableFullText[i].key_as_string === 'true'){
                    num_full_text = this.facets.availableFullText[i].doc_count
                }
            }
            
            return this.statisiticText = ( String(num_full_text) + this.store.labels.vals['search.resultsWithFullText.OutOf'] + String(this.results.count) +  this.store.labels.vals['search.resultsWithFullText']) 
        },
        getGlobalStatisitcs(){ 
          return this.statisiticText = (this.store.labels.vals['search.allLettersWithFullText'] + this.statistics + this.store.labels.vals['search.allLettersWithFullText.available'])
        }
    }
}
</script>

<style>

</style>