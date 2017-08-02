const adjustBBOX = (points) => {
  let min = { x: Infinity, y: Infinity };
  let max = { x: -Infinity, y: -Infinity };
  points.forEach(([x, y]) => {
    min = { x: Math.min(min.x, x), y: Math.min(min.y, y) };
    max = { x: Math.max(max.x, x), y: Math.max(max.y, y) };
  });
  const center = {
    x: (max.x + min.x) / 2,
    y: (max.y + min.y) / 2,
  };
  return points.map(([x, y]) => ([x - center.x, y - center.y]));
};

export default adjustBBOX;
