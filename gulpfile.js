var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var livereload = require('gulp-livereload');
var gulpif = require('gulp-if');
var changed = require('gulp-changed');
var jshint = require('gulp-jshint');
var twig = require('./tools/gulpTwig');
var functionalTestWriter = require('./tools/gulpFunctionalTestWriter');
var series = require('./tools/gulpSeries');
var argv = require('yargs').argv;

var buildType = 'dev';
if (argv.dist) buildType = 'dist'

var sourcePaths = {
  dev: {
    js: [
      'src/js/main.js',
      'temp/series.js',
      'src/js/extend.js',
      'src/js/getScreen.js',
      'src/screen/screen.js',
      'src/screen/slide/slide.js',
      'src/screen/slide/feedback.js',
      'src/transition/transition.js',
      'src/**/*.js',
      'tools/livereload.js'
    ],
    episodes: ['data/**/slides.json'],
    lint: ['src/**/*.js', 'test/**/*.js'],
    mainless: ['src/less/main.less'],
    less: ['src/less/**/*.less'],
    twig: ['src/twig/**/*.twig', '!src/twig/include/**/*'],
    copy: ['data/**/*'],
    test: {
      functional: ['test/functional/**/*.js'],
      resources: ['test/**/*', '!test/**/*.js']
    }
  },
  dist: {
    js: [
      'src/js/main.js',
      'temp/series.js',
      'src/js/extend.js',
      'src/js/getScreen.js',
      'src/screen/screen.js',
      'src/screen/slide/slide.js',
      'src/screen/slide/feedback.js',
      'src/transition/transition.js',
      'src/**/*.js'
    ],
    episodes: ['data/**/slides.json'],
    mainless: ['src/less/main.less'],
    less: ['src/less/**/*.less'],
    twig: ['src/twig/**/*.twig', '!src/twig/include/**/*'],
    copy: ['data/**/*']
  }
};

var targetPaths = {
  dev: 'dev',
  dist: 'dist'
};

gulp.task('copy', function() {
  return gulp.src(sourcePaths[buildType].copy)
  .pipe(gulp.dest(targetPaths[buildType]));
});

gulp.task('series', function() {
  return gulp.src(sourcePaths[buildType].episodes)
  .pipe(series())
  .pipe(gulp.dest('temp'));
});

gulp.task('js', ['series'], function() {
  return gulp.src(sourcePaths[buildType].js)
  .pipe(concat('min.js'))
  .pipe(gulpif(buildType === 'dist', uglify()))
  .pipe(gulp.dest('temp'));
});

gulp.task('less', function() {
  return gulp.src(sourcePaths[buildType].mainless)
  .pipe(gulpif(buildType === 'dist', less({paths: [path.join(__dirname, 'src', 'less')], compress: true})))
  .pipe(gulpif(buildType === 'dev', less({paths: [path.join(__dirname, 'src', 'less')], compress: false})))
  .pipe(concat('min.css'))
  .pipe(gulp.dest('temp'));
});

gulp.task('twig', ['js', 'less'], function() {
  return gulp.src(sourcePaths[buildType].twig)
  .pipe(twig())
  .pipe(gulpif(buildType === 'dist', minifyHTML({})))
  .pipe(gulp.dest(targetPaths[buildType]))
});

gulp.task('test', ['testToTwig', 'copyTestResources'], function(){
  if (buildType !== 'dev') return

  return gulp.src('temp/test/functional/**/*.twig')
  .pipe(twig())
  .pipe(gulp.dest(targetPaths[buildType] +'/test/functional'))
});

gulp.task('copyTestResources', function(){
  if (buildType !== 'dev') return

  return gulp.src(sourcePaths[buildType].test.resources)
  .pipe(gulp.dest(targetPaths[buildType] +'/test'))
});

gulp.task('testToTwig', ['js', 'less'], function(cb){
  if (buildType !== 'dev') {
    cb();
    return;
  }

  gulp.src(sourcePaths[buildType].test.functional)
  .pipe(functionalTestWriter())
  .pipe(gulp.dest('temp/test/functional'))
  .on('end', function (){cb()});
});

gulp.task('lint', function(){

  var jshintOptions = {
    asi: true,
    camelcase: true,
    maxlen: 120,
    indent: 2,
    quotmark: 'single',
    maxstatements: 14,
    maxdepth: 3,
    maxparams: 4,
    maxcomplexity: 10,
    unused: 'vars',
    trailing: true
  };

  return gulp.src(sourcePaths[buildType].lint)
    .pipe(changed('.'))                //process only changed files
    .pipe(jshint(jshintOptions))       //lint
    .pipe(jshint.reporter('default', {verbose: true}))  //report linting errors to the console
});

gulp.task('dev-server', function(){
  require('./tools/devserver');
});

gulp.task('main', ['copy', 'twig']);

// Rerun the task when a file changes
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(['test/**/*'], ['lint', 'test']);
  gulp.watch(['src/**/*'], ['twig', 'lint', 'test']);
  gulp.watch(sourcePaths.dev.copy, ['copy', 'twig']);
  gulp.watch('dev/**/*.html').on('change', function(){setTimeout(livereload.changed, 150)});
});

// The default task (called when you run `gulp` from cli)
if (buildType === 'dist'){
  gulp.task('default', ['main']);
} else {
  gulp.task('default', ['watch', 'dev-server', 'main', 'lint', 'test']);
}

