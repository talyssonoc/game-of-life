var GameOfLife = function(height, width) {
  var elementMatrix = [];
  var domElement;

  var dataMatrix1 = [];
  var dataMatrix2 = [];
  var useMatrix1 = true;

  var active = false;
  var run;

  var toggleActive = this.toggleActive = function() {
    active = !active;
    if(active) {
      run();
      // alert('Started');
    }
    else {
      // alert('Stopped');
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

      var newLine = document.createElement('tr');
      // elementMatrix[i] = newLine;
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

          var currentLine = parseInt(this.getAttribute('data-i'));
          var currentRow = parseInt(this.getAttribute('data-j'));

          currentMatrix[currentLine][currentRow] = !alive;

        });

        newLine.appendChild(newCell);
        elementMatrix[i][j] = newCell;
        dataMatrix1[i][j] = false;
      }
      domElement.appendChild(newLine);
    }

    var button = document.createElement('input');
    button.setAttribute('value', 'Start/Stop');
    button.setAttribute('type', 'button');
    button.setAttribute('id', 'start_button');

    button.addEventListener('click', function() {
      toggleActive();
    });

    var body = document.getElementsByTagName('body')[0];

    body.appendChild(domElement);
    body.appendChild(button);

  };

  var countNeightbours = function(line, row, matrix) {
    var neightbours = 0;

    for(var i = -1; i <= 1; i++) {
      for(var j = -1; j <= 1; j++) {
        if(!(i == 0 && j == 0)) {
          try {
            neightbours += (matrix[line + i][row + j] ? 1 : 0);
          } catch(e) {}
        }
      }
    }

    return neightbours;

  };

  this.run = function() {
    var currentMatrix;
    var otherMatrix;

    currentMatrix = (useMatrix1 ? dataMatrix1 : dataMatrix2);
    otherMatrix = (useMatrix1 ? dataMatrix2 : dataMatrix1);

    for(var i = 0; i < height; i++) {
      for(var j = 0; j < width; j++) {
        var neightbours = countNeightbours(i, j, currentMatrix);

        if(neightbours < 2) {
          otherMatrix[i][j] = false;
        }
        else if(neightbours > 3) {
          otherMatrix[i][j] = false;
        }
        else if(neightbours == 3) {
          otherMatrix[i][j] = true;
        }
        else if(currentMatrix[i][j] && neightbours == 2) {
          otherMatrix[i][j] = true;
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
      setTimeout(run, 500);

  };

  run = this.run;
  init();

  return this;

};