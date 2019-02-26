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

const { spawn }     = require('child_process');
const Path          = require('path');
const { promisify } = require('util');
const FS            = require('fs');
const _stat         = promisify( FS.stat );
const _copyFile     = promisify( FS.copyFile );
const _readFile     = promisify( FS.readFile );
const _writeFile    = promisify( FS.writeFile );

/**
 * Execute a named command with the specified arguments.
 * @param cmd   The name of the command to execute.
 * @param args  The command's argument list.
 * @param cwd   (Optional) the command's working directory.
 * @param env   (Optional) an object with environment values.
 * @returns A promise resolving to a { code, stdout, stderr } object.
 * Properties are:
 *  - code: The command's exit code;
 *  - stdout: A Buffer containing data written to stdout;
 *  - stderr: A Buffer containing data written to stderr;
 */
function exec( cmd, args, cwd, env ) {
    return new Promise( ( resolve, reject ) => {
        try {
            const stdout = [];
            const stderr = [];
            const proc = spawn( cmd, args, { cwd, env });

            proc.stdout.on('data', data => stdout.push( data ) );
            proc.stderr.on('data', data => stderr.push( data ) );
            proc.on('error', reject );
            proc.on('close', code => {
                resolve({
                    code,
                    stdout: Buffer.concat( stdout ),
                    stderr: Buffer.concat( stderr )
                });
            });
        }
        catch( e ) {
            reject( e );
        }
    });
}

/**
 * Test whether a file or directory exists.
 * @param path  The path to check for.
 * @param isDir If true then check if path exists and is a directory.
 */
async function exists( path, isDir = false ) {
    try {
        let stats = await _stat( path );
        return !isDir || stats.isDirectory();
    }
    catch( e ) {
        if( e.code == 'ENOENT' ) {
            return false;
        }
        throw e;
    }
}

/**
 * Remove a file or directory and all its contents.
 * @param path  The path to remove.
 */
function rmrf( path ) {
    if( path == '.' || path == '/' ) {
        throw new Error('rm root path panic');
    }
    return exec('rm', [ '-Rf', path ]);
}

/**
 * Make a directory.
 * @param path  The path to the directory.
 */
function mkdir( path ) {
    return exec('mkdir', [ '-p', path ]);
}

/**
 * Find files.
 * @param path      The path to search under.
 * @param filename  A file name or pattern to search for.
 */
function find( path, filename ) {
    return exec('find', [ path, '-name', filename ]);
}

/**
 * Ensure a path exists and is a directory. Creates the directory if file
 * doesn't exist, or does but isn't a directory.
 * @param path      The path to the required directory.
 */
async function ensureDir( path ) {
    // Check if directory is already in place.
    let isDir = await exists( path, true );
    if( isDir ) {
        return true;
    }
    // Path doesn't exist or isn't a directory - delete before
    // (re-)creating.
    await rmrf( path );
    await mkdir( path );
    return true;
}

/**
 * Ensure a file's parent directory exists.
 */
function ensureDirForFile( path ) {
    const dir = Path.dirname( path );
    return ensureDir( dir );
}

/**
 * Copy a file or files.
 * @param from      The file or location to copy.
 * @param to        The file or location to copy to.
 */
function cp( from, to ) {
    return _copyFile( from, to );
}

/**
 * Read JSON from a file.
 * @param defaultValue  If provided and the source file isn't found then
 *                      returns the default value instead of throwing an error.
 */
async function readJSON( path, defaultValue ) {
    try {
        let json = await _readFile( path );
        return JSON.parse( json );
    }
    catch( e ) {
        if( e.code == 'ENOENT' && defaultValue !== undefined ) {
            return defaultValue;
        }
        throw e;
    }
}

/**
 * Write JSON to a file.
 */
function writeJSON( path, data ) {
    let json = JSON.stringify( data, null, 4 );
    return _writeFile( path, json );
}

/**
 * Write data to a file.
 */
function write( path, data ) {
    return _writeFile( path, data );
}

module.exports = {
    exec,
    exists,
    rmrf,
    mkdir,
    find,
    ensureDir,
    ensureDirForFile,
    cp,
    readJSON,
    writeJSON,
    write
};
