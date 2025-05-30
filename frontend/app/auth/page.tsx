'use client'
import { useScroll } from 'framer-motion'
import { Book } from 'lucide-react'
import React, {useState} from 'react'



function page() {
  const [isLogin,setIsLogin]=useState(true)

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
 const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
 }
const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    setMessage('Passwords do not match');
    return;
  }
}

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center sm:px-6 px-4 bg-white">
      <div className="w-full md:w-1/2 h-64  md:h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('/assets/new.png')" }}>

      <div className="w-full h-full relative" >
      <img src="/assets/students1.jpg" alt="Login Image" className="absolute top-30 left-4 w-1/2  h-auto object-cover rounded shadow-lg z-0 sm:block"/>
      <img src="/assets/students2.jpg" alt="Login Image" className="absolute bottom-35 right-5 w-1/2 h-auto object-cover rounded shadow-lg z-10 sm:block" />
      </div>
      <div className="absolute justify-center bottom-2 left-66 text-black space-y-2  p-4 bg-opacity-80 rounded-lg max-w-xs text-sm">
      <span className="block font-semibold">AI-Powered Learning</span>
      <span className="block">Smart assessment creation and grading for modern education</span>
      <span className="block flex items-center gap-2 mt-2"><Book className="w-4 h-4"/> Smart Learning</span>
    </div>
  </div>

      <div className="w-full md:w-1/2 items-center justify-center bg-white sm:px-6 px-4 py-8" >
      <div className="max-w-md w-full px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="mb-2 md:text-2xl text-gray-600 font-bold">  Welcome back!</h1>
      <h2 className="mb-4 text-sm sm:text-base text-gray-600">Please enter your details to sign in</h2>
       <form  className="mb-4 flex flex-col space-y-3" onSubmit={isLogin ? handleLogin : handleSignup}>
      <label className="block text-sm text-gray-600">Email</label>
      <input
        type="email"
        placeholder="Enter your email"
        className="mt-1 w-full p-2 border rounded border-gray-300 rounded focus:ring-2 focus:ring-green-400"
      />
      <label className="block text-sm text-gray-600">Enter Password</label>
      <input
        type="password" 
        placeholder="Enter your password"
        className="mt-1 w-full p-2 border rounded border-gray-300 rounded focus:ring-2 focus:ring-green-400"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      
      {!isLogin && (
        <>
        <label className="block text-sm text-gray-600">Confirm Password</label>
          <input
        type="password" 
        placeholder="Enter your password"
         value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        className="mt-1 w-full p-2 border rounded border-gray-300 rounded focus:ring-2 focus:ring-green-400"
      ></input>
        </>
      )}
         <div className="flex items-center justify-between text-sm text-gray-600">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            
         <span className="text-sm text-gray-600">Remember me</span> </label>
          <a href="#" className="text-sm text-gray-600 hover:underline">Forgot password?</a>
        </div>
        
  
      <button type="submit" className="bg-green-400 w-full text-white  py-2 rounded hover:bg-green-500 transition duration-200">
        {isLogin? 'Sign In' : 'Sign Up'}
      </button>
    </form>
          <div className="flex  items-center my-6">
        <hr className="flex-grow border-t" />
        <span className="mx-4 text-gray-400 text-sm">or continue with Google</span>
        <hr className="flex-grow border-t" />
      </div>
      
      <div className="flex justify-center gap-6">
        <img
          src="assets/google.png"
          alt="Google"
          className="w-5 h-5 cursor-pointer"
        />
         <img
          src="assets/mac.png"
          alt="MacOS"
          className="w-5 h-5 cursor-pointer"
        />
         <img
          src="assets/fb.jpeg"
          alt="Facebook"
          className="w-5 h-5 cursor-pointer"
        />
     
      </div>
      </div>
      <p className="text-sm mt-6 text-gray-600 text-center">
  {isLogin ? "Don't have an account?" : "Already have an account?"}
  <button
    type="button"
    className="text-green-500 ml-1 hover:underline"
    onClick={() => setIsLogin(!isLogin)}
  >
    {isLogin ? 'Sign Up' : 'Log In'}
  </button>
</p>

    </div>
    </div>
  )
}

export default page
