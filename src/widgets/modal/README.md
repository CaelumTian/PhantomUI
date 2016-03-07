Modal 组件  
=== 
Modal 属于视图额外内容, 是从App弹出的内容块, 多个Modal类组件同时被呼起时，会按先后顺序被缓存在队列中，前一个modal关闭后，下一个modal才会打开.  
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
