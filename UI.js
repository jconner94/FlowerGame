UI = function(container) {
        var self = {};
        self.container = container;

    self.getMousePos = function(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left, 
            y: evt.clientY - rect.top
        };
    }

    self.toBool = function(string) {
        return string.toLowerCase() == 'true';
    }

    return self;
}