import React, { useRef, useState } from "react";
import {
  SectionList,
  GestureResponderEvent,
  ViewToken,
  LayoutAnimation,
  View,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";

import { Item } from "./interfaces";
import { alphabetArray, size } from "./contants";
import { _scrollToSection, groupItemsByOrganizer } from "./utils";
import sectionListGetItemLayout from "react-native-section-list-get-item-layout";
import { styles } from "./styles";

export const IOSContactList = ({ data }: { data: Item[] }) => {
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
  const [stickySectionHeader, setStickySectionHeader] = useState<string[]>([]);

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
            _scrollToSection(key, listRef);
          }
        }
      });
    });
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

  // Group items by organizer
  const sections = groupItemsByOrganizer(data);

  return (
    <View style={styles.container}>
      <SectionList
        ref={listRef}
        sections={sections}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.item}>{item.name ? item.name : item.key}</Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View
            style={[
              styles.sectionHeader,
              stickySectionHeader.includes(title) && styles.stickySectionHeader,
            ]}
          >
            <Text style={styles.titleHeader}>{title}</Text>
          </View>
        )}
        renderSectionFooter={() => <View style={styles.footer} />}
        getItemLayout={(data, index) => _getItemLayout(sections, index)}
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
          data={alphabetArray}
          keyExtractor={(item) => item}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              ref={(ref) => ref && touchableOpacityRefs.set(item, ref)}
              onPress={() => _scrollToSection(item, listRef)}
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
