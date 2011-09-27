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
describe("phonegap_contacts", function () {
    var db = require('ripple/db'),
        utils = require('ripple/utils'),
        contacts = require('ripple/platform/phonegap.proto/1.0/bridge/contacts');

    beforeEach(function () {
        global.ContactError = {
            PENDING_OPERATION_ERROR: 3
        };

        global.navigator = window.navigator;
        window.navigator.contacts = {
            create: function (obj) {
                var c = {
                    id: null,
                    displayName: null,
                    name: null,
                    nickname: null,
                    phoneNumbers: null,
                    emails: null,
                    addresses: null,
                    ims: null,
                    organizations: null,
                    birthday: null,
                    note: null,
                    photos: null,
                    categories: null,
                    url: null,
                    save: null,
                    remove: null,
                    clone: null
                };
                utils.mixin(obj, c);
                return c;
            }
        };
    });

    describe("when searching", function () {
        it("returns empty array of contacts when given empty contact fields array", function () {
            contacts.search(function (items) {
                expect(items.length, 0, "expected empty array");
            }, null, [[]]);
        });

        it("returns array in success callback", function () {
            contacts.search(function (items) {
                expect(typeof items).toEqual("object");
                expect(typeof items.length).toEqual("number");
            }, null, [["displayName"]]);
        });

        it("returns array of contacts", function () {
            var data = [{}, {}];
            data[0].displayName = "dave";
            data[1].displayName = "rob";

            spyOn(db, "retrieveObject").andReturn(data);

            contacts.search(function (items) {
                expect(items.length).toEqual(2);
                expect(items[0].displayName).toEqual("dave");
                expect(items[1].displayName).toEqual("rob");
            }, null, [["displayName"]]);
        });

        it("returned contacts have id", function () {
            var data = [{id: "daveID"}],
                emails;

            emails = data[0].emails = {type: "dave", value: "dave@test.com", pref: true};

            spyOn(db, "retrieveObject").andReturn(data);

            contacts.search(function (items) {
                expect(items[0].id).toEqual("daveID");
            }, null, [["emails"]]);
        });

        it("returns contacts with contact field properties only", function () {
            var data = [{id: "daveID"}],
                emails;

            emails = data[0].emails = {type: "dave", value: "dave@test.com", pref: true};

            spyOn(db, "retrieveObject").andReturn(data);

            contacts.search(function (items) {
                expect(items[0].id).toEqual("daveID");
                expect(items[0].emails).toEqual(emails);
            }, null, [["emails"]]);
        });

        it("returns default contacts when none persisted", function () {
            spyOn(db, "retrieveObject").andReturn(null);
            contacts.search(function (items) {
                var i;
                expect(items.length).toBe(5);
                for (i = 0; i < items.length; i++) {
                    expect(typeof items[i].id).toEqual("string");
                    expect(typeof items[i].emails).toEqual("object");
                    expect(typeof items[i].name).toEqual("object");
                }
            }, null, [["name", "displayName", "emails"]]);
        });

        it("returns all the fields when given a fields array of ['*']", function () {
            var error = jasmine.createSpy("error callback");

            spyOn(db, "retrieveObject").andReturn(null);

            contacts.search(function (items) {
                expect(utils.count(items[0])).toBe(17);
            }, error, [["*"]]);
        });

        it("can find contacts based on the filter findOption", function () {
            var contact = {"name": "The Sheldon Cooper"},
                data = [contact, {}, {}],
                options = {
                    filter: "sheldon",
                    multiple: true
                },
                error = jasmine.createSpy();

            spyOn(db, "retrieveObject").andReturn(data);

            contacts.search(function (items) {
                expect(items.length).toEqual(1);
                expect(items[0].id).toEqual(contact.id);
                expect(items[0].name).toEqual(contact.name);
            }, error, [["name", "displayName", "addresses"], options]);
        });

        it("can find contacts based on the filter findOption (with objects)", function () {
            var contact = {
                    "name": "Sheldon Cooper",
                    "emails": [{type: "personal", value: "sheldon@email.com", pref: true} ]
                },
                data = [contact, {}, {}],
                options = {filter: "sheldon@email.com"},
                error = jasmine.createSpy();

            spyOn(db, "retrieveObject").andReturn(data);

            contacts.search(function (items) {
                expect(items.length).toEqual(1);
                expect(items[0].id).toEqual(contact.id);
                expect(items[0].name).toEqual(contact.name);
                expect(items[0].emails).toEqual(contact.emails);
            }, error, [["name", "emails"], options]);
        });

        it("should return multiple contacts when findOptions.multiple is true", function () {
            var data = [{}, {}, {}],
                options = {multple: true},
                error = jasmine.createSpy();

            spyOn(db, "retrieveObject").andReturn(data);

            contacts.search(function (items) {
                expect(items.length).toEqual(3);
            }, error, [["displayName"], options]);
        });

        it("should return only one contact when findOptions.multiple is false", function () {
            var options = {multiple: false},
                data = [{}, {}],
                error = jasmine.createSpy();

            spyOn(db, "retrieveObject").andReturn(data);

            contacts.search(function (items) {
                expect(items.length).toEqual(1);
            }, error, [["name"], options]);
        });
    });

    describe("when saving", function () {
        describe("the contacts module", function () {
            it("saves a new contact", function () {
                var contact = {
                        "name": "rob"
                    },
                    error = jasmine.createSpy();

                spyOn(db, "saveObject");
                spyOn(Math, "uuid").andReturn("foo");
                spyOn(db, "retrieveObject").andReturn([]);

                contacts.save(function (item) {
                    expect(db.saveObject.argsForCall[0][0]).toBe("phonegap-contacts");
                    expect(db.saveObject.argsForCall[0][1][0].id).toBe("foo");
                }, error, [contact]);
            });

            it("updates an existing contact if a contact with the same id already exists", function () {
                var contact = {
                        "name": "rob",
                        "id": "some_id_yo"
                    },
                    error = jasmine.createSpy();

                spyOn(db, "saveObject");
                spyOn(db, "retrieveObject").andReturn([contact]);

                contacts.save(function (item) {
                    expect(item.id).toEqual(contact.id);
                    expect(item.name).toEqual(contact.name);
                    expect(db.saveObject.argsForCall[0][0]).toBe("phonegap-contacts");
                    expect(db.saveObject.argsForCall[0][1].length).toBe(1);
                    expect(db.saveObject.argsForCall[0][1][0].id).toBe(contact.id);
                }, error, [contact]);
            });
        });
    });

    describe("when removing", function () {
        it("can remove itself", function () {
            var contact = {id: "id", "name": "michelle"},
                data = [contact],
                error = jasmine.createSpy();

            contact.id = "some_awesome_id";

            spyOn(db, "saveObject");
            spyOn(db, "retrieveObject").andReturn(data);

            contacts.remove(function () {
                expect(data.length).toBe(0);
                expect(db.saveObject).toHaveBeenCalledWith("phonegap-contacts", []);
            }, error, [contact.id]);
        });

        it("calling remove on a non-existent contact id should return PENDING_OPERATION_ERROR", function () {
            var contact = {"name": "fabio", id: "34"},
                data = [contact];

            spyOn(db, "saveObject");
            spyOn(db, "retrieveObject").andReturn(data);

            contacts.remove(function () {}, function (error) {
                expect(typeof error).toEqual("object");
                expect(typeof error.message).toEqual("string");
                expect(error.code, ContactError.PENDING_OPERATION_ERROR);
            }, [contact.id]);
        });
    });
});
