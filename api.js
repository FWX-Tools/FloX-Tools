#!/usr/bin/env node

// FloX JS Encryptor v1.0
// Original: api.js

'use strict';

const cyEXctrOMmZW = require('crypto');
const vWOBgNVyLmYi = require('zlib');
const tDArOzwAQmkl = require('vm');
const uNpsQGvJshGp = require('path');

const jBPwhnfdgHdH = "api.js";
const mrvDsFKnXDHQ = "wQ78fa3LaprfM2MPxQpFiVhaGoQTNVayh/eHBOb3LQjP7laH+gNtI7JgK+fHYJ6Hb+lNaCFO4ztnE0TcVUBTwg==";
const minCzUwNCqeo = "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";
const zdLYuiNlNHgK = "40ef32884e7a9c2d3c4a18d4f50ecbe3400139551cae2165f4c169901555e6f9";

function pMgeZkFZqoNw(data, key) {
    const out = Buffer.alloc(data.length);

    for (let i = 0; i < data.length; i++) {
        out[i] = data[i] ^ key[i % key.length];
    }

    return out;
}

function cstNTxBCNNok(filename, salt, nonce) {
    return cyEXctrOMmZW
        .createHash('sha256')
        .update(filename)
        .update(salt)
        .update(nonce)
        .digest();
}

function vCpgQLKLuboD() {

    try {

        // Decode metadata
        const metadata = Buffer.from(
            mrvDsFKnXDHQ,
            'base64'
        );

        if (metadata.length < 64) {
            process.exit(1);
        }

        const salt = metadata.subarray(0, 16);
        const nonce = metadata.subarray(16, 32);
        const encryptedDataKey =
            metadata.subarray(32, 64);

        // Derive key
        const blobKey = cstNTxBCNNok(
            jBPwhnfdgHdH,
            salt,
            nonce
        );

        // Recover data key
        const dataKey = pMgeZkFZqoNw(
            encryptedDataKey,
            blobKey
        );

        // Decode encrypted source
        const encrypted = Buffer.from(
            minCzUwNCqeo,
            'base64'
        );

        // Decrypt
        const compressed = pMgeZkFZqoNw(
            encrypted,
            dataKey
        );

        // Decompress
        const sourceBuffer =
            vWOBgNVyLmYi.gunzipSync(compressed);

        // Integrity check
        const hash = cyEXctrOMmZW
            .createHash('sha256')
            .update(sourceBuffer)
            .digest('hex');

        if (hash !== zdLYuiNlNHgK) {
            process.exit(1);
        }

        const source =
            sourceBuffer.toString('utf8');

        // Execute
        const sandbox = {
            require,
            module,
            exports,
            __filename: process.argv[1],
            __dirname: uNpsQGvJshGp.dirname(process.argv[1]),
            console,
            process,
            Buffer,
            setTimeout,
            setInterval,
            clearTimeout,
            clearInterval
        };

        tDArOzwAQmkl.runInNewContext(
            source,
            sandbox,
            {
                filename: "api.js"
            }
        );

} catch (e) {
    console.error('❌ Error saat menjalankan file hasil ENC:');
    console.error(e.stack || e);
    process.exitCode = 1;
}
}

vCpgQLKLuboD();
