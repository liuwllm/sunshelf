import React from 'react'
import FileUploadPage from '@/components/filesubmission'
import Library from '@/components/library'

export default function Home() {
  return (
    <main className="bg-red-100 min-h-screen font-sans">
      <div>
        <FileUploadPage />
        <Library />
      </div>
    </main>
  )
}