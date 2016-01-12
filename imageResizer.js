'use strict';

var lwip = require('lwip');
var nativeImage = require('electron').nativeImage;

class ImageResizer {
    static resizeImage(fullFilePath, width, height, callback) {
        lwip.open(fullFilePath, function(err, image) {
            if (err) {
                callback(err);
                return;
            }

            image.contain(width, height, "black", function(err, containedImage) {
                if (err) {
                    callback(err);
                    return;
                }

                containedImage.toBuffer("png", function(err, buffer) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    var nativeImageThing = nativeImage.createFromBuffer(buffer);
                    var data = nativeImageThing.toDataURL();

                    callback(null, data);
                });
            });
        });
    }
}

module.exports = ImageResizer;