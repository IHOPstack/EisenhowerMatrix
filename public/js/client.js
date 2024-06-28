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
          
            // Call renderMatrixView with the cards data
            renderMatrixView(t, cards);
            console.log('renderMatrixView called');
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
        return Promise.all([
          t.get('card', 'shared', 'importance'),
          t.get('card', 'shared', 'urgency')
        ]).then(function([importance, urgency]) {
          if (importance === undefined) {
            importance = 3;
          }
          if (urgency === undefined) {
            urgency = 3;
          }
          return t.popup({
            title: 'Set Priority',
            url: './edit-field.html',
            args: { importance: importance, urgency: urgency }
          });
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
  }
});