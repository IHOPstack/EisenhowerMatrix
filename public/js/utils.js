// Get importance and urgency for a card
export function getCardPriority(t, cardId) {
  return Promise.all([
    t.get(cardId, 'shared', 'importance'),
    t.get(cardId, 'shared', 'urgency'),
  ]).then(([importance, urgency]) => {
    return { importance, urgency};
  });
}
// Set importance and urgency for a card
export function setCardPriority(t, cardId, importance, urgency) {
  return t.get('board', 'shared', 'matrixSettings')
    .then(settings => {
      return Promise.all([
        t.set(cardId, 'shared', 'importance', importance),
        t.set(cardId, 'shared', 'urgency', urgency),
      ]);
    });
}
export function getQuadrantColor(quadrant, settings) {
  const colorMap = {
    'doNow': settings.doNowColor,
    'schedule': settings.scheduleColor,
    'delegate': settings.delegateColor,
    'ignore': settings.ignoreColor
  };
  return colorMap[quadrant];
}
