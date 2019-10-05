
function addEnemy(game) {
  var gameNames = ['soccer', 'doge', 'polo', 'basket', 'peep',
                   'tennis', 'space', 'love', 'putin', 'js'];
  var enemyDiv = document.createElement('div');
    enemyDiv.classList.add('enemy-div');
    enemyDiv.innerHTML = '<img src="img/enemies/' + gameNames[game] +
                         Math.floor( Math.random() * 12.99 ) +
                         '.png" style="width: 32px">';

  setEnemyPosition(enemyDiv);
  document.getElementsByClassName('field')[0].appendChild(enemyDiv);
}


function addMenuOptions(game) {
    for (var i = 0; i < 3; i++) {
      var option = createMenuButton(i, game);
      document.getElementsByClassName('menu-div')[0].appendChild(option);
    }
  setFirstButton();
}


function changeMassSpaces() {
  createSpacesResize();
  setTimeout( function() {
    for (var i = 0; i < spacesMass.length; i++) {
      setEnemyPosition( spacesMass[i].enemy, true );
    }
  }, 0);
}


function checkCollisions() {
  var nodesToDel = [];
  var field = document.getElementsByClassName('field')[0];
  for (var i = 0; i < spacesMass.length; i++) {
    if ( detectCollision(spacesMass[i].enemy) ) {
      nodesToDel.push(i);
    }
  }
  for (var j = nodesToDel.length - 1; j >= 0; j--) {
    var node = spacesMass.splice(nodesToDel[j], 1)[0];
    field.removeChild(node.enemy);
    node.enemy = false;
    freeSpacesCatalogue.push(node);
  }
}


function chooseGame(game) {
    if (document.getElementsByClassName('menu-div')[0]) {
      exitGame();
    }
  createField(gameSets[game]);
  createMenu();
  addMenuOptions(game);
}


function clearGlobalMass() {
  freeSpacesCatalogue = [];
  reservedSpace = [];
  spacesMass = [];
}


function createEnemiesOnStart(game) {
  for (var i = 0; i < 10; i++) createEnemiesOnStartInnerFunction(i, game);
}


function createEnemiesOnStartInnerFunction(i, game) {
  setTimeout( function() {
    var gameNames = ['soccer', 'doge', 'polo', 'basket', 'peep',
                     'tennis', 'space', 'love', 'putin', 'js'];
    var enemyDiv = document.createElement('div');
      enemyDiv.classList.add('enemy-div');
      enemyDiv.innerHTML = '<img src="img/enemies/' + gameNames[game] +
                           i + '.png" style="width: 32px">';
    document.getElementsByClassName('field')[0].appendChild(enemyDiv);
    setEnemyPosition(enemyDiv);
  }, i * 100);
}


function createField(obj) {
  var field =  document.getElementsByClassName('field')[0];
    field.onclick = onclickField;

  setFieldBaseParams(field, obj);
  setFieldSize(field);
  setBall(obj.shell, obj.shellTransition);
  document.getElementsByClassName('playground')[0].scrollIntoView();
    document.documentElement.style.overflow = 'hidden';
    document.getElementsByClassName('footer')[0].setAttribute('hidden', true);
}


function createMenu() {
  var menuDiv = document.createElement('div');
    menuDiv.classList.add('menu-div');
    menuDiv.style.width = document.documentElement.clientWidth + 'px';
    menuDiv.style.top = window.pageYOffset + 'px';
    menuDiv.style.height = (document.documentElement.clientHeight + 100) + 'px';

  deleteToy()
  document.body.appendChild(menuDiv);
}


function createMenuButton(optionNumber, game) {
  var menuOptions = [
    ['Start Game', function() { startGame(game) }],
    ['Resume Game', continueGame],
    ['Exit Game', exitGame]
  ];

  var button = document.createElement('button');
    button.classList.add('option-button');
    button.innerHTML = menuOptions[optionNumber][0];
    button.onclick = menuOptions[optionNumber][1];
      if (optionNumber === 1) {
        button.setAttribute('hidden', true);
      }

  return button;
}


function createSpaces() {
  var fieldSize = getComputedStyle(document.getElementsByClassName('field')[0])
  var slotWidth = parseInt(fieldSize.width) / 10;
  var heightSlots = Math.floor(parseInt(fieldSize.height) / slotWidth);

    for (var i = 0; i < heightSlots; i++) {
      for (var j = 0; j < 9; j++) {
        var slot = {};
          slot.left = (slotWidth / 2 + j * slotWidth) + 'px';
          slot.top = (i * slotWidth) + 'px';
          slot.enemy = false;
        freeSpacesCatalogue.push(slot);

        if ( (j === 3) || (j === 4) || (j === 5) ) {
          var tempI = heightSlots - Math.floor(heightSlots / 2);
          if ( (i === tempI) || (i === (tempI - 1) ) || ( i === (tempI - 2) ) ) {
            reservedSpace.push( freeSpacesCatalogue.pop() );
            }
        }
      }
    }
}


function createSpacesResize() {
  var newSpacesCatalogue = [];
  var fieldSize = getComputedStyle(document.getElementsByClassName('field')[0])
  var slotWidth = parseInt(fieldSize.width) / 10;
  var heightSlots = Math.floor(parseInt(fieldSize.height) / slotWidth);

    for (var i = 0; i < heightSlots; i++) {
      for (var j = 0; j < 9; j++) {
        var slot = {};
          slot.left = (slotWidth / 2 + j * slotWidth) + 'px';
          slot.top = (i * slotWidth) + 'px';
          slot.enemy = false;
        newSpacesCatalogue.push(slot);
      }
    }
  freeSpacesCatalogue = newSpacesCatalogue;
}


function createToy() {
  var toysMass = ['ball.png', 'doge.png', 'polo.png', 'basketball.png',
                  'peep.png', 'tennis.png', 'spaceship.png', 'heart.png',
                  'putin.png', 'final.png'];

  var toy = document.createElement('div');
    toy.classList.add('toy-div');
    toy.innerHTML = '<img class="toy" style="width: 64px" src="img/soccer/' +
                    toysMass[parseInt(Math.random() * 9.99)] + '">';

  return toy;
}


function deleteToy() {
  var toy = document.getElementsByClassName('toy-div')[0];
    if (toy) document.body.removeChild(toy);
    document.body.onclick = ''
}


function detectCollision(node) {
  var ballRect = document.getElementsByClassName('ball-div')[0].getBoundingClientRect();
  var enemyRect = node.getBoundingClientRect();

  return ballRect.left < enemyRect.right && ballRect.top < enemyRect.bottom &&
         ballRect.right > enemyRect.left && ballRect.bottom > enemyRect.top;
}


function exitGame() {
  stopTimer();
  clearGlobalMass();
  var field =  document.getElementsByClassName('field')[0];
    field.innerHTML = '';
    field.setAttribute('hidden', true);

  document.getElementsByClassName('footer')[0].removeAttribute('hidden');
  document.body.removeChild(document.getElementsByClassName('menu-div')[0]);
  document.getElementsByClassName('header')[0].scrollIntoView();

  jumpingToy();
}


function findFreeSpaceForEnemy(node, some) {
  var slot = freeSpacesCatalogue.splice(Math.floor(Math.random() *
            (freeSpacesCatalogue.length - 0.01)), 1)[0];
    slot.enemy = node;
    if (some === false) spacesMass.push(slot);
  return { top: slot.top, left: slot.left };
}


function getOnReservedPosition() {
  for (var i = 0; i < reservedSpace.length; i++) {
    freeSpacesCatalogue.push( reservedSpace.splice(i, 1)[0] );
  }
}


// NOT USED
function includeJS(url) {
  var script = document.createElement('script');
    script.src = url;
  return script;
}


function jumpingToy() {
  var minTop = document.getElementsByClassName('carusel')[0].
          getBoundingClientRect().bottom + 10;
  var freeSpace = document.documentElement.clientHeight - minTop - 64;

    if (freeSpace > 100 ) {
      var toy = createToy();
        toy.style.top = (minTop + Math.random() * freeSpace) + 'px';
        toy.style.left = (document.documentElement.clientWidth / 2 - 32) + 'px';

      document.body.appendChild(toy);
      document.body.onclick = onclickBody;
    }
}


function onclickArrow(side) {
  var imgMass = document.getElementsByClassName('inner-span');
  var computedWidth = parseInt(getComputedStyle(imgMass[0].children[0]).width) +
                      parseInt(getComputedStyle(imgMass[0].children[0]).paddingLeft);

    for (var i = 0; i < imgMass.length; i++) {
      var left = parseInt(imgMass[i].style.left) || 0;
        if (side === 'left') {
          if (left >=  0) { imgMass[i].style.left = '0px'; break; }
          imgMass[i].style.left = (left + computedWidth) + 'px';
        } else {
          if (left <  document.getElementsByClassName('carusel')[0].offsetWidth -
            (imgMass.length + 1) * computedWidth) break;
          imgMass[i].style.left = (left - computedWidth) + 'px';
        }
    }
}


function onclickBody() {
  var headerBottom = document.getElementsByClassName('header')[0].
                     getBoundingClientRect().bottom;
  var toy = document.getElementsByClassName('toy-div')[0];
  var x = event.clientX;
  var y = event.clientY;

    if (x > document.body.clientWidth - toy.clientWidth)  {
      x = document.body.clientWidth - toy.clientWidth;
    } else if (x < 0) x = 0;

    if (y > document.body.clientHeight - toy.clientHeight)  {
      y = document.body.clientHeight - toy.clientHeight
    } else if (y < headerBottom) y = headerBottom;

    toy.style.top = y + 'px';
    toy.style.left = x + 'px';
}


function onclickField() {
  var ball = document.getElementsByClassName('ball-div')[0];
  var field = document.getElementsByClassName('field')[0];
  var x = event.clientX - field.getBoundingClientRect().left - 10;
  var y = event.clientY - field.getBoundingClientRect().top - 10;

    if (x > field.clientWidth - ball.clientWidth)  {
      x = field.clientWidth - ball.clientWidth;
    } else if (x < 0) x = 0;

    if ( y > field.clientHeight - ball.clientHeight )  {
      y = field.clientHeight - ball.clientHeight;
    } else if (y < 0) y = 0;

    ball.style.top = y + 'px';
    ball.style.left = x + 'px';
}


function resizeMenu() {
  var menuDiv = document.getElementsByClassName('menu-div')[0];
    if (menuDiv) {
        menuDiv.style.width = document.documentElement.clientWidth + 'px';
        menuDiv.style.top = window.pageYOffset + 'px';
        menuDiv.style.height = (document.documentElement.clientHeight + 100) + 'px';
      deleteToy();
    }
}


function resizePageAndField() {
  setLogoSize();
  setCaruselResized();
  setFieldResized();
  deleteToy();
  jumpingToy();
  document.getElementsByClassName('playground')[0].scrollIntoView();
    if (document.getElementsByClassName('menu-div')[0]) setFirstButton();
    if (document.getElementsByClassName('enemy-div')[0]) changeMassSpaces();
}


function setArrows() {
  var arrows = document.getElementsByClassName('arrow');
    arrows[0].addEventListener('click', function() { onclickArrow('left'); });
    arrows[1].addEventListener('click', function() { onclickArrow('right'); });
}


function setBall(file, speed) {
  var ball = document.createElement('div');
    ball.innerHTML = '<img class="ball" style="width: 64px" src="img/soccer/' +
                     file + '">';
    ball.classList.add('ball-div');
    ball.style.transition = speed;

  document.getElementsByClassName('field')[0].appendChild(ball);
  setBallPosition();
}


function setBallPosition() {
  var field = document.getElementsByClassName('field')[0];
  var ball = document.getElementsByClassName('ball-div')[0];
  var ballWidth = parseInt(getComputedStyle(field).width) / 10;
    ball.children[0].style.width = ballWidth + 'px';
    ball.style.top = (field.clientHeight - ballWidth) / 2 + 'px';
    ball.style.left = (field.clientWidth - ballWidth) / 2 + 'px';
}


function setCarusel() {
  var carusel = document.getElementsByClassName('carusel')[0];

    for (var i = 1; i <= 10; i++) {
      var img = document.createElement('img');
      var span = document.createElement('span');
        img.classList.add('carusel-img');
        span.classList.add('inner-span');
        img.setAttribute('src', 'img/carusel/carusel' + i + '.jpg');
      span.appendChild(img);
      carusel.appendChild(span);
    }
}


function setCaruselResized() {
  var imgMass = document.getElementsByClassName('inner-span');
    for (var i = 0; i < imgMass.length; i++) {
      imgMass[i].style.left = '0px';
    }
}


function setCollisionTimer() {
  collisionTimer = setInterval(function() { checkCollisions(); }, 50);
}


function setEnemyPosition(node, some=false) {
  var enemyPlace = findFreeSpaceForEnemy(node, some);
    node.children[0].style.width = (parseInt(getComputedStyle(document.
                 getElementsByClassName('field')[0]).width) / 10) + 'px';
    node.style.top = enemyPlace.top;
    node.style.left = enemyPlace.left;
    node.style.opacity = '0.05';
  setTimeout( function () { node.style.opacity = '0.8'; }, 0);
}


function setFieldBaseParams(node, obj) {
  node.innerHTML = '';
  node.style.backgroundColor = obj.backgroundColor;
  node.style.backgroundImage = obj.backgroundImage;
  node.style.backgroundRepeat = 'no-repeat';
  node.style.backgroundSize = '100% 100%';
  node.style.borderColor = obj.borderColor;
  node.removeAttribute('hidden');
}


function setFieldResized() {
  var field =  document.getElementsByClassName('field')[0];
    if (document.getElementsByClassName('ball-div')[0]) {
      setFieldSize(field);
      setBallPosition();
    }
}


function setFieldSize(node) {
  var winWidth = document.documentElement.clientWidth;
  var winHeight = document.documentElement.clientHeight;
    if (winHeight > winWidth) {
      node.style.width = (winWidth - 20) + 'px';
      node.style.height = (winWidth * 0.66) + 'px';
// ! var heightError = node.getBoundingClientRect().bottom - document.documentElement.clientHeight;
    } else {
      node.style.width = (winWidth - 20) + 'px';
      node.style.height = (winHeight - 20) + 'px';
    }
}


function setFirstButton() {
    if (document.documentElement.clientHeight > document.documentElement.clientWidth) {
      document.getElementsByClassName('menu-div')[0].children[0].style.marginTop = '66%';
    } else {
      document.getElementsByClassName('menu-div')[0].children[0].style.marginTop = '20%';
    }
}


function setIcons() {
  var gameIcons = document.getElementsByClassName('carusel-img');
    for (var i = 0; i < gameIcons.length; i++) {
      gameIcons[i].setAttribute('onclick', 'chooseGame(' + i + ')');
  }
}


function setLogoSize() {
  var logo = document.getElementsByClassName('logo')[0];
    logo.style.width = logo.parentNode.clientHeight * 0.9 + 'px';
}


function stopTimer() {
  clearInterval(enemyTimer);
  clearInterval(collisionTimer);
}


/*  NOW  WORKING ON  */

function startGame(game) {
  var timeToEnemyTimer = [750, 900, 1100, 1300, 1500, 1700, 1900, 2100, 2300, 2500];
  createSpaces();
  createEnemiesOnStart(game);
  createCountdownClock(game);
  setTimeout( setCollisionTimer, 4500 );
  setTimeout( function() { setEnemyTimer(game); }, timeToEnemyTimer[game] );

  getOnReservedPosition();
}

//

function setEnemyTimer(game) {
  var timeToNewEnemy = [977, 933, 888, 833, 777, 712, 645, 578, 511, 444];
  enemyTimer = setInterval( function() {
    if (document.getElementsByClassName('field')[0].children.length > 25) {
      gameOver(); // game over;
      return;
    }
    if (spacesMass.length === 0) {
      winGame();
      return;
    }
    addEnemy(game);
  } , timeToNewEnemy[game] );
}


function createCountdownClock(game) {
  var countdownClock = document.createElement('div');
    countdownClock.classList.add('countdown-clock');
    countdownClock.innerHTML = '<span>Ready!</span>';
    countdownClock.style.borderColor = gameSets[game].borderColor;
  document.getElementsByClassName('field')[0].appendChild(countdownClock);
  var countdownClockTimer = setInterval(changeCountdownClockInnerHTML, 1000);
  hideOptionButtons();
  setTimeout( function() {
    clearInterval(countdownClockTimer);
    document.getElementsByClassName('field')[0].
      removeChild(document.getElementsByClassName('countdown-clock')[0]);
      document.getElementsByClassName('menu-div')[0].setAttribute('hidden', true);
  }, 4500);
}


function changeCountdownClockInnerHTML() {
  var countdownClock = document.getElementsByClassName('countdown-clock')[0];
  if (countdownClock.innerHTML === '<span>Ready!</span>') {
    countdownClock.innerHTML = '<span>3</span>';
    countdownClock.style.fontSize = '80px';
  } else if (countdownClock.innerHTML === '<span>3</span>') {
    countdownClock.innerHTML = '<span>2</span>';
  } else if (countdownClock.innerHTML === '<span>2</span>') {
    countdownClock.innerHTML = '<span>1</span>';
  } else if (countdownClock.innerHTML === '<span>1</span>') {
    countdownClock.innerHTML = '<span>GO!</span>';
    countdownClock.style.fontSize = '40px';
  }
}


function hideOptionButtons() {
  var buttons = document.getElementsByClassName('option-button')
    for (var i = 0; i < buttons.length; i++) {
      console.log(buttons[i]);
      buttons[i].setAttribute('hidden', true);
    }
}


function gameOver() {
  stopTimer();
  document.getElementsByClassName('menu-div')[0].removeAttribute('hidden');
  createGameOverSign();
  setTimeout(exitGame, 5000);
}


function createGameOverSign() {
  var gameOverSign = document.createElement('div');
    gameOverSign.classList.add('game-over-sign');
  document.getElementsByClassName('field')[0].appendChild(gameOverSign);
}


function winGame() {
  stopTimer();
  document.getElementsByClassName('menu-div')[0].removeAttribute('hidden');
  createWinSign();
  setTimeout(exitGame, 5000);
}


function createWinSign() {
  var winSign = document.createElement('div');
    winSign.classList.add('win-sign');
  document.getElementsByClassName('field')[0].appendChild(winSign);
}



function continueGame() {}
