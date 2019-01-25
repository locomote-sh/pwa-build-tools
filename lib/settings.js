/*
   Copyright 2018 Locomote Limited

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/// Default values and settings.

// The name of the Locomote content manifest file.
exports.ContentManifestName = 'locomote.json';

// Default content manifest settings.
exports.DefaultContentManifest = {
    pwa: {
        name: '',
        short_name: '',
        background_color: '#000000',
        ios: {
            showInstallBanner: true
        }
    }
};

// The name of the web manifest file.
exports.WebManifestName = 'manifest.webmanifest';

// Default web manifest settings.
exports.DefaultWebManifest = {
    'display': 'standalone'
};

// List of app icon definitions.
exports.AppIconDefs = [
    { w: 120, h: 120, target: 'ios' },
    { w: 152, h: 152, target: 'ios' },
    { w: 167, h: 167, target: 'ios' },
    { w: 180, h: 180, target: 'ios' },
    { w: 192, h: 192, target: 'std' },
    { w: 512, h: 512, target: 'std' }
];

// List of splashscreen definitions.
exports.SplashscreenDefs = [
    // iPhone 5
    { w: 640,  h: 1136, dw: 320,  dh: 568,  dd: 2, target: 'ios' },
    // iPhone 6
    { w: 750,  h: 1334, dw: 375,  dh: 667,  dd: 2, target: 'ios' },
    // iPhone+
    { w: 1863, h: 3312, dw: 621,  dh: 1104, dd: 3, target: 'ios' },
    // iPhone X
    { w: 1125, h: 2436, dw: 375,  dh: 812,  dd: 3, target: 'ios' },
    // iPad
    { w: 1536, h: 2048, dw: 768,  dh: 1024, dd: 2, target: 'ios' },
    // iPad Pro 1
    { w: 1668, h: 2224, dw: 834,  dh: 1112, dd: 2, target: 'ios' },
    // iPad Pro 2
    { w: 2048, h: 2732, dw: 1024, dh: 1366, dd: 2, target: 'ios' },
    // Android etc.
    { w: 512,  h: 512, target: 'std' }
];

// Path under which app icons and splashscreens are stored in build
// source and target locatios.
exports.SourceImagePath = '_pwa';
exports.TargetImagePath = 'pwa';

// The current service worker version.
exports.SWCurrentVersion = '0.8.2';

// The Locomote.sh CDN base URL.
const CDNURL = '//cdn.locomote.sh';
exports.CDNURL = CDNURL;

// Standard service worker plugin URLs, exposed as lambdas which return the
// correct URL for a given SDK version.
exports.SWPluginURLs = {
    // The 'sw' plugin represents the actual core service worker code.
    '__sw':   ver => `${CDNURL}/sw/${ver}/locomote-sw.js`,
    // The search plugin.
    'search': ver => `${CDNURL}/sw/${ver}/locomote-search.js`
};

// The service worker client URL.
exports.SWClientURL = ver => `${CDNURL}/sw/${ver}/locomote-sw-client.js`;

// iOS install banner code + css links.
exports.InstallBannerJSURL = `${CDNURL}/ios-install-banner/index.js`;
exports.InstallBannerCSSURL = `${CDNURL}/ios-install-banner/styles.css`;

