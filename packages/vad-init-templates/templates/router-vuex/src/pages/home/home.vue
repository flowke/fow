
<template>
  <div>
    home page here!
    <div>store state name: {{storeState.name}}</div>
    <div>store state module common name: {{storeState.common.name}}</div>
    <div>store state module home name: {{storeState.home.name}}</div>
  </div>
</template>


<script>
export default {
  data: function(){
    return {
      tha: 'yes'
    }
  },

  computed: {
    storeState(){
      return this.$store.state
    }
  }
}
</script>
