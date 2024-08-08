import { getCardPriority } from './utils.js';

function calculateSortScore(importance, urgency) {
  const diagonalScore = urgency + importance;
  const adjustedScore = diagonalScore * 1000 + urgency;
  return - adjustedScore;
}

export async function sortCards(cards, t) {
  const cardsWithScores = await Promise.all(
    cards.map(async (card) => {
      const { importance, urgency } = await getCardPriority(t, card.id);
      const score = calculateSortScore(importance, urgency);
      return { id: card.id, score };
    })
  );

  return cardsWithScores.sort((a, b) => a.score - b.score);
}
