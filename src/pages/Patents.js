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
        <div>
            {patent.length > 0 ? (
                <div>
                   {patent.map((patent, index) => (
                <div key={index}>
                    <div>Patent ID: {parseInt(patent[0])}</div>
                    {/* <div>Owner: {patent[1]}</div> */}
                    <div>Name: {patent[1][0]}</div>
                    <div>Description: {patent[1][1]}</div>
                    <div>Timestamp: {new Date(parseInt(patent[1][2]._hex) * 1000).toLocaleString()}</div>
                    <div>Lease Fee: {parseInt(patent.leaseFee)}</div>
                    <div>Lease Duration: {parseInt(patent.leaseDuration)}</div>
                    <button onClick={() => {LeaseandMint(parseInt(patent[0]),parseInt(patent.leaseFee))}}>Lease it</button>
                </div>
            ))}
                </div>
            ) : (
                <div>No patents available</div>
            )}
        </div>
    );
}

export default Patents;
