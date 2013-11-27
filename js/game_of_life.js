var GameOfLife = function(_height, _width, _delay) {
  var elementMatrix = [];
  var domElement;

  var dataMatrix1 = [];
  var dataMatrix2 = [];
  var useMatrix1 = true;

  var active = false;
  var run, reset;

  var height = _height;
  var width = _width;
  var delay = _delay;

  var toggleActive = this.toggleActive = function() {
    active = !active;
    if(active) {
      run();
    }
  }

  var getActive = this.getActive = function() {
    return active;
  }

  var init = function() {

    domElement = document.createElement('table');
    domElement.setAttribute('id', 'game_of_life');
    
    for(var i = 0; i < height; i++) {
      dataMatrix1[i] = [];
      dataMatrix2[i] = [];

      var newRow = document.createElement('tr');
      elementMatrix[i] = [];

      for(var j = 0; j < width; j++) {
        var newCell = document.createElement('td');

        newCell.className = 'dead';
        newCell.setAttribute('data-i', i);
        newCell.setAttribute('data-j', j);

        newCell.addEventListener('click', function() {
          var currentMatrix = (useMatrix1 ? dataMatrix1 : dataMatrix2);

          var alive = this.className === 'alive';
          this.className = (alive ? 'dead' : 'alive');

          var currentRow = parseInt(this.getAttribute('data-i'));
          var currentColumn = parseInt(this.getAttribute('data-j'));

          currentMatrix[currentRow][currentColumn] = !alive;
          // alert(countNeighbours(currentRow, currentColumn, currentMatrix));

        });

        newRow.appendChild(newCell);
        elementMatrix[i][j] = newCell;
        dataMatrix1[i][j] = false;
      }
      domElement.appendChild(newRow);
    }

    var button = document.createElement('input');
    button.setAttribute('value', 'Start/Stop');
    button.setAttribute('type', 'button');
    button.setAttribute('id', 'start_button');

    button.addEventListener('click', function() {
      toggleActive();
    });

    var resetButton = document.createElement('input');
    resetButton.setAttribute('value', 'Reset');
    resetButton.setAttribute('type', 'button');
    resetButton.setAttribute('id', 'reset_button');

    resetButton.addEventListener('click', function() {
      reset();
    });

    var body = document.getElementsByTagName('body')[0];

    body.appendChild(domElement);
    body.appendChild(button);
    body.appendChild(resetButton);

  };

  var countNeighbours = function(row, column, matrix) {
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

  };

  this.run = function() {
    var currentMatrix;
    var otherMatrix;

    currentMatrix = (useMatrix1 ? dataMatrix1 : dataMatrix2);
    otherMatrix = (useMatrix1 ? dataMatrix2 : dataMatrix1);

    for(var i = 0; i < height; i++) {
      for(var j = 0; j < width; j++) {
        var neighbours = countNeighbours(i, j, currentMatrix);

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

    for(var i = 0; i < height; i++) {
      for(var j = 0; j < width; j++) {
        elementMatrix[i][j].className = (otherMatrix[i][j] ? 'alive' : 'dead');
      }
    }

    useMatrix1 = !useMatrix1;

    if(active)
      setTimeout(run, delay);

  };

  this.reset = function() {
    useMatrix1 = true;

    for(var i = 0; i < height; i++) {
      for(var j = 0; j < width; j++) {
        dataMatrix1[i][j] = false;
        elementMatrix[i][j].className = 'dead';
      }
    }
  };

  run = this.run;
  reset = this.reset;

  init();

  return this;

};
