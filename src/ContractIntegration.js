import Pat from './contract/nft.json';

import { ethers } from "ethers";
import Web3 from "web3";

const PATENT_CONTRACT = "0xDbe0dC00A7C9C10C7A75f8F1167949bb49a313Cd";

const isBrowser = () => typeof window !== "undefined";
const { ethereum } = isBrowser();

if (ethereum) {
  isBrowser().web3 = new Web3(ethereum); 
  isBrowser().web3 = new Web3(isBrowser().web3.currentProvider);
}

 
export const CREATEPATENT =async (name, description) => {
    try {
        const provider = 
        window.ethereum != null
          ? new ethers.providers.Web3Provider(window.ethereum)
          : ethers.providers.getDefaultProvider();
    
        const signer = provider.getSigner();
        const Role = new ethers.Contract(PATENT_CONTRACT, Pat, signer);
        const answer = await Role.createPatent(name, description);
        return answer;
    } catch (error) {
        console.error('Error fetching memo:', error);
    }
}

export const GETPATENTSBYOWNER =async (addr) => {
    try {
        const provider = 
        window.ethereum != null
          ? new ethers.providers.Web3Provider(window.ethereum)
          : ethers.providers.getDefaultProvider();
    
        const signer = provider.getSigner();
        const Role = new ethers.Contract(PATENT_CONTRACT, Pat, signer);
        const answer = await Role.getPatentsByOwnerDetails(addr);
        return answer;
    } catch (error) {
        console.error('Error fetching memo:', error);
    }
}

export const GETALLPATENTS =async () => {
    try {
        const provider = 
        window.ethereum != null
          ? new ethers.providers.Web3Provider(window.ethereum)
          : ethers.providers.getDefaultProvider();
    
        const signer = provider.getSigner();
        const Role = new ethers.Contract(PATENT_CONTRACT, Pat, signer);
        const answer = await Role.getAllPatents();
        return answer;
    } catch (error) {
        console.error('Error fetching memo:', error);
    }
}

export const LEASEPATENT =async (id, leasefee, leaseduration) => {
    try {
        const provider = 
        window.ethereum != null
          ? new ethers.providers.Web3Provider(window.ethereum)
          : ethers.providers.getDefaultProvider();
    
        const signer = provider.getSigner();
        const Role = new ethers.Contract(PATENT_CONTRACT, Pat, signer);
        const answer = await Role.leasePatent(id, leasefee, leaseduration);
        return answer;
    } catch (error) {
        console.error('Error fetching memo:', error);
    }
}

export const GETPATENTBYID =async (id) => {
    try {
        const provider = 
        window.ethereum != null
          ? new ethers.providers.Web3Provider(window.ethereum)
          : ethers.providers.getDefaultProvider();
    
        const signer = provider.getSigner();
        const Role = new ethers.Contract(PATENT_CONTRACT, Pat, signer);
        const answer = await Role.getPatentDetails(id);
        return answer;
    } catch (error) {
        console.error('Error fetching memo:', error);
    }
}

