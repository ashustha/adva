const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');

// task for including files using gulp-file-include
gulp.task('fileinclude', function() {
  return gulp.src(['src/*.html'])
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('dist/'));
});

// task for minifying HTML using gulp-htmlmin
gulp.task('htmlmin', function() {
  return gulp.src('dist/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.stream());
});

// task for compiling SCSS to CSS
gulp.task('sass', function() {
  return gulp.src('src/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

// task for watching changes and reloading the browser
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });

  gulp.watch('src/**/*.html', gulp.series('fileinclude', 'htmlmin'));
  gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('src/js/**/*.js', gulp.series('uglify'));
  gulp.watch('src/fonts/**/*', gulp.series('copyFonts'));
  gulp.watch('src/img/**/*', gulp.series('copyImages'));
});

// task for minifying JS using gulp-uglify
gulp.task('uglify', function() {
  return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

// task for copying fonts to dist/fonts
gulp.task('copyFonts', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.stream());
});

// task for copying images to dist/img
gulp.task('copyImages', function() {
  return gulp.src('src/img/**/*')
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());
});

// default task
gulp.task('default', gulp.series('fileinclude', 'htmlmin', 'sass', 'uglify', 'copyFonts', 'copyImages', 'serve'));
