Modal 组件  
=== 
[查看 DEMO](http://t-phantom.github.io/PhantomUI/modal/)  

Modal 组件继承自`Widget`基类 属于视图额外内容, 是从App弹出的内容块, 多个Modal类组件同时被呼起时，会按先后顺序被缓存在队列中，前一个modal关闭后，下一个modal才会打开.  
## 一丶使用方法: 
Modal 组件提供多个框组:`Aler`, `Confirm`, `Prompt`等内容, 对应提供不同的回调函数, 基本使用如下
```javascript
var alert = new Modal({
    "text" : "这是一个alert框",
    "callbackOk" : function() {
        console.log(this + "被关闭了")
    }
})
```     

## 二丶通用配置:  
```javascript
 attrs : {
    type : "alert",                       //modal类型
    classNames : {
        "appear" : "ph-modal-in",         //modal现实
        "none" : "ph-modal-out",          //modal隐藏
        "container" : "ph-modal",         //modal容器
        "inner" : "ph-modal-inner",       //modal内部
        "title" : "ph-modal-title",       //modal标题[可选]
        "text" : "ph-modal-text",         //modal文本[可选]
        "buttons" : "ph-modal-buttons",   //modal按钮组
        "buttonConfirm" : "ph-modal-button ph-confirm",             //modal确认按钮
        "buttonCancel" : "ph-modal-button ph-modal-line ph-cancel"  //modal取消按钮
    },
    callbackOk : null,
    callbackCancel : null,
    containerClass : "page-panel",
    title : "",
    text : "欢迎使用PhantomUI",
    confirmText : "确认",
    cancelText : "取消",
    cancel : "",
    template :   '<div class="{$classNames.container}">'
                +   '<div class="{$classNames.inner}">'
                +       '<div class="{$classNames.title}">{$title}</div>'
                +       '<div class="{$classNames.text}">{$text}</div>'
                +   '</div>'
                +   '<div class="{$classNames.buttons}">'
                +       '{$cancel}' + '<span class="{$classNames.buttonConfirm}">{$confirmText}</span>'
                +   '</div>'
                +'</div>'
 }
```  
以上配置项均可以在实例化组件的时候传入指定参数替代  

## Pannel 组件  
该组件依赖于Modal组件, 弹出一个遮罩层Pannel, 同时承载Modal实例, 提供样式; 该组件为单例模式, 会自动渲染到DOM中, 建议不要单独使用(利用Widget.query查找). 
### show() 方法 
描述: 显示pannel遮罩层  
### hide() 方法  
描述: 隐藏pannel遮罩层  

## Alert 组件  
Modal组件默认类型, type="alert"  
`text` string. Alert文本  
`title`  string Alert modal 标题
`callbackOk`  function. 在Alert modal下，当用户点击“Ok”按钮时，回调函数将被执行.(不需要手动关闭modal)    

## Confirm组件  
Modal组件可选类型, type="confirm", confirm modal 经常在需要确认一些行为时被使用  
`text` [String] Confirm文本  
`title`  [String] Confirm modal 标题
`callbackOk`  [Function] 在Confirm modal下，当用户点击"取消"按钮时，回调函数将被执行.(不需要手动关闭modal)    
`callbackCancel` [Function] 在Confirm modal下, 当用户点击"取消"按钮时, 回调函数将会被执行  

## Prompt组件  
Modal组件可选类型, type="prompt", prompt modal 经常在需要从用户那里得到一些数据/答案时使用  
`text` [String] Prompt文本  
`title`  [String] Prompt modal 标题
`callbackOk`  [Function] 在Prompt modal下，当用户点击"取消"按钮时，回调函数将被执行.(不需要手动关闭modal) 回调函数的参数是输入框的值   
`callbackCancel` [Function] 在Prompt modal下, 当用户点击"取消"按钮时, 回调函数将会被执行,回调函数的参数是输入框的值  








