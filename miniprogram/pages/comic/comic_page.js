// miniprogram/pages/comic/comic_page.js
const app = getApp();
const db = wx.cloud.database();
var url = app.globalData.baseurl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pre: '',
    save: '',
    category: '',
    next: '',
    t_image:'',
    iscollect: 0,
    content:'',
    content_list:[],
    paylist:[],
    index : 0,
    page:'',
    id: '',
    flag:false,
    price:0,
  },

  bindCatalog: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  
  pay: function () { //支付
    var _this = this;
    var userid = app.globalData.openid;
    var arr = []
    var db_id = '';
    for (var i = 0; i < _this.data.paylist.length; i++) {
      arr.push(_this.data.paylist[i])
    }
    arr.push(_this.data.id)
    
    db.collection('user').where({
      _openid: userid
    }).get({
      success(res) {
      var i = res.data[0].coin - _this.data.price
      db.collection('user').where({
        _openid: userid
      }).get({
        success(res) {
          db.collection('user').doc(res.data[0]._id).update({
            data: {
              paylist: arr,
              coin: i
            },
            success(res) {
              _this.setData({
                flag: true
              })
            }
          })
        }
      })
      }
    })
  },

  pre: function () {  //前一页
    if (this.data.index==0){
      wx.showToast({
        title: '已经是第一话啦',
        duration: 1000
      })
    }
    else{
      var i1 = this.data.index
      var i2 = i1;
      this.setData({
        index: --i1,
        page: this.data.content_list[--i2]
      })
      wx.redirectTo({
        url: '../comic/comic_page?page=' + this.data.page + '&index=' + this.data.index + '&id=' + this.data.id
      })
    }
  },

  next: function (){  //后一页
    if (this.data.index == this.data.content_list.length-1) {
      wx.showToast({
        title: '已经是最新话啦',
        duration: 1000
      })
    }
    else {
      var i1 = this.data.index
      var i2 = i1;
      this.setData({
        index: ++i1,
        page: this.data.content_list[++i2]
      })
      wx.redirectTo({
        url: '../comic/comic_page?page=' + this.data.page + '&index=' + this.data.index + '&id=' + this.data.id
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = app.globalData.baseurl;
    var userid = app.globalData.openid;
    var that = this;
    console.log(options)
    var _index = options.index;
    var _page = options.page;
    var _id = options.id;
    
    db.collection('comic').doc(_id).get({
      success(res) {
        if(_index < res.data.lock_num-1){
          that.setData({
            flag: true
          })
        }
        that.setData({
          content_list: res.data.chapter,
          price:res.data.price,
        })
      }
    })
    db.collection('user').where({
      _openid: userid
    }).get({
      success(res) {
        console.log(res.data[0])
        var arr=[];
        for(var i=0;i<res.data[0].paylist.length;i++){
          arr.push(res.data[0].paylist[i])
          if( _id == res.data[0].paylist[i]){
            that.setData({
              flag:true,
            })
            break;
          }
        }
        that.setData({
          paylist: arr
        })
      }
    })
    that.setData({
      pre: url + 'pre.png',
      save: url + 'save.png',
      next: url + 'next.png',
      category: url + 'category.png',
      t_image: url + 't_image.png',
      content: options.page,
      index: _index,
      page: _page,
      id:_id,
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
    //this.onLoad()
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})