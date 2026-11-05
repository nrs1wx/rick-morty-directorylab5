function countBy(list, getKey) {
  const counts = new Map();
  for (const item of list) {
    const key = getKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

export function computeStats(characters) {
  const total = characters.length;
  const byStatus = countBy(characters, (c) => c.status);
  const byGender = countBy(characters, (c) => c.gender);
  const bySpecies = countBy(characters, (c) => c.species);

  const alive = byStatus.find((row) => row.label === "Alive")?.value ?? 0;
  const totalEpisodes = characters.reduce((sum, c) => sum + c.episodeCount, 0);

  const topFeatured = [...characters]
    .sort((a, b) => b.episodeCount - a.episodeCount || a.name.localeCompare(b.name))
    .slice(0, 5);

  return {
    total,
    alive,
    aliveShare: total === 0 ? 0 : Math.round((alive / total) * 100),
    speciesCount: bySpecies.length,
    averageEpisodes: total === 0 ? 0 : totalEpisodes / total,
    mostFeatured: topFeatured[0] ?? null,
    topFeatured,
    byStatus,
    byGender,
    bySpecies,
  };
}
