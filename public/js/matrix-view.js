import * as Utils from './utils.js';

var t = TrelloPowerUp.iframe();

let topLabelText = "Importance";
let sideLabelText = "Urgency";

t.render(function() {
    console.log('Trello iframe rendered');
    if (typeof renderMatrixView === 'function') {
        t.cards('all')
            .then(function(cards) {
                console.log('Retrieved cards:', cards);
                renderMatrixView(t, cards);
            })
            .catch(function(error) {
                console.error('Error retrieving cards:', error);
            });
    } else {
        console.error('renderMatrixView function not found. Check if matrix-view.js is loaded correctly.');
    }

    // Add event listener for settings button
    document.getElementById('settingsButton').addEventListener('click', openSettings);
});

function createCardElement(card) {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.draggable = true;
  cardElement.dataset.cardId = card.id;
  cardElement.textContent = `${card.name}`;
  cardElement.addEventListener('dragstart', handleDragStart);
  return cardElement;
}

export function renderMatrixView(t, cards) {
  console.log('MATRIXrenderMatrixView called with cards:', cards);
  const matrixContainer = document.getElementById('matrix-container');
  const unplacedCardsContainer = document.getElementById('unplaced-cards');
  matrixContainer.innerHTML = ''; // Clear existing content
  unplacedCardsContainer.innerHTML = ''; // Clear existing content

  // Update labels
  document.getElementById('topLabel').textContent = topLabelText;
  document.getElementById('sideLabel').textContent = sideLabelText;

  // Create grid cell containers
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cardContainer = document.createElement('div');
      cardContainer.classList.add('matrix-card');
      cardContainer.id = `card-container-${i}-${j}`;
      cardContainer.dataset.row = i;
      cardContainer.dataset.col = j;
      cardContainer.addEventListener('dragover', handleDragOver);
      cardContainer.addEventListener('drop', (event) => handleDrop(event, t));
      matrixContainer.appendChild(cardContainer);
    }
  }

  // Create card elements and add them to the matrix or unplaced cards section
  Promise.all(cards.map(card => 
      Utils.getCardPriority(t, card.id).then(priority => ({...card, ...priority}))
    )).then(cardsWithData => {
      cardsWithData.forEach(card => {
        const cardElement = createCardElement(card);
  
        if (card.importance && card.urgency) {
          const row = Math.floor((card.importance - 1) / 2); // Map 1-5 to 0-3
          const col = Math.floor((card.urgency - 1) / 2); // Map 1-5 to 0-3
          document.getElementById(`card-container-${row}-${col}`).appendChild(cardElement);
        } else {
          unplacedCardsContainer.appendChild(cardElement);
        }
      });
  });
}

function handleDragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.dataset.cardId);
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(event, t) {
  event.preventDefault();
  const cardId = event.dataTransfer.getData('text');
  const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
  const newContainer = event.target.closest('.matrix-card');
  if (newContainer && cardElement) {
    newContainer.appendChild(cardElement);
    const row = parseInt(newContainer.dataset.row);
    const col = parseInt(newContainer.dataset.col);
    
    // Map 0-3 back to 1-5
    const importance = row * 2 + 1;
    const urgency = col * 2 + 1;

    Utils.setCardPriority(t, cardId, importance, urgency).then(() => {
      console.log(`Updated position for card ${cardId}: importance ${importance}, urgency ${urgency}`);
    }).catch(error => {
      console.error('Error updating card position:', error);
    });
  }
}

function openSettings() {
  console.log('Settings button clicked');
  // Implement settings functionality here
  t.modal({
    url: './settings.html',
    height: 300,
    title: 'Matrix View Settings'
  });
}
