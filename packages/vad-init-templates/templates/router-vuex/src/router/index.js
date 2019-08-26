

export default {
  routes: [
    { 
      path: '', 
      component: '@layout.base' ,
      children: [
        {
          path: '',
          component: '@pages.home/home'
        }
      ]
    },
  ]
}