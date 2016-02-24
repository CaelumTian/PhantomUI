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










