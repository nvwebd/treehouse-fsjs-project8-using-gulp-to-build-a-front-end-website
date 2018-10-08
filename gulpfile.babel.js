import gulp from "gulp";
import concat from "gulp-concat";
import rename from "gulp-rename";
import uglify from "gulp-uglify";
import sourcemaps from "gulp-sourcemaps";
import sass from "gulp-sass";
import image from "gulp-image";
import clean from "gulp-clean";
import { create as browserSyncCreate } from "browser-sync";

const browserSync = browserSyncCreate();

const paths = {
  styles: {
    src: "sass/**/*.scss",
    dest: "dist/styles/"
  },
  scripts: {
    src: "js/**/*.js",
    dest: "dist/scripts/"
  },
  images: {
    src: "images/*",
    dest: "dist/content/"
  },
  dist: "dist"
};

gulp.task("scripts", () => {
  return gulp
    .src(paths.scripts.src)
    .pipe(concat("all.js"))
    .pipe(rename("all.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest));
});

gulp.task("scripts:sourcemaps", () => {
  return gulp
    .src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(concat("all.js"))
    .pipe(rename("all.min.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scripts.dest));
});

gulp.task("styles", () => {
  return gulp
    .src(paths.styles.src)
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(rename("all.min.css"))
    .pipe(gulp.dest(paths.styles.dest));
});

gulp.task("styles:sourcemaps", () => {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(rename("all.min.css"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest));
});

gulp.task("images", () => {
  return gulp
    .src(paths.images.src)
    .pipe(image())
    .pipe(gulp.dest(paths.images.dest));
});

gulp.task("clean", () => {
  return gulp.src(paths.dist, { read: false, allowEmpty: true }).pipe(clean());
});

gulp.task("serve", done => {
  browserSync.init({
    server: {
      basedir: paths.dist
    }
  });
  done();
});

gulp.task("reload", done => {
  browserSync.reload();
  done();
});

gulp.task("watch", done => {
  gulp.watch(paths.styles.src, gulp.series("styles:sourcemaps", "reload"));
  done();
});

gulp.task(
  "build",
  gulp.series(
    "clean",
    "scripts:sourcemaps",
    "styles:sourcemaps",
    "images",
    "serve"
  )
);

gulp.task(
  "default",
  gulp.series(
    "clean",
    "scripts:sourcemaps",
    "styles:sourcemaps",
    "images",
    "serve",
    "watch"
  )
);
