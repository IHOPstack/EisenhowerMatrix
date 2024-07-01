import * as Utils from './utils.js';
import { loadSettings, saveSettings } from './settings.js';

var t = TrelloPowerUp.iframe();

let settings;

t.render(function() {
  loadSettings()
    .then(loadedSettings => {
      settings = loadedSettings;
      updateView(settings);
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
      renderMatrixView(t, cards, settings);
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
function updateCardPositions(t, cards, unplacedCardsContainer) {

  // Clear existing cards
  document.querySelectorAll('.matrix-card .card').forEach(card => card.remove());
  unplacedCardsContainer.innerHTML = '';

  Promise.all(cards.map(card => 
    Utils.getCardPriority(t, card.id).then(priority => ({ ...card, ...priority }))
  )).then(cardsWithData => {
    console.log('Promise.all resolved');
    cardsWithData.forEach(card => {
      const cardElement = createCardElement(card);

      if (card.importance && card.urgency) {
        // 'top' direction controls the y-axis (importance)
        let row = settings.sideLabelDirection === 'ascending' ? card.importance - 1 : settings.gridRows - card.importance;
        // 'side' direction controls the x-axis (urgency)
        let col = settings.topLabelDirection === 'ascending' ? card.urgency - 1 : settings.gridCols - card.urgency;

        if (row >= 0 && row < settings.gridRows && col >= 0 && col < settings.gridCols) {
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
export function renderMatrixView(t, cards) {

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

  updateCardPositions(t, cards, document.getElementById('unplaced-cards'));
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

    let importance = settings.topLabelDirection === 'ascending' ? row + 1 : settings.gridRows - row;
    let urgency = settings.sideLabelDirection === 'ascending' ? col + 1 : settings.gridCols - col;
  
    Utils.setCardPriority(t, cardId, importance, urgency).then(() => {
    }).catch(error => {
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
    }).catch(error => {
      console.error('Error updating card position:', error);
    });
  }
}
function updateArrowButtons() {
  console.log('updating');
  const topLabelArrow = document.getElementById('topLabelArrow');
  const sideLabelArrow = document.getElementById('sideLabelArrow');

  topLabelArrow.classList.remove('ascending', 'descending');
  topLabelArrow.classList.add(settings.topLabelDirection);

  sideLabelArrow.classList.remove('ascending', 'descending');
  sideLabelArrow.classList.add(settings.sideLabelDirection);
}
document.addEventListener('DOMContentLoaded', attachArrowButtonListeners);

function attachArrowButtonListeners() {
  const topLabelArrow = document.getElementById('topLabelArrow');
  const sideLabelArrow = document.getElementById('sideLabelArrow');

  topLabelArrow.addEventListener('click', handleTopArrowClick);
  sideLabelArrow.addEventListener('click', handleSideArrowClick);
}

function handleTopArrowClick() {
  handleArrowButtonClick('top');
}

function handleSideArrowClick() {
  handleArrowButtonClick('side');
}

function handleArrowButtonClick(axis) {
  console.log('handleArrowButtonClick called with axis:', axis);

  if (axis === 'top') {
    settings.topLabelDirection = settings.topLabelDirection === 'ascending' ? 'descending' : 'ascending';
  } else if (axis === 'side') {
    settings.sideLabelDirection = settings.sideLabelDirection === 'ascending' ? 'descending' : 'ascending';
  }

  updateArrowButtons();
  saveSettings(settings);
}
