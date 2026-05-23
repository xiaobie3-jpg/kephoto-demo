// 轲影像云相册 - 模拟数据（使用本地素材）

const mockData = {
    // 当前用户信息
    user: {
        nickname: '摄影爱好者',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
        phone: '138****5678'
    },

    // 活动列表
    events: [
        {
            id: 1,
            name: '2026长沙马拉松',
            subtitle: '湖南省长沙市',
            banner: 'images/event1_banner.jpg',
            banners: [
                'images/event1_banner.jpg',
                'images/event2_banner.jpg',
                'images/event3_banner.jpg'
            ],
            startTime: '2026-05-15 07:00',
            endTime: '2026-05-15 14:00',
            status: '进行中',
            viewCount: 12580,
            photoCount: 3280,
            videoCount: 156,
            albums: [
                { id: 1, name: '全部', count: 3280 },
                { id: 2, name: '起跑瞬间', count: 856 },
                { id: 3, name: '赛道风采', count: 1205 },
                { id: 4, name: '冲刺时刻', count: 623 },
                { id: 5, name: '颁奖仪式', count: 198 },
                { id: 6, name: '观众互动', count: 398 }
            ],
            price: { single: 5, video: 10 },
            packages: [
                { count: 3, price: 12 },
                { count: 5, price: 18 },
                { count: 10, price: 30 }
            ]
        },
        {
            id: 2,
            name: '湖南省青少年篮球联赛',
            subtitle: '湖南省体育馆',
            banner: 'images/event2_banner.jpg',
            banners: [
                'images/event2_banner.jpg',
                'images/event4_banner.jpg'
            ],
            startTime: '2026-05-20 09:00',
            endTime: '2026-05-25 18:00',
            status: '进行中',
            viewCount: 8932,
            photoCount: 2156,
            videoCount: 89,
            albums: [
                { id: 1, name: '全部', count: 2156 },
                { id: 2, name: '小组赛', count: 980 },
                { id: 3, name: '淘汰赛', count: 756 },
                { id: 4, name: '决赛', count: 320 },
                { id: 5, name: '颁奖', count: 100 }
            ],
            price: { single: 5, video: 10 },
            packages: [
                { count: 3, price: 12 },
                { count: 5, price: 18 }
            ]
        },
        {
            id: 3,
            name: '长沙橘子洲音乐节',
            subtitle: '橘子洲头',
            banner: 'images/event3_banner.jpg',
            banners: [
                'images/event3_banner.jpg',
                'images/event1_banner.jpg'
            ],
            startTime: '2026-04-10 18:00',
            endTime: '2026-04-12 23:00',
            status: '已结束',
            viewCount: 25680,
            photoCount: 5620,
            videoCount: 320,
            albums: [
                { id: 1, name: '全部', count: 5620 },
                { id: 2, name: '主舞台', count: 2100 },
                { id: 3, name: '观众席', count: 1800 },
                { id: 4, name: '后台花絮', count: 920 },
                { id: 5, name: '艺人特写', count: 800 }
            ],
            price: { single: 3, video: 8 },
            packages: [
                { count: 5, price: 12 },
                { count: 10, price: 20 }
            ]
        },
        {
            id: 4,
            name: '株洲国际赛车场耐力赛',
            subtitle: '株洲国际赛车场',
            banner: 'images/event4_banner.jpg',
            banners: [
                'images/event4_banner.jpg'
            ],
            startTime: '2026-06-01 08:00',
            endTime: '2026-06-02 18:00',
            status: '即将开始',
            viewCount: 0,
            photoCount: 0,
            videoCount: 0,
            albums: [{ id: 1, name: '全部', count: 0 }],
            price: { single: 8, video: 15 },
            packages: [
                { count: 3, price: 20 },
                { count: 5, price: 30 }
            ]
        }
    ],

    // 相册图片数据（复用本地素材）
    photos: [
        { id: 1, eventId: 1, albumId: 2, url: 'images/event1_banner.jpg', thumb: 'images/event1_banner.jpg', photographer: '张摄影师', time: '2026-05-15 07:15', width: 600, height: 800 },
        { id: 2, eventId: 1, albumId: 2, url: 'images/event2_banner.jpg', thumb: 'images/event2_banner.jpg', photographer: '李摄影师', time: '2026-05-15 07:20', width: 800, height: 600 },
        { id: 3, eventId: 1, albumId: 3, url: 'images/event3_banner.jpg', thumb: 'images/event3_banner.jpg', photographer: '王摄影师', time: '2026-05-15 08:30', width: 600, height: 900 },
        { id: 4, eventId: 1, albumId: 3, url: 'images/event4_banner.jpg', thumb: 'images/event4_banner.jpg', photographer: '张摄影师', time: '2026-05-15 09:00', width: 800, height: 600 },
        { id: 5, eventId: 1, albumId: 4, url: 'images/event1_banner.jpg', thumb: 'images/event1_banner.jpg', photographer: '李摄影师', time: '2026-05-15 11:30', width: 600, height: 800 },
        { id: 6, eventId: 1, albumId: 4, url: 'images/event2_banner.jpg', thumb: 'images/event2_banner.jpg', photographer: '王摄影师', time: '2026-05-15 12:00', width: 800, height: 600 },
        { id: 7, eventId: 1, albumId: 5, url: 'images/event3_banner.jpg', thumb: 'images/event3_banner.jpg', photographer: '张摄影师', time: '2026-05-15 14:00', width: 600, height: 800 },
        { id: 8, eventId: 1, albumId: 6, url: 'images/event4_banner.jpg', thumb: 'images/event4_banner.jpg', photographer: '李摄影师', time: '2026-05-15 10:30', width: 800, height: 600 },
        { id: 9, eventId: 2, albumId: 2, url: 'images/event2_banner.jpg', thumb: 'images/event2_banner.jpg', photographer: '陈摄影师', time: '2026-05-20 10:00', width: 600, height: 800 },
        { id: 10, eventId: 2, albumId: 3, url: 'images/event4_banner.jpg', thumb: 'images/event4_banner.jpg', photographer: '刘摄影师', time: '2026-05-22 15:00', width: 800, height: 600 },
        { id: 11, eventId: 3, albumId: 2, url: 'images/event3_banner.jpg', thumb: 'images/event3_banner.jpg', photographer: '赵摄影师', time: '2026-04-10 20:00', width: 600, height: 800 },
        { id: 12, eventId: 3, albumId: 3, url: 'images/event1_banner.jpg', thumb: 'images/event1_banner.jpg', photographer: '钱摄影师', time: '2026-04-11 21:00', width: 800, height: 600 }
    ],

    // 视频数据（使用本地视频）
    videos: [
        { id: 1, eventId: 1, albumId: 2, cover: 'images/event1_banner.jpg', thumb: 'images/event1_banner.jpg', photographer: '张摄影师', time: '2026-05-15 07:30', duration: '0:45', src: 'images/video1.mp4' },
        { id: 2, eventId: 1, albumId: 4, cover: 'images/event2_banner.jpg', thumb: 'images/event2_banner.jpg', photographer: '李摄影师', time: '2026-05-15 12:30', duration: '1:20', src: 'images/video2.mp4' },
        { id: 3, eventId: 2, albumId: 3, cover: 'images/event4_banner.jpg', thumb: 'images/event4_banner.jpg', photographer: '刘摄影师', time: '2026-05-22 16:00', duration: '2:15', src: 'images/video3.mp4' }
    ],

    // 订单数据
    orders: [
        { id: 'ORD20260515001', type: 'photo', eventName: '2026长沙马拉松', items: [{ thumb: 'images/event1_banner.jpg', name: '起跑瞬间 #001' }], amount: 5, time: '2026-05-15 10:30', status: '已支付' },
        { id: 'ORD20260515002', type: 'package', eventName: '2026长沙马拉松', items: [{ thumb: 'images/event2_banner.jpg', name: '赛道风采 #003' }, { thumb: 'images/event3_banner.jpg', name: '赛道风采 #005' }, { thumb: 'images/event4_banner.jpg', name: '赛道风采 #007' }], amount: 12, time: '2026-05-15 11:00', status: '已支付' },
        { id: 'ORD20260520001', type: 'video', eventName: '湖南省青少年篮球联赛', items: [{ thumb: 'images/event2_banner.jpg', name: '决赛集锦' }], amount: 10, time: '2026-05-22 18:00', status: '已支付' },
        { id: 'ORD20260520002', type: 'reward', eventName: '2026长沙马拉松', items: [{ name: '打赏 - 张摄影师' }], amount: 10, time: '2026-05-15 12:00', status: '已支付' }
    ],

    // 下载记录
    downloads: [
        { id: 1, eventName: '2026长沙马拉松', thumb: 'images/event1_banner.jpg', name: '起跑瞬间 #001', time: '2026-05-15 10:35', status: '已完成' },
        { id: 2, eventName: '2026长沙马拉松', thumb: 'images/event2_banner.jpg', name: '赛道风采 #003', time: '2026-05-15 11:05', status: '已完成' },
        { id: 3, eventName: '湖南省青少年篮球联赛', thumb: 'images/event2_banner.jpg', name: '决赛集锦', time: '2026-05-22 18:05', status: '已完成' }
    ],

    // 消息通知
    messages: [
        { id: 1, type: 'order', title: '订单支付成功', content: '您购买的"起跑瞬间 #001"已支付成功，可前往下载', time: '2026-05-15 10:35', read: false },
        { id: 2, type: 'event', title: '新活动上线', content: '"湖南省青少年篮球联赛"相册已上线，快来看看精彩瞬间', time: '2026-05-20 09:00', read: false },
        { id: 3, type: 'update', title: '相册更新', content: '"2026长沙马拉松"新增200+张照片', time: '2026-05-15 16:00', read: true }
    ]
};

// 购物车数据（运行时）
let cart = {
    eventId: null,
    items: [],
    type: 'photo' // photo/video
};

// 当前状态
let appState = {
    currentPage: 'home',
    currentEvent: null,
    currentAlbum: null,
    currentTab: 'photo', // photo/video
    viewMode: 'waterfall', // waterfall/grid
    gridColumns: 3,
    selectedPhotos: [],
    currentPhotoIndex: 0,
    orderTab: 'all',
    currentVideo: null,
    currentVideoIndex: 0
};
