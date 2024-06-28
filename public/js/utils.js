// Get importance and urgency for a card
export function getCardPriority(t, cardId) {
    return Promise.all([
      t.get(cardId, 'shared', 'importance'),
      t.get(cardId, 'shared', 'urgency')
    ]).then(([importance, urgency]) => ({importance, urgency}));
  }
// Set importance and urgency for a card
export function setCardPriority(t, cardId, importance, urgency) {
return Promise.all([
    t.set(cardId, 'shared', 'importance', importance),
    t.set(cardId, 'shared', 'urgency', urgency)
]);
}
  