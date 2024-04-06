import React, { useEffect, useState } from 'react';
import { GETALLPATENTS } from '../ContractIntegration';

function Patents() {
    const [patent, setPatent] = useState([]);

    useEffect(() => {
        const getAllPatents = async () => {
            try {
                const result = await GETALLPATENTS();
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

    return (
        <div>
            {patent.length > 0 ? (
                <div>
                   {patent.map((patent, index) => (
                <div key={index}>
                    <div>Patent ID: {parseInt(patent[0])}</div>
                    <div>Owner: {patent[1]}</div>
                    <div>Name: {patent[2][0]}</div>
                    <div>Description: {patent[2][1]}</div>
                    <div>Timestamp: {new Date(parseInt(patent[2][2]._hex) * 1000).toLocaleString()}</div>
                    {/* <div>Lease Fee: {parseInt(patent.leaseFee)}</div>
                    <div>Lease Duration: {parseInt(patent.leaseDuration)}</div> */}
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
