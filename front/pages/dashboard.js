import React from 'react'
import FileUploadPage from '@/components/filesubmission'
import Library from '@/components/library'
// import { authOptions } from "@/pages/api/auth[...nextauth]"
// import { useSession } from 'next-auth/react'



export default function Dashboard() {
  return (
    <main className="bg-red-100 min-h-screen font-sans">
      <div>
        <FileUploadPage />
        <Library />
      </div>
    </main>
  )
}