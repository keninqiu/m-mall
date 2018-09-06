const App = getApp()

Page({
    data: {
        order: {
            item: {},
        },
    },
    onLoad(option) {
        this.order = App.HttpResource('/order/:id', {id: '@id'})
        this.setData({
            id: option.id
        })
    },
    onShow() {
        this.getOrderDetail(this.data.id)
    },
    wechatPay(id) {
        var param = {id: this.data.id}
        console.log('param in wechatPay(id) = ')
        console.log(param)
        App.HttpService.wechatPay(param)
        .then(res => {
            const data = res.data.data
            console.log(data)
            if(data.package) {
                App.WxService.requestPayment({
                    timeStamp:data.timeStamp,
                    nonceStr:data.nonceStr,
                    package:data.package,
                    signType:data.signType,
                    paySign:data.paySign, 
                    success:function() {
                        console.log('小程序支付调用成功')
                    }
                });
            }
        })
    },
    getOrderDetail(id) {
        // App.HttpService.getOrderDetail(id)
        this.order.getAsync({id: id})
        .then(res => {
            const data = res.data
            console.log(data)
            if (data.meta.code == 0) {
                this.setData({
                    'order.item': data.data
                })
            }
        })
    },
})