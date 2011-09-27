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
describe("phonegap_accelerometer", function () {
    var accel = require('ripple/platform/phonegap.proto/1.0/bridge/accelerometer');

    it("getCurrentAcceleration calls the success callback", function () {
        var success = jasmine.createSpy();
        accel.getAcceleration(success, jasmine.createSpy());
        expect(success).toHaveBeenCalled();
    });

    it("calls the success callback for getTimeout", function () {
        var success = jasmine.createSpy();
        accel.getTimeout(success, jasmine.createSpy());
        expect(success).toHaveBeenCalled();
    });

    it("calls the success callback for setTimeout", function () {
        var success = jasmine.createSpy();
        accel.setTimeout(success, jasmine.createSpy());
        expect(success).toHaveBeenCalled();
    });
});
