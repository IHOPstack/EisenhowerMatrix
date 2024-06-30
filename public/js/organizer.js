import { getCardPriority } from './utils.js';

const gridRows = 7;
const gridCols = 7;

function calculateSortScore(importance, urgency) {
  const maxScore = gridRows + gridCols - 2;
  const diagonalScore = urgency + importance;
  const adjustedScore = diagonalScore * 1000 + urgency;
  return maxScore - adjustedScore;
}

export async function sortCards(cards, t) {
  const cardsWithScores = await Promise.all(cards.map(async card => {
    const { importance, urgency } = await getCardPriority(t, card.id);
    const score = calculateSortScore(importance, urgency);
    return { id: card.id, score };
  }));

  // Change the sort order here
  return cardsWithScores.sort((a, b) => a.score - b.score);
}
