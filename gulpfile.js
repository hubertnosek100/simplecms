var gulp = require('gulp'),
    del = require('del'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    batch = require('gulp-batch'),
    watch = require('gulp-watch'),
    concatCss = require('gulp-concat-css'),
    minify = require('gulp-minify');

let cleanCSS = require('gulp-clean-css');

gulp.task('css', function() {
    del(".public/simplecms.css").then(function() {
        gulp.src('./src/style/**/*.css')
            .pipe(concatCss("simplecms.css"))
            .pipe(gulp.dest('./public'))
            .pipe(gulp.dest('./html'));
    });
});

gulp.task('mcss', function() {
    del(".public/simplecms.css").then(function() {
        gulp.src('./src/style/**/*.css')
            .pipe(concatCss("simplecms.css"))
            .pipe(cleanCSS())
            .pipe(gulp.dest('./build'));
    });
});

gulp.task("mjs", function() {
    del(".public/simplecms.js").then(function() {
        gulp.src([
            './src/js/**/*.js'
        ])
            .pipe(concat('simplecms.js'))
            .pipe(minify())
            .pipe(gulp.dest('./build'));
    });
});


gulp.task("js", function() {
    del(".public/simplecms.js").then(function() {
        gulp.src([
            './src/js/**/*.js'
        ])
            .pipe(concat('simplecms.js'))
            .pipe(gulp.dest("./public"))
            .pipe(gulp.dest('./html'));
    });
});

gulp.task('sass-compile', ['css', 'sass']);
gulp.task('sass', function() {
    return gulp.src('./src/style/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/style'));
});


gulp.task('tb', function(done) {
    gulp.start('sass-compile', done);
    setTimeout(function() {
        gulp.src('./public/scss/bundle.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./public/'));

    }, 1000);
});


gulp.task('watch', function() {
    watch('./src/js/**/*.js', batch(function(events, done) {
        gulp.start('js', done);
    }));

    watch('./src/style/**/*.css', batch(function(events, done) {
        gulp.start('css', done);
    }));

    gulp.watch('./src/style/**/*.scss', batch(function(events, done) {
        gulp.start('sass-compile', done);
    }));
});