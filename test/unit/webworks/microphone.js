/*
 * Copyright 2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
describe("webworks.core microphone", function () {
    var server = require('ripple/platform/webworks.core/2.0.0/server/microphone'),
        client = require('ripple/platform/webworks.core/2.0.0/client/microphone'),
        transport = require('ripple/platform/webworks.core/2.0.0/client/transport');

    describe("handset", function () {
        describe("platform spec index", function () {
            var spec = require('ripple/platform/webworks.handset/2.0.0/spec');

            it("includes module according to proper object structure", function () {
                expect(spec.objects.blackberry.children.media.children.microphone).toEqual({
                    path: "webworks.core/2.0.0/client/microphone",
                    feature: "blackberry.media.microphone"
                });
            });
        });

        describe("server index", function () {
            it("exposes the server module", function () {
                var webworks = require('ripple/platform/webworks.handset/2.0.0/server');
                expect(webworks.blackberry.media.microphone).toEqual(server);
            });
        });
    });

    describe("tablet", function () {
        // TODO: techdebt supporting <rim:permit>
        describe("platform spec index", function () {
            var spec = require('ripple/platform/webworks.tablet/2.0.0/spec');

            it("includes module according to proper object structure", function () {
                expect(spec.objects.blackberry.children.media.children.microphone).toEqual({
                    path: "webworks.core/2.0.0/client/microphone",
                    feature: "blackberry.media.microphone"
                });
            });
        });

        describe("server index", function () {
            it("exposes the server module", function () {
                var webworks = require('ripple/platform/webworks.tablet/2.0.0/server');
                expect(webworks.blackberry.media.microphone).toEqual(server);
            });
        });
    });

    describe("core", function () {
        describe("client", function () {
            describe("pause", function () {
            });

            describe("record", function () {
            });

            describe("stop", function () {
            });
        });

        describe("server", function () {
            describe("pause", function () {
            });

            describe("record", function () {
            });

            describe("stop", function () {
            });
        });
    });
});
