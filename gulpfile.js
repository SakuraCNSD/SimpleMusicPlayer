const { series, src, dest, watch } = require("gulp");
const htmlClean = require("gulp-htmlclean"); //该插件用于压缩html文件
const less = require("gulp-less"); //该插件用于将less文件装换成css文件
const cleanCss = require("gulp-clean-css"); //该插件用于压缩css文件
const stripDebug = require("gulp-strip-debug"); //该插件用于清除js文件中的调试语句,例如：console.log()、debugger等
const uglify = require("gulp-uglify"); //该插件用于压缩js文件
const imageMin = require("gulp-imagemin"); //该插件用于压缩图片
const connect = require("gulp-connect"); //该插件用于开启一个服务器
const folder = {
    src: "src/",
    dist: "dist/"
}
//处理html任务，只需要压缩html文件
function html() {
    return src(folder.src + "html/*")
        .pipe(htmlClean())
        .pipe(dest(folder.dist + "html/"))
        .pipe(connect.reload()); //只用watch监听css、js和html没办法达到热更新,每次修改完文件都需要刷新页面才会显示修改之后的效果,如果想不手动更新需要添加上connect.reload(),该方法就是让页面重新加载
}
//处理css任务，需要将less文件装换成css文件，再将css文件进行压缩
function css() {
    return src(folder.src + "css/*")
        .pipe(less())
        .pipe(cleanCss())
        .pipe(dest(folder.dist + "css/"))
        .pipe(connect.reload());
}
//处理js任务，需要将js文件中的调试语句去掉，然后再压缩
function js() {
    return src(folder.src + "js/*")
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(dest(folder.dist + "js/"))
        .pipe(connect.reload());
}
//处理图片任务，只需要将图片进行压缩
function image() {
    return src(folder.src + "image/*")
        .pipe(imageMin())
        .pipe(dest(folder.dist + "image/"));
}
//开启服务器的任务
function server(cb) {
    connect.server({
        port: "1573",
        livereload: true //开启自动刷新
    });
    cb();
}
//开启监听任务
watch(folder.src + "html/*", function (cb) {
    html();
    cb();
});
watch(folder.src + "css/*", function (cb) {
    css();
    cb();
});
watch(folder.src + "js/*", function (cb) {
    js();
    cb();
});
exports.default = series(html, css, js, image, server);