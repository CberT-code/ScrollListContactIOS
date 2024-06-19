import { alphabetArray } from "../contants"
import { Item, Section } from "../interfaces"

export const groupItemsByOrganizer = (data: Item[], groups = alphabetArray): Section[] => {
  const groupedData: Map<string, Item[]> = new Map()

  for (const letter of groups) {
    groupedData.set(letter, [])
  }

  for (const item of data) {
    const firstChar = item.key[0].toUpperCase()
    const sectionKey = groups.includes(firstChar) ? firstChar : "#"
    groupedData.get(sectionKey)?.push(item)
  }

  const result: Section[] = Array.from(groupedData, ([title, data]) => ({
    title,
    data,
  }))

  return result
}
