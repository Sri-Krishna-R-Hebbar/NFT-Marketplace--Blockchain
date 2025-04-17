
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    struct NFTItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }
    
    mapping(uint256 => NFTItem) private idToNFTItem;
    
    event NFTItemCreated (
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );
    
    constructor() ERC721("NFT Marketplace", "NFTM") Ownable(msg.sender) {}
    
    function createNFTItem(string memory tokenURI, uint256 price) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createMarketItem(newTokenId, price);
        
        return newTokenId;
    }
    
    function createMarketItem(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be at least 1 wei");
        
        idToNFTItem[tokenId] = NFTItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );
        
        _transfer(msg.sender, address(this), tokenId);
        
        emit NFTItemCreated(
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }
    
    function purchaseNFT(uint256 tokenId) public payable {
        NFTItem storage item = idToNFTItem[tokenId];
        uint256 price = item.price;
        address seller = item.seller;
        
        require(msg.value == price, "Please submit the asking price");
        require(!item.sold, "Item already sold");
        
        item.owner = payable(msg.sender);
        item.sold = true;
        
        _transfer(address(this), msg.sender, tokenId);
        payable(seller).transfer(msg.value);
    }
    
    function fetchMarketItems() public view returns (NFTItem[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint unsoldItemCount = 0;
        
        for (uint i = 1; i <= totalItemCount; i++) {
            if (!idToNFTItem[i].sold) {
                unsoldItemCount++;
            }
        }
        
        NFTItem[] memory items = new NFTItem[](unsoldItemCount);
        uint currentIndex = 0;
        
        for (uint i = 1; i <= totalItemCount; i++) {
            if (!idToNFTItem[i].sold) {
                items[currentIndex] = idToNFTItem[i];
                currentIndex++;
            }
        }
        
        return items;
    }
    
    function fetchMyNFTs() public view returns (NFTItem[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        
        for (uint i = 1; i <= totalItemCount; i++) {
            if (idToNFTItem[i].owner == msg.sender) {
                itemCount++;
            }
        }
        
        NFTItem[] memory items = new NFTItem[](itemCount);
        uint currentIndex = 0;
        
        for (uint i = 1; i <= totalItemCount; i++) {
            if (idToNFTItem[i].owner == msg.sender) {
                items[currentIndex] = idToNFTItem[i];
                currentIndex++;
            }
        }
        
        return items;
    }
}
