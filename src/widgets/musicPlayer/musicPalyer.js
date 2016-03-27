/**
 * Created by caelumtian on 16/3/27.
 */
(function(global) {
    var MusicPlayer = Class.create(Widget, {
        attrs : {
            text : "",
            lyrics : []
        },
        setup : function() {

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
        lrcRender : function(lyrics) {
            var lyricHTML = "";
            for (var i = 0, len = lyrics.length; i < len; i++) {
                lyricHTML += "<p>" + lyrics[i].text + "</p>";
            }
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
        }
    };
    global.MusicPlayer = MusicPlayer;
})(this);
