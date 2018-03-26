import MigrationsContract from "../contracts/Migrations.sol";

module.exports = function(deployer) {
  deployer.deploy(MigrationsContract);
};
