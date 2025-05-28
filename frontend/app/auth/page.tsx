import { Book } from 'lucide-react'
import React from 'react'
function page() {
  return (
    <div className="min-h-screen flex items-center justify-end px-4 bg-white">
      <div className='w-1/2 hidden md:block ' style={{backgroundImage: "url('/assets/new.png')" ,backgroundSize: "cover", backgroundPosition: "center",
      height: "100vh"}} >
      <div className="w-full h-full relative" >
      <img src="/assets/students1.jpg" alt="Login Image" className="absolute top-20 left-30 w-1/2 h-auto object-cover rounded shadow-lg z-0" />
      <img src="/assets/students2.jpg" alt="Login Image" className="absolute bottom-40 right-20 w-1/2 h-auto object-cover rounded shadow-lg z-10" />
      </div>
      <div className="absolute justify-center bottom-1 left-66 text-black space-y-1  p-4 rounded-lg transform -translate-y-1/2">
      <span className="block text-sm font-semibold">AI-Powered Learning</span>
      <span className="block text-sm">Smart assessment creation and grading for modern education</span>
      <span className="block text-sm flex items-center gap-2"><Book className="w-4 h-4"/> Smart Learning</span>
    </div>
  </div>

      <div className="w-full md:w-1/2 items-center justify-ceter bg-white px-8" >
      <div className="max-w-md w-full">
      <h1 className="mb-2 text-2xl text-gray-600 font-bold">  Welcome back!</h1>
      <h2 className="mb-3 text-lg text-gray-600">Please enter your details to sign in</h2>
       <form  className="mb-4 flex flex-col space-y-3">
      <label className="text-sm text-gray-600">Email</label>
      <input
        type="email"
        placeholder="Enter your email"
        className="mt-1 w-full p-2 border rounded"
      />
      <label className="text-sm text-gray-600">Password</label>
      <input
        type="password" 
        placeholder="Enter your password"
        className="mt-1 w-full p-2 border rounded"
      ></input>
         <div className="flex items-center justify-between text-sm text-gray-600">
          <label className="flex space-x-2">
            <input type="checkbox" className="form-checkbox" />
            
          </label><span className="text-sm text-gray-600">Remember me</span>
          <a href="#" className="text-sm text-gray-600 hover:underline">Forgot password?</a>
        </div>
        
  
      <button type="submit" className="bg-green-400 text-white  py-2 rounded hover:bg-green-500">
        Sign In
      </button>
    </form>
          <div className="flex  items-center my-6">
        <hr className="flex-grow border-t" />
        <span className="mx-4 text-gray-400 tx-sm">or continue with Google</span>
        <hr className="flex-grow border-t" />
      </div>
      
      <div className="flex justify-center gap-4">
        <img
          src="assets/google.png"
          alt="Google"
          className="w-5 h-5"
        />
         <img
          src="assets/mac.png"
          alt="MacOS"
          className="w-5 h-5"
        />
         <img
          src="assets/fb.jpeg"
          alt="Facebook"
          className="w-5 h-5"
        />
     
      </div>
      </div>

    </div>
    </div>
  )
}

export default page
