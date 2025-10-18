document.addEventListener('DOMContentLoaded', () => {

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const cartEmptyMsg = document.querySelector('.cart-empty-msg');

    const addressModal = document.getElementById('address-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const addressForm = document.getElementById('address-form');
    
    // Updated for the new order status modal
    const orderStatusModal = document.getElementById('order-status-modal');
    const orderStatusDetails = document.getElementById('order-status-details');
    const closeStatusBtn = document.getElementById('close-status-btn');

    let cart = [];

    function updateCart() {
        cartItemsList.innerHTML = '';
        if (cart.length === 0) {
            cartEmptyMsg.style.display = 'block';
        } else {
            cartEmptyMsg.style.display = 'none';
            cart.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${item.name}</span> <span>₹${item.price.toFixed(2)}</span>`;
                cartItemsList.appendChild(li);
            });
        }
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalPrice.textContent = total.toFixed(2);
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const itemElement = event.target.closest('.item');
            const itemName = itemElement.dataset.name;
            const itemPrice = parseFloat(itemElement.dataset.price);
            cart.push({ name: itemName, price: itemPrice });
            updateCart();
        });
    });

    placeOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        addressModal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        addressModal.style.display = 'none';
    });

    addressForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const customerDetails = {
            name: document.getElementById('name').value,
            mobile: document.getElementById('mobile').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            pincode: document.getElementById('pincode').value,
        };
        
        // Generate a unique order ID
        const orderId = 'KA-' + Date.now();
        const total = cart.reduce((sum, item) => sum + item.price, 0);

        const newOrder = {
            id: orderId,
            customer: customerDetails,
            items: cart,
            total: total,
            status: 'Pending' // Initial status
        };

        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('khauAddaOrders')) || [];
        orders.push(newOrder);
        localStorage.setItem('khauAddaOrders', JSON.stringify(orders));

        // Display order status to customer
        displayOrderStatus(newOrder);
        
        addressModal.style.display = 'none';
        addressForm.reset();
        orderStatusModal.style.display = 'block';

        cart = [];
        updateCart();
    });

    function displayOrderStatus(order) {
        let statusHTML = `<h3>Thank you, ${order.customer.name}!</h3>`;
        statusHTML += `<p>Your order has been placed successfully.</p>`;
        statusHTML += `<p><strong>Order ID:</strong> ${order.id}</p>`;
        statusHTML += `<p><strong>Status:</strong> <span class="status status-pending">${order.status}</span></p>`;
        statusHTML += `<h4>Order Summary:</h4><ul>`;
        order.items.forEach(item => {
            statusHTML += `<li><span>${item.name}</span> <span>₹${item.price.toFixed(2)}</span></li>`;
        });
        statusHTML += `</ul>`;
        statusHTML += `<p class="total-display"><strong>Total: ₹${order.total.toFixed(2)}</strong></p>`;
        statusHTML += `<p class="status-note">An admin will confirm your order shortly.</p>`;
        
        orderStatusDetails.innerHTML = statusHTML;
    }
    
    closeStatusBtn.addEventListener('click', () => {
        orderStatusModal.style.display = 'none';
    });

    updateCart();
});
