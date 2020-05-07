var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as io from 'socket.io-client';
import race from 'async/race';
var websocketClient = io;
var PORT_RANGE_BEGIN = 5000;
var PORT_RANGE_END = 5010;
var SimpleosConnect = /** @class */ (function () {
    function SimpleosConnect() {
        this.socket = null;
        this.port = 0;
        this.wallet = null;
        this.sessionUuid = '';
    }
    SimpleosConnect.prototype.initWallet = function (wallet) {
        // TODO: Check if wallet info is valid
        this.wallet = wallet;
    };
    SimpleosConnect.prototype.getWallet = function () {
        return this.wallet;
    };
    SimpleosConnect.prototype.sessionCreated = function () {
        var sessionUuid = localStorage.getItem('session_uuid');
        return (sessionUuid !== null);
    };
    SimpleosConnect.prototype.connectWallet = function () {
        return __awaiter(this, void 0, void 0, function () {
            var availablePorts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.wallet) {
                            throw new Error('Wallet not initialized.');
                        }
                        // Wallet already connected
                        if (this.isWalletConnected()) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.checkAvailablePorts()];
                    case 1:
                        availablePorts = _a.sent();
                        if (!(this.port === 0)) return [3 /*break*/, 3];
                        if (availablePorts.length === 0) {
                            throw new Error('Failed to connect to wallet. No port available.');
                        }
                        // Request connection on first available port
                        this.port = availablePorts[0];
                        return [4 /*yield*/, this.requestSocketConnection(this.port)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.connectSocket()];
                    case 4:
                        _a.sent();
                        if (!this.socket.connected) {
                            // TODO: If not connected, try inputting new port number directly on wallet
                            throw new Error('Failed to connect to wallet.');
                        }
                        this.sessionUuid = localStorage.getItem('session_uuid');
                        if (!this.sessionUuid) {
                            this.sessionUuid = null;
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.isLoggedIn()];
                    case 5:
                        if (!(_a.sent())) {
                            this.sessionUuid = null;
                            localStorage.removeItem('session_uuid');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SimpleosConnect.prototype.disconnectWallet = function () {
        if (this.socket) {
            this.socket.disconnect();
        }
        this.socket = null;
    };
    SimpleosConnect.prototype.isWalletConnected = function () {
        if (this.socket) {
            return this.socket.connected;
        }
        return false;
    };
    SimpleosConnect.prototype.getAuthorizations = function (chainId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.isWalletConnected()) {
                reject('Wallet not connected.');
            }
            _this.socket.emit('get_authorizations', chainId, function (response) {
                resolve(response);
            });
        });
    };
    SimpleosConnect.prototype.logIn = function (authorization) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.isWalletConnected()) {
                reject('Wallet not connected.');
            }
            var data = window.crypto.getRandomValues(new Uint8Array(16));
            var sessionUuid = Array.from(data).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
            _this.socket.emit('log_in', sessionUuid, authorization, function () {
                localStorage.setItem('session_uuid', sessionUuid);
                _this.sessionUuid = sessionUuid;
                resolve();
            });
        });
    };
    SimpleosConnect.prototype.logOut = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.isWalletConnected()) {
                reject('Wallet not connected.');
            }
            _this.socket.emit('log_out', function () {
                _this.sessionUuid = '';
                localStorage.removeItem('session_uuid');
                resolve();
            });
        });
    };
    SimpleosConnect.prototype.isLoggedIn = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.isWalletConnected()) {
                reject('Wallet not connected.');
            }
            _this.socket.emit('is_logged_in', _this.sessionUuid, function (response) {
                resolve(response);
            });
        });
    };
    SimpleosConnect.prototype.getCurrentAuthorization = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isWalletConnected()) {
                            reject('Wallet not connected.');
                        }
                        return [4 /*yield*/, this.isLoggedIn()];
                    case 1:
                        if (!(_a.sent())) {
                            reject('Not logged in.');
                        }
                        this.socket.emit('get_current_authorization', this.sessionUuid, function (response) {
                            resolve(response);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    SimpleosConnect.prototype.transact = function (transaction) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    // TODO: Check if transaction's authorization is the same as the selected one
                                    if (!this.isWalletConnected()) {
                                        reject('Wallet not connected.');
                                    }
                                    return [4 /*yield*/, this.isLoggedIn()];
                                case 1:
                                    if (!(_a.sent())) {
                                        reject('Not logged in.');
                                    }
                                    this.socket.emit('transact', transaction, function (response) {
                                        if (response) {
                                            resolve(response);
                                        }
                                        else {
                                            reject('Transaction failed.');
                                        }
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    SimpleosConnect.prototype.checkAvailablePorts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var attempts, availablePorts, _loop_1, port;
            var _this = this;
            return __generator(this, function (_a) {
                attempts = [];
                availablePorts = [];
                _loop_1 = function (port) {
                    attempts.push(function (callback) { return __awaiter(_this, void 0, void 0, function () {
                        var controller, timeout;
                        return __generator(this, function (_a) {
                            controller = new AbortController();
                            timeout = setTimeout(function () {
                                controller.abort();
                            }, 500);
                            fetch(this.wallet.url + ':' + port + '/simpleos_ping', {
                                mode: 'cors',
                                signal: controller.signal
                            }).then(function (response) {
                                callback(response, port);
                            }).catch(function () {
                                availablePorts.push(port);
                                clearTimeout(timeout);
                            });
                            return [2 /*return*/];
                        });
                    }); });
                };
                for (port = PORT_RANGE_BEGIN; port < PORT_RANGE_END; port++) {
                    _loop_1(port);
                }
                race(attempts, function (response, port) {
                    // pong
                    _this.port = port;
                });
                return [2 /*return*/, new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve(availablePorts);
                        }, 200);
                    })];
            });
        });
    };
    SimpleosConnect.prototype.connectSocket = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.socket = websocketClient(_this.wallet.url + ':' + _this.port, { reconnection: false });
            _this.socket.on('disconnect', function () {
                _this.sessionUuid = '';
                localStorage.removeItem('session_uuid');
            });
            setTimeout(function () {
                resolve(_this.socket.connected);
            }, _this.wallet.connectionWaitingTime);
        });
    };
    SimpleosConnect.prototype.requestSocketConnection = function (port) {
        var _this = this;
        return new Promise(function (resolve) {
            open(_this.wallet.protocol + '://websocket_connection/' + port, '_self');
            setTimeout(function () {
                resolve();
            }, _this.wallet.requestWaitingTime);
        });
    };
    return SimpleosConnect;
}());
export { SimpleosConnect };
//# sourceMappingURL=simpleos-connect.js.map