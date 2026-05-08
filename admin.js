// ============================================
// ADMIN PANEL JAVASCRIPT
// ============================================

// Admin credentials (for demo - change in production)
const ADMIN_PASSWORD = 'demo123';
let isLoggedIn = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);

    // Check if already logged in
    if (sessionStorage.getItem('adminLoggedIn')) {
        isLoggedIn = true;
        showAdminPanel();
        loadDashboard();
    }
});

// ============================================
// LOGIN HANDLING
// ============================================

function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;

    if (password === ADMIN_PASSWORD) {
        isLoggedIn = true;
        sessionStorage.setItem('adminLoggedIn', 'true');
        document.getElementById('loginScreen').classList.add('hidden');
        showAdminPanel();
        loadDashboard();
    } else {
        alert('Невалидна парола!');
    }
}

function logout() {
    isLoggedIn = false;
    sessionStorage.removeItem('adminLoggedIn');
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('loginForm').reset();
}

function showAdminPanel() {
    document.getElementById('adminPanel').style.display = 'flex';
}

// ============================================
// TAB SWITCHING
// ============================================

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active from all links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Mark link as active
    event.target.classList.add('active');

    // Load content
    if (tabName === 'orders') loadOrders();
    if (tabName === 'messages') loadMessages();
    if (tabName === 'stats') loadStatistics();
}

// ============================================
// DASHBOARD
// ============================================

function loadDashboard() {
    const orders = getOrders();
    const messages = getMessages();

    // Update stat cards
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalRevenue').textContent = 
        '€' + orders.reduce((sum, o) => sum + o.price, 0);
    document.getElementById('unreadMessages').textContent = 
        messages.filter(m => m.status === 'unread').length;

    // Load recent orders
    const recentOrders = orders.slice(-3).reverse();
    const recentOrdersHtml = recentOrders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <span class="order-id">${order.id}</span>
                <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-details">
                <strong>${order.name}</strong> - ${order.serviceType}<br>
                €${order.price} | ${formatDate(order.date)}<br>
                <small>${order.email}</small>
            </div>
        </div>
    `).join('');

    document.getElementById('recentOrders').innerHTML = recentOrdersHtml || 
        '<p class="empty-state"><p>Няма поръчки все още</p></p>';
}

// ============================================
// ORDERS MANAGEMENT
// ============================================

function loadOrders() {
    const orders = getOrders();
    
    const ordersHtml = orders.length ? orders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <span class="order-id">${order.id}</span>
                <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-details">
                <strong>Клиент:</strong> ${order.name}<br>
                <strong>Email:</strong> ${order.email}<br>
                <strong>Телефон:</strong> ${order.phone}<br>
                <strong>Услуга:</strong> ${getServiceName(order.serviceType)}<br>
                <strong>Цена:</strong> €${order.price}<br>
                <strong>Дата:</strong> ${formatDate(order.date)}<br>
                <strong>Платеж ID:</strong> ${order.paymentId}
            </div>
            <div class="order-actions">
                ${order.status !== 'completed' ? 
                    `<button class="action-btn btn-complete" onclick="updateOrderStatus('${order.id}', 'completed')">Завърши</button>` : 
                    ''}
                <button class="action-btn btn-delete" onclick="deleteOrder('${order.id}')">Изтрий</button>
            </div>
        </div>
    `).join('') : '<p class="empty-state"><p>Няма поръчки</p></p>';

    document.getElementById('ordersList').innerHTML = ordersHtml;
}

function updateOrderStatus(orderId, newStatus) {
    let orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();
        loadDashboard();
        alert('Поръчката е обновена');
    }
}

function deleteOrder(orderId) {
    if (confirm('Сигурен ли си че искаш да изтриеш тази поръчка?')) {
        let orders = getOrders();
        orders = orders.filter(o => o.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();
        loadDashboard();
    }
}

// ============================================
// MESSAGES MANAGEMENT
// ============================================

function loadMessages() {
    const messages = getMessages();
    
    const messagesHtml = messages.length ? messages.map(msg => `
        <div class="message-item">
            <div class="message-header">
                <span class="message-sender">${msg.name}</span>
                <span class="order-status status-${msg.status === 'unread' ? 'pending' : 'completed'}">
                    ${msg.status === 'unread' ? 'Непрочетено' : 'Прочетено'}
                </span>
            </div>
            <div class="message-content">
                <strong>Email:</strong> ${msg.email}<br>
                <strong>Съобщение:</strong><br>
                ${msg.message}<br>
                <small>Дата: ${formatDate(msg.date)}</small>
            </div>
            <div class="order-actions">
                ${msg.status === 'unread' ? 
                    `<button class="action-btn btn-complete" onclick="markMessageAsRead('${msg.id}')">Прочети</button>` : 
                    ''}
                <button class="action-btn btn-delete" onclick="deleteMessage('${msg.id}')">Изтрий</button>
            </div>
        </div>
    `).join('') : '<p class="empty-state"><p>Няма съобщения</p></p>';

    document.getElementById('messagesList').innerHTML = messagesHtml;
}

function markMessageAsRead(messageId) {
    let messages = getMessages();
    const message = messages.find(m => m.id === messageId);
    if (message) {
        message.status = 'read';
        localStorage.setItem('messages', JSON.stringify(messages));
        loadMessages();
        loadDashboard();
    }
}

function deleteMessage(messageId) {
    if (confirm('Сигурен ли си?')) {
        let messages = getMessages();
        messages = messages.filter(m => m.id !== messageId);
        localStorage.setItem('messages', JSON.stringify(messages));
        loadMessages();
        loadDashboard();
    }
}

// ============================================
// STATISTICS
// ============================================

function loadStatistics() {
    const orders = getOrders();

    // Service statistics
    const serviceStats = {};
    orders.forEach(order => {
        const serviceName = getServiceName(order.serviceType);
        serviceStats[serviceName] = (serviceStats[serviceName] || 0) + 1;
    });

    const serviceStatsHtml = Object.entries(serviceStats).map(([service, count]) => `
        <div class="stat-item">
            <span class="stat-item-label">${service}</span>
            <span class="stat-item-value">${count} поръчки</span>
        </div>
    `).join('') || '<p>Няма данни</p>';

    // Status statistics
    const statusStats = {
        completed: orders.filter(o => o.status === 'completed').length,
        pending: orders.filter(o => o.status === 'pending').length
    };

    const statusStatsHtml = `
        <div class="stat-item">
            <span class="stat-item-label">Завършени</span>
            <span class="stat-item-value">${statusStats.completed}</span>
        </div>
        <div class="stat-item">
            <span class="stat-item-label">Чакащи</span>
            <span class="stat-item-value">${statusStats.pending}</span>
        </div>
    `;

    document.getElementById('serviceStats').innerHTML = serviceStatsHtml;
    document.getElementById('statusStats').innerHTML = statusStatsHtml;
}

// ============================================
// UTILITIES
// ============================================

function getOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
}

function getMessages() {
    return JSON.parse(localStorage.getItem('messages') || '[]');
}

function getServiceName(serviceType) {
    const services = {
        minecraft: 'Minecraft сайт',
        shop: 'Онлайн магазин',
        business: 'Бизнес сайт'
    };
    return services[serviceType] || serviceType;
}

function getStatusText(status) {
    const statuses = {
        completed: 'Завършена',
        pending: 'Чакаща',
        processing: 'Обработка'
    };
    return statuses[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

console.log('🛡️ Admin Panel Loaded - Password: demo123');
