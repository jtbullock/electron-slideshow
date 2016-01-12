'use strict';

var fs = require('fs');
var path = require('path');
var imageResizer = require('./imageResizer');

class SlideshowManager {
    constructor(directory) {
        this.directory = directory;

        this.imageCounter = 0;
        this.displayOrder = [];
        this.files;
        this.timer;
        this.isRunning = false;

        fs.readdir(directory, this.onDirectoryRead.bind(this));
    }

    onDirectoryRead(err, files) {
        this.imageCounter = 0;
        this.files = files;
        var nrImages = files.length;
        var currentIndex = nrImages;

        for (var i = 0; i < nrImages; i++) {
            this.displayOrder[i] = i;
        }

        while (0 !== currentIndex) {
            // Pick a remaining element...
            var randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            var temporaryValue = this.displayOrder[currentIndex];
            this.displayOrder[currentIndex] = this.displayOrder[randomIndex];
            this.displayOrder[randomIndex] = temporaryValue;
        }

        this.startSlideshow();
    }

    startSlideshow() {
        this.isRunning = true;
        this.loadNextPicture();
    }

    stopSlideShow() {
        this.isRunning = false;
        clearTimeout(this.timer);
    }

    loadNextPicture() {
        var currentImageNumber = this.imageCounter;
        this.imageCounter++;

        var slideshowSpeed = document.querySelector("#slideshow-speed").value * 1000;
        this.timer = setTimeout(this.loadNextPicture.bind(this), slideshowSpeed);

        var fileName = this.files[this.displayOrder[currentImageNumber]];
        var fileExtension = path.extname(fileName);
        var fullFilePath = this.directory + '/' + fileName;

        if (fileExtension != '.jpg' && fileExtension != '.png' && fileExtension != '.gif') {
            console.log('Unknown file type, returning');
            return;
        }

        console.log(fileName);

        imageResizer.resizeImage(fullFilePath, window.innerWidth, window.innerHeight,
            this.imageResized);
    }

    imageResized(err, data) {
        if (err) {
            console.log(err);
            return;
        }

        displayImage.src = data;
    }
}

module.exports = SlideshowManager;