var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    autoprefixer= require('gulp-autoprefixer'),
    cleancss     = require('gulp-clean-css'),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload,
    imagemin    = require('gulp-imagemin'),
    concat      = require('gulp-concat'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    del         = require('del');



// HTML
// Compile Pug HTML

gulp.task('html:watch', function() {
  gulp.src('assets/*.html')
    .pipe(gulp.dest('build/'))
    .pipe(reload({stream: true}))
});


gulp.task('html:build', function() {
  gulp.src('assets/*.html')
    .pipe(gulp.dest('build/'));
});



// CSS
// Compile SASS

gulp.task('sass:watch', function () {
  gulp.src(['assets/styles/**/*.scss','!assets/styles/vendor/**/*'])
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer(
        {
            browsers: ['last 15 versions'],
            cascade: true
        }
        ))
    .pipe(gulp.dest('build/css'))
	.pipe(browserSync.stream());
});
 
gulp.task('sass:build', function () {
  gulp.src(['assets/styles/**/*.scss','!assets/styles/vendor/**/*'])
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer(
        {
            browsers: ['last 15 versions'],
            cascade: true
        }
        ))
    .pipe(cleancss({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
    .pipe(gulp.dest('build/css'));
});




// JavaScript
// Concat, rename and uglify all JS

/* copy vendor JS,
 * but concat and uglify the rest
 */
var jsFiles = [
  'assets/js/**/*.js',
  'assets/js/main.js',
  '!assets/js/vendor/**/*'
];

gulp.task('js:watch', function() {
  gulp.src(jsFiles)
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream());
  gulp.src('assets/js/vendor/**/*')
    .pipe(gulp.dest('build/js/vendor'));
});

gulp.task('js:build', function() {
  gulp.src(jsFiles)
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
  gulp.src('assets/js/vendor/**/*')
    .pipe(gulp.dest('build/js/vendor'));
});



// Copy non-SVG images
// Copy non-SVG image files to /build

gulp.task('copy-non-svg', function() {
  gulp.src('assets/images/raster/**/*')
    .pipe(gulp.dest('build/images/raster'));
});



// Imagemin
// Process only SVG images

gulp.task('imagemin', function() {
  gulp.src('assets/images/vector/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/images/vector'))
    .pipe(browserSync.stream());
});



// Copy fonts

gulp.task('copy-fonts', function() {
  gulp.src('assets/fonts/**/*')
    .pipe(gulp.dest('build/fonts/'))
});



// Browser Sync
// Reload on file changes in /build

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./build/"
    }
  });
});




// Watch
// Watch HTML and CSS compilation changes

gulp.task('watch-tasks', function() {
  gulp.watch('assets/*.html', ['html:watch']);
  gulp.watch('assets/styles/**/*.scss', ['sass:watch']);
  gulp.watch('assets/js/**/*.js', ['js:watch']);
  gulp.watch('assets/images/vector/**/*', ['imagemin']);
  gulp.watch('assets/images/raster/**/*', ['copy-non-svg']);
});



// Clean 
// Clean 'build' folder

gulp.task('clean-build', function() {
  console.log('Cleaning build folder');
  return del('build/');
});



// Run Tasks

gulp.task('watch', ['html:watch', 'sass:watch', 'js:watch', 'copy-non-svg', 'imagemin', 'copy-fonts', 'browser-sync', 'watch-tasks']);
gulp.task('build', ['html:build', 'sass:build', 'js:build', 'copy-non-svg', 'imagemin', 'copy-fonts']);
gulp.task('clean', ['clean-build']);