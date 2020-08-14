'use strict';

var util = require('util'),
    path = require('path'),
    shell = require('shelljs'),
    isValidHostName = require('is-valid-hostname'),
    debug = require('debug')('dns-sync');

// https://nodejs.org/api/dns.html#dns_dns_resolve_hostname_rrtype_callback
var RRecordTypes = [
    'A',
    'AAAA',
    'NS',
    'NAPTR',
    'CNAME',
    'SOA',
    'SRV',
    'PTR',
    'MX',
    'TXT',
    'ANY'];

/**
 * Resolve hostname to IP address,
 * returns null in case of error
 */
module.exports = {
    lookup: function lookup(hostname) {
        return module.exports.resolve(hostname);
    },
    resolve: function resolve(hostname, type) {
        var nodeBinary = process.execPath;

        if (!isValidHostName(hostname)) {
            console.error('Invalid hostname:', hostname);
            return null;
        }
        if (typeof type !== 'undefined' && RRecordTypes.indexOf(type) === -1) {
            console.error('Invalid rrtype:', type);
            return null;
        }

        var scriptPath = path.join(__dirname, "../scripts/dns-lookup-script"),
            response,
            cmd = util.format('"%s" "%s" %s %s', nodeBinary, scriptPath, hostname, type || '');

        response = shell.exec(cmd, {silent: true});
        if (response && response.code === 0) {
            return JSON.parse(response.stdout);
        }
        debug('hostname', "fail to resolve hostname " + hostname);
        return null;
    }
};
