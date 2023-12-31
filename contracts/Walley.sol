// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Walley is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  address marketplaceContract;
  mapping(uint256 => string) private passwords;
  event NFTMinted(uint256);

  constructor(address _marketplaceContract) ERC721("Walley", "WLL") {
    marketplaceContract = _marketplaceContract;
  }
  function checkPassword(uint256 tokenId, string memory password) public view returns(bool) {
    string memory pass = passwords[tokenId];
    return keccak256(abi.encodePacked(pass)) == keccak256(abi.encodePacked(password));
  }

  function mint(string memory password) public{
    _tokenIds.increment();
    uint256 newTokenId = _tokenIds.current();
    _safeMint(msg.sender, newTokenId);
    passwords[newTokenId]=password;
    setApprovalForAll(marketplaceContract, true);
    emit NFTMinted(newTokenId);
  }
}
