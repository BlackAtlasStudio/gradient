//Contains all color stops
var gradient = [new ColorStop(241, 206, 239, 0), new ColorStop(241, 206, 239, 50), new ColorStop(199, 122, 218, 100)];
var defaultGradient = [new ColorStop(0, 0, 0, 0), new ColorStop(255, 255, 255, 100)];

//Other needed variables
var angle = 0;
var radialTrack = false;
var radialWidth = 0;
var movingStop = "";

var gSlide = new GradientSlider($("#gradient").width(), gradient);

//CSS stynax strings
const linearPre = "linear-gradient(";
const post = ")"

//
// DOCUMENT READY
//

$(document).ready(() => {
  radialWidth = $("#radial").width() / 2;
  placeColorStops();
  updateDisplay();
})

//
// UI RESPONSE
//

$(document).mousemove((event) => {
  if (radialTrack) {
    var offset = $("#radial").offset();
    var x = event.pageX - offset.left - radialWidth;
    var y = event.pageY - offset.top - radialWidth;
    var len = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    var a = Math.floor((360 - Math.toDegrees(Math.atan2(x, y)) + 180) % 360);
    angle = a;
    setRadialAngle();
    updateDisplay();
  }

  if (movingStop !== "") { //kinda jank but good enough
    var cStopElem = $("#"+movingStop);
    var cStopIndex = parseInt(movingStop.charAt(movingStop.length-1))
    var cStop = gradient[cStopIndex];
    var leftBound = 0, rightBound = $("#gradient").width();

    if (cStopIndex > 0) {
      leftBound = gradient[cStopIndex-1].stop;
    }
    if (cStopIndex < gradient.length - 1) {
      rightBound = gradient[cStopIndex+1].stop;
    }
    console.log("Left:", leftBound, "Right:", rightBound);

    //Calculate the stop delta
    var deltaMove, deltaStop;
    deltaMove = event.pageX - cStopElem.offset().left;
    //console.log(deltaMove);
    deltaStop = deltaMove / $("#gradient").width();
    if (deltaStop > 0) {
      deltaStop = Math.ceil(deltaStop);
    } else {
      deltaStop = Math.floor(deltaStop);
    }
    console.log(deltaStop, cStop.stop);

    if (cStop.stop + deltaStop >= leftBound && cStop.stop + deltaStop <= rightBound) {
      //We can move the stop here
      cStopElem.offset({
        left: cStopElem.offset().left + deltaMove,
        top: cStopElem.offset().top
      });
      cStop.stop += deltaStop;
    } else {
      console.log("Can't move");
    }

    updateDisplay();
  }
})

$("#radial").mousedown((event) => {
  event.preventDefault();
  radialTrack = true;
})

$(document).mouseup(() => {
  radialTrack = false;
  movingStop = "";
})

$("#copy").click(() => {
  $("#output").get(0).select();
  document.execCommand("copy");
})

$("#reset").click(() => {
  angle = 0;
  setRadialAngle();
  gradient = defaultGradient;
  updateDisplay();
  updateColorStops();
})

$("#gradient").on("mousedown", ".color-stop", function() {
  event.preventDefault();
  movingStop = $(this).get(0).id;
})

$("#stopAdd").click(() => {

})

$("#stopSub").click(() => {

})

$("#random").click(() => {
  var stops = Math.randomRange(2,3);
  gradient = [];
  var previousP = 0;
  for (var i = 0; i < stops; i++) {
    var r,g,b,p;
    r = Math.randomRange(0,255);
    g = Math.randomRange(0,255);
    b = Math.randomRange(0,255);
    p = Math.randomRange(previousP,100);
    previousP = p;
    gradient.push(new ColorStop(r,g,b,p));
  }
  angle = Math.randomRange(0,360);
  updateColorStops();
  setRadialAngle();
  updateDisplay();
})

//
// OBJECTS
//

function GradientSlider (width, stops) {
  this.width = width;
  this.stops = stops;
  this.getBounds = function(stop) {

  }
}

function ColorStop (r, g, b, stop, elem) {
  this.r = r; //Red
  this.g = g; //Green
  this.b = b; //Blue
  this.stop = stop; //Percent
  this.element = elem; //ColorStop Element
}

//
// HELPER FUNCTIONS
//

//Updates the background with current gradient
function updateDisplay() {
  var g = getGradient();
  $("body").css("background", g);
  $("#output").val("background: " + g + ";" +
    "\nbackground: -webkit-" + g + ";" +
    "\nbackground: -o-" + g + ";" +
    "\nbackground: -moz-" + g + ";"
  );
  updateColorGradient();
}

function updateColorStops() {
  $("#gradient").empty();
  placeColorStops();
}

function updateColorGradient() {
  var grad = linearPre;
  grad += "90deg";
  gradient.forEach(function(item, index, array) {
    grad += ", " + getColor(item) + " " + item.stop + "%";
  });
  grad += post;
  $("#gradient").css("background", grad);
}

//Adds all current color stops
function placeColorStops() {
  gradient.forEach((item, index, array) => {
    addColorStop(item, index);
  })
}

//Adds individual color stop
function addColorStop(colorStop, index) {
  $("#gradient").append("<div id=\"cs"+index+"\" class=\"color-stop\"></div>");
  $("#cs" + index).offset({
    top: 40 + $("#cs" + index).offset().top,
    left: colorStop.stop/100 * ($("#gradient").width() - 35)
      + $("#cs" + index).offset().left + 10
  });
  $("#cs" + index).css("background-color", getColor(colorStop));
}

function setRadialAngle() {
  var offset = $("#radial").offset();
  var x, y;
  x = Math.cos(Math.toRadians(angle - 90));
  y = Math.sin(Math.toRadians(angle - 90));
  $("#rad-ind").offset({
    top: y * radialWidth + offset.top + radialWidth - $("#rad-ind").width()/2,
    left: x * radialWidth + offset.left + radialWidth - $("#rad-ind").width()/2
  });
}

//Returns formatted gradient string
function getGradient() {
  var value = "";
  value += linearPre;
  value += angle + "deg";
  gradient.forEach(function(item, index, array) {
    value += ", " + getColor(item) + " " + item.stop + "%";
  });
  value += post;
  return value;
}

//Returns formatted color
function getColor(color) {
  var value = "rgb(";
  if (color === undefined) {
    value += "60,40,20"; //Error color
  } else {
    value += color.r + ",";
    value += color.g + ",";
    value += color.b;
  }
  value += ")"
  return value;
}

//
// UTILITY FUNCTIONS
//

Math.randomRange = function (a,b) {
    return Math.floor(Math.random() * (b - a + 1) + a);
}

Math.toDegrees = function (rad) {
  return rad * 57.2958;
}

Math.toRadians = function (deg) {
  return deg * 0.0174533;
}
