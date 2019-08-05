
## Visitor

## 结构

### es 模块的文件

es 模块的文件放在 `visitor/es` 下面: 

如: 
```js
import * as vi from 'visitor/es'


vi.replace(...)

// or
import replace from 'visitor/es/replace'
// or
import {replace} from 'visitor/es'
replace(...)
```

### commonjs 模块的文件

```js

import * as vi from 'visitor/lib'

vi.replace(...)

// or
import replace from 'visitor/lib/replace'
// or
import {replace} from 'visitor/lib'

replace(...)

```

## API

## `replace(obj, path, callback)`
访问复杂的json数据结构, 并修改值. 其理念是通过节点来访问数据结构的节点.

* obj : 要访问的数据结构
* path : 访问器, 数组 Array<function|string>
* modifier : 修过器, 函数

```js
//  假设有如下数据结构: 
[
  {a: [{b:11},{b:11}], id: 5},
  {a: [{b:22},{b:22}], id: 6},
  {a: [{b:33},{b:33}], id: 7},
]




```


## `get`
```js

```

## `set`


## `type`

