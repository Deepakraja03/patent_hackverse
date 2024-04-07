import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className='flex font-serif justify-between items-center py-4 px-4 font-semibold hover:text-black '>
        <div className='text-3xl '>
            PatentLeaser
        </div>
        <div className='flex items-center text-xl'>
            <ul className='flex items-center gap-5'>
                <li><Link to="/" className="block mt-4 lg:inline-block lg:mt-0 text-slate-700 hover:text-black hover:underline mr-4">Home</Link></li>
                <li><Link to="/Createpatent" className="block mt-4 lg:inline-block lg:mt-0 text-slate-700 hover:text-black hover:underline mr-4">Create Patent</Link></li>
                <li><Link to="/Patents" className="block mt-4 lg:inline-block lg:mt-0 text-slate-700 hover:text-black hover:underline mr-4">Patents</Link></li>
            </ul>
        </div>
        <div className='flex items-center'>
            <ConnectButton />
        </div>
    </div>
  )
}

export default Navbar
