var app = getApp();
// pages/collect/collect.js
Page({
  data: {
    url: app.globalData.urlImages,
    sum:'',
    Arraylist:[],
	conf:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setBarColor();
    app.setUserInfo();   
    this.getcollect();
  },
  getcollect:function(){
    var that = this;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    }
    wx.request({
      url: app.globalData.url + '/routine/auth_api/game_list?uid=' + app.globalData.uid,
      method: 'GET',
      header: header,
      success: function (res) {
        if (res.data.code==200){
			console.log(res.data);
          that.setData({
            sum: res.data.data.games.length,
            Arraylist: res.data.data.games,
			conf:res.data.data.conf
          })
        }else{
        // console.log(res);
        that.setData({
          sum: 0,
          Arraylist: [],
		  conf:res.data.conf
        })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  game_add:function(){
	  wx.navigateTo({ //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
      url: '/pages/collect_add/cash'
    })
  },
  
  del:function(e){
    var that=this;
    var id = e.target.dataset.id;
    console.log(id);
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_user_collect_product_del?uid=' + app.globalData.uid,
      data:{pid:id},
      method: 'GET',
      header: header,
      success: function (res) {
        if (res.data.code == 200){
          that.getcollect();
        }  
      }
    })
  },

 
})