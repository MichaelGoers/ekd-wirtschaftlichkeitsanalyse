import { Text, View } from "@react-pdf/renderer";
import { pdfStyles } from "./pdfStyles";

export interface PdfFormula {
  label: string;
  parts: string[];
  amount: string;
  showEquals?: boolean;
}

interface PdfCalculationCardProps {
  title: string;
  formulas: PdfFormula[];
  total: string;
  savings: string;
}

interface ProtocolRowProps {
  label: string;
  formula?: string;
  amount: string;
  strong?: boolean;
}

function ProtocolRow({
  label,
  formula = "",
  amount,
  strong = false,
}: ProtocolRowProps) {
  return (
    <View style={pdfStyles.protocolRow}>
      <Text
        style={[
          pdfStyles.protocolLabel,
          strong ? pdfStyles.strongLabel : {},
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          pdfStyles.protocolFormula,
          strong ? pdfStyles.strongFormula : {},
        ]}
      >
        {formula}
      </Text>
      <Text style={pdfStyles.protocolAmount}>{amount}</Text>
    </View>
  );
}

export default function PdfCalculationCard({
  title,
  formulas,
  total,
  savings,
}: PdfCalculationCardProps) {
  return (
    <View style={pdfStyles.card}>
      <Text style={pdfStyles.cardTitle}>{title}</Text>
      {formulas.map((formula) => (
        <ProtocolRow
          key={`${formula.label}-${formula.parts.join("-")}`}
          label={formula.label}
          formula={`${formula.parts.join(" ")}${
            formula.showEquals === false ? "" : " ="
          }`}
          amount={formula.amount}
        />
      ))}

      <View style={pdfStyles.totalArea}>
        <ProtocolRow
          label="Jährliche Energiekosten"
          amount={total}
          strong
        />

        <View style={pdfStyles.savingsBar}>
          <Text style={pdfStyles.savingsLabel}>
            Jährliche Ersparnis gegenüber heute
          </Text>
          <Text style={pdfStyles.savingsValue}>{savings}</Text>
        </View>
      </View>
    </View>
  );
}
