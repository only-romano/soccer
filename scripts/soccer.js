// - 1 - GLOBALS

// Levels options set
var gameSets = [
  { backgroundColor: 'green',
    backgroundImage: 'url(img/soccer/soccer-field.png)',
    borderColor: 'bisque',
    shell: 'ball.png',
    shellTransition: 'top 0.5s, left 0.5s'
  },
  { backgroundColor: '#5cb083',
    backgroundImage: 'url(img/soccer/doge-field.png)',
    borderColor: 'paleturquoise',
    shell: 'doge.png',
    shellTransition: 'top 0.45s, left 0.45s'
  },
  { backgroundColor: 'aqua',
    backgroundImage: 'url(img/soccer/waterpolo-field.png)',
    borderColor: 'white',
    shell: 'polo.png',
    shellTransition: 'top 0.4s, left 0.4s'
  },
  { backgroundColor: '#e8b255',
    backgroundImage: 'url(img/soccer/basketball-field.png)',
    borderColor: 'brown',
    shell: 'basketball.png',
    shellTransition: 'top 0.35s, left 0.35s'
  },
  { backgroundColor: 'black',
    backgroundImage: 'url(img/soccer/peep-field.png)',
    borderColor: 'grey',
    shell: 'peep.png',
    shellTransition: 'top 0.30s, left 0.30s'
  },
  { backgroundColor: '#be5602',
    backgroundImage: 'url(img/soccer/tennis-field.png)',
    borderColor: 'olivedrab',
    shell: 'tennis.png',
    shellTransition: 'top 0.25s, left 0.25s'
  },
  { backgroundColor: '#1a2435',
    backgroundImage: 'url(img/soccer/space-field.png)',
    borderColor: 'midnightblue',
    shell: 'spaceship.png',
    shellTransition: 'top 0.2s, left 0.2s'
  },
  { backgroundColor: 'orange',
    backgroundImage: 'url(img/soccer/heart-field.png)',
    borderColor: 'black',
    shell: 'heart.png',
    shellTransition: 'top 0.17s, left 0.17s'
  },
  { backgroundColor: '#05cae7',
    backgroundImage: 'url(img/soccer/putin-field.png)',
    borderColor: 'lightgoldenrodyellow',
    shell: 'putin.png',
    shellTransition: 'top 0.12s, left 0.12s'
  },
  { backgroundColor: 'indianred',
    backgroundImage: 'url(img/soccer/final-field.png)',
    fieldWidthCoef: 1.33,
    borderColor: '#fadf1c',
    shell: 'final.png',
    shellTransition: 'top 0.07s, left 0.07s'
  }
]

// globals for spaceMass
var freeSpacesCatalogue = [];
var spacesMass = [];
var reservedSpace = [];
var enemyTimer;
var collisionTimer;

/*
      ,
*/


// - 2 - PAGE STARTING SETTINGS

// sets Logo size
setLogoSize();

// sets Carusel spans with images
setCarusel();

// sets functions for arrows
setArrows();

// sets Icons 'onclick'
setIcons();

// sets Jumping toy
jumpingToy();


// - 3 - PAGE ADAPTATION

// sets 'resize' listener to window
window.addEventListener("resize", resizePageAndField, false);

// sets 'resize' listener for menu to window
window.addEventListener("resize", resizeMenu, false);
