# build-web-manifest
Locomote.sh build tools for generating service workers, web manifests and other resources.

This project provides the following build tools:

* `make-sw`: Generate service worker code.
* `make-web-manifest`: Generate a `manifest.webmanifest` file.
* `make-html-header`: Generate HTML header markdown for a PWA.
* `make-pwa-images`: Generate app icons and splashscreens from standard images.

The build tools use settings found in a content repository manifest (i.e. a `locomote.json` file) to control their output.

## make-sw
Generate service worker code.

The tool reads the `serviceWorker` section of the Locomote manifest and generates code which loads the standard Locomote service worker, together with any specified plugins, and then configures the Locomote service worker according to the other configured options. The resulting code is written to the file `sw.js`, which can then be loaded by a page as its service worker implementation.

## make-web-manifest
Generate a `manifest.webmanifest` file.

The tool generates a PWA web manifest from the settings specified in the Locomote content manifest. 

The tool will generate a list of icons for the manifest based on the icon images found on the filesystem at runtime. Icon and splashscreen images should be written to PNG files and placed under a `pwa` folder under the content repository root. Standard app icons should be named e.g. `std/{width}x{height}.png`, where `{width}` and `{height}` are the icons width and height dimensions. iOS specific images can be provided using a filename like `ios/{width}x{height}.png`. Additionally, a standard SVG icon can be provided using the filename `std/appicon.svg`.

## make-html-header
Generate HTML header markdown for a PWA.

Generates a HTML block containing `<title>`, `<meta>` and `<link>` elements for inclusion in a page's HTML `<head>` section. The generated elements setup the page as a PWA by:

* setting the pages title;
* setting the page's viewport and theme-color settings;
* linking to the page's web manifest;
* for iOS, linking to the app icon and splashscreen images and setting other meta properties;
* when configured, linking to the PWA install banner for iOS.

Values for the different tags are read from the `pwa` section of the Locomote content manifest.

## make-pwa-images
Generate app icons and splashscreens from standard images.

Generate icons and splashscreens at different sizes from a single source image by resizing the source image. Source images are read from the `assets` folder; for example, the source app icon is read from `assets/appicon.png`. Images for specific target dimensions can be provided by storing an image under the filename `assets/std/{width}x{height}.png`, where `{width}` and `{height}` are the image's width and height dimensions. When present then these images will be copied to the target, instead of an image being generated from the source image. iOS specific versions of images can be specified using the filename pattern `assets/ios/{width}x{height}.png`.

