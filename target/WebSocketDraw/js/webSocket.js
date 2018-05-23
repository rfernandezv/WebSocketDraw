    var drawingCanvas = document.getElementById('myDrawing');
    var websocket;
    var output;

    drawingCanvas.addEventListener("mousedown", mouseDown, false);
    drawingCanvas.addEventListener("mousemove", mouseMove, false);
    if (drawingCanvas.getContext) {
    } else {
        alter("oops");
    }

    function mouseMove(event) {
        if (event.shiftKey) {
            position = computeCoordinates(event);
            drawCircle(position.x, position.y);
        }
    }

    function mouseDown(event) {
        position = computeCoordinates(event);
        drawCircle(position.x, position.y);
    }

    function computeCoordinates(event) {
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var currentElement = drawingCanvas;

        do {
            totalOffsetX += currentElement.offsetLeft;
            totalOffsetY += currentElement.offsetTop;
        } while (currentElement = currentElement.offsetParent);

        var posx = event.pageX - totalOffsetX;
        var posy = event.pageY - totalOffsetY;

        return {
            x:posx,
            y:posy
        };
    }

    function drawCircleX(x, y, color, shape, notify) {
        var context = drawingCanvas.getContext('2d');
        var radius = 8;

        context.fillStyle = color;
        if (shape == 'smallcircle') {
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
        } else if (shape == 'bigcircle') {
            context.beginPath();
            context.arc(x, y, 3 * radius, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
        } else if (shape == 'bigsquare') {
            context.fillRect((x - (3 * radius)), (y - (3 * radius)), (6 * radius), (6 * radius));
        } else if (shape == 'smallsquare') {
            context.fillRect((x - (radius)), (y - (radius)), (2 * radius), (2 * radius));
        } else {
            alert(shape);
        }

        if (notify) {
            message = "{'" + shape + "': " + x + "," + y + "," + radius + "," + color + "}";
            websocket.send(message);
        }
    }

    function drawCircle(x, y) {
        var shapeElt = document.getElementById('shapeID');
        var colElt = document.getElementById('colorID');
        drawCircleX(x, y, colElt.value, shapeElt.value, true);
    }

    function updateShape(shape) {
        //var shape = '{"Circle":"173,137,10"}';

        var startDataIndex = shape.search(":");
        var shapeName = shape.substring(2, startDataIndex - 1);

        var definition = shape.substring(startDataIndex + 2, shape.length - 1);
        var nextIndex = definition.search(",");
        var x = definition.substring(0, nextIndex);
        definition = definition.substring(nextIndex + 1, definition.length);
        nextIndex = definition.search(",");
        var y = definition.substring(0, nextIndex);
        definition = definition.substring(nextIndex + 1, definition.length);
        nextIndex = definition.search(",");
        var radius = definition.substring(0, nextIndex);
        var color = definition.substring(nextIndex + 1, definition.length);
        //alert(shapeName);
        drawCircleX(x, y, color, shapeName, false);
    }

    function getRootUri() {
        return "ws://" + location.host + "/WebSocketDraw/draw";
    }

    function init() {
        output = document.getElementById("output");
        websocket = new WebSocket(getRootUri());
        websocket.onopen = function (evt) {
            onOpen(evt)
        };
        websocket.onmessage = function (evt) {
            onMessage(evt)
        };
        websocket.onerror = function (evt) {
            onError(evt)
        };
    }

    function clone() {
        window.open("index.html", "clone");
    }

    function testit() {
        var elt = document.getElementById('shapeID');
        alert(elt.value)
    }

    function clear_canvas() {
        var context = drawingCanvas.getContext('2d');
        context.fillStyle = "white";
        context.fillRect(0, 0, 500, 500);
        context.fill();
    }

    function onMessage(evt) {
        updateShape(evt.data);
    }

    function onOpen(evt) {
    }
    function onError(evt) {
    }

    window.addEventListener("load", init, false);