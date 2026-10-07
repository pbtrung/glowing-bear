'use strict';

// Wrap a delimiter so it's colored like WeeChat's chat_time_delimiters
const timeDelimiter = function (delim) {
    return (
        '\'<span class="cof-chat_time_delimiters cob-chat_time_delimiters ' +
        'coa-chat_time_delimiters">' +
        delim +
        "</span>'"
    );
};

/*
 * Convert WeeChat's buffer time format (strftime, option
 * weechat.look.buffer_time_format) to a format for AngularJS' date filter.
 *
 * Where strftime uses e.g. %I:%M:%S for 12h time, the date filter uses
 * hh:mm:ss. We detect what format the user has set in WeeChat and slot it
 * into one of four formats, (short|long) (12|24)-hour time, optionally
 * preceded by the date.
 *
 * @param timeFormat the strftime format
 * @return format string for the AngularJS date filter
 */
export const weechatTimeFormatToAngular = function (timeFormat) {
    timeFormat = timeFormat || '%H:%M:%S';
    var angularFormat;

    var delimiter = timeDelimiter(':');

    var left12 = 'hh' + delimiter + 'mm';
    var right12 = "'&nbsp;'a";

    var short12 = left12 + right12;
    var long12 = left12 + delimiter + 'ss' + right12;

    var short24 = 'HH' + delimiter + 'mm';
    var long24 = short24 + delimiter + 'ss';

    var has = function (spec) {
        return timeFormat.indexOf(spec) > -1;
    };

    if (has('%H') || has('%k')) {
        // 24h time detected
        angularFormat = has('%S') ? long24 : short24;
    } else if (has('%I') || has('%l') || has('%p') || has('%P')) {
        // 12h time detected
        angularFormat = has('%S') ? long12 : short12;
    } else if (has('%r')) {
        // strftime doesn't have an equivalent for short12
        angularFormat = long12;
    } else if (has('%T')) {
        angularFormat = long24;
    } else {
        // %R, or anything we don't know
        angularFormat = short24;
    }

    // Assemble date format
    var dateComponents = [];

    // Check for day of month in time format
    dateComponents.push([
        Math.max(timeFormat.indexOf('%d'), timeFormat.indexOf('%e')),
        'dd',
    ]);

    // month of year?
    dateComponents.push([timeFormat.indexOf('%m'), 'MM']);

    // year as well?
    if (has('%y')) {
        dateComponents.push([timeFormat.indexOf('%y'), 'yy']);
    } else if (has('%Y')) {
        dateComponents.push([timeFormat.indexOf('%Y'), 'yyyy']);
    }

    // if there is a date, assemble it in the right order
    var formatArray = dateComponents
        .filter(function (component) {
            return component[0] !== -1;
        })
        .sort(function (a, b) {
            return a[0] - b[0];
        })
        .map(function (component) {
            return component[1];
        });
    if (formatArray.length > 0) {
        // TODO: parse delimiter as well? For now, use '/' as it is
        // more common internationally than '-'
        var dateFormat = formatArray.join(timeDelimiter('/'));
        angularFormat = dateFormat + timeDelimiter('&nbsp;') + angularFormat;
    }

    return angularFormat;
};
