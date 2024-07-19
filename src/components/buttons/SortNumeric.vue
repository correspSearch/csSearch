<template>
    <font-awesome-icon
        v-bind:class="(sort[sortTarget].numeric.active) ? 'activeSorting' : 'sorting'"
        v-bind:icon="(sort[sortTarget].numeric.asc) ? 'sort-numeric-down' : 'sort-numeric-up'"
        v-on:click="sorting(sortTarget)"
    ></font-awesome-icon>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props:{
        sortTarget:{
            type: String,
            required: true
        },
        inputList:{
            type: Array,
            required: true
        }
    },
    data(){
        return{
            sortedList: [],
          }
    },
    computed: {
      ...mapState({
        store: state => state,
        collapsed: state => state.facets.collapsed,
        sort: state => state.facets.sort,
        url: state => state.url})
    },
    methods:{
        sorting(target) {
            this.sortedList = this.inputList
        // change sort.[target][type].asc to 'false' if sort.[target][type].active is 'true'
        if (this.sort[target].numeric.active) {
            this.sort[target].numeric.asc = !this.sort[target].numeric.asc;
        }
        // set sort to 'active'
        this.sort[target].numeric.active = true;
        // set none selected sort type to 'false'
        this.sort[target].alpha.active = false;
        {this.sortedList.sort((a, b) => {
            const keyA = a.count || a.doc_count;
            const keyB = b.count || b.doc_count;
            if (this.sort[target].numeric.asc) {
                if (keyA > keyB) return 1;
                if (keyA < keyB) return -1;
                if (keyA === keyB) return 0;
            } else {
                if (keyA > keyB) return -1;
                if (keyA < keyB) return 1;
                if (keyA === keyB) return 0;
            }
            return null;
        });
        }
        },
    }
}
</script>

<style>

</style>