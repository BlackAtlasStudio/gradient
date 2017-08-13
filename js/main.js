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
    value += ", " + getColor([item[0], item[1], item[2]]) + " " + item[3] + "%";
  });
  value += post;
  return value;
}

function getColor(color) {
  var value = "rgb(";
  if (color.length == 3) {
    value += color[0] + ",";
    value += color[1] + ",";
    value += color[2];
  } else {
    value += "160, 80, 0, 255";
  }
  value += ")"
  return value;
}
