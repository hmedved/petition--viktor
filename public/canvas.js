// Canvas element
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var signature = document.getElementById("signature");

// In start there is no signature comrade!
var sign;
// X & Y cordinates comrade!
var mouseX;
var mouseY;

function movePencil(e) {
    if (sign == true) {
        ctx.beginPath();
        ctx.moveTo(mouseX, mouseY);
        ctx.lineTo(e.offsetX, e.offsetY);
        mouseX = e.offsetX;
        mouseY = e.offsetY;
        ctx.stroke();
        ctx.lineJoin = "round";
    }
}

// Start signaturing comrade!
canvas.addEventListener("mousedown", function(e) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    sign = true;
});

canvas.addEventListener("mousemove", movePencil);

// Stop drawing comrade!
canvas.addEventListener("mouseup" || "mouseout", () => {
    sign = false;
    // Transfering signature value to data URL
    signature.value = canvas.toDataURL();
});
