import { fetchJson } from '../lib/lib';
import { useState, useEffect } from 'react';

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
    <div className="profile">
      <h2>Database</h2>
      <p>Log of data in database:</p>
      <div id="profile">
        { loading
          ? <code>Loading...</code>
          : <code>{JSON.stringify(props.userData)}</code>
        }
      </div>
      <br />
      <button onClick={fetchData}>Fetch data from DB</button>
    </div>
  )
}
