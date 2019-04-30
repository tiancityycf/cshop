var app = getApp();
// pages/cash/cash.js
Page({
  data: {
    ooo:'',
    _num:0,
    url: app.globalData.urlImages,
    hiddentap: true,
    hidde: true,
    money:'',
	integral:0,
    index:0,
    array:["请选择银行","招商银行","建设银行","农业银行"]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (opends) {
    app.setBarColor();
    app.setUserInfo();
    var that = this;
    this.getUserInfo();
    this.getUserExtractBank();
	that.setData({
          minmoney: 1000
        })
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
  getUserExtractBank:function () {
	return ;
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_user_extract_bank?uid=' + app.globalData.uid,
      method: 'get',
      success: function (res) {
        that.setData({
          array: res.data.data
        });
      }
    });
  },
  cardtap:function(e){
    var flag = this.data.hiddentap;
    if (flag){
      this.setData({
        hiddentap: false
      })
    }else{
      this.setData({
        hiddentap: true
      })
    }  
  },
  idnumtap: function (e) {
    this.setData({
      _num: e.target.dataset.idnum,
      hiddentap: true
    })
    if (e.target.dataset.idnum==1){
      this.setData({
        hidde: false
      })
    }else{
      this.setData({
        hidde: true
      })
    }
  },
  maskhide:function(e){
      this.setData({
        hiddentap: true
      })
  },
  bindPickerChange:function(e){
	  return;
      this.setData({
        index: e.detail.value
      })
  },
  formSubmit:function(e){
    var header = {
      // 'content-type': 'application/x-www-form-urlencoded',
      'cookie': app.globalData.sessionId//读取cookie
    };
    var that = this;
    var flag = true;
    var warn = "";
    var minmon = that.data.minmoney;
    var mymoney = that.data.money;
	var integral = that.data.integral;
    var list={};
    if (that.data.hidde==true){
      list.name = e.detail.value.name;
      list.cardnum = e.detail.value.cardnum;
      //list.bankname = that.data.array[that.data.index];
      list.money = e.detail.value.money;
      list.money = Number(list.money);
      list.extract_type = 'bank';
      if (list.$name == "") {
        warn = "请填写持卡人姓名";
      } else if (list.cardnum == "") {
        warn = "请输入银行卡号";
      } else if(list.money<minmon){
		  warn = "最小提现积分" + minmon;
	  } else if (list.money > integral) {
        warn = "您的积分不足";
      }else {
        flag = false;
      }
      if (flag == true) {
        wx.showModal({
          title: '提示',
          content: warn
        })
        return false;
      }
    } else {
      list.weixin = e.detail.value.weixin;
      list.money = e.detail.value.wmoney;
      list.money = Number(list.money);
      list.extract_type = 'weixin';
      if (list.weixin == "") {
        warn = "请填写微信号";
      } else if (list.money < minmon) {
        warn = "最小提现积分" + minmon;
      } else if (list.money > integral) {
        warn = "您的积分不足"
      } else {
        flag = false;
      }
      if (flag == true) {
        wx.showModal({
          title: '提示',
          content: warn
        })
        return false;
      }
    }
    wx.request({
      url: app.globalData.url + '/routine/auth_api/user_integral?uid=' + app.globalData.uid,
      data: { lists: list},
      method: 'POST',
      header: header,
      success: function (res) {
        that.setData({
          money: (that.data.money - list.money).toFixed(2)
        })
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 1500
        });
		wx.redirectTo({ //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
			url: '/pages/integral-con/integral-con'
		});
      }
    })
  }


})