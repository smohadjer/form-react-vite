import { UserData } from './../lib/definitions'

export default function Profile({data}: {data: UserData | null}) {
  return (
    <div className="profile">
      <h2>Database</h2>
      <p>Log of data in database:</p>
      <div id="profile">
        <code>{JSON.stringify(data)}</code>
      </div>
    </div>
  )
}
