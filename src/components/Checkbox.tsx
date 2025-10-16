import { ChangeEventHandler } from 'react';
import { Field, Option } from '../type'

type Props = {
  item: Field;
  handleChange: ChangeEventHandler;
}

export default function Checkbox(props: Props) {
  const {item, handleChange} = props;
  const isChecked = (item: Field, option: Option) => {
      if (Array.isArray(item.value)) {
          return item.value.includes(option.value);
      } else {
          return (item.value === option.value) ? true : false;
      }
  };

  return (
    item.options?.map((option: Option, index: number) =>
      <span key={index} className="nowrap">
        <label className="label--checkbox">
          <input
            type="checkbox"
            name={item.name}
            value={option.value}
            checked={isChecked(item, option)}
            onChange={handleChange}
          />
          {option.label}
        </label>
      </span>
    )
  )
}


