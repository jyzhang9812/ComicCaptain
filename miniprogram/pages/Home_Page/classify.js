// miniprogram/pages/Home_Page/classify.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */

  data: {
    search: '',
    sanji: '',
    pokemon: '',
    gintama: '',
    cateItems: [],
    curNav: 1,
    curIndex: 0,
    isnull:true,
    //连载榜
    type1: [], type2: [], type3: [], type4: [], type5: [], type6: [],
    //完结榜
    type21: [], type22: [], type23: [], type24: [], type25: [], type26: []
  },

  bindCatalog: function (event) {
    console.log(event)
    var post_id = event.currentTarget.dataset.id   //获取传递的值
    console.log(post_id);
    wx.navigateTo({
      url: '../comic/comic_catagory?id=' + post_id
    })
  },
  //事件处理函数  
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值  
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = app.globalData.baseurl;
    var _this = this;
    //1、引用数据库
    const db = wx.cloud.database({
      //这个是环境ID不是环境名称
      env: 'comic-bfef61'
    })
    //2、开始查询数据了  comic对应的是集合的名称
    //Tab 标签页的初始化
    //连载&热血对应的漫画数组type1
    db.collection('comic')
      .where({
        tag: "热血"
      })
      .where({
        state: "连载中"
      })
      .get({
        success: res => {
          _this.setData({
            type1: res.data,
          })
        }
      }),
      //连载&古风对应的漫画数组type1
      db.collection('comic')
        .where({
          tag: "冒险"
        })
        .where({
          state: "连载中"
        })
        .get({
          success: res => {
            _this.setData({
              type2: res.data,
            })
          }
        }),
      //连载&治愈对应的漫画数组type1
      db.collection('comic')
        .where({
          tag: "催泪"
        })
        .where({
          state: "连载中"
        })
        .get({
          success: res => {
            _this.setData({
              type3: res.data,
            })
          }
        }),
      //连载&校园对应的漫画数组type1
      db.collection('comic')
        .where({
          tag: "校园"
        })
        .where({
          state: "连载中"
        })
        .get({
          success: res => {
            _this.setData({
              type4: res.data,
            })
          }
        }),
      //连载&搞笑对应的漫画数组type1
      db.collection('comic')
        .where({
          tag: "搞笑"
        })
        .where({
          state: "连载中"
        })
        .get({
          success: res => {
            _this.setData({
              type5: res.data,
            })
          }
        }),
      //连载&推理对应的漫画数组type1
      db.collection('comic')
        .where({
          tag: "日常"
        })
        .where({
          state: "连载中"
        })
        .get({
          success: res => {
            _this.setData({
              type6: res.data,
            })
          }
        }),
      //完结&热血对应的漫画数组type1
      db.collection('comic')
        .where({
          tag: "热血"
        })
        .where({
          state: "已完结"
        })
        .get({
          success: res => {
            _this.setData({
              type21: res.data,
            })
          }
        }),
      //完结&古风对应的漫画数组type1
      db.collection('comic')
        .where({
          tag: "冒险"
        })
        .where({
          state: "已完结"
        })
        .get({
          success: res => {
            _this.setData({
              type22: res.data,
            })
            if(type22=='[]'){
              _this.setData({
                isnull: true,
              })
            }
          }
        }),
      //完结&治愈对应的漫画数组type1
      db.collection('comic')
        .where({
          tag: "催泪"
        })
        .where({
          state: "已完结"
        })
        .get({
          success: res => {
            _this.setData({
              type23: res.data,
            })
          }
        }),
      //完结&校园对应的漫画数组type1
      db.collection('comic')
        .where({
          tag: "校园"
        })
        .where({
          state: "已完结"
        })
        .get({
          success: res => {
            _this.setData({
              type24: res.data,
            })
          }
        }),
      //完结&搞笑对应的漫画数组type1
      db.collection('comic')
        .where({
          tag: "搞笑"
        })
        .where({
          state: "已完结"
        })
        .get({
          success: res => {
            _this.setData({
              type25: res.data,
            })
          }
        }),
      //完结&推理对应的漫画数组type1
      db.collection('comic')
        .where({
          tag: "日常"
        })
        .where({
          state: "已完结"
        })  
        .get({
          success: res => {
            _this.setData({
              type26: res.data,
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