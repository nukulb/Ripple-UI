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
    exec: function (success, fail, service, action, args) {
        var emulator = {
            "Network Status": require('ripple/platform/phonegap.proto/1.0/bridge/network'),
            "Device": require('ripple/platform/phonegap.proto/1.0/bridge/device'),
            "Contacts": require('ripple/platform/phonegap.proto/1.0/bridge/contacts'),
            "Accelerometer": require('ripple/platform/phonegap.proto/1.0/bridge/accelerometer'),
            "Compass": require('ripple/platform/phonegap.proto/1.0/bridge/compass')
        };

        try {
            emulator[service][action](success, fail, args);
            console.log("exec:" + service + "." + action);
        }
        catch (e) {
            console.log("missing exec:" + service + "." + action);
            console.log(args);
            console.log(e);
            console.log(e.stack);
        }
    }
};
