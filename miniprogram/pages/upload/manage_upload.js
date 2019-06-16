// miniprogram/pages/upload/manage_upload.js
const db = wx.cloud.database();
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'',
    numlist: [], // 存chapter的index，然后自动+1生成，每个点击对应chapter的画面内容
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var _this = this;
    var id = option.id;
    console.log(option)
    db.collection('comic').doc(id).get({
      success:res=>{
        _this.setData({
          numlist: res.data.chapter,
          id:id
        })
        console.log(numlist)
      }
    })
  },

  // 上传图片
  //上传的时候，我们可以获得一个fileId，这个id我们必须存起来，在别人查看的时候，image的src使用的就是fileId，然后用户必
  //须得知道上传的是哪张图片呀， 所以我们使用的是本地的图片路径来展示，即imagePath 
  doUpload: function () {
    // 选择图片
    var that = this;
    console.log(this.data.id)
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
        const cloudPath = (Math.random() * 10) * (Math.random() * 10) + filePath.match(/\.[^.]+?$/)[0]
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
            //app.globalData.cloudPath = cloudPath
            //app.globalData.imagePath = filePath
            var arr = []
            db.collection('comic').doc(that.data.id).get({
              success: res => {
                for (var i = 0; i < res.data.chapter.length; i++) {
                  arr.push(res.data.chapter[i])
                }
                arr.push(app.globalData.fileID)
                console.log(arr)

                db.collection('comic').doc(that.data.id).update({
                  data: {
                    chapter: arr
                  },
                  success: res => {
                    wx.switchTab({
                      url: '../Home_Page/my_info'
                    })
                  }
                })
              }
            })
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