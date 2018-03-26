import Splitter from "../contracts/Splitter.sol";
import Promise from "bluebird";

Promise.promisifyAll(web3.eth, {suffix: "Promise"});

contract('Splitter', (accounts) => {

    const alice = alice;  //Alice
    const bob = bob; //Bob
    const carol = accounts[3];  //Carol

    let inst;

    beforeEach("Splitter creation", () => Splitter.new({from: alice}).then(_inst => inst = _inst));
    var sendEther;

    it("Alice sends Ether to Bob and Carol", sendEther = async () => {

        var FOR_ADDING = 10000000;
        var initBalance;

        assert(accounts.length >= 3, "Should be at least 3 accounts (Alice, Bob and Carol)");

        const balance = await web3.eth.getBalancePromise(alice);

        const monBalance = await function () {
            assert(balance > value_to_add, "Alice have no money to send 10000000 Wei");
            var balances = [];
            balances.push(web3.eth.getBalancePromise(alice));
            balances.push(web3.eth.getBalancePromise(bob));
            balances.push(web3.eth.getBalancePromise(carol));
            return Promise.all(balances);
        };

        await function () {
            initBalance = monBalance;
            return inst.send.sendTransaction(bob, carol, {from: alice, value: FOR_ADDING});
        }

        const compBalances = await function () {
            return Promise.all([inst.balances.call(alice), inst.balances.call(bob), inst.balances.call(carol)]);
        }

        assert.equal(compBalances[0], 0);
        assert.equal(compBalances[1], FOR_ADDING);
        assert.equal(compBalances[2], FOR_ADDING);
    });


    it("Withdrawing", () => {

        const WITHDRAW_AMMOUNT = 1000000;
        const GAT_PRICE = 1000;

        let initBalance;
        let transcation;
        let expectedBalance;

        return web3.eth.getBalancePromise(bob).then(balance => {
            initBalance = balance;
            return sendEther();
        })
            .then(() => inst.balances.call(bob))
            .then((balance) => assert.equal(balance.toString(), 5000000, "initial balance of Bob in contract is wrong"))
            .then(() => inst.withdraw.sendTransaction(WITHDRAW_AMMOUNT, {from: bob, gasPrice: GAT_PRICE}))
            .then((result) => {
                transcation = result;
                return inst.balances.call(bob);
            })
            .then((balance) => assert.equal(balance.toString(), 4000000, "Bobs balance in contract after withdraw"))
            .then(() => web3.eth.getTransactionReceipt(transcation))
            .then((result) => {
                return result["gasUsed"];
            })
            .then((result) => expectedBalance = initBalance - result * GAT_PRICE + WITHDRAW_AMMOUNT)
            .then(() => web3.eth.getBalancePromise(bob))
            .then((balance) => {
                assert.equal(balance.toString(), expectedBalance, "actual Bobs balance is wrong after withdraw");
            });
    });
});
