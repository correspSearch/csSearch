<template>
    <font-awesome-icon
        v-bind:class="(sort[sortTarget].alpha.active) ? 'activeSorting' : 'sorting'"
        v-bind:icon="(sort[sortTarget].alpha.asc) ? 'sort-alpha-down' : 'sort-alpha-up'"
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
        if (this.sort[target].alpha.active) {
            this.sort[target].alpha.asc = !this.sort[target].alpha.asc;
        }
        // set sort to 'active'
        this.sort[target].alpha.active = true;
        // set none selected sort type to 'false'
        this.sort[target].numeric.active = false;
        // sort depending on type and number of results (extended/not extended)
        {this.sortedList.sort((a, b) => {
            const keyA = a.name || a.key;
            const keyB = b.name || b.key;
            if (this.sort[target].alpha.asc) {
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