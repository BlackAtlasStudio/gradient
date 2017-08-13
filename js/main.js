//Contains all color stops
var gradient = [new ColorStop(241, 206, 239, 0), new ColorStop(241, 206, 239, 50), new ColorStop(199, 122, 218, 100)];

//Other needed variables
var angle = 0;
var radialTrack = false;
var radialWidth = 0;

//CSS stynax additions
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
    var a = Math.floor((360 - toDegrees(Math.atan2(x, y)) + 180) % 360);
    angle = a;
    $("#rad-ind").offset({
      top: y / len * radialWidth + offset.top + radialWidth - $("#rad-ind").width() / 2,
      left: x / len * radialWidth + offset.left + radialWidth - $("#rad-ind").width() / 2
    });
    updateDisplay();
  }
})

$("#radial").mousedown((event) => {
  console.log("Mousedown");
  event.preventDefault();
  radialTrack = true;
})

$(document).mouseup(() => {
  radialTrack = false;
})

$("#linear").click(() => {
  console.log("Linear");
  gradientType = "linear";
  updateDisplay();
})

$("#copy").click(() => {
  console.log("Copying data");
  $("#output").get(0).select();
  document.execCommand("copy");
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
  console.log("Updating Display");
  $("body").css("background", getGradient());
  $("#output").val("background: " + getGradient() + ";");
}

//Adds all current color stops
function placeColorStops() {
  console.log("Adding Color Stops");
  gradient.forEach((item, index, array) => {
    console.log("Color Stop", index);
    addColorStop(item, index);
  })
}

//Adds individual color stop
function addColorStop(colorStop, index) {
  $("#gradient").append("<span id=\"cs"+index+"\" class=\"color-stop\">C</span>");
  $("#cs" + index).offset({
    top: 40 + $("#cs" + index).offset().top,
    left: colorStop.stop/100 * $("#gradient").width()
      + $("#cs" + index).offset().left
      - $("#gradient").width()/2
  });
  $("#cs" + index).css("background-color", getColor(colorStop));
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

function toDegrees(rad) {
  return rad * (180 / Math.PI);
}
