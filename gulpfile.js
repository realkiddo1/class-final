import gulp from 'gulp';
import nunjucksRender from 'gulp-nunjucks-render';
import plumber from 'gulp-plumber';
import browserSync from 'browser-sync';
import slugify from 'slugify';
import rename from 'gulp-rename';
import path from 'path';  // Path module to resolve paths
import data from './src/_data/googleSheetData.json' assert { type: 'json' };

// Paths configuration
const paths = {
  templates: 'src/_templates/**/*.njk', // Update this to _templates folder
  output: 'docs', // The output folder for generated files
  css: 'src/css/**/*.css', // Path to your CSS files
};

// Absolute path for detail.njk (corrected)
const detailTemplatePath = path.resolve('src/_templates/detail.njk');  // Corrected to _templates

// Log the file path for debugging purposes
console.log("Using template path:", detailTemplatePath);

// Nunjucks Task: Convert .njk files to .html
gulp.task('nunjucks', () => {
  return gulp.src(paths.templates)
    .pipe(plumber())  // Prevent gulp from crashing on errors
    .pipe(nunjucksRender({
      path: ['src/_templates'], // Updated to _templates folder
    }))
    .pipe(gulp.dest(paths.output)); // Output to docs folder
});

// Task to generate individual detail pages for each item
gulp.task('generate-detail-pages', () => {
  // Check if the detail template exists before proceeding
  return gulp.src(detailTemplatePath, { allowEmpty: true })  // Handle missing files gracefully
    .pipe(plumber())  // Prevent gulp from crashing on errors
    .pipe(nunjucksRender({
      data: data, // Pass the data from Google Sheets
    }))
    .pipe(rename((path) => {
      path.basename = slugify(path.basename);  // Ensure we slugify the title for file names
    }))
    .pipe(gulp.dest('docs/')); // Output to docs folder
});

// BrowserSync for live reloading
gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: paths.output,  // Serve files from the docs folder
    },
    port: 3000, // Run on port 3000
  });

  // Watch files for changes and reload the browser when they change
  gulp.watch(paths.templates, gulp.series('nunjucks', 'generate-detail-pages')).on('change', browserSync.reload);
  gulp.watch(paths.css, gulp.series('nunjucks')).on('change', browserSync.reload);  // Watch CSS changes
});

// Default task: Run nunjucks and then serve the project
gulp.task('default', gulp.series('nunjucks', 'generate-detail-pages', 'serve'));
