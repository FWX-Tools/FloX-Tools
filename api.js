

// FloX JS Encryptor v1.0
// Original: api.js

'use strict';

const yuyEMEykiNvZ = require('crypto');
const pqSvtufVoFjZ = require('zlib');
const KYNHdijQRWpP = require('vm');
const dAaECgpdKYas = require('path');

const EIcaWzbfEyaV = "api.js";
const noMGfQJLtUIP = "yo+nlykQEqQNsd7k+xiG597AxQvDyE6ScY/F19xa/XAUpI3gfRM4/8v/fuRlEAYXN5aq75v0n+2+Abwox69k+w==";
const vJhXLFZgMtJL = "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";
const ZkIdEJnejWaF = "c86a9849c83234c511c5f684209e7c395cf5e676953eb5bd46bb60e0f34572ed";

function HxuOzxglXlgs(data, key) {
    const out = Buffer.alloc(data.length);

    for (let i = 0; i < data.length; i++) {
        out[i] = data[i] ^ key[i % key.length];
    }

    return out;
}

function JKdjYCMGokPN(filename, salt, nonce) {
    return yuyEMEykiNvZ
        .createHash('sha256')
        .update(filename)
        .update(salt)
        .update(nonce)
        .digest();
}

function bsqyZvAuwGAe() {

    try {

        // Decode metadata
        const metadata = Buffer.from(
            noMGfQJLtUIP,
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
        const blobKey = JKdjYCMGokPN(
            EIcaWzbfEyaV,
            salt,
            nonce
        );

        // Recover data key
        const dataKey = HxuOzxglXlgs(
            encryptedDataKey,
            blobKey
        );

        // Decode encrypted source
        const encrypted = Buffer.from(
            vJhXLFZgMtJL,
            'base64'
        );

        // Decrypt
        const compressed = HxuOzxglXlgs(
            encrypted,
            dataKey
        );

        // Decompress
        const sourceBuffer =
            pqSvtufVoFjZ.gunzipSync(compressed);

        // Integrity check
        const hash = yuyEMEykiNvZ
            .createHash('sha256')
            .update(sourceBuffer)
            .digest('hex');

        if (hash !== ZkIdEJnejWaF) {
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
            __dirname: dAaECgpdKYas.dirname(process.argv[1]),
            console,
            process,
            Buffer,
            setTimeout,
            setInterval,
            clearTimeout,
            clearInterval
        };

        KYNHdijQRWpP.runInNewContext(
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

bsqyZvAuwGAe();
