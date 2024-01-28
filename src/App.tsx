import { useState, useEffect } from 'react'
import './App.css'
import Form from './components/form';
import Profile from './components/profile';
import { fetchJson } from './lib/lib';
import { UserData, FormDataInterface, Error } from './lib/definitions'

function App() {
  const [formData, setFormData] = useState<FormDataInterface>();
  const [userData, setUserData] = useState<UserData | null>();

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
    fetchJson('/json/form.json').then((result): void => {
      console.log('fetch from json only once', result);
      setFormData(result);
    });

    fetchJson('/api/profile').then((result): void => {
      console.log('fetch user data from db only once', result);
      setUserData(result[0]);
    });
  }, []);

  useEffect(() => {
    console.log('This effect runs every time userData state changes')
    removeErrors();
    updateFormData();
  }, [userData]);

  if (formData && userData) {
    return (
      <>
        <Form data={formData} updateFormData={updateFormDataErrors} updateState={setUserData} />
        <Profile data={userData} />
      </>
    )
  } else {
    return <p>Loading...</p>;
  }
}

export default App
