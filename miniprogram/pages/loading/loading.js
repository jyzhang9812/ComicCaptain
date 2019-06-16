Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'loading'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    setTimeout(() => {
      this.setData({
        loadColor: '#1AA034',
        loadText: ''
      })
    }, 3300)
    setTimeout(() => {
      this.setData({
        loadColor: '#f00',
        loadText: '请求失败'
      })
    }, 6600)
    setTimeout(() => {
      this.setData({
        loadColor: '#ddd',
        loadText: '网络超时'
      })
    }, 10000)

    setTimeout(() => {
      this.setData({
        type: ''
      })
    }, 11000)
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

  }
})