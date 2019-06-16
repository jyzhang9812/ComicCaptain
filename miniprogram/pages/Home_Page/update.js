// miniprogram/pages/Home_Page/update.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  
  bindCatalog: function (event) {
    console.log(event)
    var post_id = event.currentTarget.dataset.postid   //获取传递的值
    console.log(post_id);
    wx.navigateTo({
      url: '../comic/comic_catagory?id=' + post_id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    //1、引用数据库
    const db = wx.cloud.database({
      //这个是环境ID不是环境名称
      env: 'comic-bfef61'
    })
    //2、开始查询数据了  comic对应的是集合的名称
    db.collection('comic').get({
      //如果查询成功的话
      success: res => {
        console.log(res)
        //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值
        this.setData({
          comic_list: res.data
        })
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