// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

contract FileFunder {
    // map wallets to wei funded
    mapping(address user => uint balance) public fileFund;
    event AccountFunded(address indexed _addr, uint _amount, uint newBalance);
    event WithdrawFunds(address indexed _addr, uint _amount, uint newBalance);

    function fundAccount(address _addr) public payable {
        require(msg.value > 0);
        uint currBal = fileFund[_addr];
        fileFund[_addr] = msg.value + currBal;

        emit AccountFunded(_addr, msg.value, msg.value + currBal);
    }

    function withdraw(address _addr) public payable {
        uint currBal = fileFund[_addr];
        require(currBal > 0, "Balance must be greater than zero");

        (bool sent, bytes memory _data) = _addr.call{value: currBal}("");
        require(sent, "Could not send");

        fileFund[_addr] = 0;

        emit WithdrawFunds(_addr, msg.value, 0);
    }
}
