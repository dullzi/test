const fs = require('fs');

function simpanPesanan(chatId, data) {
    const file = './data.json';
    let semuaData = {};

    if (fs.existsSync(file)) {
        semuaData = JSON.parse(fs.readFileSync(file, 'utf-8'));
    }

    semuaData[chatId] = data;
    fs.writeFileSync(file, JSON.stringify(semuaData, null, 2));
}

function buatStrukPesanan(data) {
    return `
🧾 *Bukti Pemesanan Barang*

👤 Nama: ${data.nama}
📞 No HP: ${data.no}
🏠 Alamat: ${data.alamat}
📅 Tanggal: ${data.tanggal}
📦 Barang: ${data.barang}
🔢 Jumlah: ${data.jumlah}

📌 Pesanan akan diproses setelah pembayaran diterima.
Batas pembayaran: 24 jam setelah pemesanan.
`;
}

module.exports = { simpanPesanan, buatStrukPesanan };
