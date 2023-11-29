import { useState, useEffect } from 'react'
import './App.css'
import Form from './components/form';
import Profile from './components/profile';
import { fetchJson } from './lib/lib';
import { UserData, FormDataInt, Error } from './lib/definitions'

function App() {
  const [formData, setFormData] = useState<FormDataInt | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  // add value from database to form fields
  const updateFormData = () => {
    if (formData && formData.fields.length) {
      const data = {...formData};
      data.fields.map(field => {
        if (userData && userData.hasOwnProperty(field.name)) {
          return field.value = userData[field.name];
        }
      });
      setFormData(data);
    }
  }

  const removeErrors = () => {
    if (formData && formData.fields.length) {
      const data = {...formData};
      data.fields.map(field => {
        if (field.hasOwnProperty('error')) {
          delete field.error;
          return field;
        }
      });
      setFormData(data);
    }
  }

  // add errors to form data
  const updateFormDataErrors = (errors: Array<Error>) => {
    if (formData && formData.fields.length) {
      const data = {...formData};
      errors.forEach(error => {
        const fieldname = error.instancePath.substring(1);
        data.fields.map(field => {
          if (field.name === fieldname) {
            return field.error = error.message;
          }
        });
      });
      setFormData(data);
    }
  }

  useEffect(() => {
    fetchJson('/json/form.json').then((result) => {
      console.log('fetch from json only once');
      setFormData(result);
    });

    fetchJson('/api/profile').then((result) => {
      console.log('fetch user data from db only once');
      setUserData(result[0]);
    });
  }, []);

  useEffect(() => {
    console.log('This effect runs every time userData state changes')
    removeErrors();
    updateFormData();
  }, [userData]);

  return (
    <>
      <Form data={formData} updateFormData={updateFormDataErrors} updateState={setUserData} />
      <Profile data={userData} />
    </>
  )
}

export default App
