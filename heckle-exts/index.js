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

const makeHTMLHeader = require('../lib/make-html-header').make;

module.exports = {
    init: function( context, engine ) {},
    tags: {
        'pwa_header': async function renderPWAHeader( context ) {
            // Read options from tag arguments (see heckle SkeletonTagClass).
            let opts = this._args;
            // Read site source.
            let site = await context.get('site');
            let { source, target } = site;
            // Indicate file mode if heckle running in server mode.
            opts.fileMode = site.config.opts.serverMode || false;
            // Generate and return the header.
            let html = await makeHTMLHeader( opts, source, target );
            return html;
        }
    },
    filters: {}
};
