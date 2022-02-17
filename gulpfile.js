import gulp from 'gulp';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import del from 'del';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoPrefixer from 'gulp-autoprefixer';
import imagemin from 'gulp-imagemin';
import htmlmin from 'gulp-htmlmin';
import size from 'gulp-size';
import newer from 'gulp-newer';
import browserSync from 'browser-sync';
import gulpPug from 'gulp-pug';

const sass = gulpSass(dartSass);
const sync = browserSync.create();

const path = {
  pug: {
    src: 'src/pug/**/*.pug',
    srcPages: 'src/pug/pages/*.pug',
    dest: 'build/'
  },
  html: {
    src: 'src/*.html',
    dest: 'build/'
  },
  styles: {
    src: 'src/styles/style.scss',
    dest: 'build/css/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'build/js/'
  },
  images: {
    src: 'src/img/**',
    dest: 'build/img/'
  },
};

export const clean = () => {
  return del(['build/*', '!build/img']);
}

export const styles = () => {
  return gulp.src(path.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoPrefixer({
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: 2,
    }))
    .pipe(rename({
      basename: 'style',
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(size())
    .pipe(gulp.dest(path.styles.dest))
    .pipe(sync.stream())

}

export const scripts = () => {
  return gulp.src(path.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env'],
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(size())
    .pipe(gulp.dest(path.scripts.dest))
    .pipe(sync.stream())
}

export const img = () => {
  return gulp.src(path.images.src)
    .pipe(newer(path.images.dest))
    .pipe(imagemin({
      progressive: true,
    }))
    .pipe(size({
      showFiles: true,
    }))
    .pipe(gulp.dest(path.images.dest))
}

export const pug = () => {
  return gulp.src(path.pug.srcPages)
    .pipe(gulpPug({
      pretty: true
    }))
    .pipe(gulp.dest(path.pug.dest))
    .pipe(sync.stream())
}

export const html = () => {
  return gulp.src(path.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(size())
    .pipe(gulp.dest(path.html.dest))
    .pipe(sync.stream())
}

export const watch = () => {
  sync.init({
    server: {
      baseDir: "./build/"
    },
    notify: false,
  })
  gulp.watch(path.pug.dest).on('change', sync.reload)
  gulp.watch(path.pug.src, pug)
  gulp.watch(path.styles.src, styles)
  gulp.watch(path.scripts.src, scripts)
  gulp.watch(path.images.src, img)
}

export const build = gulp.series(
  clean,
  pug,
  gulp.parallel(styles, scripts, img),
  watch
)

export default build;