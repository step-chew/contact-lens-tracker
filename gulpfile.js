const gulp = require('gulp');
const zip = require('gulp-zip');
const del = require('del');

gulp.task('clean', () =>
    del('*.zip')
);

gulp.task('build', ['clean'], () =>
    gulp.src([
            './**',
            '!resources/*.{txt,json}',
            '!*.*',
        ])
        .pipe(zip('contact-lens-tracker.zip'))
        .pipe(gulp.dest('.'))
);
