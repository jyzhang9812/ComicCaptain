//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    motto: '点击头像进入主页~',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.switchTab({
      url: '../Home_Page/home'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    //获取用户openid，并在数据库中查询是否存在该openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
        db.collection('user')
          .where({
            _openid: app.globalData.openid
          })
          .get({
            success: res => {
              if (res.data.length == 0) {
                //该用户不在数据库中，将该用户数据添加到数据库中
                //console.log("该用户不存在")
                db.collection('user').add({
                  data: {
                    username: app.globalData.userInfo.nickName,
                    usericon: app.globalData.userInfo.avatarUrl,
                    collect: [],
                    comment:[],
                    coin:0,
                    paylist:[]
                  },
                  success(res) { }
                })
                wx.switchTab({
                  url: '../index/index'
                })
              }
              else {//该用户已经存在在数据库中，需要更新当前数据，不用再添加数据
                db.collection('user').doc(res.data[0]._id).update({
                  data: {
                    username: app.globalData.userInfo.nickName,
                    usericon: app.globalData.userInfo.avatarUrl
                  },
                  success(res) { }
                })
                _this.setData({
                  loadModal: false
                })
                wx.switchTab({
                  url: '../index/index'
                })
              }
            },
          })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
})
