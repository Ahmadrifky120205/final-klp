document.addEventListener('DOMContentLoaded', () => {
    const menuList = document.querySelector('.menu-list');
    const totalPriceEl = document.getElementById('total-price');
    const orderForm = document.getElementById('order-form');
    const customerNameInput = document.getElementById('customer-name');
    const confirmationMessageEl = document.getElementById('confirmation-message');

    // --- DATA MENU DENGAN GAMBAR ---
    const menuItems = [
        { id: 1, name: 'Mie Gacoan', price: 10000, image: 'https://i.pinimg.com/736x/7e/7b/d5/7e7bd5eef640299d312048ba9fa689d2.jpg'},
        { id: 2, name: 'Mie Hompimpa', price: 10000, image: 'https://i.pinimg.com/736x/a3/69/31/a36931b09073cd4c51911b79f307f8d5.jpg' },
        { id: 3, name: 'Udang Keju', price: 9000, image: 'https://i.pinimg.com/1200x/69/67/85/696785d41b53542c4d6ebb6246ad80b5.jpg' },
        { id: 4, name: 'Lumpia Udang', price: 9000, image: 'https://i.pinimg.com/736x/30/18/1e/30181e9713d91fa90f1fb13d83aa1270.jpg' },
        { id: 5, name: 'Es Gobak Sodor', price: 8500, image: 'https://i.pinimg.com/1200x/d0/e4/14/d0e4142b632364b8e044649dde13b644.jpg' },
        { id: 6, name: 'Es Teklek', price: 6500, image: 'https://i.pinimg.com/736x/95/14/64/951464881abf7b6175905db690751731.jpg' }
    ];

    let order = {};

    function renderMenu() {
        menuItems.forEach(item => {
            order[item.id] = { ...item, quantity: 0 };

            const itemEl = document.createElement('div');
            itemEl.classList.add('menu-item');
            
            // --- BAGIAN INI DIPERBARUI UNTUK MENAMBAHKAN GAMBAR ---
            itemEl.innerHTML = `
               <center><img src="${item.image}" alt="${item.name}" class="menu-item-img"></center>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Rp ${item.price.toLocaleString('id-ID')}</p>
                </div>
                <div class="item-controls">
                    <button type="button" class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <span class="quantity" id="quantity-${item.id}">0</span>
                    <button type="button" class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                </div>
            `;
            menuList.appendChild(itemEl);
        });
    }

    function updateQuantity(id, action) {
        if (action === 'increase') {
            order[id].quantity++;
        } else if (action === 'decrease' && order[id].quantity > 0) {
            order[id].quantity--;
        }
        document.getElementById(`quantity-${id}`).textContent = order[id].quantity;
        updateTotalPrice();
    }

    function updateTotalPrice() {
        let total = 0;
        for (const id in order) {
            total += order[id].price * order[id].quantity;
        }
        totalPriceEl.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }

    menuList.addEventListener('click', (e) => {
        if (e.target.classList.contains('quantity-btn')) {
            const id = e.target.dataset.id;
            const action = e.target.dataset.action;
            updateQuantity(id, action);
        }
    });

    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const customerName = customerNameInput.value.trim();
        if (!customerName) {
            alert('Silakan masukkan nama Anda.');
            return;
        }

        const itemsToOrder = Object.values(order).filter(item => item.quantity > 0);

        if (itemsToOrder.length === 0) {
            alert('Anda belum memilih item apapun.');
            return;
        }

        const orderData = {
            customerName,
            items: itemsToOrder,
            totalPrice: Object.values(order).reduce((sum, item) => sum + item.price * item.quantity, 0)
        };
        
        try {
            const response = await fetch('/pesan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('Gagal mengirim pesanan.');
            }

            const result = await response.json();
            orderForm.classList.add('hidden');
            confirmationMessageEl.textContent = `Terima kasih! Pesanan atas nama "${result.customerName}" berhasil dibuat.`;
            confirmationMessageEl.classList.remove('hidden');

        } catch (error) {
            alert(error.message);
        }
    });

    renderMenu();
});
