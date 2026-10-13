'use strict';

require('dotenv').config();

const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = Number(process.env.OWNER_ID);
const OWNER_USERNAME = process.env.OWNER_USERNAME || '';
const OWNER_CHAT = String(OWNER_ID);
const PORT = Number(process.env.PORT || 2009);
const API_SECRET = process.env.API_SECRET;

if (!BOT_TOKEN) {
console.error('BOT_TOKEN belum diatur di .env');
process.exit(1);
}

if (!Number.isSafeInteger(OWNER_ID) || OWNER_ID <= 0) {
console.error('OWNER_ID tidak valid di .env');
process.exit(1);
}

if (!API_SECRET || API_SECRET.length < 32) {
console.error('API_SECRET wajib minimal 32 karakter!');
process.exit(1);
}

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
console.error('PORT tidak valid di .env');
process.exit(1);
}

const DB_DIR = path.join(__dirname, 'database');
const DB_PATH = path.join(DB_DIR, 'devices.db');

fs.mkdirSync(DB_DIR, { recursive: true });

// ============================================================
// DATABASE SQLITE
// ============================================================

let SQL;
let db;
let saveQueue = Promise.resolve();

function saveDatabase() {
saveQueue = saveQueue.then(() => {
const tempPath = "${DB_PATH}.tmp";

    fs.writeFileSync(tempPath, Buffer.from(db.export()));
    fs.renameSync(tempPath, DB_PATH);
});

return saveQueue;

}

function run(sql, params = []) {
db.run(sql, params);
}

function get(sql, params = []) {
const statement = db.prepare(sql);

try {
    statement.bind(params);

    if (!statement.step()) return null;

    return statement.getAsObject();
} finally {
    statement.free();
}

}

function all(sql, params = []) {
const statement = db.prepare(sql);
const rows = [];

try {
    statement.bind(params);

    while (statement.step()) {
        rows.push(statement.getAsObject());
    }

    return rows;
} finally {
    statement.free();
}

}

async function initDatabase() {
SQL = await initSqlJs();

if (fs.existsSync(DB_PATH)) {
    db = new SQL.Database(
        new Uint8Array(fs.readFileSync(DB_PATH))
    );
} else {
    db = new SQL.Database();
}

db.run(`
    CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_key TEXT UNIQUE NOT NULL,
        buyer TEXT DEFAULT '',
        seller TEXT DEFAULT '',
        device_info TEXT DEFAULT '{}',
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
`);

db.run(`
    CREATE INDEX IF NOT EXISTS idx_devices_status
    ON devices(status)
`);

await saveDatabase();

}

// ============================================================
// UTILITAS
// ============================================================

const now = () => new Date().toISOString();

function escapeHTML(value) {
return String(value ?? '')
.replace(/&/g, '&')
.replace(/</g, '<')
.replace(/>/g, '>')
.replace(/"/g, '"');
}

function isOwner(msg) {
return Number(msg.from?.id) === OWNER_ID;
}

function formatDate(value) {
if (!value) return '-';

const date = new Date(value);

if (Number.isNaN(date.getTime())) {
    return String(value);
}

return date.toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    dateStyle: 'medium',
    timeStyle: 'short'
});

}

function parseDeviceInfo(value) {
if (value && typeof value === 'object') {
return value;
}

try {
    return JSON.parse(value || '{}');
} catch {
    return {};
}

}

function statusLabel(status) {
const labels = {
pending: 'Menunggu Persetujuan',
active: 'Aktif',
blocked: 'Diblokir'
};

return labels[status] || status;

}

function getDevice(key) {
return get(
'SELECT * FROM devices WHERE device_key = ?',
[key]
);
}

function ownerOnly(msg) {
if (isOwner(msg)) return true;

const options = {
    parse_mode: 'HTML',
    reply_markup: {
        inline_keyboard: [[{
            text: 'Owner',
            url: `https://t.me/${OWNER_USERNAME}`
        }]]
    }
};

bot.sendMessage(
    msg.chat.id,
    '<blockquote>FloX Tools Database hanya bisa diakses owner.</blockquote>',
    options
).catch(() => {});

return false;

}

async function notifyOwner(text) {
try {
await bot.sendMessage(OWNER_CHAT, text, {
parse_mode: 'HTML',
disable_web_page_preview: true
});
} catch (error) {
console.error('Gagal mengirim notifikasi:', error.message);
}
}

function deviceInfoText(info) {
if (!info || typeof info !== 'object' || Array.isArray(info)) {
return '-';
}

return Object.entries(info)
    .map(([name, value]) => {
        const printable =
            value !== null && typeof value === 'object'
                ? JSON.stringify(value)
                : String(value ?? '-');

        return `${escapeHTML(name)}: ${escapeHTML(printable)}`;
    })
    .join('\n') || '-';

}

// ============================================================
// RATE LIMIT SEDERHANA PER IP
// ============================================================

const rateLimits = new Map();

function rateLimit({ windowMs, max }) {
return (req, res, next) => {
const key = req.ip || req.socket.remoteAddress || 'unknown';
const currentTime = Date.now();
let entry = rateLimits.get(key);

    if (!entry || currentTime >= entry.resetAt) {
        entry = {
            count: 0,
            resetAt: currentTime + windowMs
        };
    }

    entry.count++;
    rateLimits.set(key, entry);

    if (entry.count > max) {
        res.set('Retry-After', String(
            Math.max(1, Math.ceil((entry.resetAt - currentTime) / 1000))
        ));

        return res.status(429).json({
            success: false,
            message: 'Terlalu banyak permintaan. Coba lagi nanti.'
        });
    }

    next();
};

}

// Bersihkan entri kedaluwarsa secara berkala.
const cleanupInterval = setInterval(() => {
const currentTime = Date.now();

for (const [key, entry] of rateLimits) {
    if (currentTime >= entry.resetAt) {
        rateLimits.delete(key);
    }
}

}, 60_000);

cleanupInterval.unref();

// ============================================================
// TELEGRAM BOT
// ============================================================

const bot = new TelegramBot(BOT_TOKEN, {
polling: true
});

function registerBotHandlers() {
// START
bot.onText(/^/start(?:@\w+)?(?:\s.*)?$/i, async (msg) => {
if (!ownerOnly(msg)) return;

    const text = [
        '<b>FloX Tools Database</b>',
        '',
        'Selamat datang, Owner.',
        '',
        '<b>Daftar Fitur:</b>',
        '',
        '<code>/addtools DEVICE_KEY</code> - Aktifkan perangkat',
        '<code>/blocktools DEVICE_KEY</code> - Blokir perangkat',
        '<code>/unblocktools DEVICE_KEY</code> - Buka blokir',
        '<code>/listtools</code> - Daftar perangkat',
        '<code>/infotools DEVICE_KEY</code> - Detail perangkat',
        '',
        '<b>Status:</b> Online',
        '<b>Akses:</b> Owner Only'
    ].join('\n');

    await bot.sendMessage(msg.chat.id, text, {
        parse_mode: 'HTML',
        disable_web_page_preview: true
    });
});

// AKTIFKAN PERANGKAT
bot.onText(/^\/addtools(?:@\w+)?(?:\s+(\S+))?$/i, async (msg, match) => {
    if (!ownerOnly(msg)) return;

    const key = match[1];

    if (!key) {
        return bot.sendMessage(
            msg.chat.id,
            'Gunakan: <code>/addtools DEVICE_KEY</code>',
            { parse_mode: 'HTML' }
        );
    }

    if (!getDevice(key)) {
        return bot.sendMessage(msg.chat.id, 'Device key tidak ditemukan.');
    }

    run(
        'UPDATE devices SET status = ?, updated_at = ? WHERE device_key = ?',
        ['active', now(), key]
    );

    await saveDatabase();

    await bot.sendMessage(
        msg.chat.id,
        `Perangkat berhasil diaktifkan.\n\nDevice Key: <code>${escapeHTML(key)}</code>`,
        { parse_mode: 'HTML' }
    );
});

// BLOKIR PERANGKAT
bot.onText(/^\/blocktools(?:@\w+)?(?:\s+(\S+))?$/i, async (msg, match) => {
    if (!ownerOnly(msg)) return;

    const key = match[1];

    if (!key) {
        return bot.sendMessage(
            msg.chat.id,
            'Gunakan: <code>/blocktools DEVICE_KEY</code>',
            { parse_mode: 'HTML' }
        );
    }

    if (!getDevice(key)) {
        return bot.sendMessage(msg.chat.id, 'Device key tidak ditemukan.');
    }

    run(
        'UPDATE devices SET status = ?, updated_at = ? WHERE device_key = ?',
        ['blocked', now(), key]
    );

    await saveDatabase();

    await bot.sendMessage(
        msg.chat.id,
        `Perangkat berhasil diblokir.\n\nDevice Key: <code>${escapeHTML(key)}</code>`,
        { parse_mode: 'HTML' }
    );
});

// BUKA BLOKIR
bot.onText(/^\/unblocktools(?:@\w+)?(?:\s+(\S+))?$/i, async (msg, match) => {
    if (!ownerOnly(msg)) return;

    const key = match[1];

    if (!key) {
        return bot.sendMessage(
            msg.chat.id,
            'Gunakan: <code>/unblocktools DEVICE_KEY</code>',
            { parse_mode: 'HTML' }
        );
    }

    if (!getDevice(key)) {
        return bot.sendMessage(msg.chat.id, 'Device key tidak ditemukan.');
    }

    run(
        'UPDATE devices SET status = ?, updated_at = ? WHERE device_key = ?',
        ['active', now(), key]
    );

    await saveDatabase();

    await bot.sendMessage(
        msg.chat.id,
        `Blokir perangkat dibuka.\n\nDevice Key: <code>${escapeHTML(key)}</code>`,
        { parse_mode: 'HTML' }
    );
});

// DAFTAR PERANGKAT
bot.onText(/^\/listtools(?:@\w+)?$/i, async (msg) => {
    if (!ownerOnly(msg)) return;

    const devices = all(`
        SELECT device_key, buyer, seller, status, created_at
        FROM devices
        ORDER BY id DESC
        LIMIT 50
    `);

    if (!devices.length) {
        return bot.sendMessage(msg.chat.id, 'Belum ada perangkat terdaftar.');
    }

    const lines = [
        '<b>Daftar Perangkat FloX Tools</b>',
        '',
        ...devices.map((device, index) => [
            `<b>${index + 1}. ${escapeHTML(device.device_key)}</b>`,
            `Status: ${escapeHTML(statusLabel(device.status))}`,
            `Buyer: ${escapeHTML(device.buyer || '-')}`,
            `Seller: ${escapeHTML(device.seller || '-')}`,
            `Tanggal: ${escapeHTML(formatDate(device.created_at))}`
        ].join('\n'))
    ];

    const chunks = [];
    let current = '';

    for (const line of lines) {
        if ((current + '\n\n' + line).length > 3500) {
            if (current) chunks.push(current);
            current = line;
        } else {
            current += current ? '\n\n' + line : line;
        }
    }

    if (current) chunks.push(current);

    for (const chunk of chunks) {
        await bot.sendMessage(msg.chat.id, chunk, {
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });
    }
});

// DETAIL PERANGKAT
bot.onText(/^\/infotools(?:@\w+)?(?:\s+(\S+))?$/i, async (msg, match) => {
    if (!ownerOnly(msg)) return;

    const key = match[1];

    if (!key) {
        return bot.sendMessage(
            msg.chat.id,
            'Gunakan: <code>/infotools DEVICE_KEY</code>',
            { parse_mode: 'HTML' }
        );
    }

    const device = getDevice(key);

    if (!device) {
        return bot.sendMessage(msg.chat.id, 'Device key tidak ditemukan.');
    }

    const info = parseDeviceInfo(device.device_info);

    const text = [
        '<b>Detail Perangkat</b>',
        '',
        `Device Key: <code>${escapeHTML(device.device_key)}</code>`,
        `Buyer: ${escapeHTML(device.buyer || '-')}`,
        `Seller: ${escapeHTML(device.seller || '-')}`,
        `Status: ${escapeHTML(statusLabel(device.status))}`,
        `Terdaftar: ${escapeHTML(formatDate(device.created_at))}`,
        `Diperbarui: ${escapeHTML(formatDate(device.updated_at))}`,
        '',
        '<b>Informasi Perangkat:</b>',
        deviceInfoText(info)
    ].join('\n');

    await bot.sendMessage(msg.chat.id, text, {
        parse_mode: 'HTML',
        disable_web_page_preview: true
    });
});

bot.on('polling_error', (error) => {
    console.error('Telegram polling error:', error.message);
});

}

// ============================================================
// EXPRESS API
// ============================================================

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', false);
app.use(express.json({ limit: '64kb' }));

app.get('/', (req, res) => {
res.json({
success: true,
message: 'FloX Tools Database API Online'
});
});

// REGISTER DEVICE
app.post(
'/register',
rateLimit({ windowMs: 60_000, max: 20 }),
async (req, res) => {
try {
const {
device_key,
buyer = '',
seller = '',
device_info = {}
} = req.body || {};

        if (
            typeof device_key !== 'string' ||
            !device_key.trim() ||
            device_key.length > 200
        ) {
            return res.status(400).json({
                success: false,
                message: 'device_key wajib diisi dan maksimal 200 karakter.'
            });
        }

        if (
            typeof buyer !== 'string' ||
            typeof seller !== 'string'
        ) {
            return res.status(400).json({
                success: false,
                message: 'buyer dan seller harus berupa string.'
            });
        }

        if (
            !device_info ||
            typeof device_info !== 'object' ||
            Array.isArray(device_info)
        ) {
            return res.status(400).json({
                success: false,
                message: 'device_info harus berupa object.'
            });
        }

        if (JSON.stringify(device_info).length > 48_000) {
            return res.status(400).json({
                success: false,
                message: 'Data perangkat terlalu besar.'
            });
        }

        const key = device_key.trim();
        const existing = getDevice(key);

        if (existing) {
            return res.json({
                success: true,
                exists: true,
                device_key: key,
                status: existing.status,
                message: 'Perangkat sudah terdaftar.'
            });
        }

        const createdAt = now();

        run(`
            INSERT INTO devices (
                device_key, buyer, seller, device_info,
                status, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            key,
            buyer.slice(0, 200),
            seller.slice(0, 200),
            JSON.stringify(device_info),
            'pending',
            createdAt,
            createdAt
        ]);

        await saveDatabase();

        const notification = [
            '<b>Perangkat Baru Terdeteksi</b>',
            '',
            `Device Key: <code>${escapeHTML(key)}</code>`,
            `Buyer: ${escapeHTML(buyer || '-')}`,
            `Seller: ${escapeHTML(seller || '-')}`,
            `OS: ${escapeHTML(device_info.os || device_info.platform || '-')}`,
            `Model: ${escapeHTML(device_info.model || device_info.device_model || '-')}`,
            '',
            '<b>Data Perangkat:</b>',
            deviceInfoText(device_info),
            '',
            '<b>Status:</b> Menunggu persetujuan',
            '',
            `Aktifkan: <code>/addtools ${escapeHTML(key)}</code>`,
            `Blokir: <code>/blocktools ${escapeHTML(key)}</code>`
        ].join('\n');

        await notifyOwner(notification);

        return res.status(201).json({
            success: true,
            device_key: key,
            status: 'pending',
            message: 'Perangkat terdaftar dan menunggu persetujuan.'
        });
    } catch (error) {
        console.error('Register error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Gagal mendaftarkan perangkat.'
        });
    }
}

);

// CHECK DEVICE
app.post(
'/check',
rateLimit({ windowMs: 60_000, max: 60 }),
(req, res) => {
try {
const { device_key } = req.body || {};

        if (
            typeof device_key !== 'string' ||
            !device_key.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: 'device_key wajib diisi.'
            });
        }

        const device = getDevice(device_key.trim());

        if (!device) {
            return res.status(404).json({
                success: false,
                registered: false,
                message: 'Perangkat tidak ditemukan.'
            });
        }

        return res.json({
            success: true,
            registered: true,
            device_key: device.device_key,
            status: device.status,
            allowed: device.status === 'active'
        });
    } catch (error) {
        console.error('Check error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Gagal memeriksa perangkat.'
        });
    }
}

);

// SET STATUS - WAJIB API SECRET
app.post('/set-status', async (req, res) => {
try {
const suppliedSecret = req.get('x-api-secret');

    if (
        typeof suppliedSecret !== 'string' ||
        suppliedSecret.length !== API_SECRET.length ||
        suppliedSecret !== API_SECRET
    ) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized.'
        });
    }

    const { device_key, status } = req.body || {};
    const allowedStatuses = ['pending', 'active', 'blocked'];

    if (
        typeof device_key !== 'string' ||
        !device_key.trim() ||
        !allowedStatuses.includes(status)
    ) {
        return res.status(400).json({
            success: false,
            message: 'device_key atau status tidak valid.'
        });
    }

    const key = device_key.trim();

    if (!getDevice(key)) {
        return res.status(404).json({
            success: false,
            message: 'Perangkat tidak ditemukan.'
        });
    }

    run(
        'UPDATE devices SET status = ?, updated_at = ? WHERE device_key = ?',
        [status, now(), key]
    );

    await saveDatabase();

    return res.json({
        success: true,
        device_key: key,
        status,
        message: 'Status perangkat berhasil diperbarui.'
    });
} catch (error) {
    console.error('Set status error:', error.message);

    return res.status(500).json({
        success: false,
        message: 'Gagal memperbarui status.'
    });
}

});

// JSON ERROR HANDLER
app.use((error, req, res, next) => {
if (error instanceof SyntaxError && 'body' in error) {
return res.status(400).json({
success: false,
message: 'JSON request tidak valid.'
});
}

console.error('Express error:', error.message);

return res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan server.'
});

});

// ============================================================
// START SERVER
// ============================================================

async function start() {
try {
await initDatabase();
registerBotHandlers();

    const server = app.listen(PORT, '0.0.0.0', () => {
       console.log(`Jalankan FloX Tools Di Session Kedua`);
       console.log(`Setelah Berhasil Menggunakann Tools Harap Hentikan Session Ini CTRL+C Sebelum 1 Menit Atau Di Keluarkan Otomatis Dari Tools`);
    });

    server.on('error', (error) => {
        console.error('Server error:', error.message);
        process.exitCode = 1;
    });
} catch (error) {
    console.error('Gagal menjalankan API:', error);

    try {
        await bot.stopPolling();
    } catch {}

    process.exit(1);
}

}

start();