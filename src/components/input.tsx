import { Fields } from './../lib/definitions'

export default function Input({item}: {item: Fields}) {
  return (
    <input
      className={item.error ? "error" : ""}
      name={item.name}
      defaultValue={item.value}
      placeholder={item.placeholder}
    />
  )
}


