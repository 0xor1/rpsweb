rpsweb
======

A simple game project written with [**Angular**](https://angularjs.org/), [**Require**](http://requirejs.org/)
and [**SASS**](http://sass-lang.com/) on the client side and [**Go**](http://golang.org/) with [**Gorilla Toolkit**](http://www.gorillatoolkit.org/)
on the server side. The project is configured as a true single page web app in that the build scripts will concat and minify all
the css and js files and then inline them into the index.html file. The project comes with:

* Automated build and testing tasks
* Unit tests
* End-to-End tests

The app can be built into a standalone server.exe to run on any machine, it also comes with a preconfigured app.yaml file
for easy upload to google app engine. You can see the project running on [GAE here](http://rpsweb-1.appspot.com).

##Setup Checklist

1. Install:
    * [Go](http://golang.org/)
        * [Go AppEngine SDK](https://cloud.google.com/appengine/downloads)
    * [Node](https://nodejs.org/) v0.12.*
    * [Ruby](https://www.ruby-lang.org)
        * [Compass](http://compass-style.org/)

2. Create the directory `$GOPATH/src/github.com/0xor1/rpsweb` and check this repo out into it

3. `cd` to `$GOPATH/src/github.com/0xor1/rpsweb` and run:
    ```sh
        npm install
        npm install -g grunt-cli
    ```

4. Local request redirection is required, for local development, ([Fiddler](http://www.telerik.com/fiddler) is a good tool for this) to send `rpsweb-1.appspot.com` to `127.0.0.1:8080`

5. Run the grunt tasks `watchSass`, `buildServer` then `startDevServer`

6. Open a browser and navigate to `rpsweb-1.appspot.com`, if you are looking at a web page with some buttons on, congratz everything worked.

##Common Tasks

There is a grunt task to cover all the basic requirements of development, run the following commands as `grunt <cmd>`:

* `buildServer` will build the server and copy the resulting server.exe to `build\server`
* `cleanServer` will delete all generated files from running `buildServer`


* `buildAppEngine` will copy the necessary files to `build`
* `cleanAppEngine` will delete app files from `build`


* `buildClient` will write the index.html file to `build\client` with the concatenated and minified css and js inlined and stripped of its AMD loading code.
  It should be noted that this task copies the existing root style.css file to the build folder for inlining, so any Sass changes need to have completed compilation before this task is run
* `testClient` will run all the client unit tests and drop the results and coverage reports in `test\unit\client`
* `cleanClientBuild` will delete all generated files from running `buildClient`
* `cleanClientTest` will delete all generated files from running `testClient`


* `buildAll` is a convenience command for `buildServer`, `buildAppEngine` and `buildClient`
* `cleanAllBuild` is a convenience command for `cleanServerBuild`, `cleanAppEngine` and `cleanClientBuild`


* `watchSass` will start compass auto compilation of all sass files in the `src\client` directory
* `cleanSass` will delete all **css** files in `src\client`


* `startDevServer` will start the `server.exe` in the `src\server` directory
* `startBuildServer` will start the `server.exe` in the `build\server` directory


* `startDevAppEngine` will run the server in the local app engine environment from `src`
* `startBuildAppEngine` will run the server in the local app engine environment from `build`


* `updateSeleniumServer` will run `webdriver-manager update`
* `startSeleniumServer` will run `webdriver-manager start`


* `testE2e` will run all the end to end tests and drop the results reports in `test\e2e\results`
* `cleanE2e` will delete all generated files from running `testE2e`


* `nuke` is a convenience command for `cleanAllBuild`, `cleanClientTest`, `cleanSass` and `cleanE2e`


