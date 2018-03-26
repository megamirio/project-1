import Splitter from "../contracts/Splitter.sol";
import Promise from "bluebird";

Promise.promisifyAll(web3.eth, {suffix: "Promise"});

contract('Splitter', (accounts) => {

    const alice = alice;  //Alice
    const bob = bob; //Bob
    const carol = accounts[3];  //Carol

    let inst;
    let sendEther;

    beforeEach("Splitter creation", () => Splitter.new({from: alice}).then(_inst => inst = _inst));

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
        }();

        await function () {
            initBalance = monBalance;
            inst.send.sendTransaction(bob, carol, {from: alice, value: FOR_ADDING});
        }();

        const compBalances = await Promise.all([inst.balances.call(alice), inst.balances.call(bob), inst.balances
            .call(carol)]);


        assert.equal(compBalances[0], 0);
        assert.equal(compBalances[1], FOR_ADDING);
        assert.equal(compBalances[2], FOR_ADDING);
    });


    it("Withdrawing", async () => {

        const WITHDRAW_AMMOUNT = 1000000;
        const GAT_PRICE = 1000;

        let initBalance;
        let transaction;
        let expectedBalance;

        const balance = await web3.eth.getBalancePromise(bob);

        await function () {
            initBalance = balance;
            sendEther();
        }();

        const bal = await inst.balances.call(bob);
        await assert.equal(bal.toString(), 5000000);
        const resSent = await inst.withdraw.sendTransaction(WITHDRAW_AMMOUNT, {from: bob, gasPrice: GAT_PRICE});

        const bobBal = await function () {
            transaction = resSent;
            return inst.balances.call(bob);
        }();

        await assert.equal(bobBal.toString(), 4000000);
        const resTrans = await web3.eth.getTransactionReceipt(transaction);
        const resGasUsed = await resTrans["gasUsed"];
        await (expectedBalance = initBalance - resGasUsed * gasPrice + value_to_withdraw);
        const resBal = await web3.eth.getBalancePromise(bob);
        await assert.equal(resBal.toString(), expectedBalance);
    });
});
