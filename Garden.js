Garden = function(size, rules) {
    var self = {};
    self.size = size;
    self.rules = rules
    self.garden = Array.from(Array(self.size), () => Array(self.size).fill(false));
    self.nextGarden = Array.from(Array(self.size), () => Array(self.size).fill(false));
    self.neighborCounts = Array.from(Array(self.size), () => Array(self.size).fill(false));

    self.get = function(x,y) {
        return self.garden[x][y];
    }

    self.set = function(x,y,value) {
        self.garden[x][y] = value;
    }

    self.flip = function(x,y) {
        self.garden[x][y] = !self.garden[x][y];
    }

    self.updateSize = function(newSize) {
        let maxIndex = Math.min(self.size, newSize);
        let newGarden = Array.from(Array(newSize), () => Array(newSize).fill(false));
        let newNextGarden = Array.from(Array(newSize), () => Array(newSize).fill(false));
        let newNeighborCounts = Array.from(Array(newSize), () => Array(newSize).fill(false));
        for(let i = 0; i < maxIndex; i++) {
            for(let j = 0; j < maxIndex; j++) {
                newGarden[i][j] = self.garden[i][j];
            }
        }

        self.size = newSize;
        self.garden = newGarden;
        self.nextGarden = newNextGarden;
        self.neighborCounts = newNeighborCounts;
    }

    self.setRules = function(rules) {
        self.rules = rules;
    }

    self.getLiveNeighborCount = function(x,y) {
        self.realMod = function(a,n) {
            return ((a%n) + n) % n;
        }

        let liveNeighborCount = 0;
        let neighborsX = Array(self.realMod(x-1, self.size), x, self.realMod(x+1, self.size));
        let neighborsY = Array(self.realMod(y-1, self.size), y, self.realMod(y+1, self.size));
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                if(!(i == 1 && j == 1)) {
                    if(self.get(neighborsX[i],neighborsY[j])) {
                        liveNeighborCount++;
                    }
                }
            }
        }

        return liveNeighborCount;
    }

    self.fillNeighborCounts = function() {
        for(let i = 0; i < self.size; i++) {
            for(let j = 0; j < self.size; j++) {
                self.neighborCounts[j][i] = self.getLiveNeighborCount(i,j);
            }
        }
    }

    self.fillNextGarden = function() {
        let x, y;
        for(let i = 0; i < self.size; i++) {
            for(let j = 0; j < self.size; j++) {
                x = self.getRuleIndex(i,j).x;
                y = self.getRuleIndex(i,j).y;
                self.nextGarden[j][i] = self.rules[x][y];
            }
        }
    }

    self.getRuleIndex = function(i, j) {
        let x, y;
        x = self.getLiveNeighborCount(i,j);
        if(self.get(i,j)) {
            y = 0;
        } else {
            y = 1;
        }

        return {
            x,
            y
        };
    }

    self.copyValues = function(toArray, fromArray) {
        for(let i = 0; i < self.size; i++) {
            for(let j = 0; j < self.size; j++) {
                toArray[i][j] = fromArray[i][j];
            }
        }
    }

    self.nextMove = function() {
        let x, y;
        for(let i = 0; i < self.size; i++) {
            for(let j = 0; j < self.size; j++) {
                self.neighborCounts[j][i] = self.getLiveNeighborCount(i,j);
                x = self.getRuleIndex(j,i).x;
                y = self.getRuleIndex(j,i).y;
                self.nextGarden[j][i] = self.rules[x][y];
            }
        }

        self.copyValues(self.garden, self.nextGarden);
    }

    self.logRules = function() {
        let string = "";
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 2; j++) {
                string += self.rules[i][j] + ' ';
            }
            string += '\n';
        }

        console.log(string);
    }

    return self;
}