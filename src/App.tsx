import { useState, useEffect, useRef } from 'react'
import './App.css'
import Form from './components/form';
import Profile from './components/profile';
import { fetchJson } from './lib/lib';
import { UserData, FormAttributes, FormDataInterface, ErrorType, Field } from './lib/type'

export default function App() {
  const [userData, setUserData] = useState<UserData>();
  const [formData, setFormData] = useState<Field[]>();
  const [formAttributes, setFormAttributes] = useState<FormAttributes>();
  const initialData = useRef<Field[]>([]);

  console.log('formData', formData);

  useEffect(() => {
    fetchJson('/json/form.json').then((result: FormDataInterface): void => {
      const clonedFields = structuredClone(result.fields);
      initialData.current = clonedFields;
      setFormData(result.fields);
      setFormAttributes(result.form);
    });
  }, []);

  useEffect(() => {
    //removeErrors();
  }, [userData]);

  // const removeErrors = () => {
  //   if (formData && formData.fields.length) {
  //     const data = {...formData};
  //     data.fields.map(field => {
  //       if (field.hasOwnProperty('error')) {
  //         delete field.error;
  //         return field;
  //       }
  //     });
  //     setFormData(data);
  //   }
  // }

  function populateHandler() {
    if (userData) {
      const clonedFields = structuredClone(initialData.current);
      clonedFields.map(item => {
        const valueFromDB = userData[item.name];
        console.log(item.name, valueFromDB);
        if (valueFromDB) {
           item.value = valueFromDB;
        }
        return item;
      });
      setFormData(clonedFields);
    }
  }

  function resetHandler() {
    console.log('initial data:', initialData.current);
    const clonedFields = structuredClone(initialData.current);
    setFormData(clonedFields);
  }

  return (
    (formAttributes && formData) ? (
      <>
        <div>
          <Form
            method={formAttributes.method}
            action={formAttributes.action}
            formData={formData}
            setFormData={setFormData}
            resetHandler={resetHandler}
          />
          <br />
          <button type="button" onClick={populateHandler}>Populate form with data from DB</button>
        </div>
        <Profile userData={userData} setUserData={setUserData} />
      </>
    ) : (
      <p>Loading...</p>
    )
  )
}
