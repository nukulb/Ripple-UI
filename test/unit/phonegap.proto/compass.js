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
describe("phonegap_compass", function () {
    var compass = require('ripple/platform/phonegap.proto/1.0/bridge/compass'),
        geo = require('ripple/geo');

    it("can get the current heading", function () {
        var failure = jasmine.createSpy("failure"),
            success = jasmine.createSpy("success");

        spyOn(geo, "getPositionInfo").andReturn({heading: 180});

        compass.getHeading(success, failure);

        expect(failure).not.toHaveBeenCalled();
        expect(success).toHaveBeenCalledWith(180);
    });
});
