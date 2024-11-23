
import React from 'react';
import { IoSearch } from "react-icons/io5";
import { IoIosContact } from "react-icons/io";
import { BiCart } from "react-icons/bi";
import Link from 'next/link';

const Navbar = () => {
  return (
    <>
      <header className='w-[100%] flex flex-col items-center bg-stone-800 py-4'>
        
        
        <div className="w-full h-64 bg-[url('/book.jpg')] bg-cover bg-center">
        <div className="w-full flex justify-between items-center">
          <IoSearch size={30} className='cursor-pointer hover:text-white'/>
          <div className='flex items-center md:space-x-7 space-x-3'>
         <IoIosContact size={30} className='cursor-pointer hover:text-white'/>
            <BiCart size={30} className='cursor-pointer hover:text-white'/>
          </div>
        </div>
          
        </div>
      </header>
    </>
  );
}

export default Navbar;
