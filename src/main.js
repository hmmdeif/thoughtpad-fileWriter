var fs = require('co-fs'),
    fsp = require('co-fs-plus');

var removeDirectory = function *(folder) {
    try {
        var files = yield fs.readdir(folder),
            i = 0,
            len = files.length,
            curPath,
            stat;

        for (i; i < len; i++) {
            curPath = folder + "/" + files[i];
            isDirectory = false;

            stat = yield fs.lstat(curPath);

            if (stat.isDirectory()) { // recurse
                yield removeDirectory(curPath);
            } else { // delete file
                yield fs.unlink(curPath);
            }
        }

        yield rmdir(folder);
    } catch (ex) {}
},

// The following two functions are a nightmare. On windows, it doesn't yield correctly when unlinking files,
// so there may be the case when it tries to remove a non-empty folder. There is so way around this apart from
// trying again a few ms later. In testing this happens irregularly and only when the live reload plugin is watching
// the folder (delay in the unlink event bubbling up).
rmdir = function *(folder) {
    try {
        yield fs.rmdir(folder);
    } catch (e) {
        yield function (cb) {
            setTimeout(cb, 500);
        };
        yield rmdir(folder);
    }
},

mkdir = function *(folder) {
    try {
        yield fs.mkdir(folder);
    } catch (e) {
        yield function (cb) {
            setTimeout(cb, 500);
        };
        yield mkdir(folder);
    }
},

remakeDirectory = function *(folder) {

    yield removeDirectory(folder);

    yield mkdir(folder);
},

writeFile = function *(file, data, splitPart) {
    if (!splitPart) {
        splitPart = "out/";
    }

    var realPart = file.replace(/\\/g, "/").split(splitPart)[0],
        realFile = yield fs.realpath(realPart)
        file = file.replace(realPart, realFile + "/").replace(/\\/g, "/"),
        folders = file.split('/'),
        i = 0,
        currentFolder = "",
        exists = false,
        separator = "",
        len = folders.length - 1; // we don't want the last part of the path as that's the filename

    // Make the directory structure for the files to sit in before copying the file
    for (i; i < len; i++) {
        currentFolder += separator + folders[i];
        exists = yield fs.exists(currentFolder);
        if (!exists && currentFolder !== "") {
            yield fs.mkdir(currentFolder);
        }
        separator = "/";
    }
    yield fs.writeFile(file, data);
},

copyDirectory = function *(startLocation, endLocation, splitPart) {
    var startFiles = yield fsp.readdir(startLocation, null, []),
        i = 0,
        file,
        len = startFiles.length,
        fileName;

    for (i; i < len; i++) {
        file = yield fs.readFile(startFiles[i]);
        fileName = startFiles[i].replace(/\\/g, "/").replace(startLocation.replace('./', ''), "");
        yield writeFile(endLocation + '/' + fileName, file, splitPart);
    }
};

module.exports = {
    writeFile: writeFile,
    copyDirectory: copyDirectory,
    remakeDirectory: remakeDirectory
}
