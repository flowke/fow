module.exports = class Block {

  constructor() {
    this.caches = {};

    this.addCaches([
      {name: 'import'},
      {name: 'code'},
    ]);

    this.beforeCallFns = [this.beforeGenCode]
    
  }

  import(str, position='code', nl = true) {
    this.addCode('import', str, position, nl);
  }

  code(str, position = 'code', nl = true) {
    this.addCode('code', str, position, nl);
  }

  addCaches(names){
    let l = Object.keys(this.caches).length;

    names.forEach((n,i) => {
      this.caches[n.name] = {
        name: n.name,
        indx: typeof n.indx === 'undefined' ? l + i : n.indx,
        codes: this.createCodeCache(),
        beforeCall: n.beforeCall
      }
    });
  }

  addCache(name){
    this.addCaches([name]);
  }

  createCodeCache(){
    return {
      pre: [],
      code: [],
      post: []
    }
  }

  addCode(name, str, position='code', newLine=true){
    if(newLine) str+= '\n';
    this.caches[name].codes[position].push(str);
  }

  addBeforeCall(fn){
    this.beforeCallFns.push(fn)
  }

  beforeGenCode(){

  }

  genCode() {
    this.beforeCallFns.forEach(fn=>fn.call(this,this));

    let codes = Object.values(this.caches).sort((a,b)=>a.indx-b.indx);

    return codes.reduce((accu, e)=>{

      if(e.beforeCall) e.beforeCall.call(this);

      let codes = e.codes;
      return accu + codes.pre.join('') + codes.code.join('') + codes.post.join('');
    }, '')
  }

}