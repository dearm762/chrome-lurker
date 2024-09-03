import React from 'react'

export default function Loading() {
  return (
    <div className='w-screen h-screen absolute top-0 left-0 flex items-center justify-center'>
      <span className="loading loading-infinity loading-lg bg-main"></span>
    </div>
  )
}
