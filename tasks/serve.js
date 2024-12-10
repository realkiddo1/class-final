import browserSync from 'browser-sync';
import gulp from 'gulp';

// BrowserSync Reload
function browserSyncReload(done) {
  browserSync.reload();
  done();
}

// Serve Task
function serve() {
  browserSync.init({
    notify: false,
    server: 'docs', // Serve files from the `docs` folder
    port: 3000,
  });

  gulp.watch(
    ['src/**/*.html', 'src/**/*.njk', 'src/**/*.json', 'src/_data/**/*.json'],
    gulp.series('nunjucks', browserSyncReload)
  );
  gulp.watch(['src/scss/**/*.scss'], gulp.series('styles', browserSyncReload));
  gulp.watch(['src/js/**/*.js'], gulp.series('scripts', browserSyncReload));
  gulp.watch(['src/img/**/*'], gulp.series('images', browserSyncReload));
}

gulp.task('serve', serve);

export default serve;
