let del = require("del");
let scss = require ('gulp-sass') (require ('sass'));
let clean_css = require("gulp-clean-css");
let rename = require("gulp-rename");
let ts = require("gulp-typescript");
let { src, dest } = require('gulp');
let gulp = require('gulp');
let browsersync = require("browser-sync").create();
let fileinclude = require("gulp-file-include");
const { timeStamp } = require("console");

let project = "dist";
let source = "src";

let path = {
    build: {
        html: project + "/",
        css: project + "/style/css/",
        js: project + "/script/",
    },
    src: {
        html: source + "/*.html",
        css: source + "/style/scss/bank_style.scss",
        ts: source + "/script/*.ts",
    },
    watch: {
        html: source + "/",
        css: source + "/style/scss/bank_style.scss",
        ts: source + "/script/*.ts",
    },
    clean: "./" + project + "/"
};

function browerSync(params){
    browsersync.init({
        server: {
            baseDir: "./" + project + "/"
        },
        port: 3000,
        notify: true,
    });
}

function html(done){
    src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());

    done();
}

function css(done){
    src(path.src.css)
    .pipe(
        scss({
            outputStyle: "expanded"
        })
    )
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
        rename({
            extname: ".min.css"
        })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());

    done();
}

function js(done){
    src(path.src.ts)
    .pipe(ts({
        noImplicitAny: true,
        target: "es6",
    }))
    .pipe(rename({extname: ".min.js"}))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());

    done();
}

function watchFiles(done){
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.ts], js);

    done();
}

function clean(params){
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html));
let watch = gulp.parallel(build, watchFiles, browerSync);

gulp.task("ts", js);

//exports.ts = ts;
exports.scss = scss;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
