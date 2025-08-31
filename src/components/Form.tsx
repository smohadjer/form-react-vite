
import { useState, FormEvent, MouseEventHandler } from 'react'
import Hint from './Hint.js';
import Input from './Input.js';
import Select from './Select.js';
import Error from './Error.js';
import Radio  from './Radio.js';
import Checkbox from './Checkbox.js';
import { validateData } from '../lib/validate.js';
import { fetchJson } from '../lib/utils.js';
import { Field, ErrorType } from '../type.js';

type Props = {
  method: string;
  action: string;
  disableBrowserValidation: boolean;
  disableClientSideValidation: boolean;
  formData: Field[];
  setFormData: Function;
  resetHandler: MouseEventHandler;
}

type Option = {
  label: string;
  value: string;
}

export default function Form(props: Props) {
  const [disabled, setDisabled] = useState(false);
  const {
    method,
    action,
    disableBrowserValidation,
    disableClientSideValidation,
    formData,
    setFormData,
    resetHandler
  } = props;

  //add errors to form data
  const updateFormDataErrors = (errors: ErrorType[]) => {
    if (formData && formData.length) {
      const data = [...formData];
      errors.forEach(error => {
        console.log(error)
        let fieldName: string = '';
        if (error.instancePath.length > 0) {
          fieldName = error.instancePath.substring(1);
        } else {
          if (error.keyword === 'required') {
            fieldName = error.params.missingProperty
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
  }

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
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log(e.target.name, e.target.value, e.target.type);

    const updatedData = formData.map(item => {
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
          item.value = e.target.value;
        }
      }
      return item;
    })
    setFormData(updatedData);
  }

  async function submitHandler(event: FormEvent) {
    event.preventDefault();
    setDisabled(true);
    removeErrors();

    const target = event.target as HTMLFormElement;

    // Type definition: values can be string OR string[]
    const data: Record<string, string | string[]> = {};
    formData.forEach((item) => {
        if (item.value) {
          data[item.name] = item.value;
        }
    });

    const json = JSON.stringify(data);
    const schema = await fetchJson('/json/schema.json');

    const errorCallback = (errors: ErrorType[]) => {
      console.log(errors);
      updateFormDataErrors(errors);
      setDisabled(false);
    }

    // client-side validation
    if (!disableClientSideValidation) {
      if (!validateData(data, schema, errorCallback)) {
        return;
      }
    }

    console.log('submitting form...');

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
  }

  function getFields() {
    const fields = formData.map((item, index: number) => {
      switch (item.type) {
        case 'hidden':
          return <input key={index} name={item.name} defaultValue={item.value} type="hidden" />
          break;
        case 'radio':
          return (
            <div className="row" key={index}>
              <label>{item.label}: {item.required ? '*' : ''}</label>
              <div>
                <div>
                  <Radio item={item} handleChange={handleChange} />
                </div>
                <Error error={item.error} />
              </div>
            </div>
          )
          break;
        case 'checkbox':
          return (
            <div className="row" key={index}>
              <label>{item.label}: {item.required ? '*' : ''}</label>
              <div>
                <div>
                  {item.options?.map((option: Option, index: number) =>
                    <Checkbox
                      key={index}
                      name={item.name}
                      label={option.label}
                      checked={(item.value && item.value.length > 0) ? item.value.includes(option.value) : false}
                      value={option.value}
                      handleChange={handleChange}
                    />
                  )}
                </div>
                <Error error={item.error} />
              </div>
            </div>
          )
          break;
        case 'select':
          return (
            <div className="row {item.error && row-error}" key={index}>
              <label>{item.label}: {item.required ? '*' : ''}</label>
              <div>
                <Select
                  item={item}
                  handleChange={handleChange}
                />
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
  }

  return formData && (
    <form
      method={method}
      action={action}
      onSubmit={submitHandler}
      noValidate={disableBrowserValidation}>
      {getFields()}
      <div className="row">
        <div>
          <button disabled={disabled} type="submit">Submit</button>
          <button type="button" onClick={resetHandler}>Reset</button>
        </div>
      </div>
    </form>
  )
}
