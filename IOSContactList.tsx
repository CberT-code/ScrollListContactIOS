import React, { useRef, useState, useEffect } from "react";
import {
  SectionList,
  GestureResponderEvent,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";

import { Item, Section } from "./interfaces";
import { alphabetArray, size } from "./contants";
import {
  _scrollToSection,
  groupItemsByOrganizer,
  groupItemsByState,
} from "./utils";
import sectionListGetItemLayout from "react-native-section-list-get-item-layout";
import { styles } from "./styles";

// Define a new property for state-based sorting
export const IOSContactList = ({
  data,
  onItemPress = () => {},
  ASC = true,
  refreshing = false,
  onRefresh = () => {},
  sortByProp, // New prop to control sorting by prop
  headerProp = false, // New prop to control sorting by prop
}: {
  data: Item[];
  onItemPress?: any;
  ASC?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  sortByProp?: string;
  headerProp?: boolean; // New prop to control sorting by state
}) => {
  // Refs
  const listRef = useRef<SectionList<Item>>(null);
  const touchableOpacityRefs = useRef(
    new Map<
      string,
      {
        measure: (
          callback: (
            fx: number,
            fy: number,
            width: number,
            height: number,
            px: number,
            py: number
          ) => void
        ) => void;
      }
    >()
  ).current;

  // States
  const [lastSelectedSection, setLastSelectedSection] = useState<string | null>(
    null
  );
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [indexMapping, setIndexMapping] = useState<{ [key: string]: number }>(
    {}
  );
  const [alphabet, setAlphabet] = useState(
    ASC ? [...alphabetArray] : [...alphabetArray].reverse()
  );

  // Update alphabet when ASC changes
  useEffect(() => {
    setAlphabet(ASC ? [...alphabetArray] : [...alphabetArray].reverse());
  }, [ASC]);

  // Filter and group items by state or by alphabet depending on sortByProp
  useEffect(() => {
    const groupedItems = sortByProp
      ? groupItemsByState(data, sortByProp, headerProp) // Group by state
      : groupItemsByOrganizer(data, alphabet); // Group by alphabet
    const nonEmptySections = groupedItems.filter(
      (section) => section.data.length > 0
    );
    setFilteredSections(nonEmptySections);

    const newIndexMapping: { [key: string]: number } = {};
    const keys = sortByProp
      ? groupedItems.map((section) => section.title)
      : alphabet;

    keys.forEach((key) => {
      const sectionIndex = nonEmptySections.findIndex(
        (section) => section.title === key
      );
      if (sectionIndex !== -1) {
        newIndexMapping[key] = sectionIndex;
      } else {
        newIndexMapping[key] = -1;
      }
    });
    setIndexMapping(newIndexMapping);
  }, [data, alphabet, sortByProp]);

  /**
   * Scroll to the section by letter or state first letter
   *
   * @param {GestureResponderEvent} event
   */
  const handleTouchMove = (event: GestureResponderEvent) => {
    const { pageX: x, pageY: y } = event.nativeEvent;
    touchableOpacityRefs.forEach((ref, key) => {
      ref.measure((fx, fy, width, height, px, py) => {
        if (x >= px && x <= px + width && y >= py && y <= py + height) {
          if (key !== lastSelectedSection) {
            setLastSelectedSection(key);
            scrollToSection(key);
          }
        }
      });
    });
  };

  const scrollToSection = (letter: string) => {
    let sectionIndex = indexMapping[letter];
    if (sectionIndex === -1) {
      // Find the next available section
      const nextLetter = alphabet.findLast(
        (nextLetter) =>
          indexMapping[nextLetter] !== -1 &&
          alphabet.indexOf(nextLetter) < alphabet.indexOf(letter)
      );
      sectionIndex = nextLetter ? indexMapping[nextLetter] : undefined;
    }
    if (sectionIndex !== null) {
      _scrollToSection(alphabet[sectionIndex], listRef, alphabet);
    }
  };

  // Get item layout
  const _getItemLayout = sectionListGetItemLayout({
    getItemHeight: () => size.itemHeight,
    getSeparatorHeight: () => 0,
    getSectionHeaderHeight: () => size.sectionHeaderHeight + 30,
    getSectionFooterHeight: () => 0,
  });

  // Function to render item text with the first word in bold
  const renderItemText = (text: string) => {
    // Split the text at the first space
    const [firstWord, ...restWords] = text.split(" ");
    return (
      <>
        {/* First word in bold */}
        <Text style={styles.itemBold}>{firstWord}</Text>
        {/* Rest of the words in normal font */}
        {restWords.length > 0 && (
          <Text style={styles.item}> {restWords.join(" ")}</Text>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <SectionList
        ref={listRef}
        sections={filteredSections}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => onItemPress(item)}
          >
            <Text style={styles.item}>
              {item.name ? renderItemText(item.name) : renderItemText(item.key)}
            </Text>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.titleHeader}>{title}</Text>
          </View>
        )}
        renderSectionFooter={() => <View style={styles.footer} />}
        getItemLayout={(section, index) =>
          _getItemLayout(filteredSections, index)
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.sectionList}
      />
      <View
        style={styles.alphabetContainer}
        onTouchStart={handleTouchMove}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setLastSelectedSection(null)}
      >
        <FlatList
          data={alphabet}
          keyExtractor={(item) => item}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              ref={(ref) => ref && touchableOpacityRefs.set(item, ref)}
              onPress={() => scrollToSection(item)}
            >
              <Text style={styles.alphabetItem}>{item.toUpperCase()}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.alphabetContent}
        />
      </View>
    </View>
  );
};

export default IOSContactList;
