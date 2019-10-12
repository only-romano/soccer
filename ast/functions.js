;'use strict';

/*
  It's just a helper class to create elements more easily.
  Also is a superclass for Enemy class.
 */
class BaseElement {
  // Base new element creation class
  constructor(tag, parent=null, classes=[], attrs={}, style={}) {
    this.element = document.createElement(tag);
    this.parent = parent;

    for (let i = 0; i < classes.length; i++)         // adds classes
      this.element.classList.add(classes[i]);
    for (let [key, value] of Object.entries(attrs))  // adds attributes
      this.element.setAttribute(key, value);
    for (let [key, value] of Object.entries(style))  // adds style attributes
      this.element.style[key] = value;
  }

  append(){
    // appends element to parent node
    if (this.parent)
      this.parent.appendChild(this.element);
  }
}


/* AND THIS IS A PAGE */
class Page {
  constructor(levels){
    /* Assign objects properties */
    this.levels = levels;
    this.game = null;

    /* Website start page elements - assign elements properties */
    this.document = document.documentElement;
    this.header = document.getElementsByClassName('header')[0];
    this.logo = document.getElementsByClassName('header__logo')[0];
    this.title = document.getElementsByClassName('header__title')[0];
    this.arrowLeft = document.getElementsByClassName('carusel__arrow')[0];
    this.arrowRight = document.getElementsByClassName('carusel__arrow')[1];
    this.carusel =  document.getElementsByClassName('carusel')[0];
    this.buttons = null;  // elements collected in setCarusel method
    this.footer = document.getElementsByClassName('footer')[0];
    this.tm = document.getElementsByClassName('footer__tm')[0];
    this.toy = null;  // element is temporal

    /* Set event listeners */
    window.onresize = () => { this.resize() }; // windws resizer handler
    this.arrowLeft.onclick = () => { this.moveCarusel('left') };  // arrow handler
    this.arrowRight.onclick = () => { this.moveCarusel('right') }; // arrow handler

    /* Run init methods */
    this.createButtons();  // create image buttons for carusel menu
    this.resize();  // resize elements with clients viewport

    /* Toy coursor */
    this.canJump();  // check and run if passed - toy cursor init
  }

  /* WEBPAGE MODE SECTION */

  createButtons(){
    // Creates image buttons to run the game
    for (let i = 1; i <= this.levels.length; i++) {  // counts levels array
      // container
      let span = new BaseElement('span', this.carusel, ['carusel__inner-span'])
      // button
      let img =  new BaseElement('img', span.element, ['carusel__img'], {
        'src': 'img/carusel/carusel' + i + '.jpg'
      });
      img.element.onclick = () => { this.startGame(i-1) }; // i - game id
      img.append();
      span.append();
    }

    this.buttons = document.getElementsByClassName('carusel__inner-span'); // fix
  }

  getSize(element, attribute){
    // Returns int part of given attribute parsed
    return parseInt(getComputedStyle(element)[attribute]);
  }

  moveCarusel(side) {
    // Arrows onclick function; moves buttons from side to side
    let buttons = this.buttons;
    let img = buttons[0].children[0];
    let width = this.getSize(img, "width") + this.getSize(img, "padding-left");

    // changes image buttons's container "left" attribute
    for (let i = 0; i < buttons.length; i++) {
      let left = parseInt(buttons[i].style.left) || 0;
      if (side === 'left') {
        if (left >=  0) {
          buttons[i].style.left = '0px';
          break;
        }
        buttons[i].style.left = (left+width) + 'px';
      } else {
        if (left <  this.carusel.offsetWidth - (buttons.length+1) * width)
          break;
        buttons[i].style.left = (left-width) + 'px';
      }
    }
  }

  resize(){
    // Resizes elements on start and on window resize event
    let height = this.header.clientHeight;  // header's height for ratio
    this.logo.style.width = height * 0.95 + 'px';     // logo
    this.title.style.fontSize = height * 0.8 + 'px';  // title
    this.tm.style.fontSize = height * 0.5 + 'px'      // bottom date
    // menu control arrows
    this.arrowLeft.style.height = this.arrowRight.style.height = height + 'px';
    for (let i = 0; i < this.buttons.length; i++) {
      // menu image-buttons
      this.buttons[i].children[0].style.height = height * 5 + 'px';
      this.buttons[i].children[0].style.left = '0px';  // sends them to start position
    }
    if (this.game) {
      // if game is on, resize GAME elements
      this.game.resize();
      this.deleteToy(); // and delete toy
    }
    if (this.document.clientHeight > this.document.clientWidth * 0.88) {
      // if vertical-oriented or close to square viewport adds top padding to
      // the carusel menu and subtract 1/3 of that from top margin of arrows container
      this.carusel.style.paddingTop = "150px";
      document.getElementsByClassName('carusel__arrow-span')[0].style.marginTop = "-50px";
    } else {
      // else default values for wide-screen viewport
      this.carusel.style.paddingTop = "0";
      document.getElementsByClassName('carusel__arrow-span')[0].style.marginTop = "2.5%";
    }
    if (this.toy) {
      // if toy and resize - move toy to center (almost)
      this.toy.style.top = '75%';
      this.toy.style.left = '50%';
    }
  }

  /* GAME MODE SECTION */

  startGame(id){
    // Creates new Game instance
    this.game = new Game(this.levels[id], id);  // level + id of level
    this.document.style.overflow = 'hidden';    // don't remember why, just leave it be. sorry.
    this.footer.setAttribute('hidden', true);   // hide footer
    this.deleteToy()  // delete toy cause of game start
  }

  endGame(){
    // Ends game, restores web mode attributes
    this.footer.removeAttribute('hidden');  // get back footer
    this.header.scrollIntoView();  // view at the top of webpage
    this.game = null;  // delete game instance from memory
    this.canJump();  // check toy availability and starts it if available
  }

  /* TOY SECTION */

  canJump() {
    // Checks available space and if it's enought creates toy
    let minTop = this.carusel.getBoundingClientRect().bottom + 10; // bottom of carusel menu
    let space = this.document.clientHeight - minTop - 64;  // space till carusel menu
    if (space > 100)  // if enought, create toy
      this.createToy(minTop, space);
  }

  createToy(minTop, space) {
    // Creaates toy, appends it to body and adds to body onclick event listener
    let top = (minTop+Math.floor(Math.random()*space)) + 'px';  // random top
    let left = (this.document.clientWidth / 2 - 32) + 'px';    // always center
    // Container
    let toy = new BaseElement('div', document.body, ['toy-div'], {}, {
      "top": top, "left": left
    });
    this.toy = toy.element;
    // Image
    let toys = [  // toys names
      'ball.png', 'doge.png', 'polo.png', 'basketball.png', 'peep.png',
      'tennis.png', 'spaceship.png', 'heart.png', 'putin.png', 'final.png'
    ];
    let src = 'img/soccer/' + toys[Math.floor(Math.random()*10)]; // random toy
    new BaseElement('img', this.toy, ['toy'], {"src": src}, {"width": "64px"})
      .append();  // don't need this instance in memory

    toy.append();
    document.body.onclick = (e) => { this.moveToy(e); }  // body event listener
  }

  moveToy(e) {
    // Body event listener; moves toy to click point
    let bottom = this.header.getBoundingClientRect().bottom; // header's bottom
    // click point
    let x = e.clientX;
    let y = e.clientY;

    // toy's left
    if (x > document.body.clientWidth - this.toy.clientWidth)
      x = document.body.clientWidth - this.toy.clientWidth;
    else if (x < 0)
      x = 0;
    this.toy.style.left = x + 'px';

    // toy's top
    if (y > document.body.clientHeight - this.toy.clientHeight)
        y = document.body.clientHeight - this.toy.clientHeight;
    else if (y < bottom)
      y = bottom;
    this.toy.style.top = y + 'px';
  }

  deleteToy() {
    // Deletes toy; removes it from body, removes body's onclick event handler
    if (this.toy) {
      document.body.removeChild(this.toy);
      document.body.onclick = '';  // removes body event listener
      this.toy = null;  // removes link to object
    }
  }
}


class Game {
  // Class for game mode
  constructor(properties, id){
    /* Gameplay elements */
    this.playground = document.getElementsByClassName('playground')[0];
    this.field = document.getElementsByClassName('field')[0];
    this.ball = null;
    this.menu = null;

    /* Game settings */
    this.id = id;
    this.name = properties.name;
    this.color = properties.backgroundColor;
    this.image = properties.backgroundImage;
    this.border = properties.borderColor;
    this.shell = properties.shell;
    this.speed = properties.shellTransition;

    /* Gameplay slots and timers */
    this.freeSlots = [];
    this.usedSlots = [];
    this.reservedSlots = [];
    this.enemyTimer = null;
    this.timeToEnemyTimer = null;
    this.collisionTimer = null;

    /* Init game */
    this.prepareGame();  // prepares page for game mode
    if (this.menu) // if menu - game is on, so, exit from curent game
      this.exitGame();
    this.createMenu();  // create menu
  };

  /* PREPARE METHODS*/

  prepareGame() {
    // Prepares page for game mode
    this.setupField();  // setup field
    this.createBall();  // create ball
    this.playground.scrollIntoView();  // view to element
  }

  createMenu() {
    // Creates menu
    let menu = new BaseElement('div', document.body, ['menu-div'], {}, {
      'width': PAGE.document.clientWidth+'px', 'top': window.pageYOffset+'px',
      'height': (PAGE.document.clientHeight+100)+'px'
    });
    this.menu = menu.element;  // we'll need link for element later
    menu.append();
    this.createButtons();  // creates menu buttons
  }

  createButtons() {
    // Creates buttons, sets first button's top
    for (let i = 0; i < 3; i++)
      this.createOneButton(i); // butoon's constructor with index oriented
    this.setFirstButton();  // sets first button top to relative display of others
  }

  createOneButton(index) {
    // Creates one button depending of givent index
    let options = [
      ['Start Game', this.startGame],  // first button - start the game
      ['Resume Game', this.continueGame],  // second button - never exicted
      ['Exit Game', this.exitGame]  // third button - exit the game
    ];

    let button = new BaseElement("button", this.menu, ['option-button']);
    // not so pretty with button.element, but it's just only case
    button.element.innerHTML = options[index][0];
    // bind -easy solution, too lazy to made a better one
    button.element.onclick = options[index][1].bind(this);  
    if (index === 1)
      button.element.setAttribute('hidden', true);  // pure continue button
    button.append();
  }

  setFirstButton() {
    // sets first menu button's top
    if (PAGE.document.clientHeight > PAGE.document.clientWidth)
      this.menu.children[0].style.marginTop = '66%';  // vertical oriented
    else
      this.menu.children[0].style.marginTop = '20%';  // horizontal oriented
  }

  resize() {
    // Resizes game elements
    if (this.menu) {
      // if menu - sets it on full screen
      this.menu.style.width = PAGE.document.clientWidth + 'px';
      this.menu.style.top = window.pageYOffset + 'px';
      this.menu.style.height = (PAGE.document.clientHeight + 100) + 'px';
      this.setFirstButton();  // sets first button of menu
    }
    if (this.ball) {
      // if ball resize field and ball's size and position
      this.setFieldSize();
      this.setBallSizeAndPosition();
    }
    this.playground.scrollIntoView();
    if (this.usedSlots.length)  // if there is enemies
      this.changeMassSpaces();  // reslot them
  }

  /* START-END METHODS */

  startGame() {
    // Game initialisation
    // Enemy timer's values
    let timers = [750, 900, 1100, 1300, 1500, 1700, 1900, 2100, 2300, 2500];
    this.createSpaces();  // creates slots
    this.createEnemiesOnStart();  // creates initial enemies
    this.createCountdownClock();  // creates countdown and get-ready timer
    setTimeout(() => {  // collision checker timeout
      PAGE.game.collisionTimer = setInterval(()=>{  // game collision interval
        PAGE.game.checkCollisions();
      }, 50);
    }, 4500);
    setTimeout(() => { this.setEnemyTimer() }, timers[this.id]);  // enemy addition timer
    this.getOnReservedPosition();  // restore reserved positions at center
  }

  continueGame() {}  // never finished

  exitGame() {
    // Finish game
    this.clearTimers();  // clear intervals
    this.clearGlobalMass();  // delete arrays from memory
    this.field.innerHTML = '';  //  delete all inner elements of field
    this.field.setAttribute('hidden', true);  // hide field
    document.body.removeChild(this.menu);  // remove menu
    PAGE.endGame.bind(PAGE)();  // envokes end-game method of PAGE
  }

  clearGlobalMass() {
    // Cleares arrays of memory
    this.freeSlots = [];
    this.usedSlots = [];
    this.reservedSlots = [];
  }

  clearTimers() {
    // Cleares intervals
    clearInterval(this.enemyTimer);
    clearInterval(this.collisionTimer);
  }

  /* FIELD */

  setupField() {
    // Sets up field for game mode
    this.field.innerHTML = '';
    this.field.style.backgroundColor = this.color;
    this.field.style.backgroundImage = this.image;
    this.field.style.backgroundRepeat = 'no-repeat';
    this.field.style.backgroundSize = '100% 100%';
    this.field.style.borderColor = this.border;
    this.field.removeAttribute('hidden');
    this.setFieldSize();  // sets up field's size
    this.field.onclick = this.moveBall.bind(this);
  }

  setFieldSize() {
    // Sets up field's size
    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;
    if (height > width) { // vertical viewport
        this.field.style.width = (width - 20) + 'px';
        this.field.style.height = (width * 0.66) + 'px';
    } else {  // horizontal viewport
        this.field.style.width = (width - 20) + 'px';
        this.field.style.height = (height - 20) + 'px';
    }
  }

  /* BALL */

  createBall() {
    // Creates the ball (shell) and sets it's position
    let ball = new BaseElement('div', this.field, ['ball-div'], {}, {
      'transition': this.speed  // animation
    });
    new BaseElement('img', ball.element, [], {
      'src': 'img/soccer/' + this.shell
    }, {'width': '64px'}).append();
    ball.append();
    this.ball = ball.element;  // fix
    this.setBallSizeAndPosition();
  }

  setBallSizeAndPosition() {
    // Sets up ball's position and width
    let width = parseInt(getComputedStyle(this.field).width) / 10;
    this.ball.children[0].style.width = width + 'px';
    this.ball.style.top = (this.field.clientHeight - width) / 2 + 'px';
    this.ball.style.left = (this.field.clientWidth - width) / 2 + 'px';
  }

  moveBall(e) {
    // Field onclick function, moves the ball to the click point
    let x = e.clientX - this.field.getBoundingClientRect().left - 10;
    let y = e.clientY - this.field.getBoundingClientRect().top - 10;

    // field's size limits checks for x
    if (x > this.field.clientWidth - this.ball.clientWidth)
      x = this.field.clientWidth - this.ball.clientWidth;
    else if (x < 0)
      x = 0;
    // and for y
    if (y > this.field.clientHeight - this.ball.clientHeight)
      y = this.field.clientHeight - this.ball.clientHeight;
    else if (y < 0)
      y = 0;

    this.ball.style.top = y + 'px';
    this.ball.style.left = x + 'px';
  }

  /* GAME */

  createSpaces() {
    // Creates free slots and push em into an array of available slots
    let size = getComputedStyle(this.field)  // field's size
    let width = parseInt(size.width) / 10;   // width of one slot (1/10 of field's width)
    let height = Math.floor(parseInt(size.height) / width);  // number of vertical slots

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < 9; j++) { // there is a 9 horizontal slots (1/10 * 9 + borders etc)
        let slot = {};  // new slot
        slot.left = (width / 2 + j * width) + 'px';
        slot.top = (i * width) + 'px';  // they are square-sized
        slot.enemy = false;

        if (j > 2 || j < 6) { // if they are in a middle
            let temp = height - Math.floor(height / 2);  // on x and y axis
            if ((i === temp) || (i === (temp-1)) || (i === (temp-2))) {
              this.reservedSlots.push(slot);  // they are reserved for future
              continue; // next iteration
            }
        }
        this.freeSlots.push(slot);  // if not in a middle - push to available slots
      }
    }
  }

  createEnemiesOnStart(i) {
    // Sets timeout to create 12 of first enemies
    for (let i = 0; i < 12; i++)
      setTimeout(()=>{new Enemy()}, i * 100);
  }

  createCountdownClock() {
    // Countdown clock
    let clock = new BaseElement('div', this.field, ['countdown-clock'], {}, {
      'border-color': this.border
    });
    this.clock = clock.element
    this.clock.innerHTML = '<span>Ready!</span>';
    clock.append();
    let timer = setInterval(() => {this.changeCountdownClockInnerHTML()}, 1000);
    this.hideOptionButtons();
    setTimeout(()=>{
      clearInterval(timer);
      this.field.removeChild(this.clock);
      this.menu.setAttribute('hidden', true);
    }, 4500);
  }

  changeCountdownClockInnerHTML() {
    // Countdown clock changer
    if (this.clock.innerHTML === '<span>Ready!</span>') {
      this.clock.innerHTML = '<span>3</span>';
      this.clock.style.fontSize = '80px';
    } else if (this.clock.innerHTML === '<span>3</span>')
      this.clock.innerHTML = '<span>2</span>';
    else if (this.clock.innerHTML === '<span>2</span>')
      this.clock.innerHTML = '<span>1</span>';
    else if (this.clock.innerHTML === '<span>1</span>') {
      this.clock.innerHTML = '<span>GO!</span>';
      this.clock.style.fontSize = '40px';
    }
  }

  hideOptionButtons() {
    // hide menu buttons
    let buttons = document.getElementsByClassName('option-button')
    for (let i = 0; i < buttons.length; i++)
      buttons[i].setAttribute('hidden', true)
  }


  getOnReservedPosition() {
    // restore reserved slots
    let length = this.reservedSlots.length;
    for (let i = 0; i < length; i++)
      this.freeSlots.push(this.reservedSlots.pop());
  }

  setEnemyTimer() {
    // enemy timerr setter
    let timer = [877, 833, 788, 733, 677, 612, 545, 478, 411, 344];
    this.enemyTimer = setInterval(()=> {
      if (this.usedSlots.length > 27) {
        this.gameOver(); // game over;
        return;
      }
      if (this.usedSlots.length === 0) {
        this.winGame();
        return;
      }
      if (this.freeSlots.length > 0)
        new Enemy();
    }, timer[this.id]);
  }


  changeMassSpaces() {
    this.createSpacesResize();
    setTimeout(()=>{
      let length = this.usedSlots.length;
      for (let i = length-1; i >= 0; i--) {
        let slot = this.usedSlots.pop();
        slot.enemy.setPosition.bind(slot.enemy)(false);
      }
    }, 0);
  }

  createSpacesResize() {
    let spaces = [];
    let size = getComputedStyle(this.field)
    let width = parseInt(size.width) / 10;
    let height = Math.floor(parseInt(size.height) / width);

      for (let i = 0; i < height; i++) {
        for (let j = 0; j < 9; j++) {
          let slot = {};
            slot.left = (width / 2 + j * width) + 'px';
            slot.top = (i * width) + 'px';
            slot.enemy = false;
          spaces.push(slot);
        }
      }
    this.freeSlots = spaces;
  }

  getFreeSlot(flag){
    // Returns free slot
    let random = Math.floor(Math.random() * this.freeSlots.length);
    let slot = this.freeSlots.splice(random, 1)[0];
    if (!flag)
      this.usedSlots.push(slot);
    return slot;
  }


  gameOver() {
    this.clearTimers();
    this.menu.removeAttribute('hidden');
    this.createGameOverSign();
    setTimeout(this.exitGame.bind(this), 5000);
  }


  winGame() {
    this.clearTimers();
    this.menu.removeAttribute('hidden');
    this.createWinSign();
    setTimeout(this.exitGame.bind(this), 5000);
  }


  checkCollisions() {
    let nodesToDel = [];
    for (let i = 0; i < this.usedSlots.length; i++) {
      if (this.detectCollision(this.usedSlots[i].enemy.element)) {
        nodesToDel.push(i);
      }
    }
    for (let j = nodesToDel.length - 1; j >= 0; j--) {
      let node = this.usedSlots.splice(nodesToDel[j], 1)[0];
      this.field.removeChild(node.enemy.element);
      node.enemy = false;
      this.freeSlots.push(node);
    }
}


  detectCollision(node) {
    let ball = this.ball.getBoundingClientRect();
    let enemy = node.getBoundingClientRect();

    return ball.left < enemy.right && ball.top < enemy.bottom &&
           ball.right > enemy.left && ball.bottom > enemy.top;
  }


  createGameOverSign() {
    let gameOverSign = document.createElement('div');
      gameOverSign.classList.add('game-over-sign');
    this.field.appendChild(gameOverSign);
  }


  createWinSign() {
    let winSign = document.createElement('div');
      winSign.classList.add('win-sign');
    this.field.appendChild(winSign);
  }
}


/* Enemy elements Class */
class Enemy extends BaseElement {

  constructor(){
    // creates instance of Enemy div element by default
    super('div', PAGE.game.field, ['enemy-div']);
    this.name = PAGE.game.name;
    this.slot = null;
    this.img = this.createImg();  // append img
    this.setPosition();  // find slot
    this.append();
  }

  createImg(){
    // creates and returns img child element of Enemy
    let img = new BaseElement('img', this.element, [], {'src': this.src()}, {
      'width': '32px'
    });
    img.append();
    return img.element;
  }

  src(){
    // returns path to random picture for enemy
    let random = Math.floor(Math.random() * 13);
    return 'img/enemies/' + this.name + random + '.png';
  }

  setPosition(flag=false){
    // Sets position for Enemy's instance element
    let game = PAGE.game;  // just for short
    // Slots object
    this.slot = game.getFreeSlot.bind(game)(flag);
    this.slot.enemy = this;
    // Enemy's element style attributes
    this.element.style.top = this.slot.top;
    this.element.style.left = this.slot.left;
    this.element.style.opacity = '0.05';
    setTimeout(() => {
      this.element.style.opacity = '0.8'; // opacity fade in fix
    }, 0);
    // img of Enemy
    this.img.style.width = (PAGE.getSize(game.field, "width")/10) + 'px';
  }
}
