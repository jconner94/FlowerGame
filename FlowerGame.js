FlowerGame = function (container) {
        var self = UI(container);
        self.fg = document.getElementById("fg");
        self.fg_ctx = self.fg.getContext('2d');
        self.bg = document.getElementById('bg');
        self.bg_ctx = self.bg.getContext('2d');
        self.size = parseInt(document.getElementById('selectsize').value);
        self.square_size = 768 / self.size;
        self.current_x = -1;
        self.current_y = -1;
        self.show_grid = true;
        self.color_alive = document.getElementById('selectcoloralive').value;
        self.color_dead = document.getElementById('selectcolordead').value;
        self.visual = document.getElementById('selectvisual').value;
        if(self.visual === 'animated') {
            self.speed = document.getElementById('selectspeed').value;
        } else {
            self.speed = 0;
        }
        self.frame = 0;
        self.playing = false;

        // Setting up life/death rules
        self.rules =  Array.from(Array(9), () => Array(2).fill(0));
        for(let i = 0; i < 9; i++) {
            let idAlive = 'select' + i + 'alive';
            let idDead = 'select' + i + 'dead';
            self.rules[i][0] = self.toBool(document.getElementById(idAlive).value);
            self.rules[i][1] = self.toBool(document.getElementById(idDead).value);
        }

        self.garden = Garden(self.size, self.rules);

    self.setOptions = function() {
        self.size = parseInt(document.getElementById('selectsize').value);
        self.color_alive = document.getElementById('selectcoloralive').value;
        self.color_dead = document.getElementById('selectcolordead').value;
        self.visual = document.getElementById('selectvisual').value;
        if(self.visual === 'animated') {
            self.speed = document.getElementById('selectspeed').value;
        } else {
            self.speed = 0;
        }
    }

    self.update = function() {
        // clear canvas for frame update
        self.fg_ctx.clearRect(0, 0, 768, 768);
        self.bg_ctx.clearRect(0, 0, 768, 768);

        if(self.playing && self.speed > 0) {
            self.frame++;
            self.frame = self.frame % Math.ceil((10 * 1/self.speed));
            if(self.frame == 0) {
                self.garden.nextMove();
            }
        }    

        // draw garden
        for(let i = 0; i < self.size; i++) {
            for(let j = 0; j < self.size; j++) {
                if(self.garden.get(j,i)) {
                    self.bg_ctx.fillStyle = self.color_alive;
                } else {
                    self.bg_ctx.fillStyle = self.color_dead;
                }
                self.bg_ctx.fillRect(i * self.square_size, j * self.square_size, self.square_size, self.square_size);
            }
        }

        // display grid if on
        if(self.show_grid) {
            self.fg_ctx.fillStyle = '#000000';
            for(let i = 1; i < self.size; i++) {
                self.fg_ctx.fillRect(0, i*self.square_size, 768, 1);
                self.fg_ctx.fillRect(i*self.square_size, 0, 1, 768);
            }
        }

    }

    self.addEventListeners = function() {
        self.fg.addEventListener('mousemove', function(evt) {
            var mousePos = self.getMousePos(self.fg, evt);
            self.current_x = Math.floor(mousePos.x / self.square_size);
            self.current_y = Math.floor(mousePos.y / self.square_size);

        }, false);

        self.fg.addEventListener('mousedown', function(evt) {
            var mousePos = self.getMousePos(self.fg, evt);
            self.mouse = evt.which;

            if(self.mouse == 1) {
                self.garden.flip(self.current_y, self.current_x);
            }

            if(self.mouse == 3) {
                self.logGarden();
            }
        }, false);

        self.fg.addEventListener('mouseup', function(evt) {
            self.mouse = -1;
        }, false);

        document.addEventListener('keydown', function(evt) {
            let key = evt.code;
            if(key == 'Space') {
                self.garden.setRules(self.rules);
                self.garden.nextMove();
            }

            if(key == 'KeyP') {
                console.log(self.garden.garden);
            }

            if(key == 'KeyG') {
                self.logGarden();
            }

            if(key == 'KeyN') {
                self.garden.fillNeighborCounts();
                console.log(self.garden.neighborCounts);
            }

            if(key == 'KeyQ') {
                self.garden.fillNextGarden();
                console.log(self.garden.nextGarden);
            }

            if(key == 'KeyR') {
                console.log(self.rules);
                console.log(self.garden.rules);
            }
        }, false);
    }

    self.logGarden = function() {
        let result = "";
        for(let i = 0; i < self.size; i++) {
            for(let j = 0; j < self.size; j++) {
                result += self.garden.get(i,j) + " ";
            }
            result += "\n";
        }

        console.log(result);
    }

    self.resetGarden = function() {
        for(let i = 0; i < self.size; i++) {
            for(let j = 0; j < self.size; j++) {
                self.garden.set(i,j,false);
            }
        }
    }

    self.updateSize = function() {
        self.size = parseInt(document.getElementById("selectsize").value);
        self.square_size = 768 / Game.garden.size;
        self.garden.updateSize(self.size);
    }

    self.addEventListeners();
    return self;
}

/*
    Next steps:
    7: Add random starting config option + spontaneous generation option?
    8: Clean up/organize code, add comments while working on 1-7 if needed
*/