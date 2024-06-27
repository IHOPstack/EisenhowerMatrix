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