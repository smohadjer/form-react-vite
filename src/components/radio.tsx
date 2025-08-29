import { useState, useEffect} from 'react';
import { Field } from '../lib/type'

type Option = {
  label: string;
  value: string;
}

export default function Radio({item}: {item: Field}) {
  const [value, setValue] = useState(item.value);

  useEffect(() => {
    setValue(item.value)
  }, [item.value]);

  return (
    item.options?.map((option: Option, index: number) =>
      <span key={index} className="nowrap">
        <input
          type="radio"
          id={option.value}
          name={item.name}
          value={option.value}
          checked={value === option.value}
          onChange={() => setValue(option.value)}
        />
        <label
          className="label--radio"
          htmlFor={option.value}>
            {option.label}
        </label>
      </span>
    )
  )
}


