// miniprogram/pages/comic/comic_catagory.js
const app = getApp()
var url = app.globalData.baseurl;
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collected: '',
    star_full: '',
    star: '',
    down: '',
    numlist: [], // 存chapter的index，然后自动+1生成，每个点击对应chapter的画面内容
    comic_list: [],
    maxlength: 3,
    iscollect: 0, //是否收藏
    iscomment: 0, //是否评分
    isdown: 1,  //记录逆序还是顺序
    comicId: '',
    _id:'',  
    lock_num: 0, //付费起始位置
    ispay:false, //是否已付费  
    unlock_icon:'',
    lock_icon:'',
    send:'',

    //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框  
    hiddenmodalput: true,
    /** 
     * 页面配置 
     */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,

    // 打星星
    one_2: 0,
    two_2: 5,
    length: 0
  },

  //跳转到内容页面
  bindPage: function(e) {
    let page = e.currentTarget.dataset.page;
    let index = e.currentTarget.dataset.index;
    db.collection('history').where({
      _openid: app.globalData.openid,
      history: db.command.in([this.data.comicId])
    }).get({
      success: res => {
        if(res.data.length == 0) {
          db.collection('history').where({
            _openid: app.globalData.openid
          }).get({
            success: res => {
              db.collection('history').doc(res.data[0]._id).update({
                data: {
                  history: db.command.push([this.data.comicId])
                },
                success: res => {
                  
                }
              })
            }
          })
        }
        wx.navigateTo({
          url: '../comic/comic_page?page=' + page + '&index=' + index + '&id=' + this.data.comicId
        })
      }
    })
    
  },

  bindDown: function(e) {
    this.down();
  },

  // 聚焦input框
  bindButtonTap: function () {
    this.setData({
      focus: true
    })
  },

  //收藏漫画
  collect: function(option) {
    var id = this.data.comicId;
    var userid = app.globalData.openid;
    if (this.data.iscollect == 0) {
      this.setData({
        iscollect: 1,
        collected: url + 'collected.png',
      })
    } else {
      this.setData({
        iscollect: 0,
        collected: url + 'collect.png',
      })
    }
    
    db.collection('user').where({
      _openid: userid
    }).get({
      success(res) {
        console.log(res.data[0])
        //将该漫画id添加到数据库中
        db.collection('user').doc(res.data[0]._id).update({
          data: {
            collect: db.command.push([id])
          },
          success: res => {
            console.log(collect)
            wx.showToast({
              title: '已收藏',
              icon: 'success',
              duration: 1000
            })
          },
          fail: err => {
            wx.showToast({
              title: '收藏失败',
            })
          }
        })
      }
    })
  },

  //评论！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
  comment: function() {

  },
 //评论函数！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！


  more: function() {
    var length = this.data.maxlength;
    this.setData({
      maxlength: length + 3
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    var that = this
    var url = app.globalData.baseurl;
    console.log(option)
    var id = option.id;
    var arr = [];
    if (this.data.iscollect == 0) {
      this.setData({
        collected: url + 'collect.png',
      })
    } else {
      this.setData({
        collected: url + 'collected.png',
      })
    }

    if (this.data.iscomment == 0) {
      this.setData({
        score: url + 'score.png',
      })
    } else {
      this.setData({
        score: url + 'score_full.png',
      })
    }
    this.setData({
      down: url + 'up.png',
      star: url + 'star.png',
      star_full: url + 'star_full.png',
      lock_icon: url + 'lock.png',
      unlock_icon: url + 'unlock.png',
      send: url + 'send.png',
    })
    console.log(id)
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              that.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickname: res.userInfo.nickName,
              })
            }
          })
        }
      }
    })
    db.collection('comic').doc(id).get({
      success(res) {
        var chapter = [];
        for(var x = 0 ; x < res.data.chapter.length ; x ++){
          var i = {
            index: x+1,
            num: res.data.chapter[x]
          }
          chapter.push(i)
        }
        that.setData({
          comic_list: res.data,
          iscollect: res.data.isCollect ? 1 : 0,
          iscomment: res.data.isComment ? 1 : 0,
          numlist: chapter,
          length: res.data.chapter.length,
          comicId: id,
          lock_num:res.data.lock_num,
        })
        //console.log(that.data.numlist)
      }
    })
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success(res) {
        console.log(res.data[0].paylist)
        for (var i = 0; i < res.data[0].paylist.length; i++) {
          if (id == res.data[0].paylist[i]) {
            that.setData({
              ispay: true,
            })
            break;
          }
        }
      }
    })
  },


  down: function() {
    var pagelist = this.data.numlist;
    var length = pagelist.length;
    console.log(length)
    var list = [];
    for (var i = 0; i < length; i++) {
      list.push(pagelist.pop());
    }
    this.setData({
      numlist: list
    })
    if (this.data.isdown == 0) {
      this.setData({
        isdown: 1,
        down: url + 'up.png',
      })
    } else {
      this.setData({
        isdown: 0,
        down: url + 'down.png',
      })
    }
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
  },

  //点击按钮弹出指定的hiddenmodalput弹出框  
  modalinput: function() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮  
  cancel: function() {
    this.setData({
      iscomment: 0,
      score: url + 'score.png',
      hiddenmodalput: true
    });
  },

  //确认  
  confirm: function() {
    wx.showToast({
      title: '已评分',
      icon: 'success',
      duration: 1000
    })
    this.setData({
      iscomment: 1,
      score: url + 'score_full.png',
      hiddenmodalput: true
    })
  },

  //情况二:用户给评分
  in_xin: function(e) {
    var in_xin = e.currentTarget.dataset.in;
    var one_2;
    if (in_xin === 'use_sc2') {
      one_2 = Number(e.currentTarget.id);
    } else {
      one_2 = Number(e.currentTarget.id) + this.data.one_2;
    }
    this.setData({
      one_2: one_2,
      two_2: 5 - one_2
    })
  }
});