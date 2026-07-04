# Projektregeln

Du arbeitest an einem React-/TypeScript-/Vite-Projekt.

## Regeln

- Keine Breaking Changes.
- TypeScript im Strict-Modus verwenden.
- Bestehende Architektur beibehalten.
- Komponenten klein halten.
- Duplikate vermeiden.
- Tailwind CSS verwenden.
- Berechnungslogik niemals in React-Komponenten implementieren.
- Alle Berechnungen ausschließlich unter `src/domain/calculation` ablegen.
- UI-Komponenten ausschließlich unter `src/components/ui` ablegen.
- Feature-Komponenten ausschließlich unter `src/features` ablegen.
- Vor jeder Änderung den bestehenden Code analysieren.
- Das Projekt muss nach jeder Änderung mit `npm run build` fehlerfrei bauen.

## Fachliche Regeln

Diese Anwendung ist ein Beratungswerkzeug.

Keine:

- Inflation
- Barwert
- Finanzierung
- Kapitalwert
- CO₂-Berechnung
- Renditeberechnung

Negative jährliche Energiekosten sind zulässig.

Alle Berechnungen orientieren sich ausschließlich an den fachlichen Vorgaben der EKD-Wirtschaftlichkeitsanalyse.

Es werden keine finanzmathematischen Modelle eingeführt, sofern diese nicht ausdrücklich gefordert sind.