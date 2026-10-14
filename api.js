'use strict';

const htheKvHDjBAl = require('crypto');
const ThDgtpGkEQaH = require('zlib');
const nuCSGbnWIMWF = require('vm');
const DshyMmqTWxPa = require('path');

const KzxuGqhctGrT = "api.js";
const OVmmiCyCXrYg = "+o1jRyiiy9SoLrO07PZsuaFGZS+R0ToEgnBZJ1wDukYKo3A0EgjmsjH0AYSYhdpSWLtdpe8QEAQqkfAl5KIyjA==";
const yozWyqEltkoR = "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";
const PhjKPfgoOitv = "d065d559f968eeae4071b1343b2d6a058c46e9735f13e90ca510c932b23e931f";

function VKdHLZaBaDJb(data, key) {
    const out = Buffer.alloc(data.length);

    for (let i = 0; i < data.length; i++) {
        out[i] = data[i] ^ key[i % key.length];
    }

    return out;
}

function AtQsKFrKspLO(filename, salt, nonce) {
    return htheKvHDjBAl
        .createHash('sha256')
        .update(filename)
        .update(salt)
        .update(nonce)
        .digest();
}

function RXGrwiajGLhl() {
    try {
        const metadata = Buffer.from(OVmmiCyCXrYg, 'base64');

        if (metadata.length < 64) {
            process.exit(1);
        }

        const salt = metadata.subarray(0, 16);
        const nonce = metadata.subarray(16, 32);
        const encryptedDataKey = metadata.subarray(32, 64);

        const blobKey = AtQsKFrKspLO(
            KzxuGqhctGrT,
            salt,
            nonce
        );

        const dataKey = VKdHLZaBaDJb(
            encryptedDataKey,
            blobKey
        );

        const encrypted = Buffer.from(
            yozWyqEltkoR,
            'base64'
        );

        const compressed = VKdHLZaBaDJb(
            encrypted,
            dataKey
        );

        const sourceBuffer =
            ThDgtpGkEQaH.gunzipSync(compressed);

        const hash = htheKvHDjBAl
            .createHash('sha256')
            .update(sourceBuffer)
            .digest('hex');

        if (hash !== PhjKPfgoOitv) {
            process.exit(1);
        }

        const source =
            sourceBuffer.toString('utf8');

        const sandbox = {
            require,
            module,
            exports,
            __filename: process.argv[1],
            __dirname: DshyMmqTWxPa.dirname(process.argv[1]),
            console,
            process,
            Buffer,
            setTimeout,
            setInterval,
            clearTimeout,
            clearInterval
        };

        nuCSGbnWIMWF.runInNewContext(
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

RXGrwiajGLhl();
