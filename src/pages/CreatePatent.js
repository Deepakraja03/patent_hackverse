import React, { useEffect, useState } from 'react';
import { CREATEPATENT, ENDLEASE, GETPATENTBYID, GETPATENTSBYOWNER, LEASEPATENT } from '../ContractIntegration';
import { ethers } from "ethers";

function CreatePatent() {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [addr, setAddr] = useState('');
    const [fee, setFee] = useState();
    const [duration, setDuration] = useState();
    const [patent, setPatent] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPatent, setSelectedPatent] = useState(null);
    const [showModal, setShowModal] = useState(false); 

    const createPatent = async () => {
        const result = await CREATEPATENT(name, desc);
        if (result) {
            alert("Patent created successfully");
        } else {
            console.log("Error");
        }
    }

    useEffect(() => {
        const getAccount = async () => {
            if (typeof window.ethereum !== "undefined") {
                try {
                    await window.ethereum.request({ method: "eth_requestAccounts" });
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const accounts = await provider.listAccounts();
                    if (accounts.length > 0) {
                        setAddr(accounts[0]);
                    }
                } catch (error) {
                    console.error("Error connecting:", error);
                }
            }
        };

        const getPatentsByOwner = async () => {
            setLoading(true); 
            const result = await GETPATENTSBYOWNER(addr);
            console.log(result);
            setPatent(result);
            setLoading(false);
        }

        getAccount();
        if (addr !== '') {
            getPatentsByOwner();
        }
    }, [addr]);
    
    const onButton = async (patentid) => {
        const result = await GETPATENTBYID(patentid);
        console.log("patent",result);
        setSelectedPatent(result);
        setShowModal(true);
    }

    const leasePatent = async (patentid) => {
        const result = await LEASEPATENT(patentid, fee, duration);
        console.log("Lease", result);
    }

    const OnBurn = async (id) => {
        const result = await ENDLEASE(id);
        console.log("lease end", result);
    }

    const closeModal = () => {
        setSelectedPatent(null);
        setShowModal(false);
    }

    return (
        <div className="bg-gradient-to-r from-black hover:text-black via-slate-900 to-slate-800 pt-8">
            <div className="container mx-auto">
                <div className="my-8">
                    <h2 className="text-6xl font-bold my-16 px-4 text-white flex items-center justify-center font-serif  ">Create Patent</h2>
                    <div className="flex flex-col justify-center  items-center W-[80VW]">
                        <input className="border-black border-2 my-5 w-3/5 flex items-center text-xl justify-center rounded-xl p-3 py-4" type='text' placeholder='Enter the Patent Name' value={name} onChange={(e) => { setName(e.target.value) }} />
                        <textarea className="border-black border-2 my-5 w-3/5 flex items-center text-xl justify-center rounded-xl p-3 py-4 min-h-28" type='text' placeholder='Enter the Patent Description' value={desc} onChange={(e) => { setDesc(e.target.value) }} />
                    </div>
                    <div className="mt-8 flex justify-center">
                        <button onClick={createPatent} type="button" className="transition ease-in-out delay-150 hover:scale-110 duration-300 bg-gradient-to-r from-sky-400 to-blue-500 p-2 rounded-2xl w-4/12 py-4 text-3xl text-white  font-semibold">Create Your Patent</button>
                    </div>
                </div>

                <div className="mb-8 flex flex-col justify-center items-center my-20">
                    <h2 className="text-6xl font-bold my-16 px-4 text-white flex items-center justify-center font-serif ">Your Patents</h2>
                    <div className='flex gap-3 mx-10'>
                        {!loading && patent && patent.length > 0 && (
                            patent.map((item, index) => (
                                item && item[1] && item[1].length >= 3 ? (
                                    <div key={index} className="bg-gray-100  w-[100%] min-h-[60%] rounded-lg my-5 mx-20 p-6">
                                        <div className=' flex flex-col justify-center items-cenetr min-w-60 min-h-52'>
                                            <div className='text-2xl font-semibold'><span className=''>Name:</span> {item[1][0]}</div>
                                            <div className='text-xl font-semibold'><span className='font-bold'>Description:</span> {item[1][1]}</div>
                                            <div className='text-xl font-semibold'><span className='font-bold'>Timestamp:</span> {new Date(parseInt(item[1][2]) * 1000).toLocaleString()}</div>
                                            <button onClick={() => onButton(parseInt(item[0]))} className="mt-4 px-4 py-4 bg-gradient-to-r from-sky-400 to-blue-500 font-semibold text-xl text-white rounded-md hover:bg-blue-600">Lease</button>
                                        </div>
                                    </div>
                                ) : null
                            ))
                        )}
                        {!loading && patent && patent.length === 0 && (
                            <div className='text-white'>No patents available</div>
                        )}
                        {loading && <div>Loading...</div>}
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="modal flex flex-col items-center ">
                        <div className="modal-content bg-gray-300  w-[60%] min-h-[60%] rounded-lg my-5 mx-20 p-6">
                            <span className="close" onClick={closeModal}>&times;</span>
                            <h2 className='text-xl font-semibold '>Patent Details</h2>
                            <p className='text-lg '>Name: {selectedPatent[1]}</p>
                            <p className='text-lg '>Description: {selectedPatent[2]}</p>
                            <p className='text-lg '>Timestamp: {new Date(parseInt(selectedPatent[3]) * 1000).toLocaleString()}</p>
                            <div className='flex justify-around m-4'>
                                <input type='number' className='p-2 rounded ' placeholder='Enter the Lease Fee' value={fee} onChange={(e) => { setFee(e.target.value) }} />
                                <input type='number' className='p-2 rounded' placeholder='Enter the Lease Duration' value={duration} onChange={(e) => { setDuration(e.target.value) }} />
                                <button className='p-2 px-5 text-xl font-semibold rounded bg-blue-400' onClick={() => {leasePatent(parseInt(selectedPatent[0]))}}>Confirm</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className='flex flex-col justify-center items-center'>
                    <h2 className="text-6xl font-bold my-16 px-4 text-white flex items-center justify-center font-serif">Burn NFT</h2>
                    <div className='flex gap-3 mx-10'>
                        {!loading && patent && patent.length > 0 && (
                            patent.map((item, index) => (
                                item && item[1] && item[1].length >= 3 ? (
                                    <div key={index} className=" bg-gray-100  w-[100%] min-h-[60%] rounded-lg my-5 mx-20 p-4">
                                        <div className='flex flex-col justify-center items-cenetr min-w-60 min-h-52'>
                                            <div  className='text-2xl font-semibold'><span>Name:</span> {item[1][0]}</div>
                                            <div  className='text-2xl font-semibold'><span className='text-xl font-semibold'>Description:</span> {item[1][1]}</div>
                                            <div  className='text-2xl font-semibold'><span className='text-xl font-semibold'>Timestamp:</span> {new Date(parseInt(item[1][2]) * 1000).toLocaleString()}</div>
                                            {item.currentLeaser !== '0x0000000000000000000000000000000000000000' && (
                                                <div>Current Leaser: {item.currentLeaser}</div>
                                            )}
                                            {parseInt(item.leaseDuration) !== 0 && (
                                                <div><span className='font-bold'>Lease Duration:</span> {parseInt(item.leaseDuration)}</div>
                                            )}
                                            {parseInt(item.leaseEndTime) !== 0 && (
                                                <div><span className='font-bold'>Lease End Time:</span> {new Date(parseInt(item.leaseEndTime) * 1000).toLocaleString()}</div>
                                            )}
                                            {parseInt(item.tokenId) !== 0 && (
                                                <div><span className='font-bold'>Token Id:</span> {parseInt(item.tokenId)}</div>
                                            )}
                                            <button onClick={() => OnBurn(parseInt(item[0]))} className="mt-4 px-4 py-4 bg-gradient-to-r  font-semibold text-xl  from-rose-500 via-red-400 to-red-500 text-white rounded-md hover:bg-red-600">Burn</button>
                                        </div>
                                    </div>
                                ) : null
                            ))
                        )}
                        {!loading && patent && patent.length === 0 && (
                            <div className='text-white'>No patents available</div>
                        )}
                        {loading && <div>Loading...</div>}
                    </div>
                </div>
            </div>
        </div>
    );
} 

export default CreatePatent;
