// miniprogram/pages/Home_Page/my_info.js
const db = wx.cloud.database();
const app = getApp()
const url = app.globalData.baseurl;
var util = require('../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    save: '',
    sanji: '',
    edit: '',
    collect: '',
    bcg: '',
    text: '',
    sign: '',
    isSign: 0,
    setting: '',
    bigImg: '',
    title: '',
    coin: 0,
    iscollect: 1,
    date: '',
    save_list: [],
    upload_list: [],
    /** 
     * 页面配置 
     */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
  },

  //跳转到内容页面
  bindPage: function(e) {
    let comic_id = e.currentTarget.dataset.cid;
    let l = e.currentTarget.dataset.index-1;
    let page = e.currentTarget.dataset.page[l]
    wx.navigateTo({
      url: '../comic/comic_page?page=' + page + '&index=' + l + '&id=' + comic_id
    })
  },

  //跳转到上传页面
  bindupload: function() {
    wx.navigateTo({
      url: '../upload/create_upload'
    })
  },

  //跳转到上传章节页面
  bindSetting: function(event) {
    console.log(event)
    var post_id = event.currentTarget.dataset.postid   //获取传递的值
    wx.navigateTo({
      url: '../upload/manage_upload?id=' + post_id
    })
  },

  //签到
  sign() {
    var userid = app.globalData.openid;
    var _this = this;
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success(res) {
        console.log(res.data[0]._id)
        db.collection('user').doc(res.data[0]._id).update({
          data: {
            coin: res.data[0].coin + 5
          },
          success: res => {
            _this.setData({
              text: '已签到',
              sign: url + 'sign.png',
              isSign: 1,
            })
            wx.showToast({
              title: '成功！金币+5',
              image: '/images/coin.png',
              duration: 1000
            })
          },
          fail: err => {
            wx.showToast({
              title: '签到失败',
            })
          }
        })
      }
    })
  },

  //收藏
  collect: function(e) {
    var userid = app.globalData.openid;
    console.log(e.currentTarget.dataset.index)
    var arr = []
    for(var x = 0 ; x < this.data.save_list.length ; x ++) {
      arr.push(this.data.save_list[x]._id)
    }
    console.log(arr)
      db.collection('user').where({
        _openid: userid
      }).get({
        //如果查询成功的话
        success: res => {
          console.log(res.data)
          if(arr.length > 1){
            arr.splice(e.currentTarget.dataset.index, 1)
          }else{
            arr.pop()
          }
          console.log(arr)
          db.collection('user').doc(res.data[0]._id).update({
            data: {
              collect: arr
            },
            success: res => {
              this.onLoad()
            },
            fail: err => {
              wx.showToast({
                title: '取消失败',
              })
            }
          })
        }
      })
  },


  onLoad: function(options) {
    var _this = this;
    var arr = [];
    var c;
    var id_list = [];
    var userid = app.globalData.openid;

    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              _this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickname: res.userInfo.nickName,
              })
            }
          })
        }
      }
    })
    //1、引用数据库
    const db = wx.cloud.database({
      //这个是环境ID不是环境名称
      env: 'comic-bfef61'
    })
    //2、开始查询数据了  comic对应的是集合的名称
    db.collection('user').where({
      _openid: userid
    }).get({
      //如果查询成功的话
      success: res => {
        this.setData({
          coin: res.data[0].coin
        })
        for (var i = 0; i < res.data[0].collect.length; i++) {
          db.collection('comic').doc(res.data[0].collect[i]).get({
            //如果查询成功的话
            success: res => {
              arr.push(res.data)
              this.setData({
                save_list: arr,
              })
            }
          })
        }
      }
    })
    //2、开始查询数据了  comic对应的是集合的名称
    db.collection('comic').where({
      _openid: userid
    }).get({
      //如果查询成功的话
      success: res => {
        var a = []
        for (var i = 0; i < res.data.length; i++) {
          a.push(res.data[i])
        }
        this.setData({
          upload_list: a,
        })
      }
    })
    if (this.data.iscollect == 0) {
      this.setData({
        collect: url + 'save.png',
      })
    } else {
      this.setData({
        collect: url + 'collected.png',
      })
    }
    this.setData({
      edit: url + 'edit.png',
      save: url + 'save.png',
      sanji: url + 'sanji.jpg',
      bcg: url + 'bcg.jpg',
      sign: url + 'unsign.png',
      setting: url + 'setting.png',
      date: util.formatTime(new Date()),
      text: '签到'
    });
    var h_comic = []
    db.collection('history').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        for(var x = 0; x < res.data[0].history.length; x ++){
          db.collection('comic').where({
            _id: res.data[0].history[x]
          }).field({
            img: true,
            title: true,
            chapter: true
          })
          .get({
            success: res => {
              var s = res.data[0];
              h_comic.push({
                _id: s._id,
                img: s.img,
                title: s.title,
                chapter: s.chapter,
                clength: s.chapter.length
              })
              this.setData({
                history_comic: h_comic
              })
            }
          })
        }        
        // setTimeout(function(){
        //   console.log(_this.data.history_comic)
        // },2000)
      }
    })
    
    var _this = this;
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /** 
   * 滑动切换tab 
   */
  bindChange: function(e) {

    var that = this;
    that.setData({
      currentTab: e.detail.current
    });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function(e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})