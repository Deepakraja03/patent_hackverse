import React from 'react'
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className='bg-gradient-to-r from-black via-slate-900 to-slate-800 text-white min-h-[100vh]'>
        <div className="flex  mx-10 py-5 h-screen">
            <div className="flex flex-col justify-center items-start lg:py-0">
                <h1 className="text-6xl font-bold justify-center  leading-snug 2xl:leading-snug sm:leading-snug lg:leading-snug font-head text-white tracking-wide">
                Rent NFT's and <br />
                <span className="text-pink"> make passive </span>
                <span className="text-blue "> income</span>
                </h1>
                <p className="font-medium text-lightBlack text-2xl mt-3">
                The world's first and largest digital marketplace for crypto <span className='w-[80%] block'>collectibles and non- fungible tokens (NFTs).</span>
                
                </p>
                <Link to='./Patents' >
                    <div className=" w-full   mt-10 hover:bg-slate-900 hover:text-lg">
                        <h2 className="italic font-semibold text-white w-[40vw] flex justify-center border border-white py-6 px-6 bg-subMain rounded">
                            Lease Your Patent Soon !!!
                        </h2>
                        {/* <CountDown /> */}
                        </div>
                </Link>
            </div>
            <div className="hero flex justify-center items-center">
                <img
                src="/bg-home.jpg"
                alt="Main"
                className="w-[80vw] h-[70vh] object-contain"
                />
            </div>
        </div>
    </div>
  );
}
export default Home;
