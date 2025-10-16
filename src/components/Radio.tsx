import { Field, Option } from '../type'
import { ChangeEventHandler } from 'react';

type Props = {
  item: Field;
  handleChange: ChangeEventHandler;
}

export default function Radio(props: Props) {
  const {item, handleChange} = props;

  return (
    item.options?.map((option: Option, index: number) =>
      <span key={index} className="nowrap">
        <label className="label--radio">
          <input
            type="radio"
            name={item.name}
            value={option.value}
            checked={item.value === option.value}
            onChange={handleChange}
          />
          {option.label}
        </label>
      </span>
    )
  )
}


