<template>
    <font-awesome-icon icon="arrow-circle-right" class="facet-search "
    v-on:click="toggleInputField()"
    v-bind:class="{active: isActive}"/> <!--v-bind:class="(sort[sortTarget].alpha.active) ? 'activeSorting' : 'sorting'"-->
    
</template>

<script>
import { mapState } from 'vuex';
export default {
 data () {
    return {
      searchString: '',
      isActive: false
    }
  },
  computed: {
    ...mapState({
      store: state => state,
      })
  },
  methods:{
    toggleInputField(){
        this.isActive = !this.isActive;
    }
  }
}
</script>

<style>

</style>