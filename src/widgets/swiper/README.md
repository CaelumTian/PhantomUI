Swiper 幻灯片组件  
===   
[使用DEMO](t-phantom.github.io/PhantomUI/swiper)  
幻灯片组件，提供基础的图片轮播效果，手势滑动。    

## 一丶基本使用  
轮播组件HTML采用flex布局，轮播内容包裹在section标签中
```html
<div class="swiper-wrap">
    <div class="swiper-container">
        <section>
            <img src="./swiper1.jpg" alt="">
        </section>
        <section>
            <img src="./swiper2.jpg" alt="">
        </section>
        <section>
            <img src="./swiper3.jpg" alt="">
        </section>
        <section>
            <img src="./swiper4.jpg" alt="">
        </section>
    </div>
</div>
```  
## 二丶可选参数  
```javascript
attrs : {
    limitDistance : 50,     //拉动阀值
    animationTime : 500,    //切换时间
    easing : "ease",        //切换动画
    pagination : true,      //是否显示导航
    direction : "horizon",  //默认方向水平
    loop : true,            //是否允许循环(定时采用)
    callbackStart : null,   //轮播启动前，调用函数
    callbackEnd : null      //轮播结束时，调用函数
}
```  
`limitDistance` 触发滚动的最大限度，当拖动距离大于该距离时，将滑动至下一页。  
`direction` 滑动方向，'vertical'垂直方向 'horizon' 水平方向。  
`loop` 当滚动到头时候，是否回到最初值。(在定时调用滚动的时候设置，默认true)    
支持事件如下：    

|事件类型      |触发说明       |
|:------------:|:-------------:|
|swiperStart   |滚动开始时触发 |
|swiperStop    |滚动结束时触发 |

## 三丶调用函数  
### swiper.turnNext()  
使轮播立刻滚到下一页  
### swiper.turnPre()  
使轮播立刻滚到上一页  

## 四丶待更新内容  
1. 可以用swiper和tab结合，提供tab另一种切换效果  
2. `pagination` 导航布局是否需要调整，待考虑  

