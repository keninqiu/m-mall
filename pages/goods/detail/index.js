const App = getApp()

Page({
    data: {
        indicatorDots: !0,
        vertical: !1,
        autoplay: !1,
        interval: 3000,
        duration: 1000,
        current: 0,
        goods: {
            item: {}
        }
    },
    swiperchange(e) {
        this.setData({
            current: e.detail.current, 
        })
    },
    onLoad(option) {
        this.goods = App.HttpResource('/goods/:id', {id: '@id'})
        this.setData({
            id: option.id
        })
    },
    onShow() {
        this.getDetail(this.data.id)
    },
    checkCart() {
        App.WxService.switchTab('/pages/cart/index')
    },
    goShop() {
        App.WxService.switchTab('/pages/index/index') 
    },
    addCart(e) {
        var token = App.WxService.getStorageSync('token')
        if(token == null || token == '') {
            App.WxService.redirectTo('/pages/login/index') 
        }
        else {
            var playload = JSON.parse(atob(token.split('.')[1]));

            var exp = playload.exp
            var current = Math.floor(Date.now() / 1000)
            if(exp < current) {
                App.WxService.removeStorageSync('token')
                App.WxService.redirectTo('/pages/login/index') 
            }
            else {
                const goods = this.data.goods.item._id
                App.HttpService.addCartByUser(goods)
                .then(res => {
                    const data = res.data
                    console.log('data=');
                    console.log(data)
                    if (data.meta.code == 0) {
                        this.showToast(data.meta.message)
                    }
                })                  
            }
          
        }

    },
    previewImage(e) {
        const urls = this.data.goods && this.data.goods.item.images.map(n => n.path)
        const index = e.currentTarget.dataset.index
        const current = urls[Number(index)]
        
        App.WxService.previewImage({
            current: current, 
            urls: urls, 
        })
    },
    showToast(message) {
        App.WxService.showToast({
            title   : message, 
            icon    : 'success', 
            duration: 1500, 
        })
    },
    getDetail(id) {
    	// App.HttpService.getDetail(id)
        this.goods.getAsync({id: id})
        .then(res => {
            const data = res.data
            console.log(data)
        	if (data.meta.code == 0) {
                data.data.images.forEach(n => n.path = App.renderImage(n.path))
        		this.setData({
                    'goods.item': data.data, 
                    total: data.data.images.length, 
                })
        	}
        })
    },
})