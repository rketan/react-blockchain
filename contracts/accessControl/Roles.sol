pragma solidity >=0.4.22 <0.9.0;

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
contract Roles {
    mapping (address => bool) bearer;
    string public roleName;
    /**
     * @dev give an account access to this role
   */
    function add(address account) internal {
        require(account != address(0), "Address cannot be zero address");
        require(!has(account), "This address already has this role");
        bearer[account] = true;
    }

    function getRole() public view returns (string memory) {
        return roleName;
    }

    function setRole(string memory role) public {
        roleName = role;
    }

    /**
     * @dev remove an account's access to this role
   */
    function remove(address account) internal {
        require(account != address(0), "Address cannot be zero address");
        require(has(account), "This address does not have this role yet");
        bearer[account] = false;
    }

    /**
     * @dev check if an account has this role
   * @return bool
   */
    function has(address account)
    internal
    view
    returns (bool)
    {
        require(account != address(0), "Address cannot be zero address");
        return bearer[account];
    }
}