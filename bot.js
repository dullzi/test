const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot Siap Digunakan!');
});

// === FORM DAN RULES ===

const formPemesanan = `📦 *Form Pemesanan Barang*

Silakan isi data berikut:

* Nama:
* No HP / WA:
* Hari / Tgl:
* Waktu:
* Dari:
* Tujuan:
* Jml Barang:

📌 *Note:*
- Harap isi data dengan lengkap agar pesanan bisa segera diproses.
- Tim kami akan menghubungi Anda untuk konfirmasi dan pembayaran.
- Batas pembayaran maksimal 24 jam setelah pemesanan.

*Terima kasih!*`;

const rules = `
📜 *Ketentuan Pemesanan:*
1. Barang akan diproses maksimal 1x24 jam setelah pembayaran.
2. Ongkir ditanggung pembeli.
3. Barang yang sudah dibeli tidak dapat dibatalkan.
4. Pengembalian hanya bisa dilakukan maksimal 3 hari setelah diterima.
5. Pengembalian wajib menyertakan video unboxing.
6. Proses refund membutuhkan waktu 2–3 hari kerja.
7. Admin akan menghubungi Anda untuk konfirmasi lebih lanjut.
`;

// === FUNGSI FORM ===

function parseForm(text) {
    const lines = text.toLowerCase().split('\n'); // ✅ pakai toLowerCase()
    const data = {};

    lines.forEach(line => {
        const [key, ...rest] = line.split(':');
        if (key && rest.length > 0) {
            data[key.trim()] = rest.join(':').trim();
        }
    });

    return data;
}

function buatStrukPesanan(data) {
    return `🧾 *Bukti Pemesanan Barang*
👤 *Nama:* ${data['nama'] || '-'}
📞 *No HP:* ${data['no hp'] || '-'}
📅 *Hari / Tgl:* ${data['hari / tgl'] || '-'}
⏰ *Waktu:* ${data['waktu'] || '-'}
🚚 *Dari:* ${data['dari'] || '-'}
🎯 *Tujuan:* ${data['tujuan'] || '-'}
📦 *Jumlah Barang:* ${data['jml barang'] || data['jml seat'] || '-'}

📝 *Catatan:*
Reservasi akan diproses jika data sudah lengkap.
Tunggu konfirmasi dari admin. Ketersediaan barang dapat berubah sewaktu-waktu.`;
}

// === EVENT PESAN ===

client.on('message', async (msg) => {
    const chat = msg.body.toLowerCase();
    console.log(`[LOG] Pesan dari ${msg.from}: ${msg.body}`);

    // 1. Cek jika .ping
    if (chat === '.ping') {
        return msg.reply('pong!');
    }

    // 2. Cek apakah isi form
    const isForm = chat.includes('nama:') &&
                   chat.includes('no hp') &&
                   chat.includes('hari') &&
                   chat.includes('tujuan') &&
                   (chat.includes('jml barang') || chat.includes('jml seat'));

    if (isForm) {
        const data = parseForm(msg.body); // ✅ msg.body aslinya (bukan chat)
        const struk = buatStrukPesanan(data);

        await msg.reply(struk);
        await msg.reply(rules);
        return;
    }

    // 3. Jika bukan form, kirim form
    await msg.reply(formPemesanan);
});

client.initialize();
