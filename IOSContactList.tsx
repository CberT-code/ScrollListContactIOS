import React, { useRef, useState, useEffect } from "react";
import {
  SectionList,
  GestureResponderEvent,
  View,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";

import { Item, Section } from "./interfaces";
import { alphabetArray, size } from "./contants";
import { _scrollToSection, groupItemsByOrganizer } from "./utils";
import sectionListGetItemLayout from "react-native-section-list-get-item-layout";
import { styles } from "./styles";

export const IOSContactList = ({
  data,
  onItemPress = () => {},
  ASC = true,
}: {
  data: Item[];
  onItemPress?: any;
  ASC?: boolean;
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

  // Filter sections to remove empty ones and create index mapping
  useEffect(() => {
    const groupedItems = groupItemsByOrganizer(data, alphabet);
    const nonEmptySections = groupedItems.filter(
      (section) => section.data.length > 0
    );
    setFilteredSections(nonEmptySections);

    const newIndexMapping: { [key: string]: number } = {};
    alphabet.forEach((letter) => {
      const sectionIndex = nonEmptySections.findIndex(
        (section) => section.title === letter
      );
      if (sectionIndex !== -1) {
        newIndexMapping[letter] = sectionIndex;
      } else {
        newIndexMapping[letter] = -1;
      }
    });
    setIndexMapping(newIndexMapping);
  }, [data, alphabet]);

  /**
   * Scroll to the section by letter
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

  /**
   * On viewable items changed
   *
   * @param {{ viewableItems: ViewToken[] }} { viewableItems }
   */
  // const onViewableItemsChanged = ({
  //   viewableItems,
  // }: {
  //   viewableItems: ViewToken[];
  // }) => {
  //   const headers = viewableItems
  //     .filter((item) => item.isViewable && item.section)
  //     .map((item) => item.section.title);

  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  //   setStickySectionHeader(headers[0]);
  // };

  // Get item layout
  const _getItemLayout = sectionListGetItemLayout({
    // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: () => size.itemHeight,

    // These three properties are optional
    getSeparatorHeight: () => 0, // The height of your separators
    getSectionHeaderHeight: () => size.sectionHeaderHeight + 30, // The height of your section headers
    getSectionFooterHeight: () => 0, // The height of your section footers
  });

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
            <Text style={styles.item}>{item.name ? item.name : item.key}</Text>
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
        // onViewableItemsChanged={onViewableItemsChanged}
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
