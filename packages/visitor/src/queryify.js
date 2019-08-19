
export default function ify(data){
  if(!data || typeof data !== 'object') return '';
  ify.detail = f=>f;

  let arr = [];

  try {
    for (const key in data) {
      let val = JSON.stringify(data[key]);
      arr.push(`${key}=${val}`);
    }
    return arr.join('&')
  } catch (error) {
    ify.detail = function(){
      ify.detail = f=>f
      return error
    }
    return ''
  }
}