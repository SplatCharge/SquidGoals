
(function () {

    function mergeObjects(obj1, obj2) {
        var obj3 = {};
        var attrname;
        for (attrname in (obj1 || {})) {
            if (obj1.hasOwnProperty(attrname)) {
                obj3[attrname] = obj1[attrname];
            }
        }
        for (attrname in (obj2 || {})) {
            if (obj2.hasOwnProperty(attrname)) {
                obj3[attrname] = obj2[attrname];
            }
        }
        return obj3;
    }


    function Sketchpad(el, opts) {
        var that = this;

        if (!el) {
            throw new Error('Must pass in a container element');
        }

        opts = opts || {};
        opts.aspectRatio = opts.aspectRatio || 1;
        opts.width = opts.width || el.clientWidth;
        opts.height = opts.height || opts.width * opts.aspectRatio;
        opts.data = opts.data || [];
        opts.line = mergeObjects({
            color: '#000',
            size: 5,
            cap: 'round',
            join: 'round',
            miterLimit: 10
        }, opts.line);



        var strokes = opts.data;
        var undos = [];

        // Boolean indicating if currently drawing
        var sketching = false;

        // Create a canvas element
        var canvas = document.createElement('canvas');

        /**
         * Set the size of canvas
         */
        function setCanvasSize (width, height) {
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';

        }

        /**
         * Get the size of the canvas
         */
        function getCanvasSize () {
            return {
                width: canvas.width,
                height: canvas.height
            };
        }

        setCanvasSize(opts.width, opts.height);
        el.appendChild(canvas);
        var context = canvas.getContext('2d');

        /**
         * Returns a points x,y locations relative to the size of the canvase
         */
        function getPointRelativeToCanvas (point) {
            var canvasSize = getCanvasSize();
            return {
                x: point.x / canvasSize.width,
                y: point.y / canvasSize.height
            };
        }

        /**
         * Returns true if is a touch event, false otherwise
         */
        function isTouchEvent (e) {
            return e.type.indexOf('touch') !== -1;
        }

        /**
         * Get location of the cursor in the canvas
         */
        function getCursorRelativeToCanvas (e) {
            var cur = {};

            if (isTouchEvent(e)) {
                cur.x = e.touches[0].pageX - canvas.offsetLeft - $('.draw-container').offset().left;
                cur.y = e.touches[0].pageY - canvas.offsetTop - $('.draw-container').offset().top;
            } else {
                var rect = that.canvas.getBoundingClientRect();
                cur.x = e.clientX - rect.left;
                cur.y = e.clientY - rect.top;

            }

            return getPointRelativeToCanvas(cur);
        }

        /**
         * Get the line size relative to the size of the canvas
         * @return {[type]} [description]
         */
        function getLineSizeRelativeToCanvas (size) {
            var canvasSize = getCanvasSize();
            return size / canvasSize.width;
        }

        /**
         * Erase everything in the canvase
         */
        function clearCanvas () {
            var canvasSize = getCanvasSize();
            context.clearRect(0, 0, canvasSize.width, canvasSize.height);
        }

        /**
         * Since points are stored relative to the size of the canvas
         * this takes a point and converts it to actual x, y distances in the canvas
         */
        function normalizePoint (point) {
            var canvasSize = getCanvasSize();
            return {
                x: point.x * canvasSize.width,
                y: point.y * canvasSize.height
            };
        }

        /**
         * Since line sizes are stored relative to the size of the canvas
         * this takes a line size and converts it to a line size
         * appropriate to the size of the canvas
         */
        function normalizeLineSize (size) {
            var canvasSize = getCanvasSize();
            return size * canvasSize.width;
        }

        /**
         * Draw a stroke on the canvas
         */
        function drawStroke (stroke) {
            
            context.beginPath();
            
            for (var j = 0; j < stroke.points.length - 1; j++) {
                var start = normalizePoint(stroke.points[j]);
                var end = normalizePoint(stroke.points[j + 1]);

                context.moveTo(start.x, start.y);
                context.lineTo(end.x, end.y);
            }

            context.closePath();

            context.strokeStyle = stroke.color;
            context.lineWidth = normalizeLineSize(stroke.size);
            context.lineJoin = stroke.join;
            context.lineCap = stroke.cap;
            context.miterLimit = stroke.miterLimit;
            $('#test2').html(context.strokeStyle);

            context.stroke();
        }

        Sketchpad.prototype.turnOff = function () {


            canvas.removeEventListener('mousedown', startLine);
            canvas.removeEventListener('touchstart', startLine);

            canvas.removeEventListener('mousemove', drawLine);
            canvas.removeEventListener('touchmove', drawLine);

            canvas.removeEventListener('mouseup', endLine);
            canvas.removeEventListener('mouseleave', endLine);
            canvas.removeEventListener('touchend', endLine);
        };

        Sketchpad.prototype.turnOn = function () {

            canvas.addEventListener('mousedown', startLine);
            canvas.addEventListener('touchstart', startLine);

            canvas.addEventListener('mousemove', drawLine);
            canvas.addEventListener('touchmove', drawLine);

            canvas.addEventListener('mouseup', endLine);
            canvas.addEventListener('mouseleave', endLine);
            canvas.addEventListener('touchend', endLine);

        };

        /**
         * Redraw the canvas
         */
        function redraw () {
            clearCanvas();

            for (var i = 0; i < that.strokes.length; i++) {
                drawStroke(that.strokes[i]);
            }
        }

        // On mouse down, create a new stroke with a start location
        function startLine (e) {
            e.preventDefault();

            strokes = that.strokes;
            sketching = true;
            that.undos = [];

            var cursor = getCursorRelativeToCanvas(e);
            strokes.push({
                points: [cursor],
                color: opts.line.color,
                size: getLineSizeRelativeToCanvas(opts.line.size),
                cap: opts.line.cap,
                join: opts.line.join,
                miterLimit: opts.line.miterLimit
            });

        }

        function drawLine (e) {
            if (!sketching) {
                return;
            }

            e.preventDefault();

            var cursor = getCursorRelativeToCanvas(e);
            that.strokes[strokes.length - 1].points.push({
                x: cursor.x,
                y: cursor.y
            });


            that.redraw();
        }

        function endLine (e) {
            if (!sketching) {
                return;
            }

            e.preventDefault();

            sketching = false;

            if (isTouchEvent(e)) {
                return;  // touchend events do not have a cursor position
            }

            var cursor = getCursorRelativeToCanvas(e);
            that.strokes[strokes.length - 1].points.push({
                x: cursor.x,
                y: cursor.y
            });

            that.redraw();
        }

        // Event Listeners
        canvas.addEventListener('mousedown', startLine);
        canvas.addEventListener('touchstart', startLine);

        canvas.addEventListener('mousemove', drawLine);
        canvas.addEventListener('touchmove', drawLine);

        canvas.addEventListener('mouseup', endLine);
        canvas.addEventListener('mouseleave', endLine);
        canvas.addEventListener('touchend', endLine);


        // Public variables
        this.canvas = canvas;
        this.strokes = strokes;
        this.undos = undos;
        this.opts = opts;

        // Public functions
        this.redraw = redraw;
        this.setCanvasSize = setCanvasSize;
        this.getPointRelativeToCanvas = getPointRelativeToCanvas;
        this.getLineSizeRelativeToCanvas = getLineSizeRelativeToCanvas;
    }


    /**
     * Undo the last action
     */
    Sketchpad.prototype.undo = function () {
        if (this.strokes.length === 0){
            return;
        }

        this.undos.push(this.strokes.pop());
        this.redraw();
    };



    /**
     * Redo the last undo action
     */
    Sketchpad.prototype.redo = function () {
        if (this.undos.length === 0) {
            return;
        }

        this.strokes.push(this.undos.pop());
        this.redraw();
    };


    /**
     * Clear the sketchpad
     */
    Sketchpad.prototype.clear = function () {
        this.undos = [];  // TODO: Add clear action to undo
        this.strokes = [];
        this.redraw();
    };


    /**
     * Convert the sketchpad to a JSON object that can be loaded into
     * other sketchpads or stored on a server
     */
    Sketchpad.prototype.toJSON = function () {
        var canvasSize = this.getCanvasSize();
        return {
            version: 1,
            aspectRatio: canvasSize.width / canvasSize.height,
            strokes: this.strokes
        };
    };


    /**
     * Load a json object into the sketchpad
     * @return {object} - JSON object to load
     */
    Sketchpad.prototype.loadJSON = function (data) {
        this.strokes = data.strokes;
    };


    /**
     * Get a static image element of the canvas
     */
    Sketchpad.prototype.getImage = function () {
        return '<img src="' + this.canvas.toDataURL('image/png') + '"/>';
    };


    /**
     * Set the line size
     * @param {number} size - Size of the brush
     */
    Sketchpad.prototype.setLineSize = function (size) {
        this.opts.line.size = size;
    };


    /**
     * Set the line color
     * @param {string} color - Hexadecimal color code
     */
    Sketchpad.prototype.setLineColor = function (color) {
        //$('#test2').html(color);
        this.opts.line.color = color;
    };


    /**
     * Draw a line
     * @param  {object} start    - Starting x and y locations
     * @param  {object} end      - Ending x and y locations
     * @param  {object} lineOpts - Options for line (color, size, etc.)
     */
    Sketchpad.prototype.drawLine = function (start, end, lineOpts) {
        lineOpts = mergeObjects(this.opts.line, lineOpts);
        start = this.getPointRelativeToCanvas(start);
        end = this.getPointRelativeToCanvas(end);

        this.strokes.push({
            points: [start, end],
            color: lineOpts.color,
            size: this.getLineSizeRelativeToCanvas(lineOpts.size),
            cap: lineOpts.cap,
            join: lineOpts.join,
            miterLimit: lineOpts.miterLimit
        });
        this.redraw();
    };



    Sketchpad.prototype.responsiveResize = function (width, height) {
        this.opts.lineSize = this.opts.lineSize * (width / this.opts.width);
        this.opts.width = width;
        this.opts.height = height;

        this.setCanvasSize(width, height);
        this.redraw();
    };
    /**
     * Resize the canvas maintaining original aspect ratio
     * @param  {number} width - New width of the canvas
     */
    Sketchpad.prototype.resize = function (width) {
        var height = width * this.opts.aspectRatio;
        this.opts.lineSize = this.opts.lineSize * (width / this.opts.width);
        this.opts.width = width;
        this.opts.height = height;

        this.setCanvasSize(width, height);
        this.redraw();
    };

    Sketchpad.prototype.turnOff = function (obj) {


        obj.removeEventListener('mousedown', startLine);
        obj.removeEventListener('touchstart', startLine);

        obj.removeEventListener('mousemove', drawLine);
        obj.removeEventListener('touchmove', drawLine);

        obj.removeEventListener('mouseup', endLine);
        obj.removeEventListener('mouseleave', endLine);
        obj.removeEventListener('touchend', endLine);
    };



    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = Sketchpad;
    } else {
        window.Sketchpad = Sketchpad;
    }

})();
