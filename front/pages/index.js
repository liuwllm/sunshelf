import React from 'react'
import Image from 'next/image'
import Logo from './../public/sunshelflogo.png'
import FileUploadPage from '@/components/filesubmission'

export default function Home() {
  return (
    <>
    <main className="bg-red-100 min-h-screen font-sans flex flex-col justify-center items-center">
      <Image 
        src={Logo}
        width={751}
        height={155}
        alt="Sunshelf Logo"
      />
      <div className="flex p-10 gap-6">
        <FileUploadPage />
      </div>
    </main>
    </>
  )
}