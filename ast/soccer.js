;'use strict';

// GLOBALS
/* Init Page, levels array as an argument */
const PAGE = new Page([{
    name: 'soccer',
    backgroundColor: 'green',
    backgroundImage: 'url(img/soccer/soccer-field.png)',
    borderColor: 'bisque',
    shell: 'ball.png',
    shellTransition: 'top 0.5s, left 0.5s'
  }, {
    name: 'doge',
    backgroundColor: '#5cb083',
    backgroundImage: 'url(img/soccer/doge-field.png)',
    borderColor: 'paleturquoise',
    shell: 'doge.png',
    shellTransition: 'top 0.45s, left 0.45s'
  }, {
    name: 'polo',
    backgroundColor: 'aqua',
    backgroundImage: 'url(img/soccer/waterpolo-field.png)',
    borderColor: 'white',
    shell: 'polo.png',
    shellTransition: 'top 0.4s, left 0.4s'
  }, {
    name: 'basket',
    backgroundColor: '#e8b255',
    backgroundImage: 'url(img/soccer/basketball-field.png)',
    borderColor: 'brown',
    shell: 'basketball.png',
    shellTransition: 'top 0.35s, left 0.35s'
  }, {
    name: 'peep',
    backgroundColor: 'black',
    backgroundImage: 'url(img/soccer/peep-field.png)',
    borderColor: 'grey',
    shell: 'peep.png',
    shellTransition: 'top 0.30s, left 0.30s'
  }, {
    name: 'tennis',
    backgroundColor: '#be5602',
    backgroundImage: 'url(img/soccer/tennis-field.png)',
    borderColor: 'olivedrab',
    shell: 'tennis.png',
    shellTransition: 'top 0.25s, left 0.25s'
  }, {
    name: 'space',
    backgroundColor: '#1a2435',
    backgroundImage: 'url(img/soccer/space-field.png)',
    borderColor: 'midnightblue',
    shell: 'spaceship.png',
    shellTransition: 'top 0.2s, left 0.2s'
  }, {
    name: 'love',
    backgroundColor: 'orange',
    backgroundImage: 'url(img/soccer/heart-field.png)',
    borderColor: 'black',
    shell: 'heart.png',
    shellTransition: 'top 0.17s, left 0.17s'
  }, {
    name: 'putin',
    backgroundColor: '#05cae7',
    backgroundImage: 'url(img/soccer/putin-field.png)',
    borderColor: 'lightgoldenrodyellow',
    shell: 'putin.png',
    shellTransition: 'top 0.12s, left 0.12s'
  }, {
    name: 'js',
    backgroundColor: 'indianred',
    backgroundImage: 'url(img/soccer/final-field.png)',
    fieldWidthCoef: 1.33,
    borderColor: '#fadf1c',
    shell: 'final.png',
    shellTransition: 'top 0.07s, left 0.07s'
  }
]);
