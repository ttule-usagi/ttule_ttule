export interface IconType {
  emoji: string;
  name: string;
  group: string;
}

export const getEmojiList = async (): Promise<IconType[]> => {
  const data = await import('unicode-emoji-json/data-by-emoji.json');
  return Object.entries(data.default)
    .map(([emoji, info]) => ({
      emoji,
      name: info.name,
      group: info.group,
    }))
    .filter((item) => item.emoji && item.group !== 'Symbols');
};
