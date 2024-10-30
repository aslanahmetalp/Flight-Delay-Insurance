// deploy.js
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const FlightDelayInsurance = require('./build/contracts/FlightDelayInsurance.json');

const provider = new HDWalletProvider(
    'YOUR_MNEMONIC_PHRASE', // Add your wallet password here

    'https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID' // Add Infura address for Rinkeby testnet
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Deploying from account:', accounts[0]);

    const result = await new web3.eth.Contract(FlightDelayInsurance.abi)
        .deploy({ data: FlightDelayInsurance.bytecode, arguments: ['0xYourOracleAddress'] }) // Real oracle address is here
        .send({ from: accounts[0], gas: '1000000' });

    console.log('Contract deployed to:', result.options.address);
    provider.engine.stop();
};

deploy();
