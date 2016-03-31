MusicPlayer 音乐播放器组件  
===  
[DEMO 浏览器请打开移动端模拟器](http://t-phantom.github.io/PhantomUI/musicPlayer/)  
一款简洁的HTML5音乐播放器, 样式参考qq音乐设计。
## 一丶基本使用：
基本结构如下
```html
<div class="content">
   
</div>
<script>
    var player = new MusicPlayer({
        parentNode : ".content",
        album : {
            img : "...",
            title : "...",
            author : "...",
            url : "...",
            lyric : "..."
        }
    })
</script>
```   
## 二丶可选参数  
### 初始化，必填参数
```javascript
album : {
    img : "...",    //歌曲图片
    title : "...",  //歌曲名称
    author : "...", //歌曲作者
    url : "...",    //歌曲连接
    lyric : "..."   //歌词lrc文件
},
//三种回调函数设置
playMusicCall : func,
stopMusicCall : func,
endMusicCall : func
```   
### 可选参数， 当自定义布局时候使用  
```javascript
lyricHeight : 42            //每条歌词所占高度， 默认42px
parentNode ： document.body //组件挂在位置， 默认<body>元素
```  
支持事件：    

|事件类型    |触发说明         |  
|:----------:|-----------------|  
|playMusic   |开始播放音乐     |
|stopMusic   |音乐被终止       |
|endMusic    |音乐播放完成     |    

### 可操作对象：  
`player.audio` : audio元素对象，
`player.$barPlay` : 进度条zepto对象  
....

### 其他 
音乐组件，其他功能需要自己配置，接口已经留好。 例如：player.audio.currentTime = 200,
修改播放进度后，组件内容会自动更新。
 

## 三丶待更新问题  
1. 支持音乐列表配置，添加musicList : []数组，保存多组音乐信息
2. 修正音乐时间控制， 
