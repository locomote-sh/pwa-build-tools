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

// Generate webmanifest file from locomote content manifest.
//
// Inputs:
// - pwa section of locomote manifest
// - manifest.webmanifest, if any, in root of source branch
// - lists of available app icon and splashscreen images with image dimensions
//
// Outputs:
// - manifest.webmanifest to root of target branch
//

const Path = require('path');

const {
    WebManifestName,
    DefaultWebManifest
} = require('./settings');

const { readJSON } = require('./support');

const { loadManifest } = require('./manifest');

/**
 * Generate web manifest JSON.
 * @param opts      Build options.
 * @param source    The build source path.
 * @param target    The build target path.
 * @returns A string containing the web manifest JSON.
 */
async function make( opts, source ) {

    // Read Locomote manifest.
    const locoManifest = await loadManifest( opts, source );

    // Read web manifest from source.
    const sourceWebManifest = await readJSON( Path.join( source, WebManifestName ) );

    // Read list of available app images from build target.
    // This assumes that image generation has occurred before this
    // script is called.
    const imagesPath = Path.join( target, opts.appImageDir );
    const images = await listImages( imagesPath );

    // Generate web manifest and write to target.
    const { icons } = images; // get icons() { ... }
    const webManifest = Object.assign(
        { icons },
        DefaultWebManifest, // Default manifest settings
        locoManifest.pwa,   // Values from Locomote content manifest
        sourceWebManifest   // Values from a user-generated web manifest
    );

    // Return the result.
    return JSON.stringify( webManifest, null, 4 );
}

async function listImages( path ) {
    const files = await findFiles( path );
    const icons = files.filter( path => AppIconFilePathPattern.test( path ) );
    const splashscreens // TODO
}

exports.make = make;
