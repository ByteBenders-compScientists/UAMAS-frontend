import React from 'react'
import Link from 'next/link'
import { BrainCircuit } from 'lucide-react'

function Navbar() {
  return (
    <div>
        <nav className="bg-emerald-500 p-4">
            <div className="container mx-auto flex gap-[30px]  items-center">
                <div className="logo ">
                    <BrainCircuit className="text-white h-8 w-8 inline-block mr-2" />
                    <span className="text-white text-xl font-bold">EduAI Suite</span>
                </div>
            <Link href="#features" className="text-white text-lg">
                Features
            </Link>
                <Link href="#works" className="text-gray-300 hover:text-white">
                How it works
                </Link>
                <Link href="#lecturers" className="text-gray-300 hover:text-white">
                For Lecturers
                </Link>
                <Link href="#students" className="text-gray-300 hover:text-white">
                For Students
                </Link>
                <Link href="#faq" className="text-gray-300 hover:text-white">
                FAQ
                </Link>
                {/* auth buttons */}
                <Link href="/login" className="text-emerald bg-emerald-100 hover:bg-emerald-200 px-4 py-2 rounded">
                    Login
                </Link>
                <Link href="/login" className='text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded'>
                    Get Started
                    </Link>
                
            </div>
        </nav>

    </div>
  )
}

export default Navbar