import { getRandomValues as expoCryptoGetRandomValues } from "expo-crypto";
import createHmac from "create-hmac";
import createHash from "create-hash";
class Crypto {
    getRandomValues = expoCryptoGetRandomValues;
    createHmac = createHmac;
    createHash = createHash;
}
const webCrypto = typeof crypto !== "undefined" ? crypto : new Crypto();

(() => {
    if (typeof crypto === "undefined") {
        Object.defineProperty(window, "crypto", {
            configurable: true,
            enumerable: true,
            get: () => webCrypto,
        });
    }
})();

import { Buffer } from "buffer";
global.Buffer = Buffer;

import "fast-text-encoding"; // This import statement sets the globals for TextEncoder and TextDecoder

if (typeof __dirname === "undefined") global.__dirname = "/";
if (typeof __filename === "undefined") global.__filename = "";
if (typeof process === "undefined") {
    global.process = require("process");
} else {
    const bProcess = require("process");
    for (var p in bProcess) {
        if (!(p in process)) {
            (process as any)[p] = bProcess[p];
        }
    }
}

(process as any).browser = false;

// global.location = global.location || { port: 80 }
const isDev = typeof __DEV__ === "boolean" && __DEV__;
(process.env as any)["NODE_ENV"] = isDev ? "development" : "production";
if (typeof localStorage !== "undefined") {
    localStorage.debug = isDev ? "*" : "";
}