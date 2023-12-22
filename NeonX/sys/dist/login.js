var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _username, _password;
var User = /** @class */ (function () {
    function User(username, password) {
        this.username = username;
        this.password = password;
        _username.set(this, void 0);
        _password.set(this, void 0);
        __classPrivateFieldSet(this, _username, username);
        __classPrivateFieldSet(this, _password, password);
    }
    User.prototype.login = function (username, password) {
        return __classPrivateFieldGet(this, _username) === username && __classPrivateFieldGet(this, _password) === password;
    };
    return User;
}());
_username = new WeakMap(), _password = new WeakMap();
var users = [
    new User("admin", "admin")
];
function isFormValid() {
    var usernameInput = document.getElementById("usr");
    var passwordInput = document.getElementById("pass");
    var loginUsername = usernameInput.value;
    var loginPassword = passwordInput.value;
    return users.some(function (user) { return user.login(loginUsername, loginPassword); });
}
