import { useState, useEffect } from 'react';
import Form from './components/Form.js';
import Profile from './components/Profile.js';
import { UserData } from './type.js'
import { fetchJson } from './lib/utils.js';
import './app.css'

export default function App() {
  const [userData, setUserData] = useState<UserData>();
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    fetchJson('/api/profile').then((result: any): void => {
      console.log('fetch user data from db only once', result);
      setUserData(result[0]);
      setLoading(false);
    });
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <>
      <div className="callout">
        <button type="button" onClick={() => {fetchData()}}>
          Populate form with data from DB
        </button>
        <span>{loading ? 'Loading...' : ''}</span>
        <Form
          path='/json/form.json'
          data={userData}
        />
      </div>
      <Profile data={userData} loading={loading} />
    </>
  )
}
