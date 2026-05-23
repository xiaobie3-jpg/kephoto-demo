// 轲影像云相册 - 主应用

// ========== 页面渲染 ==========

function renderHome() {
    const ongoingEvents = mockData.events.filter(e => e.status === '进行中');
    const upcomingEvents = mockData.events.filter(e => e.status === '即将开始');
    const endedEvents = mockData.events.filter(e => e.status === '已结束');

    let html = `
        <div class="page home-page">
            <div class="home-header">
                <h1>轲影像云相册</h1>
                <p>发现精彩赛事瞬间</p>
            </div>
            <div class="search-bar">
                <input type="text" class="search-input" placeholder="搜索活动名称..." id="search-input">
                <button class="search-btn" onclick="handleSearch()">搜索</button>
            </div>
    `;

    if (ongoingEvents.length > 0) {
        html += `<div class="section-title">正在进行 <span class="more">${ongoingEvents.length}个活动</span></div>`;
        ongoingEvents.forEach(event => {
            html += renderEventCard(event);
        });
    }

    if (upcomingEvents.length > 0) {
        html += `<div class="section-title">即将开始 <span class="more">${upcomingEvents.length}个活动</span></div>`;
        upcomingEvents.forEach(event => {
            html += renderEventCard(event);
        });
    }

    if (endedEvents.length > 0) {
        html += `<div class="section-title">精彩回顾 <span class="more">${endedEvents.length}个活动</span></div>`;
        endedEvents.forEach(event => {
            html += renderEventCard(event);
        });
    }

    html += `</div>`;
    return html;
}

function renderEventCard(event) {
    const statusClass = event.status === '进行中' ? 'status-ongoing' : event.status === '已结束' ? 'status-ended' : 'status-upcoming';
    return `
        <div class="event-card" onclick="goToEventDetail(${event.id})">
            <img class="event-banner" src="${event.banner}" alt="${event.name}">
            <div class="event-info">
                <div class="event-name">${event.name}</div>
                <div class="event-meta">
                    <span>${event.subtitle}</span>
                    <span class="status ${statusClass}">${event.status}</span>
                </div>
                <div class="event-stats">
                    <span>👁 ${formatNumber(event.viewCount)}人浏览</span>
                    <span>📷 ${event.photoCount}张照片</span>
                    <span>🎬 ${event.videoCount}个视频</span>
                </div>
            </div>
        </div>
    `;
}

function renderEventDetail(eventId) {
    const event = mockData.events.find(e => e.id === eventId);
    if (!event) return '';

    appState.currentEvent = event;

    let html = `
        <div class="page event-detail-page">
            <div class="page-header">
                <span class="back-btn" onclick="goBack()">‹</span>
                <span class="page-header-title">活动详情</span>
                <span style="width: 24px;"></span>
            </div>
            <div class="event-detail-banner">
                <img src="${event.banners[0]}" alt="${event.name}">
                <div class="banner-dots">
                    ${event.banners.map((_, i) => `<div class="banner-dot ${i === 0 ? 'active' : ''}"></div>`).join('')}
                </div>
            </div>
            <div class="event-detail-info">
                <div class="event-detail-title">${event.name}</div>
                <div class="event-detail-meta">
                    <span>📍 ${event.subtitle}</span>
                    <span>📅 ${event.startTime} - ${event.endTime}</span>
                    <span>👁 ${formatNumber(event.viewCount)}人浏览</span>
                </div>
                <div class="search-tools">
                    <div class="search-tool-btn face" onclick="showFaceSearch()">
                        <span>📷</span> 人脸识别找自己
                    </div>
                    <div class="search-tool-btn number" onclick="showNumberSearch()">
                        <span>🔢</span> 号牌搜索
                    </div>
                </div>
                <div class="action-btns">
                    <button class="action-btn primary" onclick="goToAlbum(${event.id})">进入相册</button>
                    <button class="action-btn secondary" onclick="shareEvent()">分享活动</button>
                </div>
            </div>
        </div>
    `;
    return html;
}

function renderAlbum(eventId) {
    const event = mockData.events.find(e => e.id === eventId);
    if (!event) return '';

    appState.currentEvent = event;
    const currentAlbum = appState.currentAlbum || event.albums[0];
    const isPhoto = appState.currentTab === 'photo';

    let html = `
        <div class="page album-page">
            <div class="page-header">
                <span class="back-btn" onclick="goBack()">‹</span>
                <span class="page-header-title">${event.name}</span>
                <span style="width: 24px;"></span>
            </div>
            <div class="album-header">
                <div class="album-tabs">
                    <div class="album-tab ${isPhoto ? 'active' : ''}" onclick="switchTab('photo')">图片(${event.photoCount})</div>
                    <div class="album-tab ${!isPhoto ? 'active' : ''}" onclick="switchTab('video')">视频(${event.videoCount})</div>
                </div>
                <div class="album-sub-tabs">
                    ${event.albums.map(album => `
                        <div class="album-sub-tab ${currentAlbum.id === album.id ? 'active' : ''}" onclick="switchAlbum(${album.id})">${album.name}(${album.count})</div>
                    `).join('')}
                </div>
            </div>
            <div class="view-options">
                <div class="view-option" onclick="toggleViewMode()">
                    <span>${appState.viewMode === 'waterfall' ? '⬜' : '▦'}</span>
                    <span>${appState.viewMode === 'waterfall' ? '瀑布流' : '方格图'}</span>
                </div>
                <div class="view-option" onclick="toggleSort()">
                    <span>⇅</span>
                    <span>按时间</span>
                </div>
                <div class="view-option" onclick="toggleSelectMode()">
                    <span>☑️</span>
                    <span>多选</span>
                </div>
            </div>
    `;

    if (isPhoto) {
        const photos = mockData.photos.filter(p => p.eventId === eventId && (currentAlbum.id === 1 || p.albumId === currentAlbum.id));
        if (photos.length > 0) {
            if (appState.viewMode === 'waterfall') {
                html += `<div class="waterfall">`;
                photos.forEach((photo, index) => {
                    html += `
                        <div class="waterfall-item" onclick="openLightbox(${index})">
                            ${appState.selectMode ? `<div class="checkbox ${isSelected(photo.id) ? 'checked' : ''}" onclick="toggleSelect(event, ${photo.id})"></div>` : ''}
                            <img src="${photo.thumb}" alt="">
                            <div class="watermark">轲影像</div>
                        </div>
                    `;
                });
                html += `</div>`;
            } else {
                html += `<div class="grid grid-${appState.gridColumns}">`;
                photos.forEach((photo, index) => {
                    html += `
                        <div class="grid-item" onclick="openLightbox(${index})">
                            ${appState.selectMode ? `<div class="checkbox ${isSelected(photo.id) ? 'checked' : ''}" onclick="toggleSelect(event, ${photo.id})"></div>` : ''}
                            <img src="${photo.thumb}" alt="">
                            <div class="watermark">轲影像</div>
                        </div>
                    `;
                });
                html += `</div>`;
            }
        } else {
            html += renderEmpty('暂无照片');
        }
    } else {
        const videos = mockData.videos.filter(v => v.eventId === eventId && (currentAlbum.id === 1 || v.albumId === currentAlbum.id));
        if (videos.length > 0) {
            html += `<div class="video-list">`;
            videos.forEach(video => {
                html += `
                    <div class="video-item" onclick="goToVideoDetail(${video.id})">
                        <div class="video-cover">
                            <img src="${video.cover}" alt="">
                            <div class="video-watermark">轲影像</div>
                            <div class="video-duration">${video.duration}</div>
                            <div class="video-play-icon"></div>
                        </div>
                        <div class="video-info">
                            <div class="video-title">精彩瞬间</div>
                            <div class="video-meta">${video.photographer} · ${video.time}</div>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        } else {
            html += renderEmpty('暂无视频');
        }
    }

    html += `</div>`;

    if (appState.selectMode && appState.selectedPhotos.length > 0) {
        html += `
            <div class="select-mode-bar">
                <div class="select-count">已选 <span>${appState.selectedPhotos.length}</span> 项</div>
                <div class="select-actions">
                    <button class="select-btn secondary" onclick="clearSelect()">清空</button>
                    <button class="select-btn primary" onclick="goToCheckout()">去结算</button>
                </div>
            </div>
        `;
    }

    return html;
}

function renderLightbox() {
    const event = appState.currentEvent;
    const photos = mockData.photos.filter(p => p.eventId === event.id);
    const photo = photos[appState.currentPhotoIndex];
    if (!photo) return '';

    return `
        <div class="lightbox">
            <div class="lightbox-header">
                <span class="lightbox-close" onclick="closeLightbox()">✕</span>
                <span class="lightbox-counter">${appState.currentPhotoIndex + 1} / ${photos.length}</span>
                <span style="width: 24px;"></span>
            </div>
            <div class="lightbox-body">
                ${appState.currentPhotoIndex > 0 ? `<div class="lightbox-nav prev" onclick="prevPhoto()">‹</div>` : ''}
                <img src="${photo.url}" alt="">
                <div class="lightbox-watermark">轲影像 · 示例水印</div>
                ${appState.currentPhotoIndex < photos.length - 1 ? `<div class="lightbox-nav next" onclick="nextPhoto()">›</div>` : ''}
            </div>
            <div class="lightbox-footer">
                <div class="lightbox-info">
                    <div>📷 ${photo.photographer} · ${photo.time}</div>
                    <div>分辨率: ${photo.width}x${photo.height}</div>
                </div>
                <div class="lightbox-actions">
                    <button class="lightbox-btn download" onclick="addToCart(${photo.id})">下载原片 ¥${event.price.single}</button>
                    <button class="lightbox-btn reward" onclick="showRewardModal('${photo.photographer}')">💰 打赏摄影师</button>
                    <button class="lightbox-btn share" onclick="showToast('生成海报功能演示')">生成海报</button>
                </div>
            </div>
        </div>
    `;
}

function renderCheckout() {
    const event = appState.currentEvent;
    const selectedItems = appState.selectedPhotos.map(id => mockData.photos.find(p => p.id === id)).filter(Boolean);
    const total = selectedItems.length * event.price.single;

    let html = `
        <div class="page checkout-page">
            <div class="checkout-header">
                <span class="back-btn" onclick="goBack()">‹</span>
                <span class="checkout-title">确认订单</span>
            </div>
            <div class="checkout-section">
                <div class="checkout-section-title">活动信息</div>
                <div style="font-size: 14px; color: #666;">${event.name}</div>
            </div>
            <div class="checkout-section">
                <div class="checkout-section-title">已选资源 (${selectedItems.length})</div>
                <div class="checkout-items">
                    ${selectedItems.map(item => `
                        <div class="checkout-item">
                            <img src="${item.thumb}" alt="">
                            <div class="checkout-item-info">
                                <div class="checkout-item-name">精彩瞬间 #${String(item.id).padStart(3, '0')}</div>
                                <div class="checkout-item-price">¥${event.price.single}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="checkout-section">
                <div class="checkout-section-title">优惠套餐</div>
                <div class="package-options">
                    <div class="package-option ${selectedItems.length === 1 ? 'selected' : ''}" onclick="selectPackage(1)">
                        <div class="package-option-info">单张购买</div>
                        <div class="package-option-price">¥${event.price.single}<span class="package-option-original">¥${event.price.single}</span></div>
                    </div>
                    ${event.packages.map(pkg => `
                        <div class="package-option ${selectedItems.length === pkg.count ? 'selected' : ''}" onclick="selectPackage(${pkg.count})">
                            <div class="package-option-info">${pkg.count}张套餐</div>
                            <div class="package-option-price">¥${pkg.price}<span class="package-option-original">¥${pkg.count * event.price.single}</span></div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="checkout-section">
                <div class="checkout-summary">
                    <span class="checkout-total-label">应付总额</span>
                    <span class="checkout-total-price">¥${total}</span>
                </div>
            </div>
            <div style="height: 80px;"></div>
            <div class="checkout-footer">
                <div>
                    <div style="font-size: 12px; color: #999;">应付总额</div>
                    <div style="font-size: 20px; color: #ff6b35; font-weight: 600;">¥${total}</div>
                </div>
                <button class="checkout-pay-btn" onclick="showPayModal()">立即支付</button>
            </div>
        </div>
    `;
    return html;
}

function renderOrders() {
    const currentType = appState.orderTab || 'all';
    const filteredOrders = currentType === 'all' ? mockData.orders : mockData.orders.filter(o => o.type === currentType);

    let html = `
        <div class="page orders-page">
            <div class="page-header">
                <span class="back-btn" onclick="goBack()">‹</span>
                <span class="page-header-title">我的订单</span>
                <span style="width: 24px;"></span>
            </div>
            <div class="orders-header">
                <div class="orders-tabs">
                    <div class="orders-tab ${currentType === 'all' ? 'active' : ''}" onclick="switchOrderTab('all')">全部</div>
                    <div class="orders-tab ${currentType === 'photo' ? 'active' : ''}" onclick="switchOrderTab('photo')">图片</div>
                    <div class="orders-tab ${currentType === 'video' ? 'active' : ''}" onclick="switchOrderTab('video')">视频</div>
                    <div class="orders-tab ${currentType === 'reward' ? 'active' : ''}" onclick="switchOrderTab('reward')">打赏</div>
                </div>
            </div>
    `;

    if (filteredOrders.length > 0) {
        filteredOrders.forEach(order => {
            html += `
                <div class="order-item">
                    <div class="order-header">
                        <span>${order.id}</span>
                        <span class="order-status">${order.status}</span>
                    </div>
                    <div class="order-body">
                        ${order.items.map(item => item.thumb ? `<img src="${item.thumb}" alt="">` : '').join('')}
                        <div class="order-info">
                            <div class="order-name">${order.items.map(i => i.name).join(', ')}</div>
                            <div class="order-event">${order.eventName}</div>
                        </div>
                    </div>
                    <div class="order-footer">
                        <span class="order-price">¥${order.amount}</span>
                        <span class="order-action" onclick="goToOrderDetail('${order.id}')">查看详情</span>
                    </div>
                </div>
            `;
        });
    } else {
        html += renderEmpty('暂无订单');
    }

    html += `</div>`;
    return html;
}

function goToOrderDetail(orderId) {
    goToPage('orderDetail', { orderId });
}

function renderOrderDetail(orderId) {
    const order = mockData.orders.find(o => o.id === orderId);
    if (!order) return '';

    const typeMap = { photo: '图片', video: '视频', package: '套餐', reward: '打赏' };

    return `
        <div class="page order-detail-page">
            <div class="page-header">
                <span class="back-btn" onclick="goBack()">‹</span>
                <span class="page-header-title">订单详情</span>
                <span style="width: 24px;"></span>
            </div>
            <div class="order-detail-status">
                <div class="status-icon">✓</div>
                <div class="status-text">${order.status}</div>
            </div>
            <div class="order-detail-section">
                <div class="order-detail-label">订单信息</div>
                <div class="order-detail-row"><span>订单编号</span><span>${order.id}</span></div>
                <div class="order-detail-row"><span>订单类型</span><span>${typeMap[order.type] || order.type}</span></div>
                <div class="order-detail-row"><span>下单时间</span><span>${order.time}</span></div>
                <div class="order-detail-row"><span>所属活动</span><span>${order.eventName}</span></div>
            </div>
            <div class="order-detail-section">
                <div class="order-detail-label">商品信息</div>
                ${order.items.map(item => `
                    <div class="order-detail-item">
                        ${item.thumb ? `<img src="${item.thumb}" alt="">` : '<div class="order-detail-item-icon">📷</div>'}
                        <div class="order-detail-item-name">${item.name}</div>
                    </div>
                `).join('')}
            </div>
            <div class="order-detail-section">
                <div class="order-detail-label">金额明细</div>
                <div class="order-detail-row"><span>商品金额</span><span>¥${order.amount}</span></div>
                <div class="order-detail-row total"><span>实付金额</span><span class="order-detail-total">¥${order.amount}</span></div>
            </div>
        </div>
    `;
}

function renderProfile() {
    const unreadCount = mockData.messages.filter(m => !m.read).length;

    return `
        <div class="page profile-page">
            <div class="profile-header">
                <img class="profile-avatar" src="${mockData.user.avatar}" alt="">
                <div class="profile-info">
                    <h3>${mockData.user.nickname}</h3>
                    <p>📱 ${mockData.user.phone}</p>
                </div>
            </div>
            <div class="profile-menu">
                <div class="profile-menu-item" onclick="goToPage('orders')">
                    <div class="profile-menu-left">
                        <span class="profile-menu-icon">📋</span>
                        <span>我的订单</span>
                    </div>
                    <span class="profile-menu-arrow">›</span>
                </div>
                <div class="profile-menu-item" onclick="goToPage('downloads')">
                    <div class="profile-menu-left">
                        <span class="profile-menu-icon">⬇️</span>
                        <span>我的下载</span>
                    </div>
                    <span class="profile-menu-arrow">›</span>
                </div>
                <div class="profile-menu-item" onclick="goToPage('messages')">
                    <div class="profile-menu-left">
                        <span class="profile-menu-icon">🔔</span>
                        <span>消息通知</span>
                        ${unreadCount > 0 ? `<span class="profile-badge">${unreadCount}</span>` : ''}
                    </div>
                    <span class="profile-menu-arrow">›</span>
                </div>
                <div class="profile-menu-item" onclick="goToPage('settings')">
                    <div class="profile-menu-left">
                        <span class="profile-menu-icon">⚙️</span>
                        <span>设置</span>
                    </div>
                    <span class="profile-menu-arrow">›</span>
                </div>
            </div>
        </div>
    `;
}

function renderDownloads() {
    let html = `
        <div class="page downloads-page">
            <div class="page-header">
                <span class="back-btn" onclick="goBack()">‹</span>
                <span class="page-header-title">我的下载</span>
                <span style="width: 24px;"></span>
            </div>
    `;

    if (mockData.downloads.length > 0) {
        // 按活动分组
        const eventGroups = {};
        mockData.downloads.forEach(d => {
            if (!eventGroups[d.eventName]) {
                eventGroups[d.eventName] = [];
            }
            eventGroups[d.eventName].push(d);
        });

        Object.keys(eventGroups).forEach(eventName => {
            const items = eventGroups[eventName];
            const firstThumb = items[0].thumb;
            html += `
                <div class="download-group" onclick="goToDownloadDetail('${eventName}')">
                    <div class="download-group-header">
                        <img src="${firstThumb}" alt="">
                        <div class="download-group-info">
                            <div class="download-group-name">${eventName}</div>
                            <div class="download-group-count">共 ${items.length} 个文件</div>
                        </div>
                        <span class="download-group-arrow">›</span>
                    </div>
                </div>
            `;
        });
    } else {
        html += renderEmpty('暂无下载记录');
    }

    html += `</div>`;
    return html;
}

function goToDownloadDetail(eventName) {
    goToPage('downloadDetail', { eventName });
}

function renderDownloadDetail(eventName) {
    const items = mockData.downloads.filter(d => d.eventName === eventName);
    const photos = items.filter(d => !d.name.includes('集锦') && !d.name.includes('视频'));
    const videos = items.filter(d => d.name.includes('集锦') || d.name.includes('视频'));

    return `
        <div class="page download-detail-page">
            <div class="page-header">
                <span class="back-btn" onclick="goBack()">‹</span>
                <span class="page-header-title">${eventName}</span>
                <span style="width: 24px;"></span>
            </div>
            ${photos.length > 0 ? `
                <div class="download-detail-section">
                    <div class="download-detail-label">📷 图片 (${photos.length})</div>
                    <div class="download-detail-grid">
                        ${photos.map(p => `
                            <div class="download-detail-item">
                                <img src="${p.thumb}" alt="">
                                <div class="download-detail-name">${p.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            ${videos.length > 0 ? `
                <div class="download-detail-section">
                    <div class="download-detail-label">🎬 视频 (${videos.length})</div>
                    <div class="download-detail-grid">
                        ${videos.map(v => `
                            <div class="download-detail-item">
                                <div class="download-detail-video-cover">
                                    <img src="${v.thumb}" alt="">
                                    <div class="download-detail-play">▶</div>
                                </div>
                                <div class="download-detail-name">${v.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

function renderMessages() {
    let html = `
        <div class="page messages-page">
            <div class="checkout-header">
                <span class="back-btn" onclick="goBack()">‹</span>
                <span class="checkout-title">消息通知</span>
            </div>
    `;

    if (mockData.messages.length > 0) {
        mockData.messages.forEach(msg => {
            const iconMap = { order: '💰', event: '📅', update: '📢' };
            html += `
                <div class="message-item ${msg.read ? '' : 'unread'}" onclick="readMessage(${msg.id})">
                    <div class="message-icon ${msg.type}">${iconMap[msg.type]}</div>
                    <div class="message-content">
                        <div class="message-title">
                            <span>${msg.title}</span>
                            <span class="message-time">${msg.time}</span>
                        </div>
                        <div class="message-text">${msg.content}</div>
                    </div>
                    ${!msg.read ? '<div class="message-dot"></div>' : ''}
                </div>
            `;
        });
    } else {
        html += renderEmpty('暂无消息');
    }

    html += `</div>`;
    return html;
}

function renderEmpty(text) {
    return `
        <div class="empty-state">
            <div class="empty-icon">📷</div>
            <div class="empty-text">${text}</div>
        </div>
    `;
}

// ========== 页面切换 ==========

function goToPage(page, params = {}) {
    appState.currentPage = page;
    appState.pageParams = params;

    const container = document.getElementById('page-container');
    const tabBar = document.getElementById('tab-bar');

    switch (page) {
        case 'home':
            container.innerHTML = renderHome();
            tabBar.style.display = 'flex';
            updateTabBar('home');
            document.body.classList.remove('video-page-open');
            break;
        case 'eventDetail':
            container.innerHTML = renderEventDetail(params.eventId);
            tabBar.style.display = 'none';
            document.body.classList.remove('video-page-open');
            break;
        case 'album':
            container.innerHTML = renderAlbum(params.eventId);
            tabBar.style.display = 'none';
            document.body.classList.remove('video-page-open');
            break;
        case 'lightbox':
            container.innerHTML = renderLightbox();
            tabBar.style.display = 'none';
            document.body.classList.remove('video-page-open');
            break;
        case 'checkout':
            container.innerHTML = renderCheckout();
            tabBar.style.display = 'none';
            document.body.classList.remove('video-page-open');
            break;
        case 'orders':
            container.innerHTML = renderOrders();
            tabBar.style.display = 'none';
            document.body.classList.remove('video-page-open');
            break;
        case 'orderDetail':
            container.innerHTML = renderOrderDetail(params.orderId);
            tabBar.style.display = 'none';
            document.body.classList.remove('video-page-open');
            break;
        case 'profile':
            container.innerHTML = renderProfile();
            tabBar.style.display = 'flex';
            updateTabBar('profile');
            document.body.classList.remove('video-page-open');
            break;
        case 'downloads':
            container.innerHTML = renderDownloads();
            tabBar.style.display = 'none';
            document.body.classList.remove('video-page-open');
            break;
        case 'downloadDetail':
            container.innerHTML = renderDownloadDetail(params.eventName);
            tabBar.style.display = 'none';
            document.body.classList.remove('video-page-open');
            break;
        case 'messages':
            container.innerHTML = renderMessages();
            tabBar.style.display = 'none';
            document.body.classList.remove('video-page-open');
            break;
        case 'videoDetail':
            container.innerHTML = renderVideoDetail(params.videoId);
            tabBar.style.display = 'none';
            document.body.classList.add('video-page-open');
            break;
        case 'videoCheckout':
            container.innerHTML = renderVideoCheckout(params.videoId);
            tabBar.style.display = 'none';
            document.body.classList.remove('video-page-open');
            break;
        case 'settings':
            container.innerHTML = renderSettings();
            tabBar.style.display = 'none';
            document.body.classList.remove('video-page-open');
            break;
        case 'editProfile':
            container.innerHTML = renderEditProfile();
            tabBar.style.display = 'none';
            document.body.classList.remove('video-page-open');
            break;
    }

    window.scrollTo(0, 0);
}

function goToEventDetail(eventId) {
    goToPage('eventDetail', { eventId });
}

function goToAlbum(eventId) {
    appState.currentTab = 'photo';
    appState.currentAlbum = null;
    appState.viewMode = 'waterfall';
    appState.selectMode = false;
    appState.selectedPhotos = [];
    goToPage('album', { eventId });
}

function goBack() {
    if (appState.currentPage === 'checkout') {
        goToPage('album', { eventId: appState.currentEvent.id });
    } else if (appState.currentPage === 'videoDetail') {
        goToPage('album', { eventId: appState.currentEvent.id });
    } else if (appState.currentPage === 'videoCheckout') {
        goToPage('videoDetail', { videoId: appState.currentVideo.id });
    } else if (appState.currentPage === 'orderDetail') {
        goToPage('orders');
    } else if (appState.currentPage === 'downloads' || appState.currentPage === 'messages' || appState.currentPage === 'orders' || appState.currentPage === 'settings') {
        goToPage('profile');
    } else if (appState.currentPage === 'downloadDetail') {
        goToPage('downloads');
    } else if (appState.currentPage === 'editProfile') {
        goToPage('settings');
    } else {
        goToPage('home');
    }
}

function updateTabBar(activePage) {
    document.querySelectorAll('.tab-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === activePage);
    });
}

// ========== 交互功能 ==========

function switchTab(tab) {
    appState.currentTab = tab;
    goToPage('album', { eventId: appState.currentEvent.id });
}

function switchAlbum(albumId) {
    appState.currentAlbum = appState.currentEvent.albums.find(a => a.id === albumId);
    goToPage('album', { eventId: appState.currentEvent.id });
}

function toggleViewMode() {
    appState.viewMode = appState.viewMode === 'waterfall' ? 'grid' : 'waterfall';
    goToPage('album', { eventId: appState.currentEvent.id });
}

function toggleSort() {
    showToast('切换排序方式');
}

function toggleSelectMode() {
    appState.selectMode = !appState.selectMode;
    appState.selectedPhotos = [];
    goToPage('album', { eventId: appState.currentEvent.id });
}

function isSelected(photoId) {
    return appState.selectedPhotos.includes(photoId);
}

function toggleSelect(event, photoId) {
    event.stopPropagation();
    const index = appState.selectedPhotos.indexOf(photoId);
    if (index > -1) {
        appState.selectedPhotos.splice(index, 1);
    } else {
        appState.selectedPhotos.push(photoId);
    }
    goToPage('album', { eventId: appState.currentEvent.id });
}

function clearSelect() {
    appState.selectedPhotos = [];
    goToPage('album', { eventId: appState.currentEvent.id });
}

function openLightbox(index) {
    appState.currentPhotoIndex = index;
    goToPage('lightbox');
}

function closeLightbox() {
    goToPage('album', { eventId: appState.currentEvent.id });
}

function prevPhoto() {
    if (appState.currentPhotoIndex > 0) {
        appState.currentPhotoIndex--;
        goToPage('lightbox');
    }
}

function nextPhoto() {
    const photos = mockData.photos.filter(p => p.eventId === appState.currentEvent.id);
    if (appState.currentPhotoIndex < photos.length - 1) {
        appState.currentPhotoIndex++;
        goToPage('lightbox');
    }
}

function addToCart(photoId) {
    if (!appState.selectedPhotos.includes(photoId)) {
        appState.selectedPhotos.push(photoId);
    }
    goToCheckout();
}

function goToCheckout() {
    if (appState.selectedPhotos.length === 0) {
        showToast('请先选择照片');
        return;
    }
    goToPage('checkout');
}

function selectPackage(count) {
    showToast(`选择${count}张套餐`);
}

function showPayModal() {
    showModal('确认支付', `支付金额: ¥${appState.selectedPhotos.length * appState.currentEvent.price.single}`, () => {
        showToast('支付成功！');
        appState.selectedPhotos = [];
        appState.selectMode = false;
        setTimeout(() => goToPage('orders'), 1000);
    });
}

function switchOrderTab(type) {
    appState.orderTab = type;
    goToPage('orders');
}

function readMessage(msgId) {
    const msg = mockData.messages.find(m => m.id === msgId);
    if (msg) msg.read = true;
    goToPage('messages');
}

function handleSearch() {
    const keyword = document.getElementById('search-input')?.value;
    if (keyword) {
        showToast(`搜索: ${keyword}`);
    }
}

function showFaceSearch() {
    showModal('人脸识别找自己', `
        <div class="face-modal-body">
            <div class="face-upload-area" onclick="showToast('选择照片')">
                <div class="icon">📷</div>
                <div class="text">点击上传人脸照片</div>
            </div>
            <p style="font-size: 13px; color: #999;">上传正面清晰照片，系统将自动匹配您的照片</p>
        </div>
    `, () => {
        showToast('正在识别...');
        setTimeout(() => {
            showToast('找到3张匹配照片');
        }, 1500);
    });
}

function showNumberSearch() {
    showModal('号牌搜索', `
        <div style="padding: 20px;">
            <input type="text" class="number-input" placeholder="输入参赛号牌号码" maxlength="10">
            <p style="font-size: 13px; color: #999; text-align: center;">输入您的参赛号牌，快速找到照片</p>
        </div>
    `, () => {
        showToast('搜索中...');
        setTimeout(() => {
            showToast('找到5张匹配照片');
        }, 1000);
    });
}

function shareEvent() {
    const event = appState.currentEvent;
    if (!event) {
        showToast('分享功能演示');
        return;
    }

    showModal('分享活动', `
        <div class="share-poster">
            <div class="share-poster-card">
                <img src="${event.banner}" alt="" class="share-poster-img">
                <div class="share-poster-info">
                    <div class="share-poster-title">${event.name}</div>
                    <div class="share-poster-meta">${event.subtitle}</div>
                    <div class="share-poster-date">${event.startTime}</div>
                    <div class="share-poster-qrcode">
                        <div class="qrcode-placeholder">📱</div>
                        <div class="qrcode-text">扫码查看精彩瞬间</div>
                    </div>
                </div>
            </div>
        </div>
    `, () => {
        showToast('海报已保存');
    });
}

function showSharePoster() {
    const video = appState.currentVideo;
    if (!video) return;
    const event = mockData.events.find(e => e.id === video.eventId);

    showModal('分享视频', `
        <div class="share-poster">
            <div class="share-poster-card">
                <img src="${video.cover}" alt="" class="share-poster-img">
                <div class="share-poster-info">
                    <div class="share-poster-title">${event.name}</div>
                    <div class="share-poster-meta">精彩瞬间 · ${video.photographer}</div>
                    <div class="share-poster-qrcode">
                        <div class="qrcode-placeholder">📱</div>
                        <div class="qrcode-text">扫码观看视频</div>
                    </div>
                </div>
            </div>
        </div>
    `, () => {
        showToast('海报已保存');
    });
}

function goToVideoDetail(videoId) {
    const video = mockData.videos.find(v => v.id === videoId);
    if (video) {
        appState.currentVideo = video;
        const eventVideos = mockData.videos.filter(v => v.eventId === video.eventId);
        appState.currentVideoIndex = eventVideos.findIndex(v => v.id === videoId);
        goToPage('videoDetail', { videoId });
    }
}

function goToVideoCheckout(videoId) {
    const video = mockData.videos.find(v => v.id === videoId);
    if (video) {
        appState.currentVideo = video;
        goToPage('videoCheckout', { videoId });
    }
}

function renderVideoCheckout(videoId) {
    const video = mockData.videos.find(v => v.id === videoId);
    if (!video) return '';

    const event = mockData.events.find(e => e.id === video.eventId);
    const price = event.price.video;

    return `
        <div class="page checkout-page">
            <div class="checkout-header">
                <span class="back-btn" onclick="goBack()">‹</span>
                <span class="checkout-title">确认订单</span>
            </div>
            <div class="checkout-section">
                <div class="checkout-section-title">活动信息</div>
                <div style="font-size: 14px; color: #666;">${event.name}</div>
            </div>
            <div class="checkout-section">
                <div class="checkout-section-title">已选视频</div>
                <div class="checkout-items">
                    <div class="checkout-item">
                        <img src="${video.thumb}" alt="">
                        <div class="checkout-item-info">
                            <div class="checkout-item-name">精彩瞬间 · ${video.duration}</div>
                            <div class="checkout-item-price">¥${price}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="checkout-section">
                <div class="checkout-section-title">优惠套餐</div>
                <div class="package-options">
                    <div class="package-option selected" onclick="showToast('单条购买')">
                        <div class="package-option-info">单条购买</div>
                        <div class="package-option-price">¥${price}</div>
                    </div>
                    <div class="package-option" onclick="showToast('3条套餐')">
                        <div class="package-option-info">3条套餐</div>
                        <div class="package-option-price">¥${Math.floor(price * 2.5)}<span class="package-option-original">¥${price * 3}</span></div>
                    </div>
                    <div class="package-option" onclick="showToast('5条套餐')">
                        <div class="package-option-info">5条套餐</div>
                        <div class="package-option-price">¥${price * 4}<span class="package-option-original">¥${price * 5}</span></div>
                    </div>
                </div>
            </div>
            <div class="checkout-section">
                <div class="checkout-summary">
                    <span class="checkout-total-label">应付总额</span>
                    <span class="checkout-total-price">¥${price}</span>
                </div>
            </div>
            <div style="height: 80px;"></div>
            <div class="checkout-footer">
                <div>
                    <div style="font-size: 12px; color: #999;">应付总额</div>
                    <div style="font-size: 20px; color: #ff6b35; font-weight: 600;">¥${price}</div>
                </div>
                <button class="checkout-pay-btn" onclick="showVideoPayModal()">立即支付</button>
            </div>
        </div>
    `;
}

function showVideoPayModal() {
    const video = appState.currentVideo;
    const event = mockData.events.find(e => e.id === video.eventId);
    const price = event.price.video;

    showModal('确认支付', `支付金额: ¥${price}`, () => {
        showToast('支付成功！');
        // 添加到下载记录
        mockData.downloads.unshift({
            id: Date.now(),
            eventName: event.name,
            thumb: video.thumb,
            name: `精彩瞬间 · ${video.duration}`,
            time: new Date().toLocaleString('zh-CN'),
            status: '已完成'
        });
        // 添加到订单记录
        mockData.orders.unshift({
            id: 'ORD' + Date.now(),
            type: 'video',
            eventName: event.name,
            items: [{ thumb: video.thumb, name: `精彩瞬间 · ${video.duration}` }],
            amount: price,
            time: new Date().toLocaleString('zh-CN'),
            status: '已支付'
        });
        setTimeout(() => goToPage('orders'), 1000);
    });
}

function renderVideoDetail(videoId) {
    const video = mockData.videos.find(v => v.id === videoId);
    if (!video) return '';

    const event = mockData.events.find(e => e.id === video.eventId);
    const eventVideos = mockData.videos.filter(v => v.eventId === video.eventId);
    const videoIndex = eventVideos.findIndex(v => v.id === videoId);

    return `
        <div class="page video-detail-page" id="video-detail-page" data-video-id="${videoId}">
            <div class="video-detail-back" onclick="goBack()">‹</div>
            <div class="video-detail-indicator">
                ${eventVideos.map((_, i) => `<div class="indicator-dot ${i === videoIndex ? 'active' : ''}"></div>`).join('')}
            </div>
            <div class="video-swipe-container" id="video-swipe-container"
                 ontouchstart="handleVideoTouchStart(event)"
                 ontouchmove="handleVideoTouchMove(event)"
                 ontouchend="handleVideoTouchEnd(event)">
                <div class="video-slide active" data-index="${videoIndex}">
                    <div class="video-fullscreen-player">
                        <video src="${video.src}" poster="${video.cover}" autoplay muted loop playsinline
                               onplay="this.muted=false"></video>
                        <div class="video-player-watermark">轲影像</div>
                        <div class="video-slide-info">
                            <div class="video-slide-title">${event.name}</div>
                            <div class="video-slide-desc">精彩瞬间 · ${video.photographer}</div>
                        </div>
                    </div>
                    <div class="video-slide-actions">
                        <div class="video-slide-action" onclick="event.stopPropagation(); showRewardModal('${video.photographer}')">
                            <div class="action-avatar">📷</div>
                            <span>打赏</span>
                        </div>
                        <div class="video-slide-action" onclick="event.stopPropagation(); goToVideoCheckout(${video.id})">
                            <div class="action-icon-big">⬇️</div>
                            <span>下载</span>
                        </div>
                        <div class="video-slide-action" onclick="event.stopPropagation(); showSharePoster()">
                            <div class="action-icon-big">📤</div>
                            <span>分享</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

let videoTouchStartY = 0;
let videoTouchCurrentY = 0;
let videoTouchStartTime = 0;
let videoIsDragging = false;

function handleVideoTouchStart(e) {
    videoTouchStartY = e.touches[0].clientY;
    videoTouchCurrentY = videoTouchStartY;
    videoTouchStartTime = Date.now();
    videoIsDragging = true;
}

function handleVideoTouchMove(e) {
    if (!videoIsDragging) return;
    videoTouchCurrentY = e.touches[0].clientY;
}

function handleVideoTouchEnd(e) {
    if (!videoIsDragging) return;
    videoIsDragging = false;

    const diff = videoTouchStartY - videoTouchCurrentY;
    const duration = Date.now() - videoTouchStartTime;
    const threshold = 60;
    const velocityThreshold = 0.5;
    const velocity = Math.abs(diff) / duration;

    const video = appState.currentVideo;
    if (!video) return;
    const eventVideos = mockData.videos.filter(v => v.eventId === video.eventId);

    const shouldSwitch = Math.abs(diff) > threshold || velocity > velocityThreshold;

    if (shouldSwitch && diff > 0 && appState.currentVideoIndex < eventVideos.length - 1) {
        // 向上滑动 - 下一个视频
        appState.currentVideoIndex++;
        const nextVideo = eventVideos[appState.currentVideoIndex];
        appState.currentVideo = nextVideo;
        goToPage('videoDetail', { videoId: nextVideo.id });
    } else if (shouldSwitch && diff < 0 && appState.currentVideoIndex > 0) {
        // 向下滑动 - 上一个视频
        appState.currentVideoIndex--;
        const prevVideo = eventVideos[appState.currentVideoIndex];
        appState.currentVideo = prevVideo;
        goToPage('videoDetail', { videoId: prevVideo.id });
    }
}

function showRewardModal(photographer) {
    const amounts = [1, 5, 10, 20];
    showModal('打赏摄影师', `
        <div style="padding: 15px;">
            <div style="text-align: center; margin-bottom: 15px;">
                <div style="font-size: 40px; margin-bottom: 8px;">📷</div>
                <div style="font-size: 16px; font-weight: 600;">${photographer}</div>
                <div style="font-size: 13px; color: #999;">感谢您的认可与支持</div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
                ${amounts.map(amt => `
                    <div class="reward-amount" onclick="selectRewardAmount(this, ${amt})">
                        <div style="font-size: 18px; font-weight: 600;">¥${amt}</div>
                    </div>
                `).join('')}
            </div>
            <input type="text" class="number-input" placeholder="自定义金额" style="margin-bottom: 0;">
        </div>
    `, () => {
        showToast('打赏成功！');
    });

    // 添加选中样式
    setTimeout(() => {
        document.querySelectorAll('.reward-amount').forEach(el => {
            el.style.cssText = 'padding: 15px; border: 2px solid #eee; border-radius: 10px; text-align: center; cursor: pointer; transition: all 0.2s;';
            el.addEventListener('click', function() {
                document.querySelectorAll('.reward-amount').forEach(e => {
                    e.style.borderColor = '#eee';
                    e.style.background = '#fff';
                });
                this.style.borderColor = '#ff6b35';
                this.style.background = '#fff2e8';
            });
        });
    }, 100);
}

function selectRewardAmount(el, amount) {
    // 样式在 showRewardModal 中通过事件监听处理
}

function renderSettings() {
    return `
        <div class="page settings-page">
            <div class="page-header">
                <span class="back-btn" onclick="goBack()">‹</span>
                <span class="page-header-title">设置</span>
                <span style="width: 24px;"></span>
            </div>
            <div class="settings-section">
                <div class="settings-item" onclick="goToPage('editProfile')">
                    <div class="settings-item-left">
                        <span class="settings-icon">👤</span>
                        <span>我的资料</span>
                    </div>
                    <span class="settings-arrow">›</span>
                </div>
                <div class="settings-item" onclick="showToast('功能开发中')">
                    <div class="settings-item-left">
                        <span class="settings-icon">🔔</span>
                        <span>消息通知设置</span>
                    </div>
                    <span class="settings-arrow">›</span>
                </div>
                <div class="settings-item" onclick="showToast('功能开发中')">
                    <div class="settings-item-left">
                        <span class="settings-icon">🔒</span>
                        <span>隐私设置</span>
                    </div>
                    <span class="settings-arrow">›</span>
                </div>
            </div>
            <div class="settings-section">
                <div class="settings-item" onclick="showToast('功能开发中')">
                    <div class="settings-item-left">
                        <span class="settings-icon">❓</span>
                        <span>帮助与反馈</span>
                    </div>
                    <span class="settings-arrow">›</span>
                </div>
                <div class="settings-item" onclick="showToast('功能开发中')">
                    <div class="settings-item-left">
                        <span class="settings-icon">📋</span>
                        <span>用户协议</span>
                    </div>
                    <span class="settings-arrow">›</span>
                </div>
                <div class="settings-item" onclick="showToast('功能开发中')">
                    <div class="settings-item-left">
                        <span class="settings-icon">🔐</span>
                        <span>隐私政策</span>
                    </div>
                    <span class="settings-arrow">›</span>
                </div>
            </div>
            <div class="settings-section">
                <div class="settings-item" onclick="showToast('当前版本 1.0.0')">
                    <div class="settings-item-left">
                        <span class="settings-icon">📱</span>
                        <span>关于轲影像</span>
                    </div>
                    <span class="settings-version">v1.0.0</span>
                </div>
            </div>
        </div>
    `;
}

function renderEditProfile() {
    return `
        <div class="page edit-profile-page">
            <div class="page-header">
                <span class="back-btn" onclick="goBack()">‹</span>
                <span class="page-header-title">编辑资料</span>
                <span class="header-save" onclick="saveProfile()">保存</span>
            </div>
            <div class="edit-profile-avatar">
                <img src="${mockData.user.avatar}" alt="" id="edit-avatar">
                <div class="edit-avatar-hint">点击更换头像</div>
            </div>
            <div class="edit-profile-form">
                <div class="form-item">
                    <label>昵称</label>
                    <input type="text" id="edit-nickname" value="${mockData.user.nickname}" placeholder="请输入昵称">
                </div>
                <div class="form-item">
                    <label>手机号</label>
                    <input type="text" id="edit-phone" value="${mockData.user.phone}" placeholder="请输入手机号" readonly style="color: #999;">
                </div>
            </div>
        </div>
    `;
}

function saveProfile() {
    const nickname = document.getElementById('edit-nickname')?.value;
    if (nickname && nickname.trim()) {
        mockData.user.nickname = nickname.trim();
        showToast('保存成功');
        setTimeout(() => goBack(), 500);
    } else {
        showToast('昵称不能为空');
    }
}

// ========== 工具函数 ==========

function formatNumber(num) {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
}

function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);
}

function showModal(title, content, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <div class="modal-title">${title}</div>
            </div>
            <div class="modal-body">${content}</div>
            <div class="modal-footer">
                <button class="modal-btn cancel" onclick="this.closest('.modal-overlay').remove()">取消</button>
                <button class="modal-btn confirm">确定</button>
            </div>
        </div>
    `;

    overlay.querySelector('.modal-btn.confirm').addEventListener('click', () => {
        overlay.remove();
        if (onConfirm) onConfirm();
    });

    document.body.appendChild(overlay);
}

// ========== 初始化 ==========

document.addEventListener('DOMContentLoaded', () => {
    // 底部导航点击
    document.querySelectorAll('.tab-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            goToPage(page);
        });
    });

    // 初始化首页
    goToPage('home');
});
