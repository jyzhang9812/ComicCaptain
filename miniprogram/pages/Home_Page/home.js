// miniprogram/pages/Home_Page/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: '',
    onepiece: '',
    girls: '',
    chongshi: '',
    rocket: '',
    rocket2: '',
    galaxy: '',
    change: '',
    more: '',
    comic_list: [],
    random_list:['','','','','',''],
    top_list: ['', '', '', '', '', ''],
    type:'loading',
  },
  bindCatalog: function (event) {
    console.log(event)
    var post_id = event.currentTarget.dataset.postid   //获取传递的值
    console.log(post_id);
    wx.navigateTo({
      url: "../comic/comic_catagory?id="+post_id
    })
  },
  bindrank: function () {
    wx.navigateTo({
      url: '../Home_Page/ranking_list'
    })
  },
  bindTag: function () {
    wx.switchTab ({
      url: '../Home_Page/classify'
    })
  },
  bindUpdate: function () {
    wx.navigateTo({
      url: '../Home_Page/update'
    })
  },
  search_page: function (e) {
    wx.navigateTo({
      url: '../Home_Page/search',
    })
  }, 
  change:function(){
    var array = [1, 2, 3, 4, 5, 6]
    var arr = []
    var n = Math.round(Math.random() * (array.length - 1))
    var a = n
    for (n; n <= array.length; n++) {
      if(n < array.length){
        arr.push(this.data.comic_list[n])
        this.setData({
          random_list: arr
        })
      }
      else{
        n = 0;
        for (n; n < a; n++) {
          arr.push(this.data.comic_list[n])
          this.setData({
            random_list: arr
          })
        }
        break;
      }
    }
  },
  change2: function () {
    var array = [1, 2, 3, 4, 5, 6]
    var arr = []
    var n = Math.round(Math.random() * (array.length - 1))
    var a = n
    for (n; n <= array.length; n++) {
      if (n < array.length) {
        arr.push(this.data.comic_list[n])
        this.setData({
          top_list: arr
        })
      }
      else {
        n = 0;
        for (n; n < a; n++) {
          arr.push(this.data.comic_list[n])
          this.setData({
            top_list: arr
          })
        }
        break;
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = app.globalData.baseurl;
    var _this = this;
    var array = [1, 2, 3, 4, 5, 6]
    var arr = []
    var n = Math.round(Math.random() * (array.length - 1))
    var a = n

    //1、引用数据库
    const db = wx.cloud.database({
      //这个是环境ID不是环境名称
      env: 'comic-bfef61'
    })
    db.collection('history').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        if(res.data.length == 0){
          db.collection('history').add({
            data: {
              history: []
            },
            success: res => {
              console.log(res)
            }
          })
        }
      }
    })
    //2、开始查询数据了  comic对应的是集合的名称
    db.collection('comic').get({
      //如果查询成功的话
      success: res => {
        console.log(res)
        //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值
        this.setData({
          comic_list: res.data,
        })
        for (n; n <= array.length; n++) {
          if (n < array.length) {
            arr.push(this.data.comic_list[n])
            this.setData({
              random_list: arr,
              top_list:arr
            })
          }
          else {
            n = 0;
            for (n; n < a; n++) {
              arr.push(this.data.comic_list[n])
              this.setData({
                random_list: arr,
                top_list: arr
              })
            }
            break;
          }
        }
      }
    })
    this.setData({
      search: url + 'search.png',
      onepiece: url + 'onepiece.jpg',
      girls: url + 'girls.jpg',
      chongshi: url + 'chongshi.jpg',
      rocket: url + 'rocket.png',
      rocket2: url + 'rocket2.png',
      galaxy: url + 'galaxy.png',
      change: url + 'change.png',
      more: url + 'more.png',
    })
  },

  more_card: function () {
    var length = this.data.maxlength;
    this.setData({
      maxlength: length + 3
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})