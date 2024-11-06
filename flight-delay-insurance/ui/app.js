// Web3.js ile bağlantıyı sağlayın
let web3;
let contract;
const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Kontrat adresini buraya ekleyin
const contractABI = /* Kontratın ABI’sini buraya ekleyin */

window.onload = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await ethereum.request({ method: 'eth_requestAccounts' });
        contract = new web3.eth.Contract(contractABI, contractAddress);
    } else {
        alert("Metamask yüklü değil! Devam etmek için lütfen yükleyin.");
    }
};

function showBuyInsurance() {
    document.getElementById("buy-insurance").style.display = "block";
    document.getElementById("policies").style.display = "none";
}

function showPolicies() {
    document.getElementById("buy-insurance").style.display = "none";
    document.getElementById("policies").style.display = "block";
}

async function purchasePolicy() {
    const flightNumber = document.getElementById("flightNumber").value;
    const delayThreshold = document.getElementById("delayThreshold").value;
    const payoutAmount = web3.utils.toWei(document.getElementById("payoutAmount").value, "ether");
    const premiumAmount = web3.utils.toWei(document.getElementById("premiumAmount").value, "ether");

    const accounts = await web3.eth.getAccounts();
    await contract.methods.purchasePolicy(delayThreshold, payoutAmount)
        .send({ from: accounts[0], value: premiumAmount });

    alert("Poliçe başarıyla satın alındı!");
}

async function reportDelay(policyId, delayDuration) {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.reportDelay(policyId, delayDuration)
        .send({ from: accounts[1] }); // Oracle hesabını kullanın

    alert("Gecikme oracle tarafından onaylandı!");
}

async function executePayout(policyId) {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.executePayout(policyId)
        .send({ from: accounts[0] }); // Yönetici hesabını kullanın

    alert("Ödeme başarıyla gerçekleştirildi!");
}
