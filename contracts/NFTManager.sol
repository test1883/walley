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
    string name;
    address payable storeAddress;
    address payable owner;
    uint256 amount;
    string store;
    string invoice;
    bool done;
    uint256 totalAmount;
    uint256 time;
  }
  struct storeDetails {
    string storeName;
    address storeAddress;
    string image;
  }
  storeDetails[] public stores;
  event NFTListed(
    address nftContract,
    uint256 tokenId,
    string name,
    address storeAddress,
    address owner,
    uint256 amount,
    string store
  );
  event NFTSold(
    address nftContract,
    uint256 tokenId,
    string name,
    address storeAddress,
    address owner,
    uint256 amount,
    string store,
    string invoice,
    uint256 totalAmount
  );

  constructor() payable  {
    _marketOwner = payable(msg.sender);
  }

  function initTransaction(address _nftContract, string memory name, uint256 _tokenId, uint256 _amount, address payable _storeAddress, string memory store) public payable nonReentrant() {
    require(_amount > 0, "Amount must be at least 1 wei");

    address payable buyer = payable(msg.sender);
    _nftCount.increment();
    _idToNFT[_tokenId] = NFT(
      _nftContract,
      _tokenId,
      name,
      _storeAddress,
      buyer,
      _amount,
      store,
      "",
      false,
      0,
      block.timestamp
    );

    emit NFTListed(_nftContract, _tokenId, name, _storeAddress, buyer, _amount, store);
  }
  function approveTransaction(address _nftContract, uint256 _tokenId, uint256 _amount, string memory invoice) public payable nonReentrant() {
    NFT storage nft = _idToNFT[_tokenId];
    require(msg.sender == nft.storeAddress, "you cannot approve the transaction");
    require(_amount > 0, "amount must be at least 1 wei");
    require(_amount <= nft.amount, "amount must be less than or equal to the value");
    uint tmp = nft.amount;
    payable(nft.storeAddress).transfer(_amount);
    tmp-=_amount;
    payable(nft.owner).transfer(tmp);
    nft.invoice = invoice;
    nft.done = true;
    nft.totalAmount = _amount;
    nft.time = block.timestamp;
    _idToNFT[_tokenId] = nft;
    emit NFTSold(_nftContract, _tokenId, nft.name, nft.storeAddress, nft.owner, _amount, nft.store, invoice, _amount);

    IERC721(_nftContract).transferFrom(nft.owner,  address(bytes20(bytes("0x0000000000000000000000000000000000000000"))), _tokenId);
    
  }

  function cancelTransaction(address _nftContract, uint256 _tokenId) public payable nonReentrant() {
    NFT storage nft = _idToNFT[_tokenId];
    require(msg.sender == nft.owner, "you cannot cancel the transaction");
    payable(nft.owner).transfer(nft.amount);
    IERC721(_nftContract).transferFrom(nft.owner,  address(bytes20(bytes("0x0000000000000000000000000000000000000000"))), _tokenId);
    delete _idToNFT[_tokenId];

  }

  function transferNFT(address _nftContract, uint256 _tokenId, address payable to) public payable nonReentrant() {
    NFT storage nft = _idToNFT[_tokenId];
    require(msg.sender == nft.owner, "you cannot transfer the nft");
    IERC721(_nftContract).transferFrom(nft.owner,  to, _tokenId);
    nft.time = block.timestamp;
    nft.owner = to;
  }

  function getMyTransactions() public view returns (NFT[] memory) {
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

  function getStoreTransactions(address storeAddress) public view returns (NFT[] memory) {
    uint nftCount = _nftCount.current();
    uint storeNft = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i + 1].storeAddress == storeAddress) {
        storeNft++;
      }
    }

    NFT[] memory nfts = new NFT[](storeNft);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i + 1].storeAddress == storeAddress) {
        nfts[nftsIndex] = _idToNFT[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }

  function getAllStores() public view returns (storeDetails[] memory) {
    return stores;
  }
  function addStore(string memory store, address storeAddress, string memory image) public payable {
    bool check = true;
    storeDetails[] memory storeD = stores;
    for (uint i = 0; i < stores.length; i++) {
      if (storeAddress == storeD[i].storeAddress) {
        check=false;
        break;
      }
    }
    if (check) {
      storeDetails memory tmp = storeDetails(
        store,
        storeAddress,
        image
      );
      stores.push(tmp);
    } else {
      revert("Store already exists");
    }
  }
}

