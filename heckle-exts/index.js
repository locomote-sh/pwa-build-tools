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

// Heckle site build extensions.
// Standard tag usage is:
//
//  {% locomote %}
//
// Which will write all Locomote related HTML headers. Specifcally,
// these are:
// * App title
// * PWA related headers
// * SW related code
// * Page metadata

const { make: makeHTMLHeader } = require('../lib/make-html-header');

module.exports = {
    init: function( context, engine ) {},
    tags: {
        'locomote': async function renderPWAHeader( context ) {

            // Read options from tag arguments (see Heckle SkeletonTagClass).
            const opts = this._args;

            // Read site source.
            const site = await context.get('site');
            const { source, target } = site;

            // Indicate file mode if heckle running in server mode.
            opts.fileMode = site.config.opts.serverMode || false;

            // Derive a relative path to the service worker script from the page
            // path. This assumes that the service worker script is always in the
            // repo root folder; the page path will always be relative to the
            // repo root.
            const pagePath = await context.get('path');
            const swPath = pagePath
                .split('/')
                .slice( 0, -1 )
                .map( c => '..' )
                .concat('sw.js')
                .join('/');
            opts.serviceWorkerURL = swPath;

            // Generate the HTML header.
            let html = await makeHTMLHeader( opts, source, target );

            // Add page metadata.
            const page = await context.get('page');
            // Read page data, convert to JSON and apply escaping.
            const { Liquid: { StandardFilters: { escape } } } = this;
            const json = escape( JSON.stringify( page.data ) );
            html += `\n<meta name="locomote:frontmatter" content="${json}" />`;

            // Return the HTML.
            return html;
        }
    },
    filters: {}
};

// Join a path to a base URL.
function joinPath( base, path ) {
    // Base URL can be undefined.
    let url = base || '';
    // Ensure a slash between base URL and path.
    if( !url.endsWith('/') ) {
        url += '/';
    }
    // Append path and return.
    url += path;
    return url;
}
