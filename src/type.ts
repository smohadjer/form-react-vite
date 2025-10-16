export type Option = {
    label: string;
    value: string;
}

export type Field = {
  type: string;
  name: string;
  value: string | string[];
  error?: string;
  hidden?: boolean;
  label: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: Option[];
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
  submitLabel?: string;
  resetLabel?: string;
}

export type ErrorType = {
  instancePath: string,
  message: string
  keyword: string;
  params: {
    missingProperty: string;
  }
}
