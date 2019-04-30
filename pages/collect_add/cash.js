var app = getApp();
// pages/cash/cash.js
Page({
  data: {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (opends) {
    app.setBarColor();
    app.setUserInfo();
    var that = this;
    this.getUserInfo();
  },
  getUserInfo:function(){
      var that = this;
      wx.request({
        url: app.globalData.url + '/routine/auth_api/my?uid=' + app.globalData.uid,
        method: 'POST',
        success: function (res) {
          that.setData({
            integral: res.data.data.integral
          })
        }
      });
  },
  
  formSubmit:function(e){
    var header = {
      // 'content-type': 'application/x-www-form-urlencoded',
      'cookie': app.globalData.sessionId//读取cookie
    };
    var that = this;
    var game_id = e.detail.value.game_id;
	console.log(game_id);
    
    wx.request({
      url: app.globalData.url + '/routine/auth_api/game_add?uid=' + app.globalData.uid,
      data: { game_id: game_id},
      method: 'POST',
      header: header,
      success: function (res) {
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 1500
        });
	    /*
		wx.navigateTo({ //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
			url: '/pages/collect/collect'
		});
		*/
		wx.navigateBack({
		  delta: 1
		});
      }
    })
  }


})