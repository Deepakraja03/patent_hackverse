import Pat from './contract/nft.json';
import { ethers } from "ethers";
import Web3 from "web3";

// Contract addresses for both networks
const PATENT_CONTRACT_ADDRESSES = {
    80001: "0x07709362d6Ae3B7706b92d2cfe81b7511c28aB75", // Polygon Mumbai (Matic)
    50: "0xEc074938e610B2E7e1946F920f329BC7f99834d5",  // XinFin XDC
};

// Contract address used for initialization (default)
const DEFAULT_PATENT_CONTRACT = "0x52552eF4F19A745c53cc4993bC42FB23Fe506c21";

const isBrowser = () => typeof window !== "undefined";
const { ethereum } = isBrowser();

if (ethereum) {
  window.ethereum = ethereum;
}

// Function to get contract instance based on network
const getContract = async () => {
    try {
        const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider();
        const network = await provider.getNetwork();

        const signer = provider.getSigner();
        return new ethers.Contract(PATENT_CONTRACT_ADDRESSES[network.chainId] || DEFAULT_PATENT_CONTRACT, Pat, signer);
    } catch (error) {
        console.error('Error initializing contract:', error);
        return null;
    }
}

// Contract functions
export const CREATEPATENT = async (name, description) => {
    try {
        const Role = await getContract();
        if (Role) {
            const answer = await Role.createPatent(name, description);
            return answer;
        }
    } catch (error) {
        console.error('Error creating patent:', error);
    }
}

export const GETPATENTSBYOWNER = async (addr) => {
    try {
        const Role = await getContract();
        if (Role) {
            const answer = await Role.getPatentsByOwnerDetails(addr);
            return answer;
        }
    } catch (error) {
        console.error('Error fetching patents by owner:', error);
    }
}

export const GETALLLEASEAVAILABLEPAT = async () => {
    try {
        const Role = await getContract();
        if (Role) {
            const answer = await Role.getLeaseAvailablePatents();
            return answer;
        }
    } catch (error) {
        console.error('Error fetching all lease available patents:', error);
    }
}

export const LEASEPATENT = async (id, leasefee, leaseduration) => {
    try {
        const Role = await getContract();
        if (Role) {
            const answer = await Role.leasePatent(id, leasefee, leaseduration);
            return answer;
        }
    } catch (error) {
        console.error('Error leasing patent:', error);
    }
}

export const GETPATENTBYID = async (id) => {
    try {
        const Role = await getContract();
        if (Role) {
            const answer = await Role.getPatentDetails(id);
            return answer;
        }
    } catch (error) {
        console.error('Error fetching patent by ID:', error);
    }
}

export const PAYLEASEFEEANDMINT = async (id, fee) => {
    try {
        const Role = await getContract();
        if (Role) {
            const answer = await Role.payLeaseFeeAndMintNFT(id, {
                value: fee
            });
            return answer;
        }
    } catch (error) {
        console.error('Error paying lease fee and minting NFT:', error);
    }
}

export const ENDLEASE = async (id) => {
    try {
        const Role = await getContract();
        if (Role) {
            const answer = await Role.burnNFT(id);
            return answer;
        }
    } catch (error) {
        console.error('Error ending lease:', error);
    }
}
