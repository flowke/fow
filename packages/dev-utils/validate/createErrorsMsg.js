const getSchemaPart = (schema, path, parents, additionalPath) => {
  parents = parents || 0;
  path = path.split("/");
  path = path.slice(0, path.length - parents);
  if (additionalPath) {
    additionalPath = additionalPath.split("/");
    path = path.concat(additionalPath);
  }
  let schemaPart = schema;
  for (let i = 1; i < path.length; i++) {
    const inner = schemaPart[path[i]];
    if (inner) schemaPart = inner;
  }
  return schemaPart;
};

const getSchemaPartText = (schema, schemaPart, additionalPath) => {
  if (additionalPath) {
    for (let i = 0; i < additionalPath.length; i++) {
      const inner = schemaPart[additionalPath[i]];
      if (inner) schemaPart = inner;
    }
  }
  while (schemaPart.$ref) {
    schemaPart = getSchemaPart(schema, schemaPart.$ref);
  }
  let schemaText = formatSchema(schemaPart);

  console.log(schemaText,'fff', schemaPart);
  

  if (schemaPart.description) {
    schemaText += `\n-> ${schemaPart.description}`;
  }


  return schemaText;
};

const getSchemaPartDescription = (schema, schemaPart) => {
  while (schemaPart.$ref) {
    schemaPart = getSchemaPart(schema, schemaPart.$ref);
  }
  if (schemaPart.description) {
    return `\n-> ${schemaPart.description}`;
  }
  return "";
};

const SPECIFICITY = {
  type: 1,
  oneOf: 1,
  anyOf: 1,
  allOf: 1,
  additionalProperties: 2,
  enum: 1,
  instanceof: 1,
  required: 2,
  minimum: 2,
  uniqueItems: 2,
  minLength: 2,
  minItems: 2,
  minProperties: 2,
  absolutePath: 2
};

const filterMax = (array, fn) => {
  const max = array.reduce((max, item) => Math.max(max, fn(item)), 0);
  return array.filter(item => fn(item) === max);
};

const filterChildren = children => {
  children = filterMax(children, err =>
    err.dataPath ? err.dataPath.length : 0
  );
  children = filterMax(children, err => SPECIFICITY[err.keyword] || 2);
  return children;
};

const indent = (str, prefix, firstLine) => {
  if (firstLine) {
    return prefix + str.replace(/\n(?!$)/g, "\n" + prefix);
  } else {
    return str.replace(/\n(?!$)/g, `\n${prefix}`);
  }
};

function formatSchema(schema, prevSchemas) {
  prevSchemas = prevSchemas || [];

  const formatInnerSchema = (innerSchema, addSelf) => {
    if (!addSelf) {
      return formatSchema(
        innerSchema,
        prevSchemas
      );
    }
    if (prevSchemas.includes(innerSchema)) {
      return "(recursive)";
    }
    return formatSchema(
      innerSchema,
      prevSchemas.concat(schema)
    );
  };

  if (schema.type === "string") {
    if (schema.minLength === 1) {
      return "non-empty string";
    }
    if (schema.minLength > 1) {
      return `string (min length ${schema.minLength})`;
    }
    return "string";
  }
  if (schema.type === "boolean") {
    return "boolean";
  }
  if (schema.type === "number") {
    return "number";
  }
  if (schema.type === "object") {
    if (schema.properties) {
      const required = schema.required || [];
      return `object { ${Object.keys(schema.properties)
        .map(property => {
          if (!required.includes(property)) return property + "?";
          return property;
        })
        .concat(schema.additionalProperties ? ["…"] : [])
        .join(", ")} }`;
    }
    if (schema.additionalProperties) {
      return `object { <key>: ${formatInnerSchema(
        schema.additionalProperties
      )} }`;
    }
    return "object";
  }
  if (schema.type === "array") {
    return `[${formatInnerSchema(schema.items)}]`;
  }

  switch (schema.instanceof) {
    case "Function":
      return "function";
    case "RegExp":
      return "RegExp";
  }

  if (schema.enum) {
    return schema.enum.map(item => JSON.stringify(item)).join(" | ");
  }

  if (schema.$ref) {
    return formatInnerSchema(getSchemaPart(schema, schema.$ref), true);
  }
  if (schema.allOf) {
    return schema.allOf.map(formatInnerSchema).join(" & ");
  }
  if (schema.oneOf) {
    return schema.oneOf.map(formatInnerSchema).join(" | ");
  }
  if (schema.anyOf) {
    return schema.anyOf.map(formatInnerSchema).join(" | ");
  }
  return JSON.stringify(schema, null, 2);
}

function formatValidationError(err, schema) {
  const dataPath = `config${err.dataPath}`;
  if (err.keyword === "additionalProperties") {
    const baseMessage = `${dataPath} has an unknown property '${
      err.params.additionalProperty
      }'. These properties are valid:\n${getSchemaPartText(schema, err.parentSchema)}`;

    return baseMessage;
  } else if (err.keyword === "oneOf" || err.keyword === "anyOf") {
    if (err.children && err.children.length > 0) {
      if (err.schema.length === 1) {
        const lastChild = err.children[err.children.length - 1];
        const remainingChildren = err.children.slice(
          0,
          err.children.length - 1
        );
        return formatValidationError(
          Object.assign({}, lastChild, {
            children: remainingChildren,
            parentSchema: Object.assign(
              {},
              err.parentSchema,
              lastChild.parentSchema
            )
          })
        );
      }
      const children = filterChildren(err.children);
      if (children.length === 1) {
        return formatValidationError(
          children[0]
        );
      }
      return (
        `${dataPath} should be one of these:\n${getSchemaPartText(schema,
          err.parentSchema
        )}\n` +
        `Details:\n${children
          .map(
            err =>
              " * " +
              indent(
                formatValidationError(err),
                "   ",
                false
              )
          )
          .join("\n")}`
      );
    }
    return `${dataPath} should be one of these:\n${getSchemaPartText(schema,
      err.parentSchema
    )}`;
  } else if (err.keyword === "enum") {
    if (
      err.parentSchema &&
      err.parentSchema.enum &&
      err.parentSchema.enum.length === 1
    ) {
      return `${dataPath} should be ${getSchemaPartText(schema,err.parentSchema)}`;
    }
    return `${dataPath} should be one of these:\n${getSchemaPartText(schema,
      err.parentSchema
    )}`;
  } else if (err.keyword === "allOf") {
    return `${dataPath} should be:\n${getSchemaPartText(schema,err.parentSchema)}`;
  } else if (err.keyword === "type") {
    switch (err.params.type) {
      case "object":
        return `${dataPath} should be an object.${getSchemaPartDescription(schema,
          err.parentSchema
        )}`;
      case "string":
        return `${dataPath} should be a string.${getSchemaPartDescription(schema,
          err.parentSchema
        )}`;
      case "boolean":
        return `${dataPath} should be a boolean.${getSchemaPartDescription(schema,
          err.parentSchema
        )}`;
      case "number":
        return `${dataPath} should be a number.${getSchemaPartDescription(schema,
          err.parentSchema
        )}`;
      case "array":
        return `${dataPath} should be an array:\n${getSchemaPartText(
          err.parentSchema
        )}`;
    }
    return `${dataPath} should be ${err.params.type}:\n${getSchemaPartText(schema,
      err.parentSchema
    )}`;
  } else if (err.keyword === "instanceof") {
    return `${dataPath} should be an instance of ${getSchemaPartText(schema,
      err.parentSchema
    )}`;
  } else if (err.keyword === "required") {
    const missingProperty = err.params.missingProperty.replace(/^\./, "");
    return `${dataPath} misses the property '${missingProperty}'.\n${getSchemaPartText(schema,
      err.parentSchema,
      ["properties", missingProperty]
    )}`;
  } else if (err.keyword === "minimum") {
    return `${dataPath} ${err.message}.${getSchemaPartDescription(schema,
      err.parentSchema
    )}`;
  } else if (err.keyword === "uniqueItems") {
    return `${dataPath} should not contain the item '${
      err.data[err.params.i]
      }' twice.${getSchemaPartDescription(schema,err.parentSchema)}`;
  } else if (
    err.keyword === "minLength" ||
    err.keyword === "minItems" ||
    err.keyword === "minProperties"
  ) {
    if (err.params.limit === 1) {
      switch (err.keyword) {
        case "minLength":
          return `${dataPath} should be an non-empty string.${getSchemaPartDescription(schema,
            err.parentSchema
          )}`;
        case "minItems":
          return `${dataPath} should be an non-empty array.${getSchemaPartDescription(schema,
            err.parentSchema
          )}`;
        case "minProperties":
          return `${dataPath} should be an non-empty object.${getSchemaPartDescription(schema,
            err.parentSchema
          )}`;
      }
      return `${dataPath} should be not empty.${getSchemaPartDescription(schema,
        err.parentSchema
      )}`;
    } else {
      return `${dataPath} ${err.message}${getSchemaPartDescription(schema,
        err.parentSchema
      )}`;
    }
  } else if (err.keyword === "absolutePath") {
    const baseMessage = `${dataPath}: ${
      err.message
      }${getSchemaPartDescription(schema,err.parentSchema)}`;

    return baseMessage;
  } else {
    return `${dataPath} ${err.message} (${JSON.stringify(
      err,
      null,
      2
    )}).\n${getSchemaPartText(schema,err.parentSchema)}`;
  }
}

module.exports = function (errors, schema, title = 'Invalid config'){
  return title + '\n' + errors.map(err =>
    " - " +
    indent(
      formatValidationError(err, schema),
      "   ",
      false
  )).join("\n")
}
