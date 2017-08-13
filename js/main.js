var gradient = [[0,0,0, 0],[255,255,255, 50]]; //Start with white to black gradient

var orientation = 0;
var pre = "linear-gradient(";
var post = ")"

var start;

$("#red").click(() => {
  console.log(getGradient());
  $("body").css("background", getGradient());
})

$("#blue").click(() => {
  $("body").css("background", "rgb(0,0,255)");
})

$(document).ready(() => {
  start = new Date();
  setInterval(() => {
    orientation = (1 + orientation) % 360;
    $("body").css("background", getGradient());
  }, 50);
})

function getGradient() {
  var value = pre;
  value += orientation + "deg";
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
