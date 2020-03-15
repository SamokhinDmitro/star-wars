var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concatCss = require('gulp-concat-css'),
    gutil = require('gulp-util'),
    ftp = require( 'vinyl-ftp' ),
    cache = require('gulp-cache'),
    cssmin = require('gulp-cssmin'),
    minify = require('gulp-minify'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    imgCompress  = require('imagemin-jpeg-recompress'),
    connect = require('gulp-connect');

gulp.task('connect', function() {
    connect.server({
        host: 'localhost',
        root: 'src/',
        livereload: true,
        port: 3000
    });
});

/*ClearCache*/
gulp.task('clearCache', function() {
    // Or, just call this for everything
    cache.clearAll();
});



// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {
    gulp.watch("src/sass/*.sass", ['sass']);/*.on('change', livereload.changed);*/
    gulp.watch("src/*.html"); /*.on('change', livereload.changed);*/
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/sass/*.sass")
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            /* browsers: ['last 2 versions'],*/
            cascade: false
        }))
        .pipe(concatCss("style.css"))
        .pipe(gulp.dest("src/css"))
        .pipe(connect.reload());
});

//Min Img

gulp.task('img', function(){
    return gulp.src('src/img/**')
        .pipe(imagemin([
            imgCompress({
                loops: 4,
                min: 60,
                max: 85,
                quality: 'high'
            }),
            imagemin.gifsicle(),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo(),
            pngquant(),
        ], {verbose: true}))
        .pipe(gulp.dest('dist/img'))
});


//Min css
gulp.task('mincss', function() {
    return gulp.src("src/css/*.css")
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest("dist/css/"))
        .pipe(connect.reload());
});



//Min js
gulp.task('compress', function() {
    gulp.src('src/js/*.js')
        .pipe(minify({
            ext:{
                src:'-deb.js',
                min:'.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('dist/js/'))
});


/*
ftp vinyl-ftp
 */

gulp.task( 'ftp', function () {

    var conn = ftp.create( {
        host:     'mysite.zzz.com.ua',
        user:     'user',
        password: '****',
        parallel: 10,
        /*port: 21,*/
        log:      gutil.log
    } );

    var globs = [
        //'dist/**'
        'src/**'
    ];

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src( globs, {buffer: false } )

        .pipe( conn.dest('/mysite.zzz.com.ua/' ) );

} );

gulp.task('default', ['serve', 'connect']);
