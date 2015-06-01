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

	--use-browser-sync

	Using this flag will switch from using the pretty basic `gulp-webserver`
	module to `browser-sync` for serving the static content. This will also use
	the BrowserSync's own flavor of livereloading the changes.

	--test-runner-mode <mode>

	Specify the mode, in which the test runner should run. Available modes are
	run and watch, of which the first will do a single run and exit the process
	and the second will keep watching the test files and run when changed.

## On Testing...
If you want to test this app on other devices, such as tablets and phones, you
need to set the `IO_URL` and `API_URL` environmental variables to point at your
own IP address.
```
	IO_URL=http://<MyIPHere>:9001 \
	API_URL=http://<MyIPHere>:9002/api \
	gulp --use-watchify --use-browser-sync
```

## Using the SCP and Matti integration

If you want to move the distribution after building to a remote server, use the gulp SCP task, like so:

```
	IO_URL=http://<MyIPHere>:9001 \
	API_URL=http://<MyIPHere>:9002/api \
	SCP_HOST=192.168.0.0 \
	SCP_USER=helloworld \
	SCP_PW=secret_password \
	SCP_DEST='\home\helloworld\' \
	gulp scp
```

If you want to push a notification to a Matti TTS server to alert users you're using the device lab, use the gulp matti task, like so:


```
	IO_URL=http://<MyIPHere>:9001 \
	API_URL=http://<MyIPHere>:9002/api \
	SCP_HOST=192.168.0.0 \
	SCP_USER=helloworld \
	SCP_PW=secret_password \
	SCP_DEST='\home\helloworld\' \
	MATTI_ADDR=192.168.0.1 \
	MATTI_PORT=1234 \
	gulp scp
```
