var gulp = require('gulp'),
pug = require('gulp-pug'),
watch = require('gulp-watch'),
pug_plugin_ng = require('pug-plugin-ng'),
notify = require("gulp-notify"),
plumber = require('gulp-plumber'),
gutil = require('gulp-util'),


paths = {
  pug: ['./src/**/*.pug', './src/**/**/*.pug', './src/**/**/**/*.pug', './src/**/**/**/**/*.pug']
};

gulp.task('pug', function buildHTML() {
  gulp.src(paths.pug)
  .pipe(plumber({ errorHandler: function(err) {
      //this pipe will handle errors on any other pipes inside of gulp pug, 
      //it will log the error on terminal and play a sound, 
      //but it will prevent the app from crashing on error.
          notify.onError({
              title: "Gulp error in " + err.plugin,
              message:  err.toString()
          })(err);
          gutil.beep(2);
      }}))
  .pipe(pug({
    doctype: 'html',
    plugins: [pug_plugin_ng],
    pretty: true
  }))
  .pipe(gulp.dest("./src/"))
});

gulp.task('watch', function() {
  gulp.watch(paths.pug, ['pug']);
});


gulp.task('default', ['pug', 'watch']);
