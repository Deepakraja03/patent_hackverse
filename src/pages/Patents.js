import React, { useEffect, useState } from 'react';
import { GETALLLEASEAVAILABLEPAT, PAYLEASEFEEANDMINT } from '../ContractIntegration';

function Patents() {
    const [patent, setPatent] = useState([]);

    useEffect(() => {
        const getAllPatents = async () => {
            try {
                const result = await GETALLLEASEAVAILABLEPAT();
                if (result.length > 0) {
                    setPatent(result);
                    console.log(result);
                }
            } catch (error) {
                console.error('Error fetching patents:', error);
            }
        };

        getAllPatents();
    }, []);

    const LeaseandMint = async (patid, patfee) => {
        const result = await PAYLEASEFEEANDMINT(patid, patfee);
        console.log("pay and lease", result);
    }

    return (
        <div className="container bg-gradient-to-r from-black hover:text-black via-slate-900 to-slate-800 mx-auto mt-8">
            <h2 className="text-4xl font-bold pb-4 text-white text-center">Available Patents</h2>
            {patent.length > 0 ? (
                <div className="flex flex-col items-center justify-center gap-5 p-3">
                    {patent.map((patentItem, index) => (
                        <div key={index} className="bg-slate-300  w-[80%] shadow-lg border flex flex-col items-center rounded-lg overflow-hidden">
                            <div className="p-4">
                                <div className="text-xl font-semibold mb-2">Patent ID: {parseInt(patentItem[0])}</div>
                                {/* <div>Owner: {patent[1]}</div> */}
                                <div className="text-lg mb-2">Name: {patentItem[1][0]}</div>
                                <div className="text-lg mb-2">Description: {patentItem[1][1]}</div>
                                <div className="text-sm mb-2">Timestamp: {new Date(parseInt(patentItem[1][2]._hex)).toLocaleString()}</div>
                                <div className="text-lg mb-2">Lease Fee: {parseInt(patentItem.leaseFee)}</div>
                                <div className="text-lg mb-2">Lease Duration: {parseInt(patentItem.leaseDuration)}</div>
                                <button onClick={() => { LeaseandMint(parseInt(patentItem[0]), parseInt(patentItem.leaseFee)) }} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Lease it</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center">No patents available</div>
            )}
        </div>
    );
}

export default Patents;
