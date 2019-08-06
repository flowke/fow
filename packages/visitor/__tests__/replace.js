import {replace} from '../src/index';

function createArr() {
  return [{ b: [{ a: 1, b: 2, c: { a: 1, b: 2 } }], id: 12 }, { b: [{ a: 5, b: 9, c: { a: 1, b: 2 } }], id: 44 }, { b: [{ a: 33, b: 55, c: { a: 1, b: 2 } }], id: 43 }]
}

describe('replace', () => {

  test('to object ', () => {
    let arr = createArr()
    let out1 = replace(arr, [elt => elt.id === 12, 'b', elt => elt.a === 1], val => {
      val.a = 10;
      return val
    });
    expect(out1).toEqual([{ b: [{ a: 10, b: 2, c: { a: 1, b: 2 } }], id: 12 }, { b: [{ a: 5, b: 9, c: { a: 1, b: 2 } }], id: 44 }, { b: [{ a: 33, b: 55, c: { a: 1, b: 2 } }], id: 43 }]);
  })

  test('to property', () => {

    let arr = createArr()
    let out1 = replace(arr, [elt => (elt.id === 12 || elt.id == 43), 'b', elt => elt.a === 1 || elt.a === 33, 'b'], val => {
      return 'acs'
    });
    expect(out1).toEqual([{ b: [{ a: 1, b: 'acs', c: { a: 1, b: 2 } }], id: 12 }, { b: [{ a: 5, b: 9, c: { a: 1, b: 2 } }], id: 44 }, { b: [{ a: 33, b: 'acs', c: { a: 1, b: 2 } }], id: 43 }]);
  })

  test('no property', () => {

    let arr = createArr()
    let out1 = replace(arr, [elt => elt.id === 12, 'b', elt => elt.a === 1, 'b.c'], val => {
      return 'acs'
    });
    expect(out1).toEqual(arr);

    let out2 = replace(arr, ['b.c.s'], val => {
      return 'acs'
    });

    expect(out2).toEqual(arr);
  })
})
