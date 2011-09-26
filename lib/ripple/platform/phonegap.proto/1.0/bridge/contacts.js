var db = require('ripple/db'),
    utils = require('ripple/utils'),
    _self;

function _defaultContacts() {
    return [{
        "name": new ContactName("Brent Lintner"),
        "displayName": "Brent Lintner",
        "emails": [new ContactField("work", "brent@tinyhippos.com", false)]
    }, {
        "name": new ContactName("PJ Lowe"),
        "displayName": "PJ Lowe",
        "emails": [new ContactField("work", "pj@tinyhippos.com", false)]
    }, {
        "name": new ContactName("Dan Silivestru"),
        "displayName": "Dan Silivestru",
        "emails": [new ContactField("work", "dan@tinyhippos.com", false)]
    }, {
        "name": new ContactName("Gord Tanner"),
        "displayName": "Gord Tanner",
        "emails": [new ContactField("work", "gord@tinyhippos.com", true)]
    }, {
        "name": new ContactName("Mark McArdle"),
        "displayName": "Mark McArdle",
        "emails": [new ContactField("work", "mark@tinyhippos.com", false)]
    }].map(function (person) {
        var contact = new Contact();
        contact.updated = new Date();
        utils.forEach(person, function (value, prop) {
            contact[prop] = value;
        });
        return contact;
    });
}

function _getContacts() {
    return db.retrieveObject("phonegap-contacts") || _defaultContacts();
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

function _error(callback, code, msg) {
    var e = new ContactError();
    e.code = code;
    e.message = msg;
    callback(e);
}

_self = {
    search: function (success, error, args) {
        var fields = args[0],
            options = args[1],
            foundContacts = [],
            tempContact = navigator.contacts.create(),
            contacts = _getContacts(),
            errorFlag = false;

        options = options || {};

        // handle special case of ["*"] to return all fields
        if (fields.length === 1 && fields[0] === "*") {
            fields = utils.map(tempContact, function (v, k) {
                return k;
            });
        }

        fields.forEach(function (prop) {
            if (!(tempContact.hasOwnProperty(prop))) {
                errorFlag = true;
                _error(error, ContactError.INVALID_ARGUMENT_ERROR, "invalid contact field (" + prop + ")");
            }
        });

        if (errorFlag) {
            return;
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
    }
};

module.exports = _self;
