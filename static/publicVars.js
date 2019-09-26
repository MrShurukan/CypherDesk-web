const RSA_BITS = 2048;
const AES_BLOCKSIZE = 16;
const PASSPHRASE = Math.round(Math.random() * 10e17).toString();

let DEBUG = true;
var serverKeys = null;
var encryptionKey = null;

if (DEBUG) {
    console.log("AES_BLOCKSIZE", AES_BLOCKSIZE);
}