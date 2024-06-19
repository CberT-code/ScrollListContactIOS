import { StyleSheet } from "react-native"
import { size } from "./contants"

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    flexDirection: "row",
  },
  sectionList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  stickySectionHeader: {
    backgroundColor: "#eeeeeeee",
  },
  footer: {
    height: 30,
  },

  // Item
  itemContainer: {
    borderBottomWidth: 1,
    borderColor: "#e6ebf2",
    height: size.itemHeight,
    justifyContent: "center",
  },
  item: {
    fontWeight: "600",
    paddingHorizontal: 10,
    textAlign: "left",
  },

  // SectionHeader
  sectionHeader: {
    backgroundColor: "#ffffffee",
    borderBottomWidth: 1,
    borderColor: "#e6ebf2",
    height: size.sectionHeaderHeight,
    justifyContent: "flex-end",
  },
  titleHeader: {
    fontSize: 14,
  },

  // Alphabet
  alphabetContainer: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  alphabetItem: {
    color: "blue",
    fontSize: 12,
    padding: 1,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  alphabetContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
})
