import * as Utils from './utils.js';

var t = TrelloPowerUp.iframe();

let settings = {
  gridTitle: 'Matrix View',
  topLabel: 'Importance',
  sideLabel: 'Urgency',
  gridRows: 4,
  gridCols: 4,
};

t.render(function() {
  console.log('Trello iframe rendered');
  
  // Load settings from Trello Power-Up storage
  t.get('board', 'shared', 'matrixSettings')
    .then((savedSettings) => {
      if (savedSettings) {
        settings = {
          ...settings,
          ...savedSettings,
        };
      }
      updateView();
    })
    .catch((err) => {
      console.error('Error loading settings:', err);
    });
});

function updateView() {
  // Update title and labels
  document.querySelector('.header h2').textContent = settings.gridTitle;
  document.getElementById('topLabel').textContent = settings.topLabel;
  document.getElementById('sideLabel').textContent = settings.sideLabel;

  // Re-render the matrix view
  t.cards('all')
    .then(function(cards) {
      renderMatrixView(t, cards);
    })
    .catch(function(error) {
      console.error('Error retrieving cards:', error);
    });
}
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

  // Update grid template
  matrixContainer.style.gridTemplateColumns = `repeat(${settings.gridCols}, 1fr)`;
  matrixContainer.style.gridTemplateRows = `repeat(${settings.gridRows}, 1fr)`;

  // Create grid cell containers
  for (let i = 0; i < settings.gridRows; i++) {
    for (let j = 0; j < settings.gridCols; j++) {
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

  // Make the unplaced cards container a drop zone
  unplacedCardsContainer.addEventListener('dragover', handleDragOver);
  unplacedCardsContainer.addEventListener('drop', (event) => handleUnplacedDrop(event, t));

  // Create card elements and add them to the matrix or unplaced cards section
  Promise.all(cards.map(card => 
    Utils.getCardPriority(t, card.id).then(priority => ({ ...card, ...priority }))
  )).then(cardsWithData => {
    cardsWithData.forEach(card => {
      const cardElement = createCardElement(card);

      if (card.importance && card.urgency) {
        const row = (card.importance - 1);
        const col = (card.urgency - 1);
        if (row < settings.gridRows && col < settings.gridCols) {
          document.getElementById(`card-container-${row}-${col}`).appendChild(cardElement);
        } else {
          unplacedCardsContainer.appendChild(cardElement);
        }
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

    const importance = row + 1;
    const urgency = col + 1;

    Utils.setCardPriority(t, cardId, importance, urgency).then(() => {
      console.log(`Updated position for card ${cardId}: importance ${importance}, urgency ${urgency}`);
    }).catch(error => {
      console.error('Error updating card position:', error);
    });
  }
}
function handleUnplacedDrop(event, t) {
  event.preventDefault();
  const cardId = event.dataTransfer.getData('text');
  const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
  const unplacedCardsContainer = document.getElementById('unplaced-cards');
  if (unplacedCardsContainer && cardElement) {
    unplacedCardsContainer.appendChild(cardElement);

    Utils.setCardPriority(t, cardId, null, null).then(() => {
      console.log(`Removed importance and urgency for card ${cardId}`);
    }).catch(error => {
      console.error('Error updating card position:', error);
    });
  }
}
