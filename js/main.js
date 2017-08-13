//Contains all color stops
var gradient = [new ColorStop(0,0,0,0), new ColorStop(255,255,255, 100)];

//Other needed variables
var angle = 0;

//CSS stynax additions
const pre = "linear-gradient(";
const post = ")"

//
// DOCUMENT READY
//

$(document).ready(() => {

})

//
// UI RESPONSE
//

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

function getGradient() {
  var value = pre;
  value += angle + "deg";
  gradient.forEach(function(item, index, array) {
    value += ", " + getColor(item) + " " + item.stop + "%";
  });
  value += post;
  return value;
}

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
