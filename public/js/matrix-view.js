function renderMatrixView(t, cards) {
  console.log('MATRIXrenderMatrixView called with cards:', cards);
  const matrixContainer = document.getElementById('matrix-container');
  matrixContainer.innerHTML = ''; // Clear existing content
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
  // Create card elements and add them to the matrix
  Promise.all(cards.map(card => 
    Promise.all([
      t.get(card.id, 'shared', 'importance'),
      t.get(card.id, 'shared', 'urgency')
    ]).then(([importance, urgency]) => ({...card, importance, urgency}))
  )).then(cardsWithData => {
    cardsWithData.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardElement.draggable = true;
      cardElement.dataset.cardId = card.id;
      cardElement.textContent = `${card.name}`;
      cardElement.addEventListener('dragstart', handleDragStart);

      const row = Math.floor((card.importance || 3) / 2); // Map 1-5 to 0-3
      const col = Math.floor((card.urgency || 3) / 2); // Map 1-5 to 0-3
      document.getElementById(`card-container-${row}-${col}`).appendChild(cardElement);
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
    const importance = row + 1;
    const urgency = col + 1;

    Promise.all([
      t.set(cardId, 'shared', 'importance', importance),
      t.set(cardId, 'shared', 'urgency', urgency)
    ]).then(() => {
      console.log(`Updated position for card ${cardId}: importance ${importance}, urgency ${urgency}`);
    }).catch(error => {
      console.error('Error updating card position:', error);
    });
  }
}
  