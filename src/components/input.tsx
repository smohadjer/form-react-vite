import { Field } from '../lib/type';
import { ChangeEventHandler, useState } from 'react';

type Props = {
  handleChange: ChangeEventHandler;
  item: Field;
}

export default function Input(props: Props) {
  const { item, handleChange } = props;

  return (
    <input
      className={item.error ? "error" : ""}
      name={item.name}
      value={item.value}
      onChange={handleChange}
      placeholder={item.placeholder}
      required={item.required}
    />
  )
}


