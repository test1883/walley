// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Walley is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  address marketplaceContract;
  event NFTMinted(uint256);

  constructor(address _marketplaceContract) ERC721("Walley", "WLL") {
    marketplaceContract = _marketplaceContract;
  }

  function mint() public returns(uint256){
    _tokenIds.increment();
    uint256 newTokenId = _tokenIds.current();
    _safeMint(msg.sender, newTokenId);
    // _setTokenURI(newTokenId, _tokenURI);
    setApprovalForAll(marketplaceContract, true);
    emit NFTMinted(newTokenId);
    return newTokenId;
  }
}
