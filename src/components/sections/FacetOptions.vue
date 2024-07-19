<template>
    <!-- Options -->
    <b-list-group-item>
    <h3>{{header}} </h3>
    <b-form-checkbox
        v-bind:checked="url.facets.weekdays"
        value="true"
        class="mb-2"
        unchecked-value="false"
        v-on:change="setWeekdays"
    >
        {{ weekdaysLabel }}
    </b-form-checkbox>
    <b-form-checkbox
        v-bind:checked="url.facets.externalRefLinks"
        value="true"
        class="mb-2"
        unchecked-value="false"
        v-on:change="setExternalRefLinks"
    > 
        {{ linksLabel }}
    </b-form-checkbox>
    <b-form-checkbox
        v-bind:checked="url.facets.showDateAsText"
        value="true"
        class="mb-2"
        unchecked-value="false"
        v-on:change="setDateAsText"
    >
        <span title="Infotext">
        {{ originalDateLabel }}
        </span>
    </b-form-checkbox>
    <b-form-checkbox
        v-bind:checked="url.facets.showRDate"
        value="true"
        class="mb-2"
        unchecked-value="false"
        v-on:change="setRDate"
    >
        {{ receivingDateLabel }}
    </b-form-checkbox>
    <b-form-checkbox
        v-bind:checked="url.facets.showCmifInfo"
        value="true"
        class="mb-2"
        unchecked-value="false"
        v-on:change="setCmif"
    >
        {{ cmifInfoLabel }} 
    </b-form-checkbox>
    </b-list-group-item>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: {
        // heading: {
        //     type: undefined,
        //     required: true
        // }
    },
    data(){
        return {
            header: "",
            weekdaysLabel: "",
            linksLabel: "",
            originalDateLabel: "",
            receivingDateLabel: "",
            cmifInfoLabel: "",
        }
    },
    computed: {
      ...mapState({
        store: state => state,        
        facets: state => state.search.facets,
        collapsed: state => state.facets.collapsed,
        sort: state => state.facets.sort,
        url: state => state.url
        })
    },
    watch: {
        facets() {
            this.header = this.store.labels.vals['facetHeadings.displayOptions'];
            this.weekdaysLabel = this.store.labels.vals['facets.displayWeekdays'];
            this.linksLabel = this.store.labels.vals['facets.displayExternalRefLinks'];
            this.originalDateLabel = this.store.labels.vals['facets.displayDateAsText'];
            this.receivingDateLabel = this.store.labels.vals['facets.displayReceivingDate'];
            this.cmifInfoLabel = this.store.labels.vals['facets.displayCmifInfo'];
        }
    },
    methods: {
        // See description at store/index.js
        setExternalRefLinks() {
        this.$store.commit('setExternalRefLinks');
        },
        setDateAsText() {
        this.$store.commit('setDateAsText');
        },
        setRDate() {
        this.$store.commit('setRDate');
        },
        setCmif() {
        this.$store.commit('setCmifInfo');
        },
        setWeekdays(e) {
        this.$store.commit('updateWeekdays', e);
        }
    }
}
</script>

<style>

</style>