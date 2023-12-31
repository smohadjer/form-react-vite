export interface UserData extends Object {
  _id: string,
  firstname: string,
  lastname?: string,
  age?: string
}

export enum DataFields {
  _id = '_id',
  firstname ='firstname',
  lastname = 'lastname',
  age = 'age'
}

export type Fields = {
  name: DataFields,
  value?: string,
  error?: string,
  hidden?: boolean,
  label: string,
  required?: boolean,
  placeholder?: string,
  hint?: string
}

export interface FormDataInterface {
  method: 'POST' | 'GET',
  action: string,
  fields: Array<Fields>,

}

export interface Error {
  instancePath: string,
  message: string
}
