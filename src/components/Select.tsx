import { Field } from '../type'
import { ChangeEventHandler } from 'react';

type Option = {
  label: string;
  value: string;
}

type Props = {
  item: Field;
  handleChange: ChangeEventHandler
}
export default function Select(props: Props) {
  const { item } = props;
  return (
    <select
      value={item.value}
      onChange={props.handleChange}
      className={item.error ? "error" : ""}
      name={item.name}
      required={item.required}>
        <option value="">{item.hint}</option>
        {item.options?.map((option: Option, index: number) =>
          <option
            key={index}
            value={option.value}>
            {option.label}
          </option>
        )}
    </select>
  )
}
