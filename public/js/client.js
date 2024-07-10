import * as Utils from './utils.js'
import { sortCards } from './organizer.js';

function openMatrixView(t) {
  console.log('openMatrixView running')
  return t.cards('all')
    .then(function(cards) {
      return t.modal({
        url: '../matrix-view.html',
        title: 'Matrix View',
        fullscreen: true,
        callback: function(t) {
          console.log('modal callback function called');
          // Create the matrix container
          var container = document.createElement('div');
          container.id = 'matrix-container';
          document.body.appendChild(container);
        }
      });
    });
}
TrelloPowerUp.initialize({
  'card-buttons': function(t, options) {
    return [{
      icon: '...',
      text: 'Set Priority',
      callback: function(t) {
        return Utils.getCardPriority(t, t.getContext().card)
          .then(({importance, urgency}) => {
            return t.popup({
              title: 'Set Priority',
            url: './priority-popup.html',
            args: { importance: importance, urgency: urgency }
          });
        });
      }
    }];
  },
  'show-settings': function(t, options){
    return t.popup({
      title: 'Matrix View Settings',
      url: './settings.html',
      height: 300
    });
  },
    'list-sorters': function(t) {
      return [{
        text: 'Sort by Urgency & Importance',
        callback: function(t, opts) {
          return t.cards('all')
            .then(cards => sortCards(cards, t))
            .then(sortedCards => {
              return {
                sortedIds: sortedCards.map(card => card.id)
              };
            });
        }
      }];
    },
          'board-buttons': function(t){
      console.log('board-buttons listener called');
        return {
            icon: '../../matrix-icon.svg',
            text: 'Matrix View',
            callback: function(t) {
              return openMatrixView(t);
            }
        }
  },
  'card-badges': function(t) {
    return Promise.all([
      t.get('board', 'shared', 'matrixSettings'),
      t.card('id')
        .then(card => Promise.all([
          t.get(card.id, 'shared', 'importance'),
          t.get(card.id, 'shared', 'urgency'),
          t.get(card.id, 'shared', 'quadrant')
        ]))
    ]).then(([settings, [importance, urgency, quadrant]]) => {
      console.log('Settings:', settings);
      console.log('Quadrant:', quadrant);
      if (settings && settings.showBadges && quadrant) {
        const color = Utils.getQuadrantColor(quadrant, settings);
        console.log('Calculated color:', color);
          return [{
          text: quadrant,
          color: color
        }];
      }
      return [];
    });
  },
});