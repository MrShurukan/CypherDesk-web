encryptionKey = new JSEncrypt({ default_key_size: RSA_BITS });
encryptionKey.getKey();

if (DEBUG) {
    console.log("RSA_BITS:", RSA_BITS);
}

const privateKey = encryptionKey.getPrivateKey();
if (DEBUG) console.log('privateKey', privateKey);

const publicKey  = encryptionKey.getPublicKey();
if (DEBUG) console.log('publicKey', publicKey);

if (DEBUG) {
    console.log("Testing key;");
    let plainText = "TEST";
    let encText = encryptionKey.encrypt(plainText);
    console.log('encText', encText);
    let decText = encryptionKey.decrypt(encText);
    console.log('decText', decText);
}

// Moved to ws.js in initial events
// sendEvent("publicKey", {key: publicKey});