// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FlightDelayInsurance {

    struct Policy {
        address policyHolder;
        uint256 premiumAmount;
        uint256 payoutAmount;
        uint256 purchaseTime;
        uint256 delayThreshold;
        bool delayConfirmed;
        bool paidOut;
    }

    address public insurer;
    address public oracle;
    uint256 public policyCount;
    mapping(uint256 => Policy) public policies;

    // Events
    event PolicyPurchased(uint256 indexed policyId, address indexed policyHolder, uint256 premiumAmount, uint256 payoutAmount);
    event DelayConfirmed(uint256 indexed policyId, uint256 delayDuration);
    event PayoutExecuted(uint256 indexed policyId, address indexed policyHolder, uint256 payoutAmount);

    // Modifiers
    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle can call this function.");
        _;
    }

    modifier onlyInsurer() {
        require(msg.sender == insurer, "Only insurer can perform this action.");
        _;
    }

    // Builder function (setting insurance company and oracle address)
    constructor(address _oracle) payable {
        insurer = msg.sender;
        oracle = _oracle;
    }

    // Purchasing an insurance policy
    function purchasePolicy(uint256 _delayThreshold, uint256 _payoutAmount) external payable {
        require(msg.value > 0, "Premium amount must be greater than zero.");
        
        policies[policyCount] = Policy({
            policyHolder: msg.sender,
            premiumAmount: msg.value,
            payoutAmount: _payoutAmount,
            purchaseTime: block.timestamp,
            delayThreshold: _delayThreshold,
            delayConfirmed: false,
            paidOut: false
        });

        emit PolicyPurchased(policyCount, msg.sender, msg.value, _payoutAmount);
        policyCount++;
    }

    // Oracle delay notification function
    function reportDelay(uint256 policyId, uint256 delayDuration) external onlyOracle {
        Policy storage policy = policies[policyId];
        require(!policy.paidOut, "Policy has already been paid out.");
        require(!policy.delayConfirmed, "Delay has already been confirmed for this policy.");
        
        if (delayDuration >= policy.delayThreshold) {
            policy.delayConfirmed = true;
            emit DelayConfirmed(policyId, delayDuration);
        }
    }

    // Make payment when delay is confirmed
    function executePayout(uint256 policyId) external onlyInsurer {
        Policy storage policy = policies[policyId];
        require(policy.delayConfirmed, "Delay not confirmed by oracle.");
        require(!policy.paidOut, "Payout already executed for this policy.");

        policy.paidOut = true;
        payable(policy.policyHolder).transfer(policy.payoutAmount);

        emit PayoutExecuted(policyId, policy.policyHolder, policy.payoutAmount);
    }

    // Update Oracle address (for insurance company)
    function updateOracle(address _newOracle) external onlyInsurer {
        oracle = _newOracle;
    }

    // Contract balance check
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
