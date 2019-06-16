// miniprogram/pages/Home_Page/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comic_list:[], 
    notFound:true
  },
  search: function (key) {
    var that = this;
    var arr = [];//临时数组 用于存放匹配到的数据
    const db = wx.cloud.database({
      env: 'comic-bfef61'
    })
    console.log(key)
    var comic_list = db.collection('comic').get({
      success: res =>{
        if (key == '') {//用户没有输入 全部显示
          that.setData({
            comic_list: res.data
          })
          return;
        }
        else for(let i in res.data) {
          if (res.data[i].title.indexOf(key) >= 0) {//查找
            arr.push(res.data[i])
          }
        }
        if (arr.length == 0) {
          that.setData({
            comic_list: []
          })
        } else {
          that.setData({
            notFound :false,
            comic_list: arr//在页面显示找到的数据
          })
        }
      }
    })
  },
//搜索时触发，调用search: function (key)，传入输入的e.detail.value值
  wxSearchInput: function (e) {
    this.search(e.detail.value);
    console.log(e.detail.value)
  },
  wxSerchFocus: function (e) {
    this.search(e.detail.value);
  },
  wxSearchBlur: function (e) {
    this.search(e.detail.value);
  },
  wxSearchFn: function (e) {
    console.log(e)
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
    var url = app.globalData.baseurl;
    this.setData({
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