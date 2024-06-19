import { SectionList, DefaultSectionT } from "react-native"
import * as Haptics from "expo-haptics"
import { alphabetArray } from "../contants"
import { Item } from "../interfaces"

/**
 * Scroll to the section
 *
 * @param {string} letter
 */
export const _scrollToSection = (
  letter: string,
  sectionRef: React.RefObject<SectionList<Item, DefaultSectionT>>,
  groups = alphabetArray,
) => {
  if (sectionRef.current) {
    const letterIndex = groups.indexOf(letter)
    sectionRef.current.scrollToLocation({
      sectionIndex: letterIndex,
      itemIndex: 0,
      animated: false,
    })
    Haptics.selectionAsync()
  }
}
