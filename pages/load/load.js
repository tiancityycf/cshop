var app = getApp();
Page({
  data: {
    logo: '',
    name: '',
    url: app.globalData.url,
  },
  onLoad: function (options) {
    var that = this;
    that.getEnterLogo();
    app.setBarColor();
  },
  getEnterLogo: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/login/get_enter_logo',
      method: 'post',
      dataType  : 'json',
      success: function (res) {
        that.setData({
          logo: res.data.data.site_logo,
          name: res.data.data.site_name
        })
      }
    })
  },
  //获取用户信息并且授权
  getUserInfo: function(e){
    var userInfo = e.detail.userInfo;
    userInfo.spid = app.globalData.spid;
    wx.login({
      success: function (res) {
		 
        if (res.code) {
          userInfo.code = res.code;
          wx.request({
            url: app.globalData.url + '/routine/login/index',
            method: 'post',
            dataType  : 'json',
            data: {
              info: userInfo
            },
            success: function (res) {
              app.globalData.uid = res.data.data.uid;
              app.globalData.openid = res.data.data.routine_openid;
              if (app.globalData.openPages != '' && app.globalData.openPages != undefined) {//跳转到指定页面
                wx.navigateTo({
                  url: app.globalData.openPages
                })
              } else {//跳转到首页
                if(res.data.data.page){
                    wx.navigateTo({
                        url: res.data.data.page
                    })
                }else{
                    wx.reLaunch({
                        url: '/pages/index/index'
                    })
                }
              }
            },
			fail:function(res){
				wx.showModal({
				  title: '提示',
				  content: res.errMsg,
				  success(res) {
					if (res.confirm) {
					  console.log('用户点击确定')
					} else if (res.cancel) {
					  console.log('用户点击取消')
					}
				  }
				})
			}
          })
        } else {
          console.log('登录失败！' + res.errMsg)
		  wx.showToast({
				  title: res.errMsg,
				  icon: 'success',
				  duration: 2000
				});
        }
      },
	  fail:function(res){
		  wx.showToast({
				  title: "wx.login fail",
				  icon: 'success',
				  duration: 2000
				});
	  }
    })
  },
})