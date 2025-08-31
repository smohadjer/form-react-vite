import { useState, useEffect } from 'react';
import { fetchJson } from '../lib/utils.js';

type Props = {
  userData: any;
  setUserData: Function;
};

export default function Profile(props: Props) {
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    fetchJson('/api/profile').then((result: any): void => {
      console.log('fetch user data from db only once', result);
      props.setUserData(result[0]);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="callout">
      <h2>Log of data in database</h2>
      { loading
        ? <code>Loading...</code>
        : <code>{JSON.stringify(props.userData)}</code>
      }
      <button onClick={fetchData}>Fetch data from DB again</button>
    </div>
  )
}
