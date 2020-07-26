// pages/produce/produce.js
Page({
  data: {
    dpr: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    hisName: '',
    hisMsg: '',
    center_x: 0,
    center_y: 0,
    msgArr: [],
    man_width: 51,
    man_height: 99,
    man_margin: 10,
    man_gradient: 10,
    canvas_bgcolor: '#ecced8',
    page_one: 1,
    canvasId: 'myCanvas',
    ctx: '',
    canvasObj: {}
  },
  sel_color: function(e) {
    // console.log(e.target.dataset.color);
    this.data.canvas_bgcolor = e.target.dataset.color;
    this.draw(this.data.canvas_bgcolor)
    // console.log(this.data.canvas_bgcolor);
    
  },
  //保存图片到本地
  async savePic() {
    let self = this;
    //这里是重点  新版本的type 2d 获取方法
    const query = wx.createSelectorQuery();
    const canvasObj = await new Promise((resolve, reject) => {
      query.select('#myCanvas')
        .fields({ node: true, size: true })
        .exec(async (res) => {
          resolve(res[0].node);
        })
    });
    console.log(canvasObj);
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: (result) => {
        console.log(result);
      }
    });
      
    wx.canvasToTempFilePath({
      //fileType: 'jpg',
      //canvasId: 'posterCanvas', //之前的写法
      canvas: canvasObj, //现在的写法
      success: (res) => {
        console.log(res);
        self.setData({ canClose: true });
        //保存图片
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '已保存到相册',
              icon: 'success',
              duration: 2000
            })
            // setTimeout(() => {
            //   self.setData({show: false})
            // }, 6000);
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail cancel") {
              wx.showToast({
                title: '保存失败',
                icon: 'none',
                duration:2000
              });
              console.log("用户取消保存")
            } else {
              console.log('保存失败1');
            }
          },
          complete(res) {
            wx.hideLoading();
            console.log(res);
          }
        })
      },
      fail(res) {
        console.log(res);
      }
    }, this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      hisName: options.hisName,
      hisMsg: options.hisMsg,
    })
    if(options.canvas_bgcolor) {
      canvas_bgcolor: options.canvas_bgcolor
    }
    if(options.page_one) {
      page_one: options.page_one
    }
    this.data.msgArr = this.data.hisMsg.split('\n')
    
    wx.setNavigationBarTitle({
      title: 'To '+ this.data.hisName +''
    })
    
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {  
    this.draw(this.data.canvas_bgcolor)
  },
  draw: function(bgcolor) {
    const query = wx.createSelectorQuery()
    // const canvasObj = await new Promise((resolve, reject) => {
      query.select('#myCanvas')
      .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node
          var ctx = canvas.getContext('2d')
          this.data.ctx = ctx
          canvas.width = res[0].width 
          canvas.height = res[0].height 
  
          ctx.fillStyle = bgcolor
          ctx.fillRect(0, 0, canvas.width, canvas.height) //填充一个宽高和canvas一样的矩形，用来填充不同的背景色
  
          // 画举牌小人
          var text = this.data.msgArr
          var w = this.data.man_width
          var h = this.data.man_height
            // var m = this.data.man_margin
          // var g = this.data.man_gradient
  
  
          // 计算小人所占宽高
          var n = text.length  //表示几行
          // var cal_h = n * h + text[n-1].length * g  
          var cal_h = n * h //全部小人的总高
          
          var cal_w = 0
          for (var i = 0; i < n; i++) {  //cal_w为小人最多一行的个数
              if (cal_w < text[i].length) {
                  cal_w = text[i].length
            }
          }
          cal_w = cal_w * w  //cal_w为最长一排小人的长度
  
  
          //动态设置小人之间的margin
          var offset_w = this.data.man_margin  //初始值为10的margin,当小人长度超过canvas宽度时，使用初始值
          var offset_h = this.data.man_margin  
          if (cal_w < canvas.width) { //小人总长度小于canvas宽度时
              offset_w = (canvas.width - cal_w) / 2  //横向，一堆小人与左右边界的距离
          }
          if (cal_h < canvas.height) {
              offset_h = (canvas.height - cal_h) / 2  //同理，纵向，小人与上下边界的距离
          }
  
          //循环每一个小人，得到每个小人的位置，调用drawOne绘制每个小人和字符
          for (var i = 0; i < n; i++) {  //循环每一行
              for (var j = 0; j < text[i].length; j++) {  //循环每一个小人
                  var x = j * w + offset_w
                  // var y = i * h + j * g + offset_h
                  var y = i * h + offset_h  //得到每一个小人的x,y轴坐标
                  this.drawOne(canvas,ctx, text[i][j], x, y)
              }
          }
          // 调用 wx.drawCanvas，通过 canvasId 指定在哪张画布上绘制，通过 actions 指定绘制行为
          // wx.drawCanvas({
          //   canvasId: this.data.canvasId,
          //   actions: ctx.getActions() // 获取绘图动作数组
          // })
        
      })
      
    },
  //根据传过来的每个小人的坐标和字体进行绘制
  drawOne: function(canvas,ctx,word, x, y) {
    ctx.save();
    const image = canvas.createImage();//创建image       
    const n = Math.ceil(Math.random() * 25)
    image.src = '../../image/'+ n +'.png';//指定路径为getImageInfo的文件
    image.onload = () => {
      ctx.drawImage(image, x, y, this.data.man_width, this.data.man_height)//图片加载完成时draw
      ctx.font = "18px sans-serif"
      ctx.fillStyle = '#000000';
      ctx.translate(x, y)  //对当前坐标系的原点 (0, 0) 进行变换,从而每一个字的位置随着小人坐标的改变而改变
      ctx.rotate(40 * Math.PI / 180)
      ctx.fillText(word, 20, 1)
      ctx.restore();
    }   
    
    
  },

  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    //  if(res.from === "button") {

    //  }
    return {
      title: 'To '+ this.data.hisName +'',
      path: '/pages/produce/produce?hisName='+ this.data.hisName +'&hisMsg='+ this.data.hisMsg +'&canvas_bgcolor='+ this.data.canvas_bgcolor +'&page_one='+this.data.page_one+''
    }
  }
})