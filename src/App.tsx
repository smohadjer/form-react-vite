import { useState } from 'react';
import Form from './components/Form.js';
import Profile from './components/Profile.js';
import { fetchJson } from './lib/utils.js';
import formJson from '../public/json/form.json';
import './app.css'

export default function App() {
  const [userData, setUserData] = useState<{[key: string]: string}>();
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    fetchJson('/api/profile').then((result: any): void => {
      console.log('fetch user data from db only once', result);
      setUserData(result[0]);
      setLoading(false);
    });
  };

  return (
    <>
      <div className="callout">
        <button type="button" onClick={() => {fetchData()}}>
          Populate form with data from DB
        </button>
        <span>{loading ? 'Loading...' : ''}</span>
        <Form
          pathSchema='/json/schema.json'
          path='/json/form.json'
          data={userData}
          initialData={formJson.fields}
          formAttributes={formJson.form}
        />
      </div>
      <Profile data={userData} loading={loading} />
    </>
  )
}
