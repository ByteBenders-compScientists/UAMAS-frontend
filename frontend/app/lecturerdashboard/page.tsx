import { ChartBarIncreasing, Circle, LayoutDashboard, LetterText, LetterTextIcon, LoaderIcon, Plus, Star, User, Users } from 'lucide-react'
import React from 'react'

// Temporary Layout component definition
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <main className="flex-1 ml-64 w-full p-8">{children}</main>
);

function page() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center sm:px-6 px-4 bg-white">
    <h1>Lecturer Dashboard</h1>
    <aside className="h-screen w-64 bg-rose-400 text-black fixed top-0 left-0">
       <div className="flex items-center p-4 space-x-2 text-xl font-bold ">
    <LetterTextIcon className="w-5 h-5 " />
    <span>EduPortal</span>
  </div>
  <div className="flex p-4 items-center space-x-2 text-sm border-b border-gray-700 font-medium">
    <User className="w-5 h<-5 " />
    <span>Jane Doe</span>
 
  </div>
      <nav className="flex flex-col gap-2 p-4">
        <a href="#" className="hover:bg-white p-2 rounded"><LayoutDashboard className="inline-block ml-2 text-black"/> Dashboard</a>
        <a href="#" className="hover:bg-white p-2 rounded"><LoaderIcon className="inline-block ml-2 text-black"/> Pending Approvals</a>
        <a href="#" className="hover:bg-white p-2 rounded"><Plus className="inline-block ml-2 text-black"/> Create</a>
        <a href="#" className="hover:bg-white p-2 rounded"><Users className="inline-block ml-2 text-black" /> Student Status</a>
        <a href="#" className="hover:bg-white p-2 rounded"><Star className="inline-block ml-2 text-black"/> Graded CATs</a>  
        <a href="#" className="hover:bg-white p-2 rounded"><ChartBarIncreasing className="inline-block ml-2 text-black"/> Analytics</a> 
      </nav>

    </aside>
        <Layout>
      <h1 className="text-3xl font-bold text-black top-0 mb-4">Welcome,Dr Alex Kimani</h1>
      
    </Layout>
    </div>
  )
}

export default page
