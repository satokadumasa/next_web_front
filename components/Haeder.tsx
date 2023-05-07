import React from 'react'

type Props = {
  title: string
}

export const Header: React.FC<Props> = (props) => {
  return (
    <header className="bg-white z-1 py-1">
      <h1 className="text-lg font-bold leading-tight">
        {props?.title}
      </h1>
    </header>
  )
}

export default Header
