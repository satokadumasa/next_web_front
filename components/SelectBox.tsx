import React from 'react'
import Link from 'next/link'
import Select from "react-select";

type Props = {
  data: []
  name: string
}
const options = [
]

const SelectBox: React.FC<Props> = ({ data, name }) => {
  console.log("data:" + JSON.stringify(data))
  data.map((datum) =>{
    options.push({label: datum.name, value: datum.id})
  })
  return (
    <Select 
      options={options} 
      name={name}
    />
  )
}

export default SelectBox
