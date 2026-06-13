const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Render membutuhkan web server agar aplikasi tetap berjalan
app.get('/', (req, res) => {
    res.send('Bot WhatsApp berjalan aktif!');
});

app.listen(port, () => {
    console.log(`Web server mendengarkan di port ${port}`);
});

// Inisialisasi bot dengan LocalAuth agar sesi tersimpan
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth' // Folder ini akan menyimpan sesi WhatsApp Anda
    }),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Wajib untuk server Linux seperti Render
    }
});

// Menampilkan QR Code di terminal Render saat pertama kali jalan
client.on('qr', (qr) => {
    console.log('SCAN QR CODE INI DI WHATSAPP ANDA:');
    qrcode.generate(qr, { small: true });
});

// Log saat bot berhasil masuk
client.on('ready', () => {
    console.log('Bot WhatsApp siap digunakan!');
});

// Logika balas otomatis
client.on('message', async (msg) => {
    const pesan = msg.body.toLowerCase();

    if (pesan === 'p' || pesan === 'halo' || pesan === 'hi') {
        await msg.reply('Halo! Ada yang bisa saya bantu? Ini adalah balasan otomatis.');
    } else if (pesan === 'info') {
        await msg.reply('Bot ini aktif 24 jam di hosting Render.');
    }
});

client.initialize();
