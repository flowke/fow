// resolve object's values, keys
export default function toArr(obj, generate=true) {
  let v = new Value(obj)
  if (generate) v.generate()
  return v
}

class Value {
  constructor(obj={}){
    this.__rowValue = obj;
    this.__hasGenerate = false;
    this.keys = [];
    this.values = [];
    this.entries = [];
  }

  get(){
    if (!this.__hasGenerate) this.generate();
    return this;
  }

  generate(fn){

    eachObj(this.__rowValue, (key, value, i)=>{
      this.keys.push(key);
      this.values.push(value);
      this.arr.push([key, value]);
      fn && fn(key, value, i);
    })

    this.__hasGenerate = true;
    return this;
  }

  forEach(fn){
    let result = true;
    if (this.__hasGenerate){
        retult = eachArr(this.entries, (e,i)=>{
        return fn(e[0], e[1], i)
      })
    }else{
      let hasFalse = false;
      this.generate((key, elt, i)=>{
        if (hasFalse) result = false;
        hasFalse = fn(key, elt,i);
      })
    }

    return result
  }

  reduce(fn, init){

    if (!this.__hasGenerate){
      let value = init;
      this.generate((key, val,i)=>{
        value = fn(key, val, i)
      });
      return value
    }else{
      return this.entries.reduce((accu, e, i) => {
        return fn(accu, e[0], e[1], i)
      }, init)
    }
    
  }
}


function eachObj(obj,fn){
  let i = 0;
  for(let key in obj ){
    let rut = fn(key, obj[key], i);
    if(rut===false) return false;
    i++;
  }
  return true;
}

function eachArr(arr, fn){
  for (let index = 0; index < arr.length; index++) {
    const e = arr[index];
    if (fn(e, i) === false) return false;
  }
  return true
}