import { useState } from 'react'

interface AvatarProps {
  src: string
  name: string
  className?: string
}

export default function Avatar({ src, name, className = 'w-10 h-10' }: AvatarProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`${className} rounded-full bg-teal-brand text-white flex items-center justify-center font-semibold`}
      >
        {name.charAt(0)}
      </div>
    )
  }

  return (
    <img
      src={src || '/icons/Avatar.png'}
      alt={name}
      onError={() => setFailed(true)}
      className={`${className} rounded-full object-cover`}
    />
  )
}