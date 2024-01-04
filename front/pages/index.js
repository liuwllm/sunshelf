import React from 'react'
import FileUploadPage from '@/components/filesubmission'
import Library from '@/components/library'
import Login from '@/components/login'

export default function Home() {
  return (
    <main className="bg-red-100 min-h-screen font-sans">
      <div>
        <Login />
        <FileUploadPage />
        <Library />
      </div>
    </main>
  )
}