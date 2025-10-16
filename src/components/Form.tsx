
import { useState, useEffect, FormEvent } from 'react'
import Hint from './Hint.js';
import Input from './Input.js';
import Select from './Select.js';
import Error from './Error.js';
import Radio  from './Radio.js';
import Checkbox from './Checkbox.js';
import { validateData } from '../lib/validate.js';
import { fetchJson } from '../lib/utils.js';
import {
  Field,
  ErrorType,
  FormAttributes,
} from '../type.js';

type Props = {
  pathSchema?: string;
  path: string;
  data?: {[key: string]: string;};
  initialData: Field[];
  formAttributes: FormAttributes;
}

export default function Form(props: Props) {
  const { data, pathSchema, initialData, formAttributes } = props;
  const [formData, setFormData] = useState<Field[]>(initialData);
  const [disabled, setDisabled] = useState(false);
  const errorCallback = (errors: ErrorType[]) => {
    console.log(errors);
    updateFormDataErrors(errors);
    setDisabled(false);
  };
  const updateFormDataErrors = (errors: ErrorType[]) => {
    console.log('updateForm data errors')
    if (formData && formData.length) {
      const data = [...formData];
      errors.forEach(error => {
        console.log(error)
        let fieldName: string = '';
        if (error.instancePath.length > 0) {
          fieldName = error.instancePath.substring(1);
        } else {
          if (error.keyword === 'required') {
            fieldName = error.params.missingProperty;
            error.message = 'This is a required field.';
          }
        }
        data.map(field => {
          if (field.name === fieldName) {
            return field.error = error.message;
          }
        });
      });

      setFormData(data);
    }
  };
  const removeErrors = () => {
    if (formData && formData.length) {
      const data = [...formData];
      data.map(field => field.error = "");
      // data.map(field => {
      //   if (field.hasOwnProperty('error')) {
      //     delete field.error;
      //     return field;
      //   }
      // });
      setFormData(data);
    }
  };
  const resetHandler = () => {
    const clonedFields = structuredClone(initialData);
    setFormData(clonedFields);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      console.log('handleChange', e.target.name, e.target.value, e.target.type);
      const updatedData = formData?.map(item => {
        if (item.name === e.target.name) {
            if (Array.isArray(item.value)) {
                if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
                    if (e.target.checked) {
                        item.value = [...item.value, e.target.value];
                    } else {
                        item.value = item.value.filter(arrItem => arrItem !== e.target.value);
                    }
                }
            } else {
                if (e.target.type === "checkbox") {
                    item.value = e.target.checked ? e.target.value : '';
                } else {
                    item.value = e.target.value;
                }
            }
        }
        return item;
      });
      setFormData(updatedData);
  };
  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();
    setDisabled(true);
    removeErrors();

    const target = event.target as HTMLFormElement;

    // Type definition: values can be string OR string[]
    const data: Record<string, string | string[]> = {};
    formData?.forEach((item) => {
        if (item.value) {
          data[item.name] = item.value;
        }
    });
    const json = JSON.stringify(data);

    // client-side validation
    if (pathSchema && !formAttributes?.disableClientSideValidation) {
      const schema = await fetchJson(pathSchema);
      if (!validateData(data, schema, errorCallback)) {
        return;
      }
    }

    console.log('submitting form after validation...');

    fetch(target.action, {
      method: target.method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: json
    })
    .then((response) => response.json())
    .then(json => {
      setDisabled(false);
      if (json.error) {
        console.error(json.error);
        updateFormDataErrors(json.error);
      } else {
        console.log('form data saved in db');
      }
    }).catch(err =>
      console.warn('Something went wrong.', err)
    );
  };
  const getFields = () => {
    const fields = formData?.map((item, index: number) => {
      switch (item.type) {
        case 'hidden':
          return <input type="hidden" key={index} name={item.name} value={item.value} />
          break;
        case 'select':
        case 'checkbox':
        case 'radio':
          return (
            <div className="row" key={index}>
              <label>{item.label}: {item.required ? '*' : ''}</label>
              <div>
                <Hint text={item.hint} />
                <div>
                  {item.type === 'radio'
                    ? <Radio item={item} handleChange={handleChange} />
                    : (item.type === 'checkbox')
                      ? <Checkbox item={item} handleChange={handleChange} />
                      : <Select item={item} handleChange={handleChange} />
                  }
                </div>
                <Error error={item.error} />
              </div>
            </div>
          )
          break;
        default:
          return (
            <div className="row" key={index}>
              <label>{item.label}: {item.required ? '*' : ''}</label>
              <div>
                <Hint text={item.hint} />
                <Input item={item} handleChange={handleChange} />
                <Error error={item.error} />
              </div>
            </div>
          )
      }
    });
    return fields;
  };

  useEffect(() => {
    if (formData && data) {
      const clonedFields = structuredClone(initialData);
      clonedFields.map(item => {
        const valueFromDB = data[item.name];
        if (valueFromDB) {
            item.value = valueFromDB;
        }
        return item;
      });
      setFormData(clonedFields);
    }
  }, [data]);

  return (
    <form
      method={formAttributes.method}
      action={formAttributes.action}
      onSubmit={submitHandler}
      noValidate={formAttributes.disableBrowserValidation}>

      {getFields()}
      <div className="row">
        <div>
          <button disabled={disabled} type="submit">{formAttributes.submitLabel}</button>
          {formAttributes.resetLabel &&
            <button type="button" onClick={resetHandler}>{formAttributes.resetLabel}</button>
          }
        </div>
      </div>
    </form>
  )
}
