var GameOfLife = function(_height, _width, _delay) {
  var self = this;

  this.elementMatrix = [];

  this.dataMatrix1 = [];
  this.dataMatrix2 = [];
  this.useMatrix1 = true;

  this.active = false;

  this.height = _height;
  this.width = _width;
  this.delay = _delay;

  this.placeElements();

  return this;

};

GameOfLife.prototype = {
  run: function run() {
    var currentMatrix;
    var otherMatrix;

    if(this.useMatrix1) {
      currentMatrix = this.dataMatrix1;
      otherMatrix = this.dataMatrix2;
    }
    else {
      currentMatrix = this.dataMatrix2;
      otherMatrix = this.dataMatrix1;
    }

    for(var i = 0; i < this.height; i++) {
      for(var j = 0; j < this.width; j++) {
        var neighbours = this.countNeighbours(i, j, currentMatrix);

        if(neighbours < 2) {
          otherMatrix[i][j] = false;
        }
        else if(neighbours > 3) {
          otherMatrix[i][j] = false;
        }
        else if(neighbours == 3) {
          otherMatrix[i][j] = true;
        }
        else if(neighbours == 2) {
          if(currentMatrix[i][j]) {
            otherMatrix[i][j] = true;
          }
          else {
            otherMatrix[i][j] = false;
          }
        }
      }
    }

    for(var i = 0; i < this.height; i++) {
      for(var j = 0; j < this.width; j++) {
        this.elementMatrix[i][j].className = (otherMatrix[i][j] ? 'alive' : 'dead');
      }
    }

    this.useMatrix1 = !this.useMatrix1;

    var self = this;

    if(this.active) {
      setTimeout(function() {
        self.run();
      }, this.delay);
    }
  },

  placeElements: function placeElements() {
    var self = this;
    
    this.domElement = document.createElement('table');
    this.domElement.setAttribute('id', 'game_of_life');
    
    var newRow,
        newCell;

    for(var i = 0; i < this.height; i++) {
      this.dataMatrix1[i] = [];
      this.dataMatrix2[i] = [];

      newRow = document.createElement('tr');
      this.elementMatrix[i] = [];

      for(var j = 0; j < this.width; j++) {
        newCell = document.createElement('td');

        newCell.className = 'dead';
        newCell.setAttribute('data-i', i);
        newCell.setAttribute('data-j', j);

        newCell.addEventListener('click', function() {
          var currentMatrix = (self.useMatrix1 ? self.dataMatrix1 : self.dataMatrix2);

          var alive = this.className === 'alive';
          this.className = (alive ? 'dead' : 'alive');

          var currentRow = parseInt(this.getAttribute('data-i'), 10);
          var currentColumn = parseInt(this.getAttribute('data-j'), 10);

          currentMatrix[currentRow][currentColumn] = !alive;

        });

        newRow.appendChild(newCell);
        this.elementMatrix[i][j] = newCell;
        this.dataMatrix1[i][j] = false;
      }
      this.domElement.appendChild(newRow);
    }

    var button = document.createElement('input');
    button.setAttribute('value', 'Start/Stop');
    button.setAttribute('type', 'button');
    button.setAttribute('id', 'start_button');


    button.addEventListener('click', function() {
      self.toggleActive();
    });

    var resetButton = document.createElement('input');
    resetButton.setAttribute('value', 'Reset');
    resetButton.setAttribute('type', 'button');
    resetButton.setAttribute('id', 'reset_button');

    resetButton.addEventListener('click', function() {
      self.reset();
    });

    var body = document.getElementsByTagName('body')[0];

    body.appendChild(this.domElement);
    body.appendChild(button);
    body.appendChild(resetButton);
  },

  reset: function reset() {
    this.useMatrix1 = true;
    this.active = false;

    for(var i = 0; i < this.height; i++) {
      for(var j = 0; j < this.width; j++) {
        this.dataMatrix1[i][j] = false;
        this.elementMatrix[i][j].className = 'dead';
      }
    }
  },

  countNeighbours: function countNeighbours(row, column, matrix) {
    var neighbours = 0;

    for(var i = -1; i <= 1; i++) {
      for(var j = -1; j <= 1; j++) {
        if(!(i == 0 && j == 0)) {
          try {
            neighbours += (matrix[row + i][column + j] ? 1 : 0);
          } catch(e) {}
        }
      }
    }

    return neighbours;
  },

  toggleActive: function toggleActive() {
    this.active = !this.active;
    if(this.active) {
      this.run();
    }
  },

  getActive: function getActive() {
    return this.active;
  }
}