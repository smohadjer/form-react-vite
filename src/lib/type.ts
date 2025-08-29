export type UserData = {
  _id: string;
  firstname: string;
  lastname: string;
  age: string;
  role: string;
  agree: string;
  gender: string;
}

export type Field = {
  type: 'hidden' | 'input' | 'select' | 'radio' | 'checkbox';
  name: '_id' | 'firstname' | 'lastname' | 'age' | 'gender' | 'role' | 'agree';
  value: string | string[];
  error?: string;
  hidden?: boolean;
  label: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: any[];
}

export type FormDataInterface = {
  form: FormAttributes;
  fields: Field[]
}

export type FormAttributes = {
  method: string;
  action: string;
  disableBrowserValidation: boolean;
  disableClientSideValidation: boolean;
}

export type ErrorType = {
  instancePath: string,
  message: string
  keyword: string;
  params: {
    missingProperty: string;
  }
}
