var app = getApp()
const db = wx.cloud.database()
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    author: '',
    intro: '',
    imgUrl: '',
    country:'',
    tag:[],
    addpic: '',
    prices:null,
    lock_page:null,
    countrys: [
      { name: '中国', value: '中国' },
      { name: '日本', value: '日本' },
    ],
    tags: [
      { name: '热血', value: '热血' },
      { name: '冒险', value: '冒险' },
      { name: '催泪', value: '催泪' },
      { name: '校园', value: '校园' },
      { name: '搞笑', value: '搞笑' },
      { name: '日常', value: '日常' },
    ]
  },
  radioChange(e) {
    this.setData({
      country: e.detail.value
    })
  },
  checkboxChange(e) {
    this.setData({
      tag: e.detail.value
    })
  },
  titleInput: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  authorInput: function (e) {
    this.setData({
      author: e.detail.value
    })
  },
  lockInput: function (e) {
    this.setData({
      lock_page: e.detail.value
    })
  },
  priceInput: function (e) {
    this.setData({
      prices: e.detail.value
    })
  },
  introInput: function (e) {
    this.setData({
      intro: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = app.globalData.baseurl;
    var _this = this;
    _this.setData({
      addpic: url + 'add_pic.png',
    })
  },

  pulish: function () {

    var title = this.data.title
    var author = this.data.author
    var intro = this.data.intro
    var prices = this.data.prices
    var lock_page = this.data.lock_page

    if (title != null && author != null && intro != null && prices != null && lock_page != null) {
      db.collection('comic').add({
        data: {
          "author": author,
          "chapter": [],
          "country": this.data.country,
          "img": this.data.imgUrl,
          "intro": intro,
          "isCollect": false,
          "isComment": false,
          "num": 0,
          "state": '连载中',
          "tag": this.data.tag,
          "title": title,
          "price": prices,
          "lock_num": lock_page,
        },
        success: res =>{
          wx.switchTab({
            url: '../Home_Page/my_info'
          })
        }
      })     
    } else {
      wx.showToast({
        title: '请填写信息',
        icon: 'none'
      })
    }
  },

  // 上传图片
  //上传的时候，我们可以获得一个fileId，这个id我们必须存起来，在别人查看的时候，image的src使用的就是fileId，然后用户必
  //须得知道上传的是哪张图片呀， 所以我们使用的是本地的图片路径来展示，即imagePath 
  doUpload: function () {
    // 选择图片
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        that.setData({
          imgUrl: filePath
        })
        // 上传图片
        const cloudPath = that.data.count + filePath.match(/\.[^.]+?$/)[0]
        //改写: 数组 多图片
        // const filePath = res.tempFilePaths, cloudPath = [];
        // filePath.forEach((item, i)=>{
        //   cloudPath.push(that.data.count + '_' + i + filePath[i].match(/\.[^.]+?$/)[0])
        // })

        console.log(cloudPath)


        // filePath.forEach((item, i) => {
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', cloudPath, res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
        // })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})