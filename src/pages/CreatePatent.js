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
        <div>
            <div>
                <input type='text' placeholder='Enter the Patent Name' value={name} onChange={(e) => { setName(e.target.value) }} />
                <input type='text' placeholder='Enter the Patent Description' value={desc} onChange={(e) => { setDesc(e.target.value) }} />
                <button onClick={createPatent}>
                    Create
                </button>
            </div>
            <div>
                <div>
                    Your Patents:
                </div>
                <div>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        patent.map((item, index) => (
                            <div key={index}>
                                <div>Name: {item[1][0]}</div>
                                <div>Description: {item[1][1]}</div>
                                <div>Timestamp: {new Date(parseInt(item[1][2]) * 1000).toLocaleString()}</div>
                                {/* <div>Description: {item[1][1]}</div> */}
                                <button onClick={() => onButton(parseInt(item[0]))}>Lease</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* Modal */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Patent Details</h2>
                        <p>Name: {selectedPatent[1]}</p>
                        <p>Description: {selectedPatent[2]}</p>
                        <p>Timestamp: {new Date(parseInt(selectedPatent[3]) * 1000).toLocaleString()}</p>
                        <div>
                            <input type='number' placeholder='Enter the Lease Fee' value={fee} onChange={(e) => { setFee(e.target.value) }} />
                            <input type='number' placeholder='Enter the Lease Duration' value={duration} onChange={(e) => { setDuration(e.target.value) }} />
                            <button onClick={() => {leasePatent(parseInt(selectedPatent[0]))}}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <br />
            <div>
                Burn NFT
                <div>
                    <div>
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            patent.map((item, index) => (
                                <div key={index}>
                                    <div>Name: {item[1][0]}</div>
                                    <div>Description: {item[1][1]}</div>
                                    <div>Timestamp: {new Date(parseInt(item[1][2]) * 1000).toLocaleString()}</div>
                                    <div>Current Leaser: {item.currentLeaser}</div>
                                    <div>Lease Duration: {parseInt(item.leaseDuration)}</div>
                                    <div>Lease End Time: {new Date(parseInt(item.leaseEndTime) * 1000).toLocaleString()}</div>
                                    <div>Token Id: {parseInt(item.tokenId)}</div>
                                    <button onClick={() => OnBurn(parseInt(item[0]))}>Burn</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreatePatent;
