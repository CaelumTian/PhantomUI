基础样式库  
===    
[展示DEMO](http://t-phantom.github.io/PhantomUI/ui/)  

## 一丶基本样式  
1.这里我们采用了`normalize.css`做样式统一 ，加入了一些调整，设置元素margin和padding初值为0  
2.基础设置：   
PhantomUI 将所有盒模型设置为`border-box`  
```css
 *,
 *:before,
 *:after {
   -moz-box-sizing: border-box;
   -webkit-box-sizing: border-box;
   box-sizing: border-box;
 }
```  
字号采用根元素`font-size`为20px， 基本字体为body为0.85rem， 行高1.5，文字字体如下，另外，在 Webkit 浏览器下还设置了反锯齿平滑渲染，渲染出来要纤细一些：  
```css
body {
    /*字体反锯齿*/
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
    font-family: "Segoe UI", "Lucida Grande", Helvetica, Arial, "Microsoft YaHei", FreeSans, Arimo, "Droid Sans","wenquanyi micro hei","Hiragino Sans GB", "Hiragino Sans GB W3", Arial, sans-serif;
}
```    
[文本样式展示](http://t-phantom.github.io/PhantomUI/ui/text.html)  

## 二丶栅格布局  
PhantomUI提供了移动设备优先flex栅格系统，采用12栅格的布局，在加入指定类后，可变成响应式栅格。  
工作原理：  
栅格系统有采用flex布局，提供更直观、丰富的布局方式，可以轻松解决垂直居中，多栏同高等问题。默认12栅，使用
的时候指定父容器类名`flex`, 每一列被划分为12等分，每份可采用向子元素添加`flex-item-n`来表示。不指定份数n，单纯的`flex-item`
类为自动适应剩余空间。如果一“行（row）”中包含了的“列（column）”大于 12，多余的“列（column）”所在的元素将被作为一个整体另起一行排列。  
简单使用如下：  
```html
<div class="flex">
    <div class="flex-item-4">占据4份空间</div>
    <div class="flex-item-8">占据8份空间</div>
</div>
```  
我们也可以指定，元素的相对于左边便宜的长度：`flex-offset-3` 指定容器向左偏移3分内容。   

媒体查询：  
我们可以在此基础上，通过向父元素添加辅助类，实现响应式栅格。栅格划分如下：  


|             |小屏幕 平板 (≥768px)      |中等屏幕 桌面显示器 (≥992px)  |大屏幕 大桌面显示器 (≥1200px) |  
|:-----------:|--------------------------|------------------------------|------------------------------|  
|栅格系统行为 |开始是堆叠在一起的，当大于这些阈值时将变为水平排列                                      |  
|加入的class  |`flex-sm`                 | `flex-md`                    |`flex-lg`                     |  
|隐藏元素     |`flex-sm-hide`            |`flex-md-hide`                |`flex-lg-hide`                |

不引入响应式类名，那么栅格将正常横向排列。  

如果指定一个元素类名为：`flex-sm-hide`那么该元素将在屏幕宽度小于768px的时候自动隐藏元素，依次类推。  
[栅格样式展示](http://t-phantom.github.io/PhantomUI/ui/flex.html)    

##三丶图标  
PhabtomUI字体图标库引用自`IcoMoon App`，图标使用需要 类`icon` `icon-name` 
```html
<!-- 一个用户图标 -->
<i class="icon icon-user"></i>
```  
字体图标大小默认`0.85rem`   
[栅格样式展示](http://t-phantom.github.io/PhantomUI/ui/icon.html)   

## 四丶 列表 && 表单    
PhantomUI中列表样式参考IOS界面列表，采用`flex`辅助布局  
`list-content` 指定列表容器。`list-item`为每项内容容器，`list-inner`为主要内容，以上两个容器需要指定
`flex`成为弹性容器。 `list-img`为可选项，指定容器的图标。基本使用如下  
```html
<div class="list-content-title">图标, 文字, 内容(图标留空,暂时没有)</div>
<div class="list-content">
    <ul>
        <li class="list-item flex">
            <div class="item-img"></div>
            <div class="item-inner flex">
                <div class="item-prev">手机型号</div>
                <div class="item-back">IPHONE6s</div>
            </div>
        </li>
        <li class="list-item flex">
            <div class="item-inner flex">
                <div class="item-prev">用户名</div>
                <div class="item-back">CaelumTian</div>
            </div>
        </li>
        <li class="list-item flex">
            <div class="item-img"></div>
            <div class="item-inner flex">
                <div class="item-prev">设置</div>
                <div class="item-back">
                    <i class="icon icon-chevron-right"></i>
                </div>
            </div>
        </li>
    </ul>
</div>
```   
在此基础上,扩展出表单样式, 进需要修改列表中 `.item-back`部分为下面内容:  
```html
<!-- 文本内容 -->
<li class="list-item flex">
    <div class="item-img"></div>
    <div class="item-inner flex">
        <div class="item-prev label">
            姓名
        </div>
        <div class="item-input">
            <input type="text" placeholder="输入姓名">
        </div>
    </div> 
</li>
<!-- chackbox内容对应替换内容即可 -->
<div class="item-input">
    <label class="label-switch">
        <input type="checkbox">
        <div class="checkbox"></div>
    </label>
</div>  
```  
[列表样式展示](http://t-phantom.github.io/PhantomUI/ui/list.html)  
[表单样式展示](http://t-phantom.github.io/PhantomUI/ui/form.html)  

## 五丶卡片样式  
卡片含有独特的相关数据，例如，照片，文字,视频等相关内容, 更好的组织页面结构.   
 `card-header` 卡片头部, `card-content`卡片主体(`card-content-inner`, `<p>`), `card-footer`卡片尾部, `img-card` 特殊卡片1  
```html  
<div class="card">
    <div class="card-content">
        <div class="card-content-inner">
            -webkit-line-clamp 是一个 不规范的属性（unsupported WebKit property），它没有出现在 CSS 规范草案中。
            限制在一个块元素显示的文本的行数
        </div>
    </div>
</div>
<!-- 特殊卡片 -->
<div class="card img-card">
    <div class="card-header">
        <div class="card-avatar">
            <img src="./image/cardImg.png" alt="">
        </div>
        <div class="card-name">
            CaelumTian
        </div>
        <div class="card-time">
            2016-03-13 星期日
        </div>
    </div>
    <div class="card-content">
        <img src="./image/cardImg.png" alt="">
    </div>
    <div class="card-footer">
        <a href="#" class="link">赞</a>
        <a href="#" class="link">评论</a>
        <a href="#" class="link">分享</a>
    </div>
</div>   
```  
[卡片样式展示](http://t-phantom.github.io/PhantomUI/ui/card.html) 

