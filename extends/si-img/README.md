si-img 图片优化组件  
===   
![](https://travis-ci.org/T-phantom/si-img.svg?branch=master)  ![](https://img.shields.io/badge/npm-v1.0.0-blue.svg)  
图片优化组件: 包括图片大小检测，webp格式适配，图片惰性加载，缓存等功能；  
主要面向移动端，PC端不支持IE8及以下.    

## 图片惰性加载：  
实例化  
```javascript  
SI.img({
    lazyWidth: 0,     //预加载当前屏幕以右边lazyWidth内的图片，默认0
    lazyHeight: 0,    //预加载当前屏幕以下lazyHeight内的图片，默认0
    realSrc: "data-src",  //图片路径放置属性
    class: "img-load",    //惰性加载的图片必须的类名
    cachePrefix: "img_cache_url_",    //图片缓存前缀  
    cachePoolName: "img_cache_pool",  //图片缓存池名
    cachePoolLength: 50,              //图片缓存池长度
    wait: 100,                        //节流函数等待时间(谨慎修改)
    fadeIn: null                      //图片显示后调用的函数
})
``` 
为需要惰性加载的图片添加`img-load`类名，将图片路径写在`data-src`中
```html
<img data-src="http://..." class="img-load">
``` 
### 使用图片缓存  
将需要缓存的图片加上 `data-cache=1`的属性  
```javascript  
<img data-cache=1 data-src="http://....." class="img-load">
```
该组件支持将图片信息以base64格式存在`localStorage`中, 注意缓存的图片被自动打上 `crossOrigin="anonymous" `属性
（如果您的开启图片共享有可能存在安全问题，不建议开启）。  
`注意`: 缓存图片的数量默认为50，请保证你缓存的图片总大小不会超过 `localStorage`容量上限    

### 支持背景图片的惰性加载和缓存    
当为不是`<img>`的标签添加`img-load`属性时，会以背景图片的形式，应用缓存和惰性加载 
```javascript  
<div data-src="http://....." class="img-load">...</div>
```  

## ChangeLog  
### 1.0.0  
1. 完成组件的基本架构  
2. 完成图片惰性加载功能  
3. 完成图片base64缓存功能  

## 待更新问题  
1. 添加设备环境检测，以此来判断是否需要开启惰性加载和缓存  
2. webp格式支持检测  
3. 图片统一检测，优化  
4. 动态载入图片等  

## 图片组件的前世今生  
~~在大一的时候，刚接触前端，因为项目原因和练手目的写了一个图片惰性加载的jquery插件，虽然勉强能用呢，但是...~~   
~~如今再次写图片组件的时候，感觉视野开阔了，需要注意的东西也多了哈哈。原来的代码留在old文件夹，以供怀念吧。~~

  



