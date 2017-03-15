/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var clr = [0, 0, 255, 0];
var lastX = 0;
var lastY = 0;
var smoothness = 0;
var numBristles = 80;
var mixval = 0.9;
var bristles;
var radius = 10;
var colour;
var drawingCanvas;
var context;
var colourPicker;
var cpcontext;
var dist;
var angle;
var i;
window.onload = function () {
    drawingCanvas = document.getElementById('myDrawing');
    colourPicker = document.getElementById('colourpicker');
    colourPicker.style.cursor = 'default';
    if (drawingCanvas.getContext) {
        context = drawingCanvas.getContext('2d');
        bristles = new Array();
        drawingCanvas.addEventListener("mousedown", onDown);
    }
    if (colourPicker.getContext) {
        cpcontext = colourPicker.getContext('2d');
        getCP();
    }
    colourPicker.addEventListener("mousedown", onCPDown);
    clr = [0, 0, 255, 0];

	app.initialize();
};
function getCP() {
    var cp = new Image();
    cp.onload = function () {
        cpcontext.createImageData(350, 150);
        cpcontext.drawImage(cp, 0, 0);
    };
	//cp.crossOrigin = 'anonymous';
    cp.src = "cp.png";
};function onCPDown(e) {
    e.preventDefault();
    e.stopPropagation();
    e.target.style.cursor = 'default';
    colourPicker.addEventListener("mousemove", onCPMove);
    window.addEventListener("mouseup", onCPUp);
    var imgdata = cpcontext.getImageData(e.offsetX, e.offsetY, 1, 1);
    var p = imgdata.data;
    clr = [p[0], p[1], p[2], p[3]];
    document.getElementById('curClr').style.backgroundColor = 'rgba(' + p[0] + ', ' + p[1] + ',' + p[2] + ',' + p[3] + ')';
};function onCPMove(e) {
    e.preventDefault();
    e.stopPropagation();
    e.target.style.cursor = 'default';
    var imgdata = cpcontext.getImageData(e.offsetX, e.offsetY, 1, 1);
    var p = imgdata.data;
    clr = [p[0], p[1], p[2], p[3]];
    document.getElementById('curClr').style.backgroundColor = 'rgba(' + p[0] + ', ' + p[1] + ',' + p[2] + ',' + p[3] + ')';
};function onCPUp(e) {
    colourPicker.removeEventListener("mousemove", onCPMove);
    window.removeEventListener("mouseup", onCPUp);
};function onDown(e) {
    e.preventDefault();
    e.stopPropagation();
    e.target.style.cursor = 'crosshair';
    lastX = e.clientX;
    lastY = e.clientY;
    drawingCanvas.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    numBristles = radius * 10;
    bristles = [];
    var rt = clr[0];
    var gt = clr[1];
    var bt = clr[2];
    var at = clr[3];
    for (i = 0; i < numBristles; ++i) {
        dist = Math.random() * radius;
        angle = Math.random() * 2 * Math.PI;
        bristles.push({dx: Math.sin(angle) * dist, dy: Math.cos(angle) * dist, colour: [rt, gt, bt, at]});
    }
};function onMove(e) {
    var xp = e.clientX;
    var yp = e.clientY;
    for (i = 0; i < numBristles; ++i) {
        var xp2 = xp + bristles[i].dx;
        var yp2 = yp + bristles[i].dy;
        var imageData = context.getImageData(xp2, yp2, 1, 1);
        var pixel = imageData.data;
        var tmpData = context.createImageData(1, 1);
        var tmpPixel = tmpData.data;
        if (pixel[3] == 0) {
            pixel[0] = bristles[i].colour[0];
            pixel[1] = bristles[i].colour[1];
            pixel[2] = bristles[i].colour[2];
            pixel[3] = 0;
        }
        var r = mix(bristles[i].colour[0], pixel[0], mixval);
        var g = mix(bristles[i].colour[1], pixel[1], mixval);
        var b = mix(bristles[i].colour[2], pixel[2], mixval);
        var a = 255;
        bristles[i].colour[0] = r;
        bristles[i].colour[1] = g;
        bristles[i].colour[2] = b;
        bristles[i].colour[3] = a;
        tmpPixel[0] = r;
        tmpPixel[1] = g;
        tmpPixel[2] = b;
        tmpPixel[3] = a;
        context.putImageData(tmpData, xp2, yp2);
    }
    var md = 0;
    var mdx = dif(lastX, xp);
    var mdy = dif(lastY, yp);
    md = mdx > mdy ? mdx : mdy;
    var incx = ((xp - lastX) / md) * 2;
    var incy = ((yp - lastY) / md) * 2;
    md /= 2;
    if (md >= 1) {
        for (j = 0; j < md; ++j) {
            var xpos = lastX + incx * j;
            var ypos = lastY + incy * j;
            for (i = 0; i < numBristles; ++i) {
                var xp2 = xpos + bristles[i].dx;
                var yp2 = ypos + bristles[i].dy;
                var imageData = context.getImageData(xpos, ypos, 1, 1);
                var pixel = imageData.data;
                var tmpData = context.createImageData(1, 1);
                var tmpPixel = tmpData.data;
                if (pixel[3] == 0) {
                    pixel[0] = bristles[i].colour[0];
                    pixel[1] = bristles[i].colour[1];
                    pixel[2] = bristles[i].colour[2];
                    pixel[3] = 0;
                }
                var r = mix(bristles[i].colour[0], pixel[0], mixval);
                var g = mix(bristles[i].colour[1], pixel[1], mixval);
                var b = mix(bristles[i].colour[2], pixel[2], mixval);
                var a = 255;
                bristles[i].colour[0] = r;
                bristles[i].colour[1] = g;
                bristles[i].colour[2] = b;
                bristles[i].colour[3] = a;
                tmpPixel[0] = r;
                tmpPixel[1] = g;
                tmpPixel[2] = b;
                tmpPixel[3] = a;
                context.putImageData(tmpData, xp2, yp2);
            }
        }
    }
    lastX = xp;
    lastY = yp;
};function onUp(e) {
    lastX = 0;
    lastY = 0;
    drawingCanvas.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
};function mix(colour1, colour2, mv) {
    var val = colour1 * mv + colour2 * (1 - mv);
    return val;
};function dif(pos1, pos2) {
    if (pos1 > pos2) {
        return pos1 - pos2;
    }
    return pos2 - pos1;
};function setSize() {
    radius = document.getElementById('size').value;
};
/*
$("#cambiacolor").click(function() {
	  var color1 = Color('red');
	  var color2 = Color('yellow');
	  var mix = RGBMix(color1, color2);
	  
	  console.log(color1.hexString());
	  console.log(color2.hexString());
	  console.log(mix.hexString());
	  
	  $('#color1').css('backgroundColor', color1.hexString());
	  $('#color2').css('backgroundColor', color2.hexString());
	  $('#color3').css('backgroundColor', mix.hexString());
});
function RGBMix(color1, color2) {
  var r = (color1.red() + color2.red()) / 2;
  var g = (color1.green() + color2.green()) / 2;
  var b = (color1.blue() + color2.blue()) / 2;
  
  return Color().rgb([r, g, b]);  
}
*/


