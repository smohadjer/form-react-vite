import { UserData } from '../type.js'

type Props = {
  loading: boolean;
  data: UserData | undefined;
};

export default function Profile(props: Props) {
  return (
    <div className="callout">
      <h2>Log of data in database</h2>
      {props.loading
        ? <code>Loading...</code>
        : <code>{JSON.stringify(props.data)}</code>
      }
    </div>
  )
}
