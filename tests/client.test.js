/**
 * Test suite for client.js
 */

const { renderMatrixView, handleDragStart, handleDragOver, handleDrop, openMatrixView } = require('../public/js/client');

describe('renderMatrixView', () => {
  it('renders the matrix view with the given cards', () => {
    // Mock the Trello Power-Up context
    const t = { args: () => ({ cards: [{ id: 1, name: 'Card 1' }, { id: 2, name: 'Card 2' }] }) };
    const cards = t.args('cards');
    const matrixContainer = document.createElement('div');
    matrixContainer.id = 'matrix-container';
    document.body.appendChild(matrixContainer);
    renderMatrixView(t, cards);
    expect(matrixContainer.children.length).toBe(16); // 4x4 grid
  });

  it('throws an error if the matrix container does not exist', () => {
    // Mock the Trello Power-Up context
    const t = { args: () => ({ cards: [{ id: 1, name: 'Card 1' }, { id: 2, name: 'Card 2' }] }) };
    const cards = t.args('cards');
    expect(() => renderMatrixView(t, cards)).toThrowError('Cannot read property \'innerHTML\' of null');
  });
});

describe('handleDragStart', () => {
  it('sets the card ID as data on the drag event', () => {
    const event = { target: { dataset: { cardId: 1 } }, dataTransfer: { setData: jest.fn() } };
    handleDragStart(event);
    expect(event.dataTransfer.setData).toHaveBeenCalledWith('text/plain', 1);
  });

  it('throws an error if the card ID is not set on the event target', () => {
    const event = { target: {}, dataTransfer: { setData: jest.fn() } };
    expect(() => handleDragStart(event)).toThrowError('Cannot read property \'cardId\' of undefined');
  });
});

describe('handleDragOver', () => {
  it('prevents the default dragover behavior', () => {
    const event = { preventDefault: jest.fn() };
    handleDragOver(event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });
});

describe('handleDrop', () => {
  it('appends the card element to the target container', () => {
    const event = { target: document.createElement('div'), dataTransfer: { getData: () => 1 } };
    const cardElement = document.createElement('div');
    cardElement.dataset.cardId = 1;
    document.body.appendChild(cardElement);
    handleDrop(event);
    expect(event.target.children.length).toBe(1);
  });

  it('throws an error if the card ID is not set on the event data', () => {
    const event = { target: document.createElement('div'), dataTransfer: { getData: () => null } };
    expect(() => handleDrop(event)).toThrowError('Cannot read property \'appendChild\' of null');
  });
});

describe('openMatrixView', () => {
  it('opens the matrix view modal and renders the matrix view', () => {
    // Mock the Trello Power-Up context
    const t = { cards: () => Promise.resolve([{ id: 1, name: 'Card 1' }, { id: 2, name: 'Card 2' }]), modal: jest.fn() };
    openMatrixView(t);
    expect(t.modal).toHaveBeenCalledTimes(1);
  });

  it('throws an error if the t.cards promise rejects', () => {
    // Mock the Trello Power-Up context
    const t = { cards: () => Promise.reject(new Error('Error fetching cards')) };
    expect(() => openMatrixView(t)).toThrowError('Error fetching cards');
  });
});
