const path = require("path");

module.exports = {
    contracts_build_directory: path.join(__dirname, "client/src/contracts"),
    networks: {
        development: {
            host: "172.20.80.1",
            port: 7545,
            network_id: "5777"
        }
    },
    compilers: {
        solc: {
            version: "0.6.0"
        }
    }
};
