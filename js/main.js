//Contains all color stops
var gradient = [new ColorStop(241, 206, 239, 0), new ColorStop(241, 206, 239, 50), new ColorStop(199, 122, 218, 100)];
var defaultGradient = [new ColorStop(0, 0, 0, 0), new ColorStop(255, 255, 255, 100)];

//Other needed variables
var angle = 0;
var radialTrack = false;
var radialWidth = 0;
var movingStop = "";

//Canvas variables
var wheelCanvas = $("#colorWheel").get(0);
var wheelCtx = wheelCanvas.getContext("2d");

var gSlide = new GradientSlider(
  $("#gradient"),
  $("#gradient").width(),
  gradient,
  {left: 10, right: 25},
  0
);

//CSS stynax strings
const linearPre = "linear-gradient(";
const post = ")"

//
// DOCUMENT READY
//

$(document).ready(() => {
  radialWidth = $("#radial").width() / 2;
  placeColorStops();
  gSlide.setActive(1);
  drawColorWheel();
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
    var cStop = gSlide.stops[cStopIndex];
    var leftBound, rightBound;
    leftBound = gSlide.left();
    rightBound = gSlide.right();

    if (cStopIndex > 0) {
      leftBound = $("#cs" + (cStopIndex-1)).offset().left;
    }
    if (cStopIndex < gSlide.stops.length - 1) {
      rightBound =  $("#cs" + (cStopIndex+1)).offset().left;
    }

    //Calculate the stop delta
    var deltaMove;
    deltaMove = event.pageX - cStopElem.offset().left;

    //Move Stop
    if (cStopElem.offset().left + deltaMove > leftBound && cStopElem.offset().left + deltaMove < rightBound) {
      //Can move either way
      cStopElem.offset({
        left: cStopElem.offset().left + deltaMove,
        top: cStopElem.offset().top
      });
    } else if (cStopElem.offset().left + deltaMove < leftBound) {
      cStopElem.offset({
        left: leftBound,
        top: cStopElem.offset().top
      });
    } else if (cStopElem.offset().left + deltaMove > rightBound) {
      cStopElem.offset({
        left: rightBound,
        top: cStopElem.offset().top
      });
    }

    //Calculate new stop value
    var newStop = cStopElem.offset().left - gSlide.left();
    newStop /= gSlide.right() - gSlide.left();
    newStop *= 100;
    newStop = Math.round(newStop);

    cStop.stop = newStop;

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
  gSlide.stops = defaultGradient;
  updateDisplay();
  updateColorStops();
})

$("#gradient").on("mousedown", ".color-stop", function() {
  event.preventDefault();
  movingStop = $(this).get(0).id;
  gSlide.setActive(parseInt(movingStop.charAt(movingStop.length-1)));
})

$("#gradient").on("click", ".color-stop", function() {
  event.preventDefault();
  var s = $(this).get(0).id
  gSlide.setActive(parseInt(s.charAt(s.length-1)));
})

$("#stopAdd").click(() => {
  addNewColorStop();
})

$("#stopSub").click(() => {
  removeActiveStop();
})

$("#random").click(() => {
  var stops = Math.randomRange(2,3);
  gSlide.stops = [];
  var previousP = 0;
  for (var i = 0; i < stops; i++) {
    var r,g,b,p;
    r = Math.randomRange(0,255);
    g = Math.randomRange(0,255);
    b = Math.randomRange(0,255);
    p = Math.randomRange(previousP,100);
    previousP = p;
    gSlide.stops.push(new ColorStop(r,g,b,p));
  }
  angle = Math.randomRange(0,360);
  updateColorStops();
  gSlide.setActive(0);
  setRadialAngle();
  updateDisplay();
})

$(window).resize(() => {
  gSlide.width = $("#gradient").width();
  gSlide.offset = {left: gSlide.width / 60, right: gSlide.width/20};
  updateColorStops();
})

//
// OBJECTS
//

function GradientSlider (elem, width, stops, offset, activeStop) {
  this.width = width;
  this.stops = stops;
  this.element = elem;
  this.left = function () {
    return elem.offset().left + offset.left;
  }
  this.right = function () {
    return elem.offset().left + this.width - offset.right;
  }
  this.activeStop = activeStop;
  this.setActive = function(stop) {
    if (stop >= 0 && stop < this.stops.length) {
      $("#cs"+this.activeStop).removeClass("active");
      $("#cs"+stop).addClass("active");
      this.activeStop = stop;
      updateActiveColor();
    }
  }
}

function ColorStop (r, g, b, stop) {
  this.r = r; //Red
  this.g = g; //Green
  this.b = b; //Blue
  this.stop = stop; //Percent
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

function drawColorWheel() {
  console.log("Drawing Color Wheel");
  var wheelData = wheelCtx.createImageData(wheelCanvas.width, wheelCanvas.height);
  var data = wheelData.data;

  for (var i = 0; i < data.length; i += 4) {
    var x, y;
    var color = getWheelColorAt(x, y);
    data[i] = color[0];
    data[i+1] = color[1];
    data[i+2] = color[2];
    data[i+3] = color[3];
  }

  wheelData.data = data;

  wheelCtx.putImageData(wheelData, 0, 0);
}

function getWheelColorAt(x, y) {
  var color = [0,0,0,0];

  color = [80,100,240,255];

  return color;
}

function updateActiveColor() {
  $("#activeColor").css("background", getColor(gSlide.stops[gSlide.activeStop]));
  var c = gSlide.stops[gSlide.activeStop];
  $("#activeColorHex").text(("#"+c.r.toString(16)+c.g.toString(16)+c.b.toString(16)).toUpperCase());
}

function updateColorStops() {
  $("#gradient").empty();
  placeColorStops();
}

function updateColorGradient() {
  var grad = linearPre;
  grad += "90deg";
  gSlide.stops.forEach(function(item, index, array) {
    grad += ", " + getColor(item) + " " + item.stop + "%";
  });
  grad += post;
  $("#gradient").css("background", grad);
}

//Adds all current color stops
function placeColorStops() {
  gSlide.stops.forEach((item, index, array) => {
    addColorStop(item, index);
  })
}

function removeActiveStop() {
  if (gSlide.stops.length > 1) {
    gSlide.stops.splice(gSlide.activeStop, 1);
  }
  gSlide.setActive(0);
  updateColorStops();
  updateActiveColor();
  updateDisplay();
}

function addNewColorStop() {
  if (gSlide.stops.length < 6) {
    gSlide.stops.push(new ColorStop(255,255,255, 100));
    updateColorStops();
    gSlide.setActive(gSlide.stops.length-1);
    updateActiveColor();
    updateDisplay();
  }
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
  gSlide.stops.forEach(function(item, index, array) {
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
