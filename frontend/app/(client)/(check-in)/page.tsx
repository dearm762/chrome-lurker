'use client'
import CheckInForm from '@/components/check-in.form'
import Header from '@/components/header'
import Wrapper from '@/components/wrapper'
import { useState } from 'react';

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <title>Нархоз Университеті | Кезекке Тұру</title>
      <Wrapper additionalStyles='h-screen mx-auto flex flex-col'>
        <Header />
        <CheckInForm />
      </Wrapper >
    </>
  )
}
