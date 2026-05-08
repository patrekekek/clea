import { useState } from "react"
import { Text, StyleSheet } from "react-native"

import { colors } from "../../../theme/colors"



//components
import AppContainer from "../../../components/AppContainer";
import AppHeader from "../../../components/AppHeader";
import TopTabs from "../../../components/TopTabs";
import ScoreMVP from "../../../components/scores/ScoreMVP"



export default function ScoresPage() {


  return (
    <AppContainer>
      <AppHeader />
      <TopTabs />

        <Text style={styles.title}>Record Score</Text>

      <ScoreMVP />

        
    </AppContainer>
  )
}

const styles = StyleSheet.create({

  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.textPrimary,
  },
})