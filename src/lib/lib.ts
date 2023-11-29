import validate from './validate.js';

interface Schema extends Object {}
interface jsonData extends Object {}

// client-side validation
export function validateData(jsonData: jsonData, schema: Schema, callback: Function) {
  let isValid = true;
  const result = validate(jsonData, schema);
  if (result && Array.isArray(result)) {
    isValid = false;
    callback(result);
  }
  return isValid;
}

export async function fetchJson(path: string) {
  const response = await fetch(path);
  const responseJson = await response.json();
  return responseJson;
}




