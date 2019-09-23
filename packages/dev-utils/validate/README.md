- ajv: [git 文档](https://github.com/epoberezkin/ajv#defining-custom-keywords)
- ajv: [Defining custom keywords](https://github.com/epoberezkin/ajv/blob/master/CUSTOM.md)
- ajv: [validation-errors](https://github.com/epoberezkin/ajv#validation-errors)

# export

## validate(schema, data, options)


## validate.compile(schema, options) => fn: validate(data)

如果验证不通过, 会抛出错误, 错误信息通过 error.message 描述

## options

### title


# validate core 真正运行验证的部分


## 自己新增 `keyword`

[详细查看](./KEYWORD.md)

同步验证 和 compiled keywords 定义了 errors 后, 放到 validation function 的 .errors 属性上.



# error message

validate 验证不通过会产生 errors list, 每个 error 会产生一个 message.


给个 error 的 message
```
${dataPath} ${keyword 相关的描述}
  -> ${schema 的 description}
```

最终的 message:

```

${title='Invalid config'}
- ${dataPath} ${keyword 相关的描述}
  -> ${schema 的 description}
...

```

