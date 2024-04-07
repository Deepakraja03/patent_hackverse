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
        <div className="container mx-auto mt-8">
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Create Patent</h2>
                <div className="flex justify-center gap-2 items-center">
                    <input className="border-black border-2 rounded-full p-2 font-semibold" type='text' placeholder='Enter the Patent Name' value={name} onChange={(e) => { setName(e.target.value) }} />
                    <input className="border-black border-2 rounded-full p-2 font-semibold" type='text' placeholder='Enter the Patent Description' value={desc} onChange={(e) => { setDesc(e.target.value) }} />
                </div>
                <div className="mt-4 flex justify-center">
                    <button onClick={createPatent} type="button" className="transition ease-in-out delay-150 hover:scale-110 duration-300 text-white bg-green-700 hover:bg-green-800 px-4 py-1 font-semibold rounded-full dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-red-900">Create</button>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Your Patents</h2>
                <div>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        patent.length === 0 ? (
                            <div>No patents available</div>
                        ) : (
                            patent.map((item, index) => (
                                <div key={index} className="bg-gray-100 p-4 rounded-md mb-4">
                                    <div>Name: {item[1][0]}</div>
                                    <div>Description: {item[1][1]}</div>
                                    <div>Timestamp: {new Date(parseInt(item[1][2]) * 1000).toLocaleString()}</div>
                                    <button onClick={() => onButton(parseInt(item[0]))} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Lease</button>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Burn NFT</h2>
                <div>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        patent.length === 0 ? (
                            <div>No patents available</div>
                        ) : (
                            patent.map((item, index) => (
                                <div key={index} className="bg-gray-100 p-4 rounded-md mb-4">
                                    <div>Name: {item[1][0]}</div>
                                    <div>Description: {item[1][1]}</div>
                                    <div>Timestamp: {new Date(parseInt(item[1][2]) * 1000).toLocaleString()}</div>
                                    <div>Current Leaser: {item.currentLeaser}</div>
                                    <div>Lease Duration: {parseInt(item.leaseDuration)}</div>
                                    <div>Lease End Time: {new Date(parseInt(item.leaseEndTime) * 1000).toLocaleString()}</div>
                                    <div>Token Id: {parseInt(item.tokenId)}</div>
                                    <button onClick={() => OnBurn(parseInt(item[0]))} className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Burn</button>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content ">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Patent Details</h2>
                        <p>Name: {selectedPatent[1]}</p>
                        <p>Description: {selectedPatent[2]}</p>
                        <p>Timestamp: {new Date(parseInt(selectedPatent[3]) * 1000).toLocaleString()}</p>
                        <div>
                            <input type='number' placeholder='Enter the Lease Fee' value={fee} onChange={(e) => { setFee(e.target.value) }} />
                            <input type='number' placeholder='Enter the Lease Duration' value={duration} onChange={(e) => { setDuration(e.target.value) }} />
                            <button onClick={() => {leasePatent(parseInt(selectedPatent[0]))}}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreatePatent;
