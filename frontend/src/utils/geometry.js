export const getClueCenter = (clue) => {
  const CARD_WIDTH = 240;
  const CARD_HEIGHT = 220;

  return {
    x: clue.position.x + CARD_WIDTH / 2,
    y: clue.position.y + CARD_HEIGHT / 2,
  };
};


export const isPointNearClue = (point, clue) => {
  const CARD_WIDTH = 240;
  const CARD_HEIGHT = 220;

  const centerX = clue.position.x + CARD_WIDTH / 2;
  const centerY = clue.position.y + CARD_HEIGHT / 2;

  const dx = point.x - centerX;
  const dy = point.y - centerY;

  const distance = Math.sqrt(dx * dx + dy * dy);

  const SNAP_RADIUS = 80;

  return distance <= SNAP_RADIUS;
};



export const screenToWorld = (
  screenX,
  screenY,
  pan,
  zoom
) => {
  return {
    x: (screenX - pan.x) / zoom,
    y: (screenY - pan.y) / zoom,
  };
};
