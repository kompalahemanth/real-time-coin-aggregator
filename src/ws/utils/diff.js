export function generateDiff(oldList, newList) {
  const oldMap = new Map(oldList.map(t => [t.token_address, t]));
  const newMap = new Map(newList.map(t => [t.token_address, t]));

  let added = [];
  let changed = [];
  let removed = [];

  // Identify added & changed
  for (const token of newList) {
    if (!oldMap.has(token.token_address)) {
      added.push(token);
    } else {
      const oldToken = oldMap.get(token.token_address);
      if (JSON.stringify(oldToken) !== JSON.stringify(token)) {
        changed.push(token);
      }
    }
  }

  // Identify removed
  for (const token of oldList) {
    if (!newMap.has(token.token_address)) {
      removed.push(token);
    }
  }

  return { added, changed, removed };
}
