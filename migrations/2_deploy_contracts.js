var USHToken = artifacts.require("./USHToken.sol");
var Crowdsale = artifacts.require("./Crowdsale.sol");


module.exports = function (deployer) {

	var maxCap = 698396562013061000000000+10**18;
				 
	return deployer.deploy(USHToken,{gas:1500000}).then(function () {
		//log the address of the USHToken
		console.log("USHToken deployed !! address: " + USHToken.address);
		//deploy the Crowdsale contract
		return deployer.deploy(Crowdsale, USHToken.address,{gas:4400000}).then(function () {
			console.log("Crowdsale deployed address: " + Crowdsale.address);
			return USHToken.deployed().then(function (token) {
				return Crowdsale.deployed().then(function (crowdsale) {
					// send token to crowdsale contract
					console.log("transfer tokens to crowdsale")
					return token.transfer(Crowdsale.address, maxCap).then(function () {
						token.balanceOf.call(Crowdsale.address).then(function (balance) {
							console.log("crowdsale balance:",balance.toNumber())
							return crowdsale.doAlloc({gas:3800000}).then(function() {
									console.log("alloc 1 done")
									return crowdsale.doAlloc2({gas:3800000}).then(function() {
										console.log("alloc 2 done")
										return crowdsale.doAlloc3({gas:3800000}).then(function() {
											return token.balanceOf.call(Crowdsale.address).then(function (balance2) {
												console.log("crowdsale balance:",balance2.toNumber())
											});
										});
								});
							});
						});
					});
				});
			}); 
		});
	});
};
