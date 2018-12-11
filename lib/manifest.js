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

const { loadJSON } = require('json-link');

const {
    ContentManifestName,
    DefaultContentManifest
} = require('./settings');

/**
 * Load a content manifest.
 * @param opts      Build options.
 * @param source    The build source path.
 */
async function loadManifest( opts, source ) {
    // First check build options for manifest path.
    let path = opts.manifestPath;
    // If no path specified then load from default location.
    if( !path ) {
        // Load manifest from master branch of source content repo.
        let branch = opts.manifestBranch || 'master';
        // Construct manifest path with branch identifier.
        let file = ContentManifestName+'#master';
        path = Path.join( source, file );
    }
    // Load the manifest, overwriting defaults.
    let manifest = Object.assign(
        DefaultContentManifest,
        await loadJSON( path )
    );
    return manifest;
}

exports.loadManifest = loadManifest;
