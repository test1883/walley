// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract NFTManager is ReentrancyGuard{
  using Counters for Counters.Counter;
  Counters.Counter private _nftsSold;
  Counters.Counter private _nftCount;
  address payable private _marketOwner;
  mapping(uint256 => NFT) private _idToNFT;
  struct NFT {
    address nftContract;
    uint256 tokenId;
    address payable storeAddress;
    address payable owner;
    uint256 amount;
    string store;
  }
  event NFTListed(
    address nftContract,
    uint256 tokenId,
    address storeAddress,
    address owner,
    uint256 amount,
    string store
  );
  event NFTSold(
    address nftContract,
    uint256 tokenId,
    address storeAddress,
    address owner,
    uint256 amount,
    string store
  );

  constructor() payable  {
    _marketOwner = payable(msg.sender);
  }

  // List the NFT on the marketplace
  function initTransaction(address _nftContract, uint256 _tokenId, uint256 _amount, address payable _storeAddress, string memory store) public payable nonReentrant {
    require(_amount > 0, "Amount must be at least 1 wei");

    _storeAddress.transfer(_amount);
    address payable buyer = payable(msg.sender);
    _nftCount.increment();
    _idToNFT[_tokenId] = NFT(
      _nftContract,
      _tokenId, 
      _storeAddress,
      buyer,
      _amount,
      store
    );

    emit NFTListed(_nftContract, _tokenId, _storeAddress, buyer, _amount, store);
  }
  function getBalance() public view returns(uint) {
    return address(msg.sender).balance;
  }
  // Resell an NFT purchased from the marketplace
  function approveTransaction(address _nftContract, uint256 _tokenId, uint256 _amount) public payable nonReentrant {
    NFT storage nft = _idToNFT[_tokenId];
    require(msg.sender == nft.storeAddress, "you cannot approve the transaction");
    require(_amount > 0, "amount must be at least 1 wei");
    require(_amount <= nft.amount, "amount must be less than or equal to the value");
    uint tmp = nft.amount;
    tmp-=_amount;
    payable(nft.owner).transfer(tmp);

    emit NFTSold(_nftContract, _tokenId, nft.storeAddress, nft.owner, _amount, nft.store);

    IERC721(_nftContract).transferFrom(nft.owner,  address(bytes20(bytes("0x000000000000000"))), _tokenId);
    delete _idToNFT[_tokenId];
    
  }

  function getMyActiveTransactions() public view returns (NFT[] memory) {
    uint nftCount = _nftCount.current();
    uint myNftCount = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i + 1].owner == msg.sender) {
        myNftCount++;
      }
    }

    NFT[] memory nfts = new NFT[](myNftCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i + 1].owner == msg.sender) {
        nfts[nftsIndex] = _idToNFT[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }

  function getStoreActiveTransactions() public view returns (NFT[] memory) {
    uint nftCount = _nftCount.current();
    uint storeNft = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i + 1].storeAddress == msg.sender) {
        storeNft++;
      }
    }

    NFT[] memory nfts = new NFT[](storeNft);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i + 1].storeAddress == msg.sender) {
        nfts[nftsIndex] = _idToNFT[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }
}

