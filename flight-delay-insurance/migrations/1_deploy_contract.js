// 1_deploy_contract.js
const FlightDelayInsurance = artifacts.require("FlightDelayInsurance");

module.exports = function (deployer) {
    // The oracle address can be set as a fixed address here, but can be replaced with a real oracle address.
    const oracleAddress = "0xYourOracleAddress"; // Add real oracle address here
    deployer.deploy(FlightDelayInsurance, oracleAddress);
};
