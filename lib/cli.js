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

// Expected arguments.
const Args = ['source','target'];
// Valid options.
const Opts = {
    '-m': 'manifestPath',
    '-b': 'manifestBranch'
};

// Parse command line arguments.
function parseArgs() {
    let opts = {};          // Set of command line options.
    let result = { opts };  // The result.
    // Extract arguments.
    let [ _node, _script, ...args ] = process.argv;
    let opt = false;        // The current option name.
    let argIdx = 0;         // Index into expected arguments.
    // Iterate over arguments.
    for( let arg of args ) {
        // If option name from previous arg then assign current
        // arg as its value and continue.
        if( opt ) {
            opts[opt] = arg;
            opt = false;
            continue;
        }
        // Check for an option name.
        opt = Opts[arg];
        if( opt ) {
            continue;
        }
        if( arg[0] == '-' ) {
            exit('Unrecognized option:', arg );
        }
        // Read expected argument.
        let name = Args[argIdx++];
        if( !name ) {
            exit('Unexpected argument:', arg );
        }
        result[name] = arg;
    }
    // Check that all expected arguments have been processed.
    if( argIdx < Args.length ) {
        exit('Missing expected argument(s):', Args.slice( argIdx ).join(' ') );
    }
    return result;
}

function exit() {
    console.error.apply( console.error, arguments );
    process.exit( 1 );
}

module.exports = parseArgs();

