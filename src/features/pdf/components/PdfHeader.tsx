import { Text, View } from "@react-pdf/renderer";
import { pdfStyles } from "./pdfStyles";

interface PdfHeaderProps {
  customerName: string;
}

export default function PdfHeader({ customerName }: PdfHeaderProps) {
  return (
    <View style={pdfStyles.header}>
      <Text style={pdfStyles.eyebrow}>
        EKD-Wirtschaftlichkeits-Analyse
      </Text>
      <Text style={pdfStyles.title}>Wirtschaftlichkeits-Analyse</Text>
      <Text style={pdfStyles.subtitle}>
        Individuelle Berechnung Ihrer zukünftigen Energieversorgung
      </Text>
      {customerName ? (
        <Text style={pdfStyles.customer}>Erstellt für {customerName}</Text>
      ) : null}
    </View>
  );
}
