import { View, Text } from "react-native";
import { ScoreRow } from "./selectors"; //type

type Props = {
    rows: ScoreRow[]
};

export default function ScoreTable({ rows }: Props) {
  return (
    <View style={{ marginTop: 24 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 2,
          paddingBottom: 6,
        }}
      >
        <HeaderCell label="Student" />
        <HeaderCell label="S1" />
        <HeaderCell label="S2" />
        <HeaderCell label="S3" />
        <HeaderCell label="S4" />
        <HeaderCell label="Perf" />
        <HeaderCell label="Quarterly" />
      </View>

      {/* Rows */}
      {rows.map(row => (
        <View
          key={row.studentName}
          style={{
            flexDirection: "row",
            borderBottomWidth: 1,
            paddingVertical: 6,
          }}
        >
          <Cell value={row.studentName} />
          <Cell value={row.summative[1]} />
          <Cell value={row.summative[2]} />
          <Cell value={row.summative[3]} />
          <Cell value={row.summative[4]} />
          <Cell value={row.performance} />
          <Cell value={row.quarterly} />
        </View>
      ))}
    </View>
  )
}

function HeaderCell({ label }: { label: string }) {
  return (
    <Text style={{ flex: 1, fontWeight: "bold" }}>
      {label}
    </Text>
  )
}

function Cell({ value }: { value?: number | string }) {
  return (
    <Text style={{ flex: 1 }}>
      {value ?? "-"}
    </Text>
  )
}

