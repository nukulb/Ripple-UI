
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

    initialize_wtf: function () {

        var emulatorBridge = require('ripple/emulatorBridge'),
            win = emulatorBridge.window();


        win.prompt = function () {
            return "'{}'";
        };

        win._nativeReady = true;

    },

    initialize: function () {
        var pg,
            emulatorBridge = require('ripple/emulatorBridge'),
            win = emulatorBridge.window();

        console.log("init");

        win.__defineGetter__("PhoneGap", function () {
            return pg;
        });

        win.__defineSetter__("PhoneGap", function (value) {
            console.log("got it!");
            pg = value;

            //hack
            pg.__defineGetter__("UsePolling", function () {
                return true;
            });

            pg.__defineSetter__("UsePolling", function () {
            });

            pg.__defineSetter__("exec", function () {
            });

            pg.__defineGetter__("exec", function () {
                return function () {
                    console.log("exec: ");
                    console.log(arguments);
                };
            });

            pg.__defineSetter__("JSCallbackPolling", function () {
            });

            pg.__defineGetter__("JSCallbackPolling", function () {
                return function () {
                };
            });
        });


        win._nativeReady = true;
    },

    objects: {
    }
};
