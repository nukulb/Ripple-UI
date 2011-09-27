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

module.exports = {
    id: "phonegap.proto",
    version: "1.0",
    name: "PhoneGap Prototype",
    type: "platform",

    persistencePrefix: "phonegap.proto-",

    config: require('ripple/platform/phonegap.proto/1.0/spec/config'),
    device: require('ripple/platform/phonegap.proto/1.0/spec/device'),
    ui: require('ripple/platform/phonegap.proto/1.0/spec/ui'),
    events: require('ripple/platform/phonegap.proto/1.0/spec/events'),

    initialize: function () {
        var pg,
            bridge = require('ripple/platform/phonegap.proto/1.0/bridge'),
            emulatorBridge = require('ripple/emulatorBridge'),
            honeypot = require('ripple/honeypot'),
            win = emulatorBridge.window();

        honeypot.monitor(win, "PhoneGap").andRun(function () {
            return pg;
        }, function (value) {
            pg = value;

            //hack: force to use polling
            honeypot.monitor(pg, "UsePolling").andReturn(true);

            //do nothing here as we will just call the callbacks ourselves
            honeypot.monitor(pg, "JSCallbackPolling").andReturn(function () {});
            honeypot.monitor(pg, "exec").andReturn(bridge.exec);

        });

        win._nativeReady = true;
    },

    objects: {
    }
};
