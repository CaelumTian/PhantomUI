/**
 * Created by caelumtian on 16/3/4.
 */
var gulp = require("gulp"),
    gulpLoadPlugins = require('gulp-load-plugins'),
    Browsersync = require('browser-sync').create(),
    reload = Browsersync.reload;
const $ =  gulpLoadPlugins();
gulp.task('server', function() {
    Browsersync.init({
        server: {
            baseDir: "./test/"
        }
    });
    //gulp.watch("./lib/styles/less/*.less", ['less']);
    gulp.watch("*.html").on("change", reload);
});
