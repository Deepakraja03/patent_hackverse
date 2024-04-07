import Pat from './contract/nft.json';
import { ethers } from "ethers";
import Web3 from "web3";

// Contract addresses for both networks
const PATENT_CONTRACT_ADDRESSES = {
    80001: "0xE0a89ECdBe5aB30E117A20BD4A69b9eB7Be11A02", // Polygon Mumbai (Matic)
    50: "0x9F64d4aa85aacF2107583FF41401A2f6F958e7fe",  // XinFin XDC
};

// Contract address used for initialization (default)
const DEFAULT_PATENT_CONTRACT = "0xE0a89ECdBe5aB30E117A20BD4A69b9eB7Be11A02";

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
