//Contains all color stops
var gradient = [new ColorStop(0,0,0,0), new ColorStop(255,255,255, 100)];

//Other needed variables
var angle = 0;
var radialTrack = false;
var radialWidth = 0;

//CSS stynax additions
const pre = "linear-gradient(";
const post = ")"

//
// DOCUMENT READY
//

$(document).ready(() => {
  radialWidth = $("#radial").width() / 2;
})

//
// UI RESPONSE
//

$(document).mousemove((event) => {
  if (radialTrack) {
    var offset = $("#radial").offset();
    var x = event.pageX - offset.left - radialWidth;
    var y = event.pageY - offset.top - radialWidth;
    var a = 360 - toDegrees(Math.atan2(x, y)) + 180;
    angle = a;
    updateDisplay();
    console.log(a);
  }
})

$("#radial").mousedown(() => {
  radialTrack = true;
})

$(document).mouseup(() => {
  radialTrack = false;
})

$("#red").click(() => {
  $("body").css("background", getGradient());
})

$("#blue").click(() => {
  $("body").css("background", "rgb(0,0,255)");
})

//
// OBJECTS
//

function ColorStop (r, g, b, stop) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.stop = stop;
}

//
// HELPER FUNCTIONS
//

//Updates the background with current gradient
function updateDisplay() {
  $("body").css("background", getGradient());
}

//Returns formatted gradient string
function getGradient() {
  var value = pre;
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

function toDegrees(rad) {
  return rad * (180 / Math.PI);
}
