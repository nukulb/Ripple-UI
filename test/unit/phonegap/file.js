/*
 *  Copyright 2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
describe("phonegap file", function () {
    describe("spec", function () {
        var spec = require('ripple/platform/phonegap/1.0/spec');

        describe("resolveLocalFileSystemURI", function () {
            it("points to respective module", function () {
                expect(spec.objects.resolveLocalFileSystemURI.path)
                    .toEqual("phonegap/1.0/file/resolveLocalFileSystemURI");
            });
        });

        describe("requestFileSystem", function () {
            it("points to respective module", function () {
                expect(spec.objects.requestFileSystem.path)
                    .toEqual("phonegap/1.0/file/requestFileSystem");
            });
        });

        describe("LocalFileSystem", function () {
            it("points to respective module", function () {
                expect(spec.objects.LocalFileSystem.path)
                    .toEqual("phonegap/1.0/file/LocalFileSystem");
            });
        });
    });

    describe("LocalFileSystem", function () {
        var LocalFileSystem,
            requestFileSystem,
            resolveLocalFileSystemURI;

        beforeEach(function () {
            window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || function () {};
            window.requestFileSystem = window.requestFileSystem || function () {};

            LocalFileSystem = require('ripple/platform/phonegap/1.0/file/LocalFileSystem');
            requestFileSystem = require('ripple/platform/phonegap/1.0/file/requestFileSystem');
            resolveLocalFileSystemURI = require('ripple/platform/phonegap/1.0/file/resolveLocalFileSystemURI');
        });

        afterEach(function () {
            // argh
            //delete window.requestFileSystem;
            //delete window.resolveLocalFileSystemURL;
        });

        describe("constants", function () {
            it("is exposes TEMPORARY", function () {
                expect(LocalFileSystem.TEMPORARY).toBe(0);
            });

            it("is exposes PERSISTENT", function () {
                expect(LocalFileSystem.PERSISTENT).toBe(1);
            });
        });

        // TODO: this should filter file:/// and map it to what though? assume temp for now
        describe("resolveLocalFileSystemURI", function () {
            it("points to resolveLocalFileSystemURL or webkitResolveLocalFileSystemURL", function () {
                expect(LocalFileSystem.resolveLocalFileSystemURI).toBe(window.resolveLocalFileSystemURL);
                expect(resolveLocalFileSystemURI).toBe(LocalFileSystem.resolveLocalFileSystemURI);
            });
        });

        describe("requestFileSystem", function () {
            it("points to requestFileSystem or webkitRequestFileSystem", function () {
                expect(LocalFileSystem.requestFileSystem).toBe(window.requestFileSystem);
                expect(requestFileSystem).toBe(LocalFileSystem.requestFileSystem);
            });
        });
    });
});
