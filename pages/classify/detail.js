const App = getApp()

Page({
    data: {
        type  : null,
        goods : {},
    },
    onLoad() {
        this.goods = App.HttpResource('/goods')
        this.onPullDownRefresh()
    },
    initData() {
        const type = this.data.type
        const keyword = this.data.keyword

        this.setData({
            goods: {
                items: [],
                params: {
                    page : 1,
                    limit: 10,
                    type : '5b55159e6096160dc1174c2b',
                },
                paginate: {}
            }
        })
    },
    getList() {
        const goods = this.data.goods
        const params = goods.params
        console.log('params=')
        console.log(params)
        // App.HttpService.getGoods(params)
        this.goods.queryAsync(params)
        .then(res => {
            const data = res.data
            console.log(data)
            if (data.meta.code == 0) {
                data.data.items.forEach(n => n.thumb_url = App.renderImage(n.images[0] && n.images[0].path))
                goods.items = [...goods.items, ...data.data.items]
                goods.paginate = data.data.paginate
                goods.params.page = data.data.paginate.next
                goods.params.limit = data.data.paginate.perPage
                console.log('goods in here')
                console.log(goods)
                this.setData({
                    goods: goods,
                    'prompt.hidden': goods.items.length,
                })
            }            
        })
    },
    onPullDownRefresh() {
        console.info('onPullDownRefresh')
        this.initData()
        this.getList()
    },
    onReachBottom() {
        console.info('onReachBottom')
        if (!this.data.goods.paginate.hasNext) return
        this.getList()
    },        
})