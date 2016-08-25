"use strict";
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function Promise(callback) {
    this.status = PENDING;
    this.value = null;
    this.defferd = [];
    //系一个队列执行，将this.resolve替换成callback中的resolve
    setTimeout(callback.bind(this, this.resolve.bind(this), this.reject.bind(this)), 0);
}
Promise.prototype = {
    constructor: Promise,
    resolve: function(result) {
        this.status = FULFILLED;
        this.value = result;
        this.done();
    },
    reject: function(error) {
        this.status = REJECTED;
        this.value = error;
        this.done();
    },
    handle: function(fn) {
        if(!fn) {
            return;
        }
        var value = this.value;
        var p;
        if(this.status === PENDING) {
            this.defferd = fn;
        }else {
            if(this.status === FULFILLED && typeof fn.onfulfiled === "function") {
                p = fn.onrejected(value);
            }
            var promise = fn.promise;
            if(promise) {
                if(p && p.constructor === Promise) {
                    p.defferd = promise.defferd;
                }else {
                    p = this;
                    p.defferd = promise.defferd;
                    this.done();
                }
            }
        }
    },
    done: function() {
        var status = this.status;
        var defferd = this.defferd;
        if(status === PENDING) {
            return;
        }
        for(var i = 0; i < defferd.length; i++) {
            this.handle(defferd[i]);
        }
    },
    then: function() {
        var o = {
            onfulfiled: success,
            onrejected: fail
        }
        var status = this.status;
        o.promise = new this.constructor(function() {
            if(status === PENDING) {
                this.defferd.push(o);
            }else if(status === FULFILLED || status === REJECTED) {
                this.handle(0);
            }
            return o.promise;
        })
    }
}