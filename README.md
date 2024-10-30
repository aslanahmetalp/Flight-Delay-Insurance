Flight Delay Insurance Smart Contract

This project is a decentralized insurance smart contract for Ethereum, designed to automatically execute payments when a flight delay occurs. Users can purchase an insurance policy for a specified delay threshold, and when an oracle confirms the delay, the insured user is paid out automatically.

Project Features
Policy Purchase: Users can buy insurance policies by specifying the delay threshold and payout amount.
Oracle Confirmation: An external oracle confirms the flight delay duration, verifying that it meets the threshold set in the policy.
Automatic Payout: If the delay is confirmed by the oracle, the smart contract executes the payment to the policyholder.
Oracle and Insurer Management: Only the insurer can update the oracle address, ensuring secure operations.

Getting Started:
1-Clone the repository and navigate to the project directory.
2-Set up your environment (e.g., Infura, Rinkeby network, Oracle address).
3-Deploy the contract using Truffle.

Prerequisites:
Truffle
Node.js
A Web3 provider like Infura
