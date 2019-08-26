
<template>
  <div>
     <div>welcome to tha tha, {{storeState.name}}!</div>
    <div>My module name is {{storeState.home.name}}</div>
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
