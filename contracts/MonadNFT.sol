// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MonadNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Цена минтинга в wei (0.01 MON = 10000000000000000 wei)
    uint256 public mintPrice = 0.01 ether;
    
    // Максимальное количество NFT
    uint256 public maxSupply = 10000;
    
    // События
    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event MintPriceUpdated(uint256 newPrice);

    constructor(address initialOwner) 
        ERC721("MonadNFT", "MNFT") 
        Ownable(initialOwner) 
    {
        // Начинаем с токена ID = 1
        _tokenIdCounter.increment();
    }

    /**
     * @dev Минтинг NFT с URI метаданных
     * @param to Адрес получателя NFT
     * @param uri URI метаданных (IPFS ссылка)
     */
    function mintNFT(address to, string memory uri) public payable returns (uint256) {
        // Проверяем оплату
        require(msg.value >= mintPrice, "Insufficient payment");
        
        // Проверяем лимит
        require(_tokenIdCounter.current() <= maxSupply, "Max supply reached");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Минтим NFT
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        // Возвращаем лишние средства
        if (msg.value > mintPrice) {
            payable(msg.sender).transfer(msg.value - mintPrice);
        }
        
        emit NFTMinted(to, tokenId, uri);
        return tokenId;
    }

    /**
     * @dev Минтинг для владельца (бесплатно)
     */
    function ownerMint(address to, string memory uri) public onlyOwner returns (uint256) {
        require(_tokenIdCounter.current() <= maxSupply, "Max supply reached");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit NFTMinted(to, tokenId, uri);
        return tokenId;
    }

    /**
     * @dev Получить общее количество заминченных NFT
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current() - 1;
    }

    /**
     * @dev Обновить цену минтинга (только владелец)
     */
    function setMintPrice(uint256 _newPrice) public onlyOwner {
        mintPrice = _newPrice;
        emit MintPriceUpdated(_newPrice);
    }

    /**
     * @dev Вывести средства (только владелец)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(owner()).transfer(balance);
    }

    /**
     * @dev Получить информацию о NFT
     */
    function getNFTInfo(uint256 tokenId) public view returns (
        address owner,
        string memory tokenURI,
        bool exists
    ) {
        exists = _ownerOf(tokenId) != address(0);
        if (exists) {
            owner = ownerOf(tokenId);
            tokenURI = tokenURI(tokenId);
        }
    }

    // Переопределяем функции для совместимости
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
