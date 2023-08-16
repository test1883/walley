// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Wallet {
    //state variables
    uint public quorum = 2;
    address[] appr;
    struct Transfer {
        uint id;
        uint amount;
        address payable to;
        uint approvals;
        bool sent;
        address[] approvers;
    }
    Transfer[] public transfers;
    mapping(address => mapping(uint => bool)) public approvals;

    /// @return returns array of transfers of struct Transfer
    function getTransfers() external view returns(Transfer[] memory) {
        return transfers;
    }
  
    /// @param amount How much ether to transfer
    /// @param to Address of who is receiving the ether
    function createTransfer(uint amount, address payable to) external {
        appr.push(msg.sender);
        appr.push(to);
        transfers.push(Transfer(
            transfers.length,
            amount,
            to,
            0,
            false,
            appr
            )
        );
        appr.pop();
        appr.pop();
    }
    /// @param id ID of transfer to be approved
    function approveTransfer(uint id) external onlyApprover(id) {
        require(transfers[id].sent == false, 'transfer has already been sent');
        require(approvals[msg.sender][id] == false, 'cannot approve transfer twice');
        
        approvals[msg.sender][id] = true;
        transfers[id].approvals++;
        
        if(transfers[id].approvals >= quorum) {
            transfers[id].sent = true;
            address payable to = transfers[id].to;
            uint amount = transfers[id].amount;
            to.transfer(amount); //transfer is method for addresses in solidity
        }
    }
    
    //native way to receive ether
    receive() external payable {}
    
    modifier onlyApprover(uint id) {
        bool allowed = false;
        for (uint i =0; i< transfers[id].approvers.length; i++) {
            if(transfers[id].approvers[i] == msg.sender) {
                allowed = true;
            }
        }
        require(allowed == true, 'only approver allowed');
        _;
    }
}