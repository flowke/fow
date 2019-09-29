// resolve object's values, keys
export default function toArr(obj) {
  return new Value().generate(obj)
}

class Value {
  constructor(){

    this.keys = [];
    this.values = [];
    this.entries = [];
  }

  generate(obj={}){
    for (const key in obj) {
      const elt = obj[key];
      this.keys.push(key);
      this.values.push(elt);
      this.arr.push([key, elt]);
    }
    return this;
  }

  forEach(fn, type ='entries'){
    let arr = this[type]
    for (let index = 0; index < arr.length; index++) {
      const e = arr[index];
      if (fn(e[0], e[1], i) === false) return false;
    }
    return true

  }

  reduce(fn, init, type = 'entries'){
    this[type].reduce((accu,e,i)=>{
      return fn(accu, e[0], e[1], i)
    },init)
  }
}