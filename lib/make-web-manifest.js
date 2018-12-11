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
    AppIconDefs,
    TargetImagePath,
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
async function make( opts, source, target ) {

    // Read Locomote manifest.
    const locoManifest = await loadManifest( opts, source );

    // Read web manifest from source.
    const sourceWebManifest = await readJSON( Path.join( source, WebManifestName ) );

    // Read list of available app images from build target.
    // This assumes that image generation has occurred before this
    // script is called.
    const icons = await listAppIcons( target );

    // Generate web manifest and write to target.
    const webManifest = Object.assign(
        { icons },
        DefaultWebManifest, // Default manifest settings
        locoManifest.pwa,   // Values from Locomote content manifest
        sourceWebManifest   // Values from a user-generated web manifest
    );

    // Return the result.
    return JSON.stringify( webManifest, null, 4 );
}

/**
 * Return a list of available app icons under the target path.
 * Searches for PNG and SVG app icons and returns a list of icon descriptors
 * suitable for inclusion in the web manifest.
 * @param targetPath    The build target path.
 * @returns A list of app icon descriptors.
 */
async function listAppIcons( targetPath ) {
    const icons = [];   // The list of found icons.
    const sizes = [];   // A list of icon sizes not provided by the PNG icon versions.
    const iconDefs = AppIconDefs.filter( d => d.target == 'std' );
    // Search for provided PNG versions of appicons.
    for( let { target, w, h } of iconDefs ) {
        let size = `${w}x${h}`;
        let src = Path.join( TargetImagePath, target, `${size}.png`);
        let iconPath = Path.join( targetPath, src );
        // If icon exists at path then add to the list of icons.
        if( await exists( iconPath ) ) {
            icons.push({ src, sizes: size });
        }
        else sizes.push( size );
    }
    // Look for an SVG app icon, and if one is found then add to the icon list and
    // specify its use for all icon sizes not matched with a PNG version.
    if( sizes.length > 0 ) {
        let src = Path.join( TargetImagePath, 'std/appicon.svg' );
        let iconPath = Path.join( targetPath, src );
        if( await exists( iconPath ) ) {
            icons.push({ src, sizes });
        }
    }
    return icons;
}

exports.make = make;
