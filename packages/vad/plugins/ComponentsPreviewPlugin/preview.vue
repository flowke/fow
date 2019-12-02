<template>
<div class='comp-preview'>

  <div class="menu">
    <template v-for="(item, indx) in menuList">
      <template v-if="!item.path" >
        <div :key="item.label">{{item.label}}</div>
        <div v-for="elt in item.children" :key="elt.path">
          <router-link class="subMenu"  :to="elt.path" >{{elt.label}}</router-link>
        </div>
        
      </template>
      <div v-else :key="indx">
        <router-link :to="item.path" >{{item.label}}</router-link>
      </div>
      
    </template>
    
  </div>
  <div class="content">
    <div v-if="showHint"> 在左边菜单中选择要预览的组件. </div>
    <router-view>
    </router-view>
  </div>
  <!-- <div class="controls">
    控制区
  </div> -->
</div>

</template>

<script>

export default {
  data: ()=>{
    return {
      menuList: [],
      showHint: false
    }
  },

  watch: {
    '$route' (to, from) {
      if(to.path==='/comp_preview/'){
        this.showHint = true;
      }else{
        this.showHint = false;
      }
      
    }
  },

  mounted(){

    if(this.$route.path==='/comp_preview/'){
      this.showHint = true;
    }

    if(this.$options.menuList){
      this.menuList = this.$options.menuList
    }

    
  }

}
</script>

<style lang="scss" scoped>
.comp-preview{
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: #fff;
  .menu{
    width: 300px;
    height: 100%;
    border-right: 1px solid #ccc;
    box-sizing: border-box;
    padding: 0 10px;
    overflow: auto;
    
    a{
      text-decoration: none;
    }

    .subMenu{
      padding-left: 20px;
    }
  }
  .content{
    position: absolute;
    top: 0;
    right: 0px;
    left: 300px;
    height: 100%;
    padding: 0 10px;
    
  }
  .controls{
    width: 300px;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    border-left: 1px solid #ccc;
    
    padding: 0 10px;
  }

}
</style>