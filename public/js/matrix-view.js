function renderMatrixView(t, cards) {
    console.log('this is t:', t)
    console.log('MATRIXrenderMatrixView called with cards:', cards);
    const matrixContainer = document.getElementById('matrix-container');
    // Create grid cell containers
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cardContainer = document.createElement('div');
            cardContainer.classList.add('matrix-card');
            cardContainer.id = `card-container-${i}-${j}`; // Assign a unique ID to each container
            cardContainer.dataset.row = i; // Store the row index as a data attribute
            cardContainer.dataset.col = j; // Store the column index as a data attribute
            cardContainer.addEventListener('dragover', handleDragOver);
            cardContainer.addEventListener('drop', handleDrop);
            matrixContainer.appendChild(cardContainer);
            console.log('Card container created:', cardContainer);
        }
    }
  // Create card elements and add them to the matrix
  cards.forEach(card => {
    console.log('MATRIXCreating card element for:', card);
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.draggable = true;
    cardElement.dataset.cardId = card.id; // Store the card ID as a data attribute
    cardElement.textContent = card.name; // Set the card name as the element's text
    cardElement.addEventListener('dragstart', handleDragStart);
    console.log('MATRIXcard created')
    // Add the card to the first container by default
    document.getElementById('card-container-0-0').appendChild(cardElement);
})}
function handleDragStart(event) {
event.dataTransfer.setData('text/plain', event.target.dataset.cardId);
}
function handleDragOver(event) {
event.preventDefault();
}
function handleDrop(event) {
event.preventDefault();
const cardId = event.dataTransfer.getData('text');
const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
event.target.appendChild(cardElement);
}