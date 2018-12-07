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
// - html fragment with link and meta tags for ios support
//

const Path = require('path');

const DefaultLocoManifest = {};

const WebManifestName = 'manifest.webmanifest';

const DefaultWebManifest = {
    "display": "standalone"
};

async function exec( opts, source, target ) {

    // Read Locomote manifest.
    const locoManifest = await readJSON( 
        Path.join( source, opts.locomoteManifestName ),
        DefaultLocoManifest );

    // Read web manifest from source.
    const sourceWebManifest = await readJSON(
        Path.join( source, WebManifestName ),
        {});

    // Read list of app images from source.
    const imagesPath = Path.join( source, opts.appImageDir );
    const images = await listImages( imagesPath );

    // Generate web manifest and write to target.
    const { icons } = images; // get icons() { ... }
    const webManifest = Object.assign(
        { icons },
        DefaultWebManifest,
        locoManifest.pwa,
        sourceWebManifest
    );
    await writeJSON(
        Path.join( target, WebManifestName ),
        webManifest );

    // Generate html fragment
    // TODO
}
