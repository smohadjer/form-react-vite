import { ChangeEventHandler } from 'react';

type Props = {
  label: string;
  value: string;
  checked: boolean;
  name: string;
  handleChange: ChangeEventHandler;
}

export default function Checkbox(props: Props) {
  const {name, value, label, checked, handleChange} = props;

  return (
      <span className="nowrap">
        <input
          type="checkbox"
          value={value}
          id={value}
          name={name}
          checked={checked}
          onChange={handleChange}
        />
        <label
          className="label--checkbox"
          htmlFor={value}>
            {label}
        </label>
      </span>
  )
}


