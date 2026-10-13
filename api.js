#!/usr/bin/env node

// FloX JS Encryptor v1.0
// Original: api.js

'use strict';

const ItGALSBqndqn = require('crypto');
const xNsFQPopsdyp = require('zlib');
const vtddOLsHhwyH = require('vm');
const vISQsPAvPejg = require('path');

const EUXBbVSaOfmT = "api.js";
const TdvSiGHiHohI = "zoAiolm7ACFq6FoPJyCPG4BiJ0rue+DVHgrIapc02+GzBgxHl/c70oHpxWSRTCNp8GWW90cjvaUrpNQhD0LCgA==";
const furjKMmnQejq = "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";
const ljLRxywoClTv = "98861e1331bbc11959911e2bb52757c74dbe61dabca43562d16abe9441659052";

function rGNMdTkGLzOq(data, key) {
    const out = Buffer.alloc(data.length);

    for (let i = 0; i < data.length; i++) {
        out[i] = data[i] ^ key[i % key.length];
    }

    return out;
}

function JsNtEcLXFvhB(filename, salt, nonce) {
    return ItGALSBqndqn
        .createHash('sha256')
        .update(filename)
        .update(salt)
        .update(nonce)
        .digest();
}

function XmkmGyucvNxQ() {

    try {

        // Decode metadata
        const metadata = Buffer.from(
            TdvSiGHiHohI,
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
        const blobKey = JsNtEcLXFvhB(
            EUXBbVSaOfmT,
            salt,
            nonce
        );

        // Recover data key
        const dataKey = rGNMdTkGLzOq(
            encryptedDataKey,
            blobKey
        );

        // Decode encrypted source
        const encrypted = Buffer.from(
            furjKMmnQejq,
            'base64'
        );

        // Decrypt
        const compressed = rGNMdTkGLzOq(
            encrypted,
            dataKey
        );

        // Decompress
        const sourceBuffer =
            xNsFQPopsdyp.gunzipSync(compressed);

        // Integrity check
        const hash = ItGALSBqndqn
            .createHash('sha256')
            .update(sourceBuffer)
            .digest('hex');

        if (hash !== ljLRxywoClTv) {
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
            __dirname: vISQsPAvPejg.dirname(process.argv[1]),
            console,
            process,
            Buffer,
            setTimeout,
            setInterval,
            clearTimeout,
            clearInterval
        };

        vtddOLsHhwyH.runInNewContext(
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

XmkmGyucvNxQ();
