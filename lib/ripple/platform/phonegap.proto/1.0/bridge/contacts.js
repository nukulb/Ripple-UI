var db = require('ripple/db'),
    utils = require('ripple/utils'),
    _self;

function _default() {
    return [{
        "name": {formatted: "Brent Lintner"},
        "displayName": "Brent Lintner",
        "emails": [{type: "work", value: "brent@tinyhippos.com", pref: false}]
    }, {
        "name": {formatted: "PJ Lowe"},
        "displayName": "PJ Lowe",
        "emails": [{type: "work", value: "pj@tinyhippos.com", pref: false}]
    }, {
        "name": {formatted: "Dan Silivestru"},
        "displayName": "Dan Silivestru",
        "emails": [{type: "work", value: "dan@tinyhippos.com", pref: false}]
    }, {
        "name": {formatted: "Gord Tanner"},
        "displayName": "Gord Tanner",
        "emails": [{type: "work", value: "gord@tinyhippos.com", pref: true}]
    }, {
        "name": {formatted: "Mark McArdle"},
        "displayName": "Mark McArdle",
        "emails": [{type: "work", value: "mark@tinyhippos.com", pref: false}]
    }].map(navigator.contacts.create);
}

function _get() {
    return db.retrieveObject("phonegap-contacts") || _default();
}

function _save(contacts) {
    db.saveObject("phonegap-contacts", contacts);
}

function _filtered(compare, options) {
    // this could be done a lot better..
    var found = false;
    if (!options.filter || options.filter === "") {
        found = true;
    } else if (typeof compare === "string" &&
              compare.match(new RegExp(".*" + options.filter + ".*", "i"))) {
        found = true;
    } else if (typeof compare === "object" || compare instanceof Array) {
        utils.forEach(compare, function (value) {
            if (!found) {
                found = _filtered(value, options);
            }
        });
    }
    return found;
}

_self = {
    search: function (success, error, args) {
        var fields = args[0],
            options = args[1],
            foundContacts = [],
            tempContact = navigator.contacts.create(),
            contacts = _get();

        options = options || {};

        // handle special case of ["*"] to return all fields
        if (fields.length === 1 && fields[0] === "*") {
            fields = utils.map(tempContact, function (v, k) {
                return k;
            });
        }

        if (fields.length > 0) {
            contacts.forEach(function (contact, index) {
                var newContact = utils.copy(contact);

                if (options && (!_filtered(contact, options) ||
                        options.updatedSince && contact.updated && contact.updated.getTime() < options.updatedSince.getTime())) {
                    return;
                }

                utils.forEach(newContact, function (value, prop) {
                    if (typeof newContact[prop] !== "function" && prop !== "id" &&
                        !fields.some(function (field) {
                            return field === prop;
                        })) {
                        delete newContact[prop];
                    }
                });

                foundContacts.push(newContact);
            });
        }

        // TODO: don't loop over entire db just to slice the array
        if (options.multiple === false) {
            foundContacts = foundContacts.splice(0, 1);
        }
        success(foundContacts);
    },

    save: function (success, error, args) {
        var contacts = _get(),
            existsIndex = contacts.reduce(function (result, value, index) {
                return value.id === args[0].id ? index : result;
            }, -1),
            contact = existsIndex >= 0 ? contacts[existsIndex] : new navigator.contacts.create();

        if (!contact.id) {
            contact.id = Math.uuid(undefined, 16);
        }

        utils.mixin(args[0], contact);
        if (existsIndex < 0) {
            contacts.push(contact);
        }
        _save(contacts);
        if (success) {
            success(contact);
        }
    }
};

module.exports = _self;
