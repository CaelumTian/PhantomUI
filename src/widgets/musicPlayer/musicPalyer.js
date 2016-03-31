/**
 * Created by caelumtian on 16/3/27.
 */
(function(global) {
    var MusicPlayer = Class.create(Widget, {
        _isUpdate : true,
        _hasLyric : false,
        audio : null,
        $timeStart : null,
        $timeEnd : null,
        $barPlay : null,
        _canPlay : false,
        _containCount : 8,   //最大容量数目
        attrs : {
            lyricHeight : 42,
            lyrics : [],
            parentNode : ".content",
            template :  '<div class="music-box">'
                       +    '<div class="main-box">'
                       +        '<div class="music-info">'
                       +            '<div class="album-img">'
                       +                '<img src="{$album.img}" alt="">'
                       +            '</div>'
                       +            '<div class="album-title">'
                       +                '<h2>{$album.title}</h2>'
                       +                '<p>{$album.author}</p>'
                       +            '</div>'
                       +            '<div class="control-button">'
                       +                '<i class="icon icon-play"></i>'
                       +            '</div>'
                       +        '</div>'
                       +        '<div class="lyric-container"><div class="lyric"><div class="lyric-box">'
                       +            '<div class="lyric-text" id="lyricText"></div>'
                       +        '</div></div></div>'
                       +    '</div>'
                       +    '<div class="music-control">'
                       +        '<div class="music-operate music-list"></div>'
                       +        '<div class="music-operate music-like"><i class="icon icon-heart"></i></div>'
                       +        '<div class="music-progress">'
                       +            '<div class="progress-bar">'
                       +                '<div class="progress-load"></div>'
                       +                '<div class="progress-play"></div>'
                       +            '</div>'
                       +            '<span id="time-start">00:00</span>'
                       +            '<span id="time-end">00:00</span>'
                       +        '</div>'
                       +     '</div>'
                       +    '<div class="music-bg" style="{$album.bg}"></div><div class="music-pannel"></div>'
                       +    '<audio id="h5audio" height="0" width="0" src="{$album.url}" autoplay></audio>',
            album : {
                img : "./yuanliang.jpg",
                title : "原谅",
                author : "张玉华",
                bg : "background-image: url(./yuanliang.jpg)",
                url : "http://ws.stream.qqmusic.qq.com/C100004UopHN3XV5h9.m4a?fromtag=0",
                lrc : "[00:00.00] 作曲 : kiroro\n[00:00.410] 作词 : 徐世珍\n[00:01.230]原谅把你带走的雨天\n[00:05.040]在突然醒来的黑夜\n[00:07.850]发现我终于没有再流泪\n[00:13.140]原谅被你带走的永远\n[00:17.000]时钟就快要走到明天\n[00:20.080]痛会随着时间 好一点\n[00:26.590]那些日子你会不会舍不得\n[00:31.950]思念就像关不紧的门\n[00:35.810]空气里有幸福的灰尘\n[00:38.820]否则为何闭上眼睛的时候 那么疼\n[00:50.000]谁都别说 让我一个人躲一躲\n[00:55.970]你的承诺 我竟没怀疑过\n[01:01.910]反反覆覆 要不是当初的温柔\n[01:10.770]毕竟是我爱的人\n[01:14.790]我能够怪你什么\n[01:21.350]原谅把你带走的雨天\n[01:24.630]在渐渐模糊的窗前\n[01:27.590]每个人最后都要说再见\n[01:32.840]原谅被你带走的永远\n[01:36.490]微笑着容易过一天\n[01:39.670]也许是我已经 老了一点\n[02:10.340]那些日子你会不会舍不得\n[02:16.030]思念就像关不紧的门\n[02:19.740]空气里有幸福的灰尘\n[02:22.870]否则为何闭上眼睛的时候\n[02:30.460]又全都想起了\n[02:34.930]谁都别说 让我一个人躲一躲\n[02:40.760]你的承诺 我竟然没怀疑过\n[02:47.360]反反覆覆 要不是当初深深爱过\n[02:57.580]我试着恨你 却想起你的笑容\n[03:09.040]原谅把你带走的雨天\n[03:12.400]在突然醒来的黑夜\n[03:15.470]发现我终于没有再流泪\n[03:20.470]原谅被你带走的永远\n[03:24.450]时钟就快要走到明天\n[03:26.620]痛会随着时间 好一点\n[03:31.330]原谅把你带走的雨天\n[03:35.450]在渐渐模糊的窗前\n[03:38.400]每个人最后都要说再见\n[03:43.710]原谅被你带走的永远\n[03:47.430]微笑着容易过一天\n[03:50.870]也许是我已经 老了一点\n"
            },
            lyrics : []
        },
        _initTemplate : function() {
            var self = this;
            var template = this.get('template');
            //ajax 查询专辑信息
            this._getMusicInfo();
            // 替换template中的{$className}占位符
            typeof template == 'string' && (template = template.replace(/{\$([^\})]*)}/g, function() {
                return self.get(arguments[1]);
            }));
            this.set("template", template);
        },
        setup : function() {
            this.audio = this.$element.find("#h5audio")[0];
            this.$lastEle = this.$element.find("#lyric-0");
            this.$lyricText = this.$element.find("#lyricText");
            this.$timeStart = this.$element.find("#time-start");
            this.$timeEnd = this.$element.find("#time-end");
            this.$barPlay = this.$element.find(".progress-play").eq(0);

            if(this.get("album.lrc") !== false) {
                this.set("lyrics", Util.parseLyric(this.get("album.lrc")));
                Util.lrcRender(this.$element.find("#lyricText"), this.get("lyrics"));
                this._hasLyric = true;
            }

            this.audio.addEventListener("timeupdate", this.handleTimeUpdate.bind(this), false);
            this.audio.addEventListener("loadedmetadata", this.handleLoadMeta.bind(this), false);
            this.audio.addEventListener("canplay", this.handleCanPlay.bind(this), false);
            this.delegateEvents(document, "click .control-button", this.handlePlay);
            this.delegateEvents(document, "touchstart #lyricText", this.handleTouchStart);
            this.delegateEvents(document, "touchmove #lyricText", this.handleTouchMove);
            this.delegateEvents(document, "touchend #lyricText", this.handleTouchEnd);

            this.render();
        },
        /**
         * ajax获取专辑信息
         * @private
         */
        _getMusicInfo : function() {
            //测试案例
            if(this.get("album")) {
                return;
            }
        },
        handleTouchStart : function(event) {
            clearTimeout(this._interval);
            this._isUpdate = false;
            this._touchStartY = event.targetTouches[0].pageY;
            //按下时, 滚动距离
            this._currDis = parseInt(this.$lyricText.css("transform").split(",")[1]);
            if(!this._currDis) {
                this._currDis = 0
            }
        },
        handleTouchMove : function(event) {
            //移动距离
            var disY = event.targetTouches[0].pageY - this._touchStartY;
            this.$lyricText.css({
                "transform" : "traanslate3d(0px, " + (disY + this._currDis)+ "px, 0px)",
                "transform-origin" : "0px 0px 0px",
                "transition" : "transform 0s"
            })

        },
        handleTouchEnd : function(event) {
            var self = this;
            //移动距离
            var disY = parseInt(this.$lyricText.css("transform").split(",")[1]);
            if(disY > 0) {
                this.$lyricText.css({
                    "transform" : "translate3d(0px, " + 0 + "px, 0px)",
                    "transform-origin" : "0px 0px 0px",
                    "transition" : "transform 0.3s ease-out"
                })
            }
            if(disY < (player.get("lyrics").length - this._containCount) * this.get("lyricHeight") * -1) {
                this.$lyricText.css({
                    "transform" : "translate3d(0px, " + ((player.get("lyrics").length - this._containCount) * this.get("lyricHeight") * -1) + "px, 0px)",
                    "transform-origin" : "0px 0px 0px",
                    "transition" : "transform 0.3s ease-out"
                });
            }
            //延时启动回弹函数
            this._interval = setTimeout(function() {
                self._isUpdate = true;
            }, 1000);
        },
        handlePlay : function(event) {
            var $target = $(event.currentTarget);
            if(this.audio.paused && this._canPlay) {
                this.audio.play();
                $target.find("i").removeClass("icon-play").addClass("icon-pause");
            }else {
                this.audio.pause();
                $target.find("i").removeClass("icon-pause").addClass("icon-play");
            }
        },
        handleCanPlay : function() {
            this._canPlay  = true;
            this.$element.find(".control-button i").removeClass("icon-play").addClass("icon-pause");
        },
        handleLoadMeta : function() {
            //音频信息夹在完毕
            this.$timeEnd.text(Util.parseSec(this.audio.duration));
        },
        handleTimeUpdate : function() {
            var curTime       = (this.audio.currentTime).toFixed(0);
            var curTimeForLrc = (this.audio.currentTime).toFixed(3);
            var playPercent   = 100 * (curTime / this.audio.duration);

            //给控制条用一个

            this.$barPlay.css({
                "transform" : "translate3d(" + playPercent + "%, 0, 0)"
            });

            this.$timeStart.text(Util.parseSec(curTime));

            if(this._hasLyric && this._isUpdate) {
                //获取歌词索引
                var lyricIndex = Util.getCurrentIndex(curTime, this.get("lyrics"));
                var $lyricEle = this.$element.find("#lyric-" + lyricIndex);
                this.$lastEle.removeClass("lyric-active");
                $lyricEle.addClass("lyric-active");
                this.$lastEle = $lyricEle;

                if(lyricIndex >= (player.get("lyrics").length - this._containCount)) {
                    this.$lyricText.css({
                        "transform" : "translate3d(0px, " + ((player.get("lyrics").length - this._containCount) * this.get("lyricHeight") * -1) + "px, 0px)",
                        "transform-origin" : "0px 0px 0px",
                        "transition" : "transform 0.3s ease-out"
                    });
                    return;
                }
                if(curTime >= 0 && lyricIndex > 2) {
                    this.$lyricText.css({
                        "transform" : "translate3d(0px, " + ((lyricIndex - 2) * this.get("lyricHeight") * -1) + "px, 0px)",
                        "transform-origin" : "0px 0px 0px",
                        "transition" : "transform 0.3s ease-out"
                    })
                }
            }
        }
    });
    var Util = {
        /**
         * 解析lrc文件
         * @param text lrc字符串
         * @returns {Array} 返回解析好的数组
         */
        parseLyric : function(text) {
            var lyric = text.split('\n'),
                lrc = [],
                len = lyric.length,
                reg1 = /\[(\d{2}):(\d{2})\.(\d{2,3})]/g,
                reg2 = /\[(\d{2}):(\d{2})\.(\d{2,3})]/;
            for (var i = 0; i < len; i++) {
                var time = lyric[i].match(reg1);
                var lrcText = lyric[i].replace(reg1, '').replace(/^\s+|\s+$/g, '');
                // 排除空行
                if (!lrcText) {
                    continue;
                }
                if (time != null) {
                    var timeLen = time.length;
                    for (var j = 0; j < timeLen; j++) {
                        var oneTime = reg2.exec(time[j]);
                        var lrcTime = (oneTime[1]) * 60 + parseInt(oneTime[2]) + parseInt(oneTime[3]) / ((oneTime[3] + '').length === 2 ? 100 : 1000);
                        //歌词时间, 歌词内容
                        lrc.push({
                            time: lrcTime,
                            text: lrcText
                        });
                    }
                }
            }
            lrc.sort(function (a, b) {
                return a.time - b.time;
            });
            return lrc;
        },
        /**
         * 插入歌词
         * @param element
         * @param lyrics
         */
        lrcRender : function(ele, lyrics) {
            var lyricHTML = "";
            for (var i = 0, len = lyrics.length; i < len; i++) {
                lyricHTML += "<p id='lyric-" + i + "'>" + lyrics[i].text + "</p>";
            }
            ele.html(lyricHTML);
        },
        getCurrentIndex : function(time, lyrics) {
            if(time < lyrics[0].time) {
                return 0;
            }
            for(var i = 0, len = lyrics.length; i < len; i++) {
                if (time >= lyrics[i].time && (!(lyrics[i + 1]) || time <= lyrics[i + 1].time)) {
                    break;
                }
            }
            return i;
        },
        parseSec : function(sec) {
            var tempMin = Math.floor((sec / 60)).toFixed(0);
            var tempSec = (sec % 60).toFixed(0);
            var curMin  = tempMin < 10 ? ('0' + tempMin) : tempMin;
            var curSec  = tempSec < 10 ? ('0' + tempSec) : tempSec;
            return curMin + ':' + curSec;
        }
    };
    global.MusicPlayer = MusicPlayer;
})(this);
