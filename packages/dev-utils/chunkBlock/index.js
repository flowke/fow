module.exports = class Blocks {

  constructor() {
    this.blocks = {};

    this.addBlocks([
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

  // 遗留
  addCaches(nameObjs){
    this.addBlocks(nameObjs)
  }

  addBlocks(nameObjs){
    let l = Object.keys(this.blocks).length;

    let indx = 0;

    nameObjs.forEach((n,i) => {
      if (typeof n.indx !== 'undefined' && typeof n.indx === 'number' && !isNaN(n.indx)) {
        indx = n.indx;
      }
      this.blocks[n.name] = {
        name: n.name,
        indx: indx,
        codes: this.createCodeCache(),
        beforeCall: n.beforeCall
      }
    });
  }
  // 遗留
  addCache(nameObj){
    this.addBlock(nameObj)
  }

  addBlock(nameObj){
    this.addBlocks([nameObj]);
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
    this.blocks[name].codes[position].push(str);
  }

  addBeforeCall(fn){
    this.beforeCallFns.push(fn)
  }

  beforeGenCode(){

  }

  genCode() {
    this.beforeCallFns.forEach(fn=>fn.call(this,this));

    let codes = Object.values(this.blocks).sort((a,b)=>a.indx-b.indx);

    return codes.reduce((accu, e)=>{

      if(e.beforeCall) e.beforeCall.call(this);

      let codes = e.codes;
      return accu + codes.pre.join('') + codes.code.join('') + codes.post.join('');
    }, '')
  }

}