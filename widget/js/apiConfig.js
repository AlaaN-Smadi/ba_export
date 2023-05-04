'use strict';

const api_config = {
    "USER_DATA": "USER_DATA",
    "LOCATION_DATA": "LOCATION_DATA",
    "EVENTS_DATA": "EVENTS_DATA",
}

// options = {appId:'', email:'', type:''}
function fetch_BA_data(options) {
    buildfire.spinner.show();
    ui_elements.exportBtn.setAttribute('disabled', 'disabled');

    // an api call will be sent to get the data from BiznessApps DB
    let res = [{ id: '123' }], err = null;

    // faild request
    if (err) {
        buildfire.dialog.alert({
            message: "Something went wrong",
        });
        ui_elements.exportBtn.removeAttribute('disabled');
        buildfire.spinner.hide();
        return false;
    }
    // success request
    if (res) {
        switch (options.type) {
            case api_config['USER_DATA']:
                convertUsersData(res);
                break;
            case api_config['LOCATION_DATA']:
                convertLocationsData(res);
                break;
            case api_config['EVENTS_DATA']:
                convertEventsData(res);
                break;
            default:
                break;
        }
    }
}

function convertUsersData(data) {
    let users = data.map(user => ({
        /**
         * BF-keyName : value-from-BA
         */
        id: user.id
        // ...
    }))
    downloadCSV(users, "users.csv");
}
function convertLocationsData(data) {
    let locations = data.map(location => ({
        /**
         * BF-keyName : value-from-BA
         */
        id: location.id
        // ...
    }))
    downloadCSV(locations, "locations.csv");
}
function convertEventsData(data) {
    let events = data.map(event => ({
        /**
         * BF-keyName : value-from-BA
         */
        id: event.id
        // ...
    }))
    downloadCSV(events, "events.csv");
}

const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

const downloadCSV = (data, filename) => {
    const csv = jsonToCsv(data);
    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
    });

    var reader = new FileReader();
    reader.onload = function (event) {
        buildfire.navigation.openWindow(event.target.result, "_blank");

        buildfire.spinner.hide();
        ui_elements.exportBtn.removeAttribute('disabled');

    };
    reader.readAsDataURL(blob);
}

/**
 * 
 * @param {Array} objArray array data that should be converted
 * @param {Object} options options to manage the result
 * @returns 
 */
function jsonToCsv(objArray, options) {
    let array;
    try {
        array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    } catch (error) {
        throw "Error while reading csv";
    }
    if (!Array.isArray(array) || !array.length) {
        return;
    }
    let csvStr = "";
    let header = null;
    if (options && options.header) {
        header = options.header;
        for (const key in header) {
            if (header.hasOwnProperty(key)) {
                let value = (header[String(key)] || "").replace(/"/g, '""');
                // remove �
                value = value.replace(/\uFFFD/g, "");
                csvStr += `"${value.trim()}",`;
            }
        }
    } else {
        header = array[0];
        for (const key in header) {
            if (header.hasOwnProperty(key)) {
                let value = key.toString().replace(/"/g, '""');
                // remove �
                value = value.replace(/\uFFFD/g, "");
                csvStr += `"${value.trim()}",`;
            }
        }
    }
    csvStr = csvStr.slice(0, -1) + "\r\n";
    // eslint-disable-next-line no-plusplus
    for (let rowNo = 0, rowLen = array.length; rowNo < rowLen; rowNo++) {
        let line = "";
        for (const index in header) {
            if (!array[rowNo][index] || typeof array[rowNo][index] !== "object") {
                const value = (array[rowNo][index] || "").toString();
                line += '"' + value.replace(/"/g, '""').replace(/\uFFFD/g, "") + '",';
            } else {
                const line1 = JSON.stringify(array[rowNo][index]);
                line += '"' + line1.replace(/"/g, '""').replace(/\uFFFD/g, "") + '",';
            }
        }
        line = line.slice(0, -1);
        const cReturn = rowLen - 1 === rowNo ? "" : "\r\n";
        csvStr = csvStr + line + cReturn;
    }
    return csvStr;
}