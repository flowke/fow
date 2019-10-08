# Runner Hooks

## patchSchema: [patchFn(schema)]

patch option 的 schema.

addfn(schema);

schema 会填充到以下位置:

```js
{
  ...其它默认 schema,
  properties: {
    ... 其它默认 schema,
    ... addFn 传入的 schema
  }
}
```

不能与已经存在的配置项冲突, 否则此次 addSchema 失败, addFn 返回 `{error:error}`,