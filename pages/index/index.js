//index.js
//获取应用实例
var app = getApp();
var wxh = require('../../utils/wxh.js');
var promoter_uid = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.urlImages,
    imgUrls:[],
    lovely:[],
    menus:[],
    indicatorDots: true,//是否显示面板指示点;
    autoplay: true,//是否自动播放;
    interval: 3000,//动画间隔的时间;
    duration: 500,//动画播放的时长;
    indicatorColor: "rgba(51, 51, 51, .3)",
    indicatorActivecolor: "#ffffff",
    recommendList:[],
    newList:[],
    hotList:[],
    benefitList:[],
    likeList:[],
	category:[],
    offset: 0,
    title: "玩命加载中...",
    hidden: false
  },
  goUrl:function(e){
    if (e.currentTarget.dataset.url != '#'){
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  torday:function(e){
    wx.switchTab({
      url: '/pages/productSort/productSort'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setBarColor();
    var that = this;
    if (options.spid){
		app.globalData.spid = options.spid
	  	//promoter_uid = options.scene;
    }
	
	if(app.globalData.spid>0){
		promoter_uid = app.globalData.spid;
	}
	  
    app.setUserInfo();
    that.getIndexInfo();
  },
  getIndexInfo:function(event){
	  let cate_id = 0 ;
	  if(undefined!=event){
		  cate_id = event.currentTarget.dataset.cate_id;
	  }
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/index?uid=' + app.globalData.uid+'&cate_id='+cate_id+'&promoter_uid='+promoter_uid,
      method: 'POST',
      header: header,
      success: function (res) {
        that.setData({
		  category:res.data.data.category,
		  cate_id:cate_id,
		  user: res.data.data.user,
          likeList: res.data.data.like//猜猜喜欢
        });
      }
    })
  },
   freeBuy:function(event){
	  let product_id = 0 ;
	  if(undefined!=event){
		  product_id = event.currentTarget.dataset.product_id;
	  }else{
		  return false;
	  }
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/free_buy?uid=' + app.globalData.uid+'&product_id='+product_id,
      method: 'POST',
      header: header,
      success: function (res) {
		  console.log(res.data);
		  if(res.data.data.errcode==0){
			  wx.showToast({
              title: '兑换成功',
              icon: 'success',
              duration: 1000,
            })
		  }else{
			  wx.showToast({
              title: res.data.data.errmsg,
              duration: 1000,
            })
		  }
      }
    })
  },
  onReachBottom: function (p) {
    var that = this;
    var limit = 20;
    var offset = that.data.offset;
    if (!offset) offset = 1;
    var startpage = limit * offset;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_hot_product?uid=' + app.globalData.uid,
      data: { limit: limit, offset: startpage },
      method: 'POST',
      header: header,
      success: function (res) {
        var len = res.data.data.length;
        for (var i = 0; i < len; i++) {
          that.data.likeList.push(res.data.data[i])
        }
        that.setData({
          offset: offset + 1,
          likeList: that.data.likeList
        });
        if (len < limit) {
          that.setData({
            title: "数据已经加载完成",
            hidden: true
          });
          return false;
        }
      },
      fail: function (res) {
        console.log('submit fail');
      },
      complete: function (res) {
        console.log('submit complete');
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '小程序',
      path: '/pages/index/index?spid=' + app.globalData.uid,
      // imageUrl: that.data.url + that.data.product.image,
      success: function () {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      }
    }
  }
})