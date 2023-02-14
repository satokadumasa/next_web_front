import React from 'react'
import Link from 'next/link'

type Props = {
  href: string
}

const LinkButton: React.FC<Props> = ({ href, children }) => {
  return (
    <Link href={href}>
      <button 
        className="text-sm px-4 py-1 h-10 m-1 rounded bg-black text-white text-right"
      >
        {children}
      </button>
    </Link>
  )
}

export default LinkButton
