const App = getApp()

Page({
	data: {
		logged: !1
	},
    onLoad() {},
    onShow() {
    	const token = App.WxService.getStorageSync('token')
    	this.setData({
    		logged: !!token
    	})
    	token && setTimeout(this.goIndex, 1500)
    },
    login() {
    	this.signIn(this.goIndex)
    },
    signUpWechat() {
    	this.wechatSignUp(this.goIndex)
    },
    signInWechat() {
    	this.wechatSignIn(this.goIndex)
    },
    goIndex() {
    	App.WxService.switchTab('/pages/index/index')
    },
	showModal() {
		App.WxService.showModal({
            title: '友情提示', 
            content: '获取用户登录状态失败，请重新登录', 
            showCancel: !1, 
        })
	},
	wechatDecryptData() {
		let code

		App.WxService.login()
		.then(data => {
			console.log('wechatDecryptData', data.code)
			code = data.code
			return App.WxService.getUserInfo()
		})
		.then(data => {
			return App.HttpService.wechatDecryptData({
				encryptedData: data.encryptedData, 
				iv: data.iv, 
				rawData: data.rawData, 
				signature: data.signature, 
				code: code, 
			})
		})
		.then(data => {
            console.log(data) 
		})
	},
	wechatSignIn(cb) {   
		if (App.WxService.getStorageSync('token')) return
		App.WxService.login()
		.then(data => {
			console.log('wechatSignIn1', data) 
			return App.HttpService.wechatSignIn({
				code: data.code
			})
		})
		.then(res => {
			const data = res.data
			console.log('wechatSignIn', data)
			if (data.meta.code == 0) {
				App.WxService.setStorageSync('token', data.data.token)

				var t = new Date();
				t.setSeconds(t.getSeconds() + 60*5-10)
				console.log('t=')
				console.log(t)
				App.WxService.setStorageSync('expired_at', t) 
				cb()
			} else if(data.meta.code == 40029) {
				App.showModal()
			} else {
				App.wechatSignUp(cb)
			}
		})
	},
    showToast(message) {
        App.WxService.showToast({
            title   : message, 
            icon    : 'success', 
            duration: 1500, 
        })
    },	
	wechatSignUp(cb) {
		App.WxService.login()
		.then(data => {
			console.log('wechatSignUp', data.code)
			return App.HttpService.wechatSignUp({
				code: data.code
			})
		})
		.then(res => {
			const data = res.data
			console.log('wechatSignUp', data)
			if (data.meta.code == 0) {
				App.WxService.setStorageSync('token', data.data.token)
				var callback = App.WxService.getStorageSync('callback')
				if(callback) {
					var op = callback.op
					if(op == 'addCart') {
						var goods = callback.goods
		                App.HttpService.addCartByUser(goods)
		                .then(res => {
		                    const data = res.data
		                    if (data.meta.code == 0) {
		                        this.showToast(data.meta.message)
		                        cb()
		                    }
		                }) 						
					}
					else if(op == 'buyNow') {
						var goods = callback.goods
		                App.HttpService.addCartByUser(goods)
		                .then(res => {
		                    const data = res.data
		                    if (data.meta.code == 0) {
		                        App.WxService.switchTab('/pages/cart/index')
		                    }
		                }) 							
					}
					else if(op == 'showCart') {
						App.WxService.switchTab('/pages/cart/index')
					}
				}
				else {
					cb()
				}
				
			} else if(data.meta.code == 40029) {
				App.showModal()
			}
		})
	},
	signIn(cb) {
		if (App.WxService.getStorageSync('token')) return
		App.HttpService.signIn({
			username: 'admin', 
			password: '123456', 
		})
		.then(res => {
            const data = res.data
			if (data.meta.code == 0) {
				App.WxService.setStorageSync('token', data.data.token)			
				cb()
			}
		})
	},
})