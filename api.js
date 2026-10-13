
// FloX JS Encryptor v1.0
// Original: api.js

'use strict';

const EEUCpWNYcAMx = require('crypto');
const DCuehUprZpPx = require('zlib');
const SGwkhfpfUTQd = require('vm');
const yoeEKAvsbAQk = require('path');

const IdgjRJDIZrqK = "api.js";
const CFKTDRWMvpdB = "sP6xC4ugswkHVQ18JqJHELetjmxdi0SnUQgnk5ZBziFKv5mDDZWvBfRaExT4GHCRfr3WFeMzp1skvcJ1o/BX3g==";
const FDaBFjMbolPy = "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";
const sjBxaJfYZkkR = "7fd60fc57361596bf612f5aa260be9034a88d200366799d3aa136269b0be979a";

function NCgwMNUDKSrH(data, key) {
    const out = Buffer.alloc(data.length);

    for (let i = 0; i < data.length; i++) {
        out[i] = data[i] ^ key[i % key.length];
    }

    return out;
}

function VLAVivbLLQzQ(filename, salt, nonce) {
    return EEUCpWNYcAMx
        .createHash('sha256')
        .update(filename)
        .update(salt)
        .update(nonce)
        .digest();
}

function vTSpyrqkRdOj() {

    try {

        // Decode metadata
        const metadata = Buffer.from(
            CFKTDRWMvpdB,
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
        const blobKey = VLAVivbLLQzQ(
            IdgjRJDIZrqK,
            salt,
            nonce
        );

        // Recover data key
        const dataKey = NCgwMNUDKSrH(
            encryptedDataKey,
            blobKey
        );

        // Decode encrypted source
        const encrypted = Buffer.from(
            FDaBFjMbolPy,
            'base64'
        );

        // Decrypt
        const compressed = NCgwMNUDKSrH(
            encrypted,
            dataKey
        );

        // Decompress
        const sourceBuffer =
            DCuehUprZpPx.gunzipSync(compressed);

        // Integrity check
        const hash = EEUCpWNYcAMx
            .createHash('sha256')
            .update(sourceBuffer)
            .digest('hex');

        if (hash !== sjBxaJfYZkkR) {
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
            __dirname: yoeEKAvsbAQk.dirname(process.argv[1]),
            console,
            process,
            Buffer,
            setTimeout,
            setInterval,
            clearTimeout,
            clearInterval
        };

        SGwkhfpfUTQd.runInNewContext(
            source,
            sandbox,
            {
                filename: "api.js"
            }
        );

} catch (e) {
    console.error('❌ Error saat menjalankan :');
    console.error(e.stack || e);
    process.exitCode = 1;
}
}

vTSpyrqkRdOj();
