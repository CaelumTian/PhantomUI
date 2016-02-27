# Class  

---  
提供简单的OO原型继承   

---  
## 使用说明：  
### 1. 创建类： 
通过`Class.create([properties])`创建类，`properties`为属性对象;   
>  `init` 初始化方法，会在创建实例是被调用  
>  `statics` 类的静态方法，ClassName.fn()

例子：  
```javascript  
var Person = Class.create({
    init : function(name, age) {
        this.name = name;
        this.age = age;
    },
    statics : {
        "name" : "PERSON",
        "type" : "CLASS"
    }
})
var per = new Person("phantom", 1);
```  
### 2. 继承类  
使用`Class.create(superClass, properties)` 继承父类`superClass`  
> this._super 保存有父类属性，可以用于子类中调用父类方法  

```javascript  
var Teacher = Class.create(Person, {
    init : function(name, age, school) {
        this._super.init.call(this, name, age);  //调用父类init
        this.school = school;
    },
    teach : function() {
        console.log(this.name + "上课呢");
    }
})
var te = new Teacher("cjk", 30, 't_hot');
```  
`ClassName.prototype._super`上保持对父类原型的引用，所以可以利用这个访问父类方法，但是注意有this的要保证this指向。  
这里的this._super.fn.call(this, [...]) 似乎有点麻烦，下面提供一个改进方法。   
```javascript 
/*
 * 参考simple-inherittance
 * 利用fnText检测函数中是否含有_super，来判断是否需要临时改变this._super值重写方法。
 */
 var fnText = /xyz/.text(function() {
    xyz;
 }) ? /\b_super\b/ : /.*/ 
 for(var name in definition) {
    _Object.prototype[name] = typeof definition[name] === 'function' && typeof _super[fn] === 'function' && fnText.test(definition[name]) ?
    (function(name, fn) {
        return function() {
            var tmp = this._super;
            this._super = _super[name];
            var ret = fn.apply(this, arguments);
            this._super = tmp;
            return ret;
        }
    })(name, definition[fn])
 }
```   
# Base 

---  
基础类之一， 提供 event: 事件发布订阅功能

---  
## 使用说明：  
### Event  

---  
> 提供自定义事件 发布 订阅 移除 功能    

例子：
```javascript
var SaleOffice = Class.create(Base, {
    init : function() {
        this.on("home", function(event) {
            console.log(event.type + "事件触发");
            console.log("出售房子");
        })
    },
    sale : function() {
        this.trigger("home");
    },
    destruct : function() {
        this.off("home");
    }
});
var sipc = new SaleOffice();
wanda.on("change", function(event) {
    event.stopPropagation();
    console.log("这个事件不会传递");
});
wanda.trigger("change");
```   
#### 订阅事件 Function on(eventType, callback, [context])  
给对象订阅事件  
`eventType` : 事件名称(多个事件类型， 空格隔开)  
`callback` : 回调函数  
`context` : 回调函数this指向， 默认值事件绑定对象。   

```javascript
sipc.on("change", changeHandler);
sipc.on("change submit", dataHandler);
```  

#### 移除事件 Function off(eventType, [callback])  
给对象移除订阅的事件  
`eventType` : 事件名称  
`callback` : 移除的事件下绑定的函数  
```javascript 
sipc.off();    //移除sipc上所有订阅事件  
sipc.off("change")   //移除sipc上change事件  
sipc.off("change" changeHandler) //移除sipc上change事件的名为changeHandler的函数  
```  

#### 发布事件 Function trigger(eventType, [Array args])   
触发一个或多个事件，触发顺序为注册顺序
`eventType` : 事件名称  
`args` : 传给回调函数的额外参数  
```javascript
sipc.trigger("change", [arg1, arg2]);
sipc.trigger("change submit");
```  

#### event 事件对象 
触发事件是，会将event对象作为第一个参数传入回掉函数，event对象来自 `Event`类  
对象属性：   
`event.target` : 触发事件的对象   
`event.type` : 触发的事件名称    
`event.stopPropagation()` : 终止事件传递下去   
不太完善总觉得......     

# Attribute  

----  
提供基本属性添加，获取，修改  
## 属性初始化  
#### 定义类的时候通过attrs属性设置，注意：`init`函数中一定要调用 `_initAttrs` 方法。 
可选属性如下：  
`value` : 初始化值  
`getter` : getter魔术方法  
`setter` : setter魔术方法 
`attrMerge` : 是否继承父类该属性。

```javascript
var Widget = Class.create(Base, {
    attrs : {
        template : '<div></div>',  //省略参数，直接定义
        className : 'span-12',
        ownerNode : {              //第二种定义方式
            value : {
                "parent" : "body",
                "time" : "2016"
            }，
            setter : function(){...}，
            getter : function(){...}
        }
    }
});
```  
## 基本方法： 
### function set(key, value, option);  
设置某个属性的值，如果该属性设置 setter 函数，则调用setter函数
`key` : 键名  
`value` : 键值  
`option` : 额外参数 
`option.event` : 决定是否触发 "change:key" 事件，默认 false  
`option.merge` : 决定属性是覆盖还是继承, 默认false  
`option.data` : 传递给setter函数和事件函数的额外参数  
return : 返回true表示成功，返回`CONST_ATTR_ERROR`表示设置属性失败。  

```javascript
//具体设置单一属性
dia.set("status", "close", {event : true, merge : false}); 
//设置一组属性 
dia.set({
    name : "dia",
    status : "open"
})
//设置子属性 
dia.set("status.time", new Date()); 
```  

### setter函数使用  
属性若有定义setter，则在设置属性时，会调用setter，再将属性值设为它的返回值。  
#### function setter(value, name, data);  
`value` : 要设置成的值  
`name` : 要设置的属性名  
`data` : 额外参数即 option.data 
return : 返回值，若设置合理，则返回值为最终属性值。设置不合理，请返回`CONST_ATTR_ERROR` 表示设置失败。  

```javascript 
var Dialog = Class.create("Widget", {
    attrs : {
        uuid : {
            value : +new Data(),
            setter : function(value) {
                if(typeof value !== "number") {
                    return CONST_ATTR_ERROR;
                }else {
                    return value;
                }
            }
        }
    }
})
``` 
### function get(key)  
根据属性明，获取对应的属性, 若有getter函数，优先调用getter  
```javascript
dia.get();   //获取所有属性 
dia.get("status");  //获取指定属性
dia.get("status.time"); //获取子属性
```   
### getter函数使用  
属性若有定义getter，则会在调用对象调用get()时触发，并返回getter()返回的值  
#### function getter(value, name)  
```javascript
var Dialog = Class.create("Widget", {
    attrs : {
        uuid : {
            value : +new Data(),
            getter : function(value, name) {
                return "当前状态为：" + value;
            }
        }
    }
})
```     
### change事件  
当通过set()改变属性值时，会触发change:attrName事件。 因此可通过 this.on('change:attrName', function(ev, val, prev, data) { /* ... */ })来监听属性更改。










