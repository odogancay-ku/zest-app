// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

    struct Swap {
        address owner;
        string  receiveAddress;
        uint256 toBeReceived;
        uint256 toBeSent;
        uint256 timeLock;
        bool isOpen;
    }

contract AtomicSwap {
    address public bitcoinClient;
    mapping(uint256 => Swap) public swaps;
    uint256 swapCount;

    event SwapCreated(address indexed sender, string receiveAddress,uint256 toBeSent, uint256 toBeReceived, uint256 timeLock, uint256 swapId);
    event FundsWithdrawn(address indexed receiver, uint256 amount);
    event FundsRefunded(address indexed sender, uint256 amount);
    event VerificationRequested(bytes32 txid, uint256 swapId, string owner, uint256 amount);
    event ContractCreated(address indexed owner);

    constructor(address _bitcoinClient) {
        bitcoinClient = _bitcoinClient;
        emit ContractCreated(msg.sender);
    }

    modifier onlyBitcoinClient() {
        require(msg.sender == address(bitcoinClient), "Only BitcoinClient can call this function");
        _;
    }

    function createSwap(
        string memory receiveAddress,
        uint256 toBeReceived
    ) external payable {
        require(toBeReceived > 0, "Amount must be greater than zero");
        require(msg.value > 0, "Amount must be greater than zero");

        uint256 timeLock = block.timestamp + 7 days;
        swapCount++;

        swaps[swapCount] = Swap({
            owner: msg.sender,
            receiveAddress: receiveAddress,
            toBeSent: msg.value,
            toBeReceived: toBeReceived,
            timeLock: timeLock,
            isOpen: false
        });
        emit SwapCreated(msg.sender, receiveAddress,msg.value, toBeReceived, timeLock, swapCount);
    }

    function initiateVerification(bytes32 txid, uint256 swapId) external {
        Swap storage swap = swaps[swapId];
        require(!swap.isOpen, "Swap already completed");
        emit VerificationRequested(txid, swapId, swap.receiveAddress, swap.toBeReceived);
    }

    function completeVerification(
        uint256 swapId,
        bool isVerified,
        address recipient
    ) external onlyBitcoinClient {
        require(isVerified, "Transaction not verified");
        Swap storage swap = swaps[swapId];
        require(!swap.isOpen, "Swap already completed");
        swap.isOpen = true;
        payable(recipient).transfer(swap.toBeSent);
        emit FundsWithdrawn(recipient, swap.toBeSent);
    }

    function refund(uint256 swapId) external {
        Swap storage swap = swaps[swapId];
        require(msg.sender == swap.owner, "Not the swap owner");
        require(block.timestamp > swap.timeLock, "Too early to refund");
        require(!swap.isOpen, "Swap already completed");

        swap.isOpen = true;
        payable(swap.owner).transfer(swap.toBeSent);
        emit FundsRefunded(swap.owner, swap.toBeSent);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getSwap(uint256 swapId) public view returns (Swap memory) {
        return swaps[swapId];
    }
}