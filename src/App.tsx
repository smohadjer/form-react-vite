import { useState, useEffect, useRef } from 'react'
import Form from './components/Form.js';
import Profile from './components/Profile.js';
import { fetchJson } from './lib/utils.js';
import { UserData, FormAttributes, FormDataInterface, Field } from './type.js'
import './app.css'

export default function App() {
  const [userData, setUserData] = useState<UserData>();
  const [formData, setFormData] = useState<Field[]>();
  const [formAttributes, setFormAttributes] = useState<FormAttributes>();
  const initialData = useRef<Field[]>([]);

  useEffect(() => {
    fetchJson('/json/form.json').then((result: FormDataInterface): void => {
      const clonedFields = structuredClone(result.fields);
      initialData.current = clonedFields;
      setFormData(result.fields);
      setFormAttributes(result.form);
    });
  }, []);

  function populateHandler() {
    if (userData) {
      const clonedFields = structuredClone(initialData.current);
      clonedFields.map(item => {
        const valueFromDB = userData[item.name];
        if (valueFromDB) {
           item.value = valueFromDB;
        }
        return item;
      });
      setFormData(clonedFields);
    }
  }

  function resetHandler() {
    const clonedFields = structuredClone(initialData.current);
    setFormData(clonedFields);
  }

  return (
    (formAttributes && formData) ? (
      <>
        <div className="callout">
          <button type="button" onClick={populateHandler}>
            Populate form with data from DB
          </button>
          <Form
            method={formAttributes.method}
            action={formAttributes.action}
            disableBrowserValidation={formAttributes.disableBrowserValidation}
            disableClientSideValidation={formAttributes.disableClientSideValidation}
            formData={formData}
            setFormData={setFormData}
            resetHandler={resetHandler} />
        </div>
        <Profile userData={userData} setUserData={setUserData} />
      </>
    ) : (
      <p>Loading...</p>
    )
  )
}
