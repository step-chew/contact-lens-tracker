const del = require('del');
const gulp = require('gulp');
const install = require('gulp-install');
const runSequence = require('run-sequence');

gulp.task('clean', () =>
    del('./build/**')
);

gulp.task('build', ['clean'], () =>
    gulp.src([
            './**',
            '!./resources/**/!(google.private.key)',
            '!./test/**',
            '!./node_modules/**',
            '!./!(package.json)',
        ])
        .pipe(gulp.dest('./build'))
);

gulp.task('install', () => {
    gulp.src('./build/package.json')
        .pipe(install({production: true}))
});

gulp.task('dist', (done) => {
    runSequence('build', 'install', () => {
        done();
    });
});
