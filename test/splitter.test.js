import Splitter from "../contracts/Splitter.sol";
import Promise from "bluebird";

Promise = require("bluebird");
Promise.promisifyAll(web3.eth, { suffix: "Promise" });

contract('Splitter', function(accounts) {

    var instance;

    beforeEach("Create new Splitter", ()=>
        Splitter.new({from:accounts[0]}).then(_instance => instance = _instance)
    );

    var sendEtherFunction;

    it("Alice(accounts[0]) should send Ether to contract for Bob(accounts[1]) and Carol(accounts[2])", sendEtherFunction = function() {

        var VALUE_FOR_ADD = 10000000;
        var initBalances;

        assert(accounts.length>=3, "not enought acccounts to test");
        return web3.eth.getBalancePromise(accounts[0]).then
        (
            balance =>
            {
                assert(balance> VALUE_FOR_ADD, "Alice does not have enought money to send 10000000 Wei");
                var balancePromises = []
                for(i=0;i<3;i++)
                    balancePromises.push(web3.eth.getBalancePromise(accounts[i]));
                return Promise.all(balancePromises);
            }
        ).then(balances =>
        {
            initBalances = balances;
            return instance.sendEther.sendTransaction(accounts[1], accounts[2], { from: accounts[0], value: VALUE_FOR_ADD});
        }).then(() =>
        {
            return Promise.all([instance.balances.call(accounts[0]),instance.balances.call(accounts[1]),instance.balances.call(accounts[2])]);
        }).then((balances) =>
        {
            assert.equal(balances[0], 0, "Alice balance failed");
            assert.equal(balances[1], VALUE_FOR_ADD / 2, "Bob balance failed");
            assert.equal(balances[2], VALUE_FOR_ADD - VALUE_FOR_ADD / 2, "Carol balance failed");
        });
    });

    it("Bob(accounts[1]) should withdraw part of the funds", withdrawEtherFunction = function() {

        var VALUE_FOR_WITHDRAW = 1000000;
        var GAS_PRICE = 1000;
        var initBalance;
        var bob = accounts[1];
        var transcation;
        var gasUsed;
        var expectedBalance;

        return web3.eth.getBalancePromise(bob).then( balance =>
        {
            initBalance = balance;
            return sendEtherFunction();
        })
            .then(()=> instance.balances.call(bob))
            .then((balance)=> assert.equal(balance.toString(), 5000000, "initial balance of Bob in contract is wrong"))
            .then(()=> instance.withdraw.sendTransaction(VALUE_FOR_WITHDRAW, {from : bob, gasPrice : GAS_PRICE}))
            .then((result)=> { transcation=result; return instance.balances.call(bob);})
            .then((balance)=> assert.equal(balance.toString(), 4000000, "Bobs balance in contract after withdraw"))
            .then(()=>web3.eth.getTransactionReceipt(transcation))
            .then((result)=> {return result["gasUsed"];})
            .then((result) => expectedBalance = initBalance - result * GAS_PRICE + VALUE_FOR_WITHDRAW)
            .then(()=>web3.eth.getBalancePromise(bob))
            .then((balance)=> {
                assert.equal(balance.toString(), expectedBalance, "actual Bobs balance is wrong after withdraw");
            });

    });



});
