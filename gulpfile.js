const del = require('del');
const gulp = require('gulp');
const install = require('gulp-install');
const tar = require('gulp-tar');
const gzip = require('gulp-gzip');

const appName = 'contact-lens';

const clean = async () => del('./build');

const build = () =>
    gulp.src([
            './**',
            '!./resources/**/!(google.private.key)',
            '!./test/**',
            '!./node_modules/**',
            '!./!(package.json)',
        ])
        .pipe(gulp.dest(`./build/${appName}`));

const npmInstall = () => 
    gulp.src(`./build/${appName}/package.json`)
        .pipe(install({production: true}));

const compress = () => 
    gulp.src([
            `build/${appName}/**/*`,
            `!build/${appName}/package*.json`,
        ])
        .pipe(tar(`${appName}.tar`))
        .pipe(gzip())
        .pipe(gulp.dest('./build/'));


gulp.task('clean', clean);
gulp.task('build', build);
gulp.task('install', npmInstall);
gulp.task('compress', compress);

exports.default = gulp.series('clean', 'build', 'install', 'compress');