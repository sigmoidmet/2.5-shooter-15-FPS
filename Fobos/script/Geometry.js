



function _distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 -y2, 2));
}


function lineAngle(x1, y1, x2, y2) {
    var angle = Math.atan((y1 - y2) / (x1 - x2));
    if (angle > PI) angle = (angle % (2 * PI)) - 2 * PI;
    if (angle < -PI) angle = (angle % (2 * PI)) + 2 * PI;
    return angle; 
}