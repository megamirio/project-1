import Splitter from "../contracts/Splitter.sol";
import Promise from "bluebird";

Promise.promisifyAll(web3.eth, {suffix: "Promise"});

contract('Splitter', function (accounts) {

    const alice = accounts[0];  //Alice
    const bob = accounts[1]; //Bob
    const carol = accounts[3];  //Carol

    var inst;

    beforeEach("Splitter creation", () => Splitter.new({from: accounts[0]}).then(_inst => inst = _inst));
    var sendEther;

    it("Alice sends Ether to Bob and Carol", sendEther = async () => {

        var FOR_ADDING = 10000000;
        var initBalances;

        assert(accounts.length >= 3, "Should be at least 3 accounts (Alice, Bob and Carol)");

        const balance = await web3.eth.getBalancePromise(accounts[0]);

        const monBalance = await () => {
            assert(balance > value_to_add, "Alice have no money to send 10000000 Wei");
            var balances = [];
            for (i = 0; i < 3; i++) {
                balances.push(web3.eth.getBalancePromise(accounts[i]));
            }
            return Promise.all(balances);
        };

        const transaction = await function


        // return web3.eth.getBalancePromise(accounts[0]).then
        // (
        //     balance => {
        //         assert(balance > FOR_ADDING, "Alice does not have enought money to send 10000000 Wei");
        //         var balancePromises = [];
        //         for (i = 0; i < 3; i++)
        //             balancePromises.push(web3.eth.getBalancePromise(accounts[i]));
        //         return Promise.all(balancePromises);
        //     }
    ).
        then(balances => {
            initBalances = balances;
            return inst.sendEther.sendTransaction(accounts[1], accounts[2], {from: accounts[0], value: FOR_ADDING});
        }).then(() => {
            return Promise.all([inst.balances.call(accounts[0]), inst.balances.call(accounts[1]), inst.balances.call(accounts[2])]);
        }).then((balances) => {
            assert.equal(balances[0], 0, "Alice balance failed");
            assert.equal(balances[1], FOR_ADDING / 2, "Bob balance failed");
            assert.equal(balances[2], FOR_ADDING - FOR_ADDING / 2, "Carol balance failed");
        });
    });

    it("Bob withdraw the funds", function () {

        var value_to_withdraw = 1000000;
        var gasPrice = 1000;
        var initBalance;
        var bob = accounts[1];
        var transcation;
        var gasUsed;
        var expectedBalance;

        return web3.eth.getBalancePromise(bob).then(balance => {
            initBalance = balance;
            return sendEther();
        })
            .then(() => inst.balances.call(bob))
            .then((balance) => assert.equal(balance.toString(), 5000000, "initial balance of Bob in contract is wrong"))
            .then(() => inst.withdraw.sendTransaction(value_to_withdraw, {from: bob, gasPrice: gasPrice}))
            .then((result) => {
                transcation = result;
                return inst.balances.call(bob);
            })
            .then((balance) => assert.equal(balance.toString(), 4000000, "Bobs balance in contract after withdraw"))
            .then(() => web3.eth.getTransactionReceipt(transcation))
            .then((result) => {
                return result["gasUsed"];
            })
            .then((result) => expectedBalance = initBalance - result * gasPrice + value_to_withdraw)
            .then(() => web3.eth.getBalancePromise(bob))
            .then((balance) => {
                assert.equal(balance.toString(), expectedBalance, "actual Bobs balance is wrong after withdraw");
            });

    });
});
