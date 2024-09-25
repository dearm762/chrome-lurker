'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

export default function Index() {
  const fetchRole = async () => {
    const response = await fetch('http://localhost:3000/api/role', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      credentials: 'include'
    })
    const data = await response.json()

    console.log(data)
  }

  return (
    <div className='p-5 flex items-center justify-center min-h-screen '>
      <Button variant={'secondary'} className='font-semibold' onClick={fetchRole}>Button</Button>
    </div>
  )
}
