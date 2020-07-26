
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hisName: '',
    hisMsg: '',
    // value: ''
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  // del: function() {
  //   this.setData({
  //     value: ''
  //   })
  // },
  handleProduce: function(e) {
    console.log(e);
    console.log(this.hisMsg);
    
    wx.navigateTo({
      url: '/pages/produce/produce?hisName='+ this.hisName +'&hisMsg='+ this.hisMsg +''
      
    })
  },
  inputName: function(e) {
    this.hisName = e.detail.value;
  },
  inputMsg: function(e) {
    this.hisMsg = e.detail.value;

    
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