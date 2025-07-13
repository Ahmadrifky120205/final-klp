const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'pesanan.json');

// Middleware untuk membaca JSON body dan menyajikan file statis dari folder 'public'
app.use(express.json());
app.use(express.static('public'));

// Fungsi untuk membaca data pesanan dari file
function readOrders() {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
}

// Fungsi untuk menulis data pesanan ke file
function writeOrders(orders) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2));
}

// Endpoint untuk menerima pesanan baru (API)
app.post('/pesan', (req, res) => {
    const orders = readOrders();
    const newOrder = {
        orderId: `GACOAN-${Date.now()}`, // ID unik untuk setiap pesanan
        customerName: req.body.customerName,
        items: req.body.items,
        totalPrice: req.body.totalPrice,
        orderTime: new Date().toISOString()
    };
    
    // Validasi sederhana
    if (!newOrder.customerName || !newOrder.items || newOrder.items.length === 0) {
        return res.status(400).json({ message: 'Data pesanan tidak lengkap.' });
    }

    orders.push(newOrder);
    writeOrders(orders);

    console.log(`Pesanan baru diterima dari: ${newOrder.customerName}`);
    console.log(newOrder);

    res.status(201).json({ 
        message: 'Pesanan berhasil disimpan!',
        customerName: newOrder.customerName
    });
});

// Endpoint untuk melihat semua pesanan (opsional, untuk admin)
app.get('/semua-pesanan', (req, res) => {
    const orders = readOrders();
    res.json(orders);
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server pemesanan berjalan di http://localhost:${PORT}`);
});