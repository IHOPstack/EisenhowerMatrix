export function getCardPriority(t, cardId) {
  return Promise.all([
    t.get(cardId, 'shared', 'importance'),
    t.get(cardId, 'shared', 'urgency'),
  ]).then(([importance, urgency]) => {
    return { importance, urgency };
  });
}
export function setCardPriority(t, cardId, importance, urgency) {
  return t.get('board', 'shared', 'matrixSettings').then((settings) => {
    return Promise.all([
      t.set(cardId, 'shared', 'importance', importance),
      t.set(cardId, 'shared', 'urgency', urgency),
    ]);
  });
}
export function getQuadrantColor(quadrant, settings) {
  let color = settings[`${quadrant}Color`];
  if (color == 'custom') {
    color = settings[`${quadrant}CustomColor`]
  };
  return color;
};
