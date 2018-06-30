let USHToken = artifacts.require("./USHToken.sol"),
    Crowdsale = artifacts.require("./Crowdsale.sol"),
  

let eth = web3.eth,
    owner = eth.accounts[0],
    wallet = eth.accounts[1],
    buyer = eth.accounts[2],
    buyer2 = eth.accounts[3],
    totalTokensSold = 0,
    buyerTokenBalance = 0,
    buyer2TokenBalance = 0;

let totalSupply = 698396562013061000000000+10**18;
    totalTokenForSale = totalSupply,
    maxCap = totalTokenForSale;

const timeTravel = function (time) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [time], // 86400 is num seconds in day
            id: new Date().getTime()
        }, (err, result) => {
            if (err) { return reject(err) }
            return resolve(result)
        });
    })
}

const mineBlock = function () {
    return new Promise((resolve, reject) => {
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_mine"
        }, (err, result) => {
            if (err) { return reject(err) }
            return resolve(result)
        });
    })
}

var printBalance = async function () {
    const ownerBalance = web3.eth.getBalance(owner);
    const walletBalance = web3.eth.getBalance(wallet);
    const buyerBalance = web3.eth.getBalance(buyer);
    const crowdsaleBalance = web3.eth.getBalance(Crowdsale.address);

    let token = await USHToken.deployed();
    let balance = await token.balanceOf.call(owner);
    console.log("Owner balance: ", web3.fromWei(ownerBalance, "ether").toString(), " ETHER / ", web3.fromWei(balance.valueOf(), "ether").toString(), " ENT");
    balance = await token.balanceOf.call(buyer);
    console.log("Buyer balance: ", web3.fromWei(buyerBalance, "ether").toString(), " ETHER / ", web3.fromWei(balance.valueOf(), "ether").toString(), " ENT");
    balance = await token.balanceOf.call(Crowdsale.address);
    console.log("Crowdsale balance: ", web3.fromWei(crowdsaleBalance, "ether").toString(), " ETHER / ", web3.fromWei(balance.valueOf(), "ether").toString(), " ENT");
    balance = await token.balanceOf.call(wallet);
    console.log("wallet balance: ", web3.fromWei(walletBalance, "ether").toString(), " ETHER / ", web3.fromWei(balance.valueOf(), "ether").toString(), " ENT");
}

contract('ICO', function (accounts) {
    var investEther = async function (sum, from) {
        var investSum = web3.toWei(sum, "ether");

        let ico = await Crowdsale.deployed();
        let txn = await ico.sendTransaction({ from: from, to: ico.address, value: investSum });
        let token = await USHToken.deployed();
        let balance = await token.balanceOf.call(from);
        return balance;
    }

    it("should remain 0 USHToken in the first account", async function () {
        await printBalance();
        let token = await USHToken.deployed();
        let balance = await token.balanceOf.call(owner);
        assert.equal(web3.fromWei(balance.valueOf()), 0, "0 wasn't in the first account");
    });

    it("should have " + maxCap + " USHToken in Crowdsale contract", async function () {
        let token = await USHToken.deployed();
        let balance = await token.balanceOf.call(Crowdsale.address);
        assert.equal(web3.fromWei(balance.valueOf()), maxCap, maxCap + " wasn't in the Crowdsale account")
    });

    it("Should burn the remaining tokens", async function () {
        let token = await USHToken.deployed();
        let ico = await Crowdsale.deployed();
        let txn = await ico.doAlloc({ from: owner });
        let balance = await token.balanceOf.call(Crowdsale.address);
        assert.equal(balance.valueOf(), 0, "Crowdsale contract still have tokens.");
        await printBalance();
    });

});
