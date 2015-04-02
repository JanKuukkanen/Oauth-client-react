# teamboard-client-react
The Better Way.

## Setup
```
npm install && gulp
```
This will start a development server on port `8000`. You can specify an
alternative hostname using the `HOSTNAME` environment variable.

By default, `gulp` will use `browserify` to build the code, so each build will
take a set amount of time. By default `sourcemaps` are also generated, so you
can inspect your source files instead of the big generated bundle.

If you are deploying the code into `production`, run the `build` task with the
environmental variable `NODE_ENV` set to `production`. This will minify the
source code, and strip out sourcemaps, making the generated bundle very small.

There are a few arguments you can give to `gulp`, they are listed and explained
below:

	--use-watchify

	Using this flag will switch the browserify bundler to watchify. This means
	that the initial build time will be about the same as it was with
	browserify, but the subsequent builds will be much faster due to the way
	watchify only rebuilds the code that has changed.

	If this flag is active, changes to the source code do not trigger the
	'build-js' task. This is intended, since using watchify together with the
	'gulp.watch' is a bit volatile, so we use the 'update' event made available
	by the watchify bundler instead.

	Don't use this flag if you're running the build task on a vagrant guest.
