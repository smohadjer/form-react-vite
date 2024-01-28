
import { validateData, fetchJson } from './../lib/lib.js';
import Hint from './hint.js';
import Input from './input.js';
import Error from './error.js';
import { FormDataInterface } from './../lib/definitions'
import { FormEvent } from 'react';

export default function Form({data, updateFormData, updateState}: {
  data: FormDataInterface | null,
  updateFormData: Function,
  updateState: Function
}) {
  async function submitHandler(event: FormEvent) {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const postData = new FormData(target);
    const json = JSON.stringify(Object.fromEntries(postData));
    const schema: Object = await fetchJson('/json/schema.json');

    // client-side validation
    if (!validateData(Object.fromEntries(postData), schema, updateFormData)) {
      return;
    }

    fetch(data.action, {
      method: data.method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: json
    })
    .then((response) => response.json())
    .then(json => {
      json.error ? updateFormData(json.error) : updateState(json);
    }).catch(err =>
      console.warn('Something went wrong.', err)
    );
  }

  if (data) {
    return (
      <div className="form">
        <h2>Edit data in Database</h2>
        <div id="form">
          <form onSubmit={submitHandler}>
            {
              data.fields.map((item, index) =>
                item.hidden
                ? <input key={index} name={item.name} defaultValue={item.value} type="hidden" />
                :
                  <div className="row" key={index}>
                    <label>{item.label}: {item.required ? '*' : ''}</label>
                    <div>
                      <Hint text={item.hint} />
                      <Input item={item} />
                      <Error error={item.error} />
                    </div>
                  </div>
               )
            }
            <button>Submit</button>
          </form>
        </div>
      </div>
    )
  } else {
    return null;
  }
}
