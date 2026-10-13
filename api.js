#!/usr/bin/env node

// FloX JS Encryptor v1.0
// Original: api.js

'use strict';

const woOlONzoWnCp = require('crypto');
const sggrjFTbLeWc = require('zlib');
const hZPzKqYgOSRR = require('vm');
const xlOaFQKSYEcW = require('path');

const NFmrGidFCRlq = "api.js";
const wTqFZjhdHSvN = "pbeM8W61zncYi+O2BETBK7kHaETGyQ/QOHIsl1ojqLecPHiiQdbH7TFqiH9JNGDX62lZbEYIYD1LEb4umpc/WA==";
const iSTAwMmCeRKd = "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";
const woUWlmviYhMA = "19d0d749788d6e22721be07b2678b627d805caec8a3f1505d911600c00213b21";

function KRxUJoMLzisd(data, key) {
    const out = Buffer.alloc(data.length);

    for (let i = 0; i < data.length; i++) {
        out[i] = data[i] ^ key[i % key.length];
    }

    return out;
}

function mVlnytSIOOyv(filename, salt, nonce) {
    return woOlONzoWnCp
        .createHash('sha256')
        .update(filename)
        .update(salt)
        .update(nonce)
        .digest();
}

function YPJZZYjopSUN() {

    try {

        // Decode metadata
        const metadata = Buffer.from(
            wTqFZjhdHSvN,
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
        const blobKey = mVlnytSIOOyv(
            NFmrGidFCRlq,
            salt,
            nonce
        );

        // Recover data key
        const dataKey = KRxUJoMLzisd(
            encryptedDataKey,
            blobKey
        );

        // Decode encrypted source
        const encrypted = Buffer.from(
            iSTAwMmCeRKd,
            'base64'
        );

        // Decrypt
        const compressed = KRxUJoMLzisd(
            encrypted,
            dataKey
        );

        // Decompress
        const sourceBuffer =
            sggrjFTbLeWc.gunzipSync(compressed);

        // Integrity check
        const hash = woOlONzoWnCp
            .createHash('sha256')
            .update(sourceBuffer)
            .digest('hex');

        if (hash !== woUWlmviYhMA) {
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
            __dirname: xlOaFQKSYEcW.dirname(process.argv[1]),
            console,
            process,
            Buffer,
            setTimeout,
            setInterval,
            clearTimeout,
            clearInterval
        };

        hZPzKqYgOSRR.runInNewContext(
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

YPJZZYjopSUN();
