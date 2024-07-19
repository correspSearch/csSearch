<template>
    <!-- Facet: Availability -->
    <b-list-group-item>
    <h3
        v-bind:class="(facets.availability.length === 0) ? 'disabled' : ''"
    >
        <b-link
        v-bind:disabled="facets.availability.length === 0"
        v-bind:aria-expanded="collapsed.availability ? 'true' : 'false'"
        aria-controls="availabilityCollapse"
        v-on:click="collapsed.availability = !collapsed.availability"
        >
        <font-awesome-icon
            v-bind:icon="'chevron-' + ((!collapsed.availability ||
            facets.availability.length === 0) ? 'right' : 'down')"
            class="mr-1"
        />
        </b-link> {{ store.labels.vals['facetHeadings.availability'] }}
    </h3>
    <b-collapse
        v-if="facets.availability.length > 0"
        id="availabilityCollapse"
        v-model="collapsed.availability"
    >
        <b-list-group flush>
        <b-list-group-item
            v-for="(av, i) in facets.availability"
            v-bind:key="i"
            class="facetList"
            v-bind:class="(url.facets.availability.includes(av.key)) ? 'facetActive' : ''"
        >
            <b-row class="p-0 m-0">
            <b-col
                cols="8"
                class="p-0"
            >
                <b-link
                v-if="av.key !== undefined"
                v-bind:id="'availabilityLink' + i"
                v-on:click="$parent.setFacet(av.key, 'a')"
                >
                {{ store.labels.vals[`form.availability.${av.key}`] }}
                </b-link> ({{ av.doc_count }})
            </b-col>
            <b-col
                cols="4"
                class="p-0"
            >
                <font-awesome-icon
                v-if="av.key !== undefined && !url.facets.availability.includes(av.key)"
                icon="plus-circle"
                class="mt-1 float-right ml-1 facet-icons"
                v-on:click="$parent.setFacet(av.key, 'a')"
                />
                <font-awesome-icon
                v-if="av.key !== undefined && url.facets.availability.includes(av.key)"
                icon="times-circle"
                class="mt-1 float-right ml-1 facet-icons"
                v-on:click="$parent.removeFacet(av.key, 'a')"
                />
                <font-awesome-icon
                v-if="av.key !== undefined && !url.facets.availability.includes(av.key)"
                icon="minus-circle"
                class="mt-1 float-right ml-1 facet-icons"
                v-on:click="$parent.exceptFacet(av.key, 'a')"
                />
            </b-col>
            </b-row>
        </b-list-group-item>
        </b-list-group>
    </b-collapse>
    </b-list-group-item>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
      ...mapState({
        store: state => state,
        collapsed: state => state.facets.collapsed,
        sort: state => state.facets.sort,
        url: state => state.url,
        facets: state => state.search.facets})
    }
}
</script>

<style>

</style>