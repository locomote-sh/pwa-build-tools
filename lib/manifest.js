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

/// Functions for loading the content manifest.

const Path = require('path');

const { readJSON } = require('./support');

const {
    ContentManifestName,
    DefaultContentManifest,
    DefaultPWASettings
} = require('./settings');

/**
 * Load a content manifest.
 * @param opts      Build options.
 * @param source    The build source path.
 */
async function loadManifest( opts, source ) {
    const path = Path.join( source, ContentManifestName );
    const manifest = await readJSON( path, DefaultContentManifest );
    // If the manifest specifies a "pwa" section then ensure that it has
    // a minimum set of properties.
    const { pwa } = manifest;
    if( pwa ) {
        manifest.pwa = Object.assign(
            {},
            DefaultPWASettings,
            pwa );
    }
    return manifest;
}

module.exports = { loadManifest };
