document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('admin-login');
    const dashboardSection = document.getElementById('admin-dashboard');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const ordersTbody = document.getElementById('orders-tbody');

    const ADMIN_PASSWORD = 'Vishv1234'; // Simple hardcoded password

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const password = document.getElementById('password').value;
        if (password === ADMIN_PASSWORD) {
            loginSection.style.display = 'none';
            dashboardSection.style.display = 'block';
            loadOrders();
        } else {
            loginError.textContent = 'Incorrect password.';
        }
    });

    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem('khauAddaOrders')) || [];
        ordersTbody.innerHTML = ''; // Clear existing table data

        if (orders.length === 0) {
            ordersTbody.innerHTML = '<tr><td colspan="6">No orders found.</td></tr>';
            return;
        }
        
        // Display orders in reverse chronological order
        orders.reverse().forEach(order => {
            const row = document.createElement('tr');
            
            const customerInfo = `
                ${order.customer.name}<br>
                ${order.customer.mobile}<br>
                ${order.customer.address}, ${order.customer.city}, ${order.customer.pincode}
            `;
            
            const itemsInfo = order.items.map(item => `${item.name} (₹${item.price})`).join('<br>');

            let statusClass = '';
            if (order.status === 'Confirmed') statusClass = 'status-confirmed';
            else if (order.status === 'Declined') statusClass = 'status-declined';
            else statusClass = 'status-pending';

            row.innerHTML = `
                <td>${order.id}</td>
                <td>${customerInfo}</td>
                <td>${itemsInfo}</td>
                <td>₹${order.total.toFixed(2)}</td>
                <td><span class="status ${statusClass}">${order.status}</span></td>
                <td class="action-buttons">
                    ${order.status === 'Pending' ? `
                    <button class="confirm-btn" data-id="${order.id}">Confirm</button>
                    <button class="decline-btn" data-id="${order.id}">Decline</button>
                    ` : `<span>-</span>`}
                </td>
            `;
            ordersTbody.appendChild(row);
        });
    }

    ordersTbody.addEventListener('click', (event) => {
        const orderId = event.target.dataset.id;
        if (!orderId) return;

        if (event.target.classList.contains('confirm-btn')) {
            updateOrderStatus(orderId, 'Confirmed');
        } else if (event.target.classList.contains('decline-btn')) {
            updateOrderStatus(orderId, 'Declined');
        }
    });

    function updateOrderStatus(orderId, newStatus) {
        let orders = JSON.parse(localStorage.getItem('khauAddaOrders')) || [];
        orders = orders.map(order => {
            if (order.id === orderId) {
                return { ...order, status: newStatus };
            }
            return order;
        });
        localStorage.setItem('khauAddaOrders', JSON.stringify(orders));
        loadOrders(); // Refresh the table
    }
});
