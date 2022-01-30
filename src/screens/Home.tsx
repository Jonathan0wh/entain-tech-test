import React, { useState } from "react";
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Collapsible from "react-native-collapsible";
import { Race } from "services/types";

import { useGetNextRacesQuery } from "../services/racing";

enum Categories {
  Greyhound = "Greyhound",
  Harness = "Harness",
  Horse = "Horse",
}

const Home = () => {
  const [isCollapsed, setIsCollapsed] = useState({
    [Categories.Greyhound]: false,
    [Categories.Harness]: false,
    [Categories.Horse]: false,
  });
  const { data, error, isLoading } = useGetNextRacesQuery();

  let IDs: Array<string> = [];
  let races: Array<Race> = [];
  let sectionData = [];

  if (data) {
    IDs = data.next_to_go_ids;
    races = Object.values(data.race_summaries);
    sectionData.push({
      title: Categories.Greyhound,
      data: races
        .filter(
          (value) =>
            value.category_id === "9daef0d7-bf3c-4f50-921d-8e818c60fe61"
        )
        .sort(
          (a, b) => a.advertised_start.seconds - b.advertised_start.seconds
        ),
    });
    sectionData.push({
      title: Categories.Harness,
      data: races
        .filter(
          (value) =>
            value.category_id === "161d9be2-e909-4326-8c2c-35ed71fb460b"
        )
        .sort(
          (a, b) => a.advertised_start.seconds - b.advertised_start.seconds
        ),
    });
    sectionData.push({
      title: Categories.Horse,
      data: races
        .filter(
          (value) =>
            value.category_id === "4a2788f8-e825-4d36-9894-efd4baf1cfae"
        )
        .sort(
          (a, b) => a.advertised_start.seconds - b.advertised_start.seconds
        ),
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Next To Go</Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : error ? (
        <Text>Sorry, network error. Please try again later</Text>
      ) : (
        <SectionList
          sections={sectionData}
          keyExtractor={(item) => item.race_id}
          renderItem={({ item, section }) => (
            <Collapsible
              collapsed={isCollapsed[section.title]}
              style={styles.row}
            >
              <View style={styles.cell}>
                <Text>{item.meeting_name}</Text>
              </View>
              <View style={styles.cell}>
                <Text>{item.race_number}</Text>
              </View>
              <View style={styles.cell}>
                <Text>
                  {item.advertised_start.seconds - Date.now() / 1000 < 0
                    ? `-${Math.floor(
                        (Date.now() / 1000 - item.advertised_start.seconds) / 60
                      )}m ${Math.floor(
                        (Date.now() / 1000 - item.advertised_start.seconds) % 60
                      )}s`
                    : `${Math.floor(
                        (item.advertised_start.seconds - Date.now() / 1000) / 60
                      )}m ${Math.floor(
                        (item.advertised_start.seconds - Date.now() / 1000) % 60
                      )}s`}
                </Text>
              </View>
            </Collapsible>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() =>
                setIsCollapsed((prev) => ({
                  ...prev,
                  [Categories[title]]: !prev[Categories[title]],
                }))
              }
              accessibilityRole="header"
            >
              <Text style={styles.sectionHeaderText}>{title}</Text>
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            <View style={[styles.row, styles.header]}>
              <View style={styles.cell}>
                <Text>Race Name</Text>
              </View>
              <View style={styles.cell}>
                <Text>Race Number</Text>
              </View>
              <View style={styles.cell}>
                <Text>Countdown (Second)</Text>
              </View>
            </View>
          }
          ListEmptyComponent={<Text>Sorry, no data available right now.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  row: {
    flexDirection: "row",
    marginHorizontal: 16,
  },
  cell: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    width: "33%",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    marginHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "grey",
  },
  sectionHeaderText: {
    fontWeight: "bold",
    paddingVertical: 4,
  },
});

export default Home;
