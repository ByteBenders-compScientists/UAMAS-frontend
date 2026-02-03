import Image from "next/image";
import { Mail, Phone, MapPin, ChevronRight } from "lucide-react";
import { Twitter, Facebook, Instagram, Linkedin, Youtube, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Wave Shape at Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-24"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-white"
          ></path>
        </svg>
      </div>

      {/* 3D Text Background - Large IntelliMark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <h2 
          className="text-[10rem] md:text-[16rem] lg:text-[22rem] font-black opacity-5 select-none whitespace-nowrap"
          style={{
            textShadow: `
              2px 2px 0px rgba(16, 185, 129, 0.1),
              4px 4px 0px rgba(16, 185, 129, 0.08),
              6px 6px 0px rgba(16, 185, 129, 0.06),
              8px 8px 0px rgba(16, 185, 129, 0.04),
              10px 10px 20px rgba(0, 0, 0, 0.3)
            `
          }}
        >
          IntelliMark
        </h2>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 pt-24 pb-8">
        {/* Top section with logo and newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 pb-12 border-b border-slate-800">
          <div className="mb-8 lg:mb-0">
            <Image
              src="/assets/logo3.png"
              alt="IntelliMark logo"
              width={230}
              height={160}
              quality={100}
            />
          </div>
          
          <div className="w-full max-w-md">
            <h4 className="text-xl font-bold mb-4">Stay Updated</h4>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-3 rounded-l-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h4 className="text-lg font-bold mb-6 text-emerald-400">About IntelliMark</h4>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Transforming education through intelligent automation and
              personalized learning experiences. Making education more
              accessible, engaging, and effective for all.
            </p>
            <div className="space-y-2">
              <p className="text-gray-400 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-emerald-400" />
                <span className="text-emerald-400">info@intellimark.com</span>
              </p>
              <p className="text-gray-400 flex items-center">
                <Phone className="w-4 h-4 mr-2 text-emerald-400" />
                <span className="text-emerald-400">+254 712 345 678</span>
              </p>
              <p className="text-gray-400 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-emerald-400" />
                <span>Nairobi, Kenya</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-emerald-400">Features</h4>
            <ul className="space-y-3 text-gray-400">
              {[
                "Automated Assessment",
                "Performance Analytics",
                "Student Engagement",
                "AI-Powered Insights",
                "Curriculum Alignment",
                "Personalized Learning",
              ].map((item, i) => (
                <li key={i} className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-emerald-400">For Educators</h4>
            <ul className="space-y-3 text-gray-400">
              {[
                "Lecturer Dashboard",
                "Content Creation",
                "Progress Tracking",
                "Grade Management",
                "Department Analytics",
                "Academic Planning",
              ].map((item, i) => (
                <li key={i} className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-emerald-400">Company</h4>
            <ul className="space-y-3 text-gray-400">
              {[
                "About Us",
                "Careers",
                "Blog",
                "Help Center",
                "Contact Us",
                "Privacy Policy",
                "Terms of Service",
              ].map((item, i) => (
                <li key={i} className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Social media */}
        <div className="flex justify-center space-x-6 mb-8">
          {[Twitter, Facebook, Instagram, Linkedin, Youtube, Github].map((Icon, i) => (
            <a 
              key={i} 
              href="#"
              className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          <p className="mb-4">
            &copy; 2025 IntelliMark. All rights reserved. Empowering
            education through innovation.
          </p>
          <div className="flex justify-center space-x-4 text-xs">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}