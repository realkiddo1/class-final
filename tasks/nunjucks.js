import gulp from 'gulp';
import nunjucksRender from 'gulp-nunjucks-render';
import data from 'gulp-data';
import fs from 'fs';
import path from 'path';

// Nunjucks Task
function nunjucks() {
  console.log('Processing templates...');
  return gulp
    .src('src/templates/**/*.njk') // Process all `.njk` files in `src/templates`
    .pipe(
      data(() => {
        const dataFile = path.join(__dirname, '../src/_data/mydata.json'); // Correct file name
        const jsonData = JSON.parse(fs.readFileSync(dataFile));
        return { data: jsonData };
      })
    )
    .pipe(
      nunjucksRender({
        path: ['src/templates'], // Path to templates
      })
    )
    .pipe(gulp.dest('docs')); // Output to `docs`
}

export default nunjucks;
