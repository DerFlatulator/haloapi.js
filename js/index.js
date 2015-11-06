/// <reference path="./haloapi.d.ts"/>
/// <reference path="./lib/tsd.d.ts" />
var Stats = require("./stats");
var Metadata = require("./metadata");
var Profile = require("./profile");
var request_1 = require("request");
var HaloAPI = (function () {
    function HaloAPI(apiKey, title) {
        if (title === void 0) { title = "h5"; }
        this.title = title;
        this.stats = new Stats(this);
        this.metadata = new Metadata(this);
        this.profile = new Profile(this);
        this.apiKey = apiKey;
        this.host = "https://www.haloapi.com";
    }
    HaloAPI.prototype.getJSON = function (endpoint, callback) {
        var options = {
            url: this.host + endpoint,
            headers: {
                'Ocp-Apim-Subscription-Key': this.apiKey
            }
        };
        // TODO switch to "request-promise" 
        // TODO check if we're running in a browser and use XMLHttpRequest
        request_1.get(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(JSON.parse(body));
            }
            else {
                // TODO handle throttling
                try {
                    var obj = JSON.parse(body);
                    callback(null, obj.statusCode + " - " + obj.message);
                }
                catch (e) {
                    callback(null, String(response.statusCode));
                }
            }
        });
    };
    HaloAPI.prototype.getImageURL = function (endpoint, callback) {
        var options = {
            url: this.host + endpoint,
            followRedirect: false,
            headers: {
                'Ocp-Apim-Subscription-Key': this.apiKey
            }
        };
        request_1.get(options, function (error, response, body) {
            // console.info(error, response, body);
            if (response.statusCode == 302) {
                callback(response.headers.location);
            }
            else {
                callback(null, response.statusCode);
            }
        });
    };
    HaloAPI.prototype.isGuid = function (id) {
        if (id && /^[a-zA-Z0-9\-]+$/.test(id)) {
            return true;
        }
        return false;
    };
    return HaloAPI;
})();
;
module.exports = HaloAPI;
