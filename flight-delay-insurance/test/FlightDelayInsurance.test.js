// FlightDelayInsurance.test.js
const FlightDelayInsurance = artifacts.require("FlightDelayInsurance");

contract("FlightDelayInsurance", (accounts) => {
    const insurer = accounts[0];
    const oracle = accounts[1];
    const user = accounts[2];

    let insuranceInstance;

    before(async () => {
        insuranceInstance = await FlightDelayInsurance.new(oracle, { from: insurer });
    });

    it("should allow a user to purchase a policy", async () => {
        const premiumAmount = web3.utils.toWei("0.1", "ether");
        const payoutAmount = web3.utils.toWei("1", "ether");
        const delayThreshold = 120; // late time (minutes)

        await insuranceInstance.purchasePolicy(delayThreshold, payoutAmount, {
            from: user,
            value: premiumAmount
        });

        const policy = await insuranceInstance.policies(0);
        assert.equal(policy.policyHolder, user, "Policy holder should be the user");
        assert.equal(policy.premiumAmount, premiumAmount, "Premium amount should match");
        assert.equal(policy.payoutAmount, payoutAmount, "Payout amount should match");
    });

    it("should allow oracle to confirm delay and execute payout", async () => {
        const policyId = 0;
        const delayDuration = 130; // late time (minutes)

        // Oracle delay notification
        await insuranceInstance.reportDelay(policyId, delayDuration, { from: oracle });
        const policyAfterDelay = await insuranceInstance.policies(policyId);
        assert.equal(policyAfterDelay.delayConfirmed, true, "Delay should be confirmed by oracle");

        // Payout execution
        const initialUserBalance = web3.utils.toBN(await web3.eth.getBalance(user));
        await insuranceInstance.executePayout(policyId, { from: insurer });
        const finalUserBalance = web3.utils.toBN(await web3.eth.getBalance(user));

        assert(finalUserBalance.gt(initialUserBalance), "User balance should increase after payout");
    });

    it("should prevent payout if delay is not confirmed", async () => {
        const policyId = 1;
        await insuranceInstance.purchasePolicy(150, web3.utils.toWei("1", "ether"), {
            from: user,
            value: web3.utils.toWei("0.1", "ether")
        });

        try {
            await insuranceInstance.executePayout(policyId, { from: insurer });
            assert.fail("Payout should not succeed without delay confirmation");
        } catch (error) {
            assert(error.toString().includes("Delay not confirmed by oracle"), "Expected delay not confirmed error");
        }
    });
});
