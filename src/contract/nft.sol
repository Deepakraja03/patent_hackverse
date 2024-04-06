// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PatentLending is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Patent {
        uint256 id;
        address payable owner;
        TupleDetails details;
        uint256 leaseFee;
        uint256 leaseDuration;
        uint256 leaseEndTime;
        address currentLeaser;
        uint256 escrowAmount;
        uint256 tokenId; // Added tokenId here
    }

    struct TupleDetails {
        string name;
        string description;
        uint256 timestamp;
    }

    Patent[] public patents;
    mapping(uint256 => bool) public patentExists;
    mapping(address => uint256[]) public patentsByOwner;
    mapping(address => uint256[]) public patentsByLeaser;

    event PatentCreated(uint256 id, string name, string description, uint256 timestamp, address owner);
    event PatentLeased(uint256 id, address leaser, uint256 leaseEndTime, uint256 tokenId);
    event LeaseEnded(uint256 id);
    event EscrowClaimed(uint256 id, uint256 amount);
    event PatentBurned(uint256 id, uint256 tokenId);

    modifier leaseNotExpired(uint256 _id) {
        require(patents[_id].leaseEndTime > block.timestamp, "Lease period is over");
        _;
    }

    constructor() ERC721("LeaseNFT", "LNFT") {}

    function createPatent(string memory _name, string memory _description) external {
        uint256 id = patents.length;
        TupleDetails memory details = TupleDetails({
            name: _name,
            description: _description,
            timestamp: block.timestamp
        });

        Patent memory newPatent = Patent({
            id: id,
            owner: payable(msg.sender),
            details: details,
            leaseFee: 0,
            leaseDuration: 0,
            leaseEndTime: 0,
            currentLeaser: address(0),
            escrowAmount: 0,
            tokenId: 0 // Initialize to 0
        });

        patents.push(newPatent);
        patentExists[id] = true;
        patentsByOwner[msg.sender].push(id);

        emit PatentCreated(id, _name, _description, block.timestamp, msg.sender);
    }

    function leasePatent(uint256 _id, uint256 _leaseFee, uint256 _leaseDuration) external {
        require(patentExists[_id], "Patent does not exist");
        require(msg.sender == patents[_id].owner, "Only owner can lease the patent");

        patents[_id].leaseFee = _leaseFee;
        patents[_id].leaseDuration = _leaseDuration;
        patents[_id].leaseEndTime = block.timestamp + _leaseDuration;

        emit PatentLeased(_id, msg.sender, patents[_id].leaseEndTime, patents[_id].tokenId);
    }

    function payLeaseFeeAndMintNFT(uint256 _id) external payable {
        require(patentExists[_id], "Patent does not exist");
        require(patents[_id].leaseFee > 0, "Lease fee not set");
        require(msg.value == patents[_id].leaseFee, "Incorrect lease fee amount");
        require(patents[_id].currentLeaser == address(0), "Patent already leased");

        patents[_id].currentLeaser = msg.sender;
        patents[_id].escrowAmount += msg.value;

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        patents[_id].tokenId = newTokenId;
        _mint(msg.sender, newTokenId);

        emit PatentLeased(_id, msg.sender, patents[_id].leaseEndTime, newTokenId);
    }

    function endLease(uint256 _id) external leaseNotExpired(_id) {
        require(patentExists[_id], "Patent does not exist");
        require(msg.sender == patents[_id].owner || msg.sender == patents[_id].currentLeaser, "Not authorized to end lease");

        _burn(patents[_id].tokenId);
        patents[_id].tokenId = 0; 
        patents[_id].currentLeaser = address(0);
        patents[_id].leaseFee = 0;
        patents[_id].leaseDuration = 0;
        patents[_id].leaseEndTime = 0;

        emit LeaseEnded(_id);
        emit PatentBurned(_id, patents[_id].tokenId);
    }

    function claimEscrow(uint256 _id) external {
        require(patentExists[_id], "Patent does not exist");
        require(msg.sender == patents[_id].owner, "Only owner can claim escrow");

        uint256 amount = patents[_id].escrowAmount;
        patents[_id].escrowAmount = 0;
        payable(msg.sender).transfer(amount);

        emit EscrowClaimed(_id, amount);
    }

    function getPatentsByOwner(address _owner) external view returns (uint256[] memory) {
        return patentsByOwner[_owner];
    }

    function getPatentsByLeaser(address _leaser) external view returns (uint256[] memory) {
        return patentsByLeaser[_leaser];
    }

    function getPatentDetails(uint256 _id) external view returns (uint256, string memory, string memory, uint256) {
        require(patentExists[_id], "Patent does not exist");
        return (_id, patents[_id].details.name, patents[_id].details.description, patents[_id].details.timestamp);
    }

    function getAllPatents() external view returns (Patent[] memory) {
        return patents;
    }

    struct PatentInfo {
        uint256 id;
        TupleDetails details;
        uint256 leaseFee;
        uint256 leaseDuration;
        uint256 leaseEndTime;
        address currentLeaser;
        uint256 escrowAmount;
        uint256 tokenId;
    }

    function getPatentsByOwnerDetails(address _owner) external view returns (PatentInfo[] memory) {
        uint256[] memory ownedPatents = patentsByOwner[_owner];
        PatentInfo[] memory result = new PatentInfo[](ownedPatents.length);
        for (uint256 i = 0; i < ownedPatents.length; i++) {
            Patent storage patent = patents[ownedPatents[i]];
            result[i] = PatentInfo({
                id: patent.id,
                details: patent.details,
                leaseFee: patent.leaseFee,
                leaseDuration: patent.leaseDuration,
                leaseEndTime: patent.leaseEndTime,
                currentLeaser: patent.currentLeaser,
                escrowAmount: patent.escrowAmount,
                tokenId: patent.tokenId
            });
        }
        return result;
    }

    function getLeaseAvailablePatents() external view returns (PatentInfo[] memory) {
        uint256[] memory availablePatents = new uint256[](patents.length);
        uint256 count = 0;
        for (uint256 i = 0; i < patents.length; i++) {
            if (patents[i].leaseEndTime <= block.timestamp || patents[i].currentLeaser == address(0)) {
                availablePatents[count] = i;
                count++;
            }
        }
        PatentInfo[] memory result = new PatentInfo[](count);
        for (uint256 j = 0; j < count; j++) {
            Patent storage patent = patents[availablePatents[j]];
            result[j] = PatentInfo({
                id: patent.id,
                details: patent.details,
                leaseFee: patent.leaseFee,
                leaseDuration: patent.leaseDuration,
                leaseEndTime: patent.leaseEndTime,
                currentLeaser: patent.currentLeaser,
                escrowAmount: patent.escrowAmount,
                tokenId: patent.tokenId
            });
        }
        return result;
    }

    function burnNFT(uint256 _id) external {
        require(patentExists[_id], "Patent does not exist");
        require(msg.sender == patents[_id].owner, "Only owner can burn NFT");
        _burn(patents[_id].tokenId);
        patents[_id].tokenId = 0; 
        patents[_id].currentLeaser = address(0);
        patents[_id].leaseFee = 0;
        patents[_id].leaseDuration = 0;
        patents[_id].leaseEndTime = 0;

        emit PatentBurned(_id, patents[_id].tokenId);
    }
}
