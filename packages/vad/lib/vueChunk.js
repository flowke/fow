const Chunk = require('@fow/dev-utils/chunkBlock');


module.exports = class VueChunk extends Chunk{
  constructor(){
    super();

    this.name = '';
    this.emitPath = '';
    this.htmlTemplatePath = '';
    this.htmlName = '';


    this.vueOptions = {
      el: '"#root"'
    }

    this.renderComp = {
      name: '',
      path: ''
    }

    this.newVmCode = this.createVMCode();
  }

  // 设置要渲染的组件名字, 
  setRenderComp(componentName, path='' ){
    this.renderComp = {
      name: componentName,
      path: path
    }
  }

  // 设置 实例化 vm 的代码
  setNewVmCode(createCodeFn){
    this.newVmCode = createCodeFn(this.createVMCode())
  }

  // 设置值 vue options 的 key: value 
  vueOption(key, value){
    this.vueOptions[key] = value;
  }

  // 获得创建 vm 的 code
  createVMCode(){
    return '__createVM()'
  }



  beforeGenCode(){
    let vueOpCode = Object.entries(this.vueOptions).map(e=>`    ${e[0]}:${e[1]},`);

    let {
      name, path
    } = this.renderComp;

    // if(!name) throw new Error('No component name to render');

    this.import('import Vue from "vue/dist/vue.runtime.esm";');
    this.code(this.newVmCode, 'post')

    if(path && name){
      this.import(`import ${name} from ${JSON.stringify(path)};`)
    }

    let renderCode = '';
    if(!name){
      renderCode = `h=>(<div>No render component file !! make sure you have <strong>src/App.vue</strong></div>)`;
    }else{
      renderCode = `h=>(<${name}></${name}>)`;
    }

    this.code([
      'function __createVM(){',
      '  return new Vue({',
         ...vueOpCode,
      `  render: ${renderCode},`,
      '  })',
      '}\n',
    ].join('\n'))
  }
}