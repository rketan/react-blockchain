pragma solidity >=0.4.22 <0.9.0;
import "./StringUtils.sol";

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {

    struct userMetaData {
        string password;
        address id;
        bool isUserVerified;
    }

    struct Role {
        mapping(address => bool) bearer;
        mapping(string => userMetaData) nameToAccountAndPasswordMapping;
        mapping(address => address[]) rememberAccounts;
    }


    /**
     * @dev give an account access to this role
   */
    function add(Role storage role, address account, string memory name, string memory password) internal {
        require(account != address(0), "Address cannot be zero address");
        require(!has(role, account), "This address already has this role");
        role.bearer[account] = true;

        role.nameToAccountAndPasswordMapping[name].id = account;
        role.nameToAccountAndPasswordMapping[name].password = password;
        role.nameToAccountAndPasswordMapping[name].isUserVerified = true;
    }

    function login(Role storage role, string memory name, string memory password) internal view returns (address) {
        if (role.nameToAccountAndPasswordMapping[name].isUserVerified == true &&
            StringUtils.equal(role.nameToAccountAndPasswordMapping[name].password, password)) {
            return role.nameToAccountAndPasswordMapping[name].id;
        }
        return address(0);
    }

    function addNewAddress(Role storage role, address name, address id) internal{
        for (uint i=0; i<role.rememberAccounts[name].length; i++) {
            if (role.rememberAccounts[name][i] == id)
                return;
        }
        role.rememberAccounts[name].push(id);
    }

    function getAddress(Role storage role, address name) internal view returns (address[] memory) {
        return role.rememberAccounts[name];   
    }

    /**
     * @dev remove an account's access to this role
   */
    function remove(Role storage role, address account) internal {
        require(account != address(0), "Address cannot be zero address");
        require(has(role, account), "This address does not have this role yet");

        role.bearer[account] = false;
    }

    /**
     * @dev check if an account has this role
   * @return bool
   */
    function has(Role storage role, address account)
    internal
    view
    returns (bool)
    {
        require(account != address(0), "Address cannot be zero address");
        return role.bearer[account];
    }
}