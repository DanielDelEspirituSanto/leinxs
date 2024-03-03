// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract leinxs is ERC20, Ownable {

    mapping(address => uint256) private _stakes;
    mapping(address => uint256) private _LXSstakeTime;
    uint256 private _rewardRate = 2;
    uint256 private WithdrawLXSTime = 9; //9secs


    constructor(address initialOwner) 
        ERC20("leinxs", "LXS") 
        Ownable(initialOwner) 
    {}

    function mint(address to, uint256 amount) public {
        uint256 WEILXSCOIN = amount * 1e18;
        _mint(to, WEILXSCOIN);
    }

    function stake(uint256 amount) public {
        uint256 WEILXSCOIN = amount * 1e18;
        require(WEILXSCOIN > 0, "Insufficient balance, MINT more LXS");
        require(balanceOf(msg.sender) >= WEILXSCOIN, "NO BALANCE");

        _stakes[msg.sender] += WEILXSCOIN;
        _LXSstakeTime[msg.sender] = block.timestamp;
        _transfer(msg.sender, address(this), WEILXSCOIN);
  }

     function TimeWithdrawLXS(address account) public view returns (uint256) {
        uint256 time = (block.timestamp - _LXSstakeTime[account]);
        return time;
  } 

    function WLXS() public {
        require(block.timestamp > (_LXSstakeTime[msg.sender] + WithdrawLXSTime), "Cannot Withdraw, Please wait for the countdown.");
        require(_stakes[msg.sender] > 0, "No staked LXS");

        uint256 stakedLXS = _stakes[msg.sender];
        uint256 rewardforminting = ((block.timestamp - _LXSstakeTime[msg.sender]) * _rewardRate) * 1e18;

        _stakes[msg.sender] = 0;
        _transfer(address(this), msg.sender, stakedLXS);
        _mint(msg.sender, rewardforminting);
  }

}