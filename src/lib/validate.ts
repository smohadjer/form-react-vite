import Ajv from "ajv";
import ajvErrors from 'ajv-errors';

interface Schema extends Object {}
interface jsonData extends Object {}

export default function validate(json: jsonData, schema: Schema) {
  const ajv = new Ajv({
    coerceTypes: true,
    allErrors: true,
    strict: false
  });

  ajvErrors(ajv);

  const validator = ajv.compile(schema);
  const valid = validator(json);
  if (!valid) {
    return (validator.errors);
  }
}
