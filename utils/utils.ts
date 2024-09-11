import { alphabetArray } from "../contants";
import { Item, Section } from "../interfaces";

export const groupItemsByOrganizer = (
  data: Item[],
  groups = alphabetArray
): Section[] => {
  const groupedData: Map<string, Item[]> = new Map();

  for (const letter of groups) {
    groupedData.set(letter, []);
  }

  for (const item of data) {
    const firstChar = item.key[0].toUpperCase();
    const sectionKey = groups.includes(firstChar) ? firstChar : "#";
    groupedData.get(sectionKey)?.push(item);
  }

  const result: Section[] = Array.from(groupedData, ([title, data]) => ({
    title,
    data,
  }));

  return result;
};

// Helper function to group items by the first letter of their state
export const groupItemsByState = (
  items: Item[],
  sortByProp: string,
  headerProp = false
) => {
  const sections: { [key: string]: Item[] } = {};
  items.forEach((item) => {
    const stateFirstLetter = headerProp
      ? item[sortByProp]?.toUpperCase() || "#"
      : item[sortByProp]?.[0].toUpperCase() || "#";
    if (!sections[stateFirstLetter]) {
      sections[stateFirstLetter] = [];
    }
    sections[stateFirstLetter].push(item);
  });
  return Object.keys(sections)
    .sort()
    .map((letter) => ({ title: letter, data: sections[letter] }));
};
