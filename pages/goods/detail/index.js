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
        },
        canOrder:true
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
    decode_base64 (s)
    {
        var e = {}, i, k, v = [], r = '', w = String.fromCharCode;
        var n = [[65, 91], [97, 123], [48, 58], [43, 44], [47, 48]];

        for (var z in n)
        {
            for (i = n[z][0]; i < n[z][1]; i++)
            {
                v.push(w(i));
            }
        }
        for (i = 0; i < 64; i++)
        {
            e[v[i]] = i;
        }

        for (i = 0; i < s.length; i+=72)
        {
            var b = 0, c, x, l = 0, o = s.substring(i, i+72);
            for (x = 0; x < o.length; x++)
            {
                c = e[o.charAt(x)];
                b = (b << 6) + c;
                l += 6;
                while (l >= 8)
                {
                    r += w((b >>> (l -= 8)) % 256);
                }
             }
        }
        return r;
    }, 
    buyNow(e) {
        var token = App.WxService.getStorageSync('token')
        if(token == null || token == '') {
            var callBackFunction = {
                op:"buyNow",
                goods:this.data.goods.item._id
            }
            App.WxService.setStorageSync('callback', callBackFunction)
            App.WxService.redirectTo('/pages/login/index') 
        }
        else {

            // Create Base64 Object
            //var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=0;var c1=0; var c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};            
            var playload = JSON.parse(this.decode_base64(token.split('.')[1]));
            console.log('playload=')
            console.log(playload)
            var exp = playload.exp
            var current = Math.floor(Date.now() / 1000)
            if(exp < current) {
                App.WxService.removeStorageSync('token')
                var callBackFunction = {
                    "op":"buyNow",
                    "goods":this.data.goods.item._id
                }
                App.WxService.setStorageSync('callback', callBackFunction)                
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
                        this.checkCart() 
                    }
                })                  
            }
          
        }
    },   
    addCart(e) {
        var token = App.WxService.getStorageSync('token')
        if(token == null || token == '') {
            var callBackFunction = {
                op:"addCart",
                goods:this.data.goods.item._id
            }
            App.WxService.setStorageSync('callback', callBackFunction)
            App.WxService.redirectTo('/pages/login/index') 
        }
        else {

            // Create Base64 Object
            //var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=0;var c1=0; var c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};            
            var playload = JSON.parse(this.decode_base64(token.split('.')[1]));
            console.log('playload=')
            console.log(playload)
            var exp = playload.exp
            var current = Math.floor(Date.now() / 1000)
            if(exp < current) {
                App.WxService.removeStorageSync('token')
                var callBackFunction = {
                    "op":"addCart",
                    "goods":this.data.goods.item._id
                }
                App.WxService.setStorageSync('callback', callBackFunction)                
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