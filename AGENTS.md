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

Ab Sprint P1 gilt ausschließlich die PDF-Ausgabe als Referenz.

Der Browser-Report dient nur noch als historische Layoutvorlage.

Neue Layoutänderungen werden ausschließlich an den PDF-Komponenten umgesetzt.

Der Browser-Report wird nicht mehr angepasst.

## Alternative Eingaben

Wenn zwei Eingabefelder alternativ verwendet werden können,
ist zwischen beiden Feldern immer folgende Darstellung zu verwenden:

oder ───────────────────────────────

Regeln:

- "oder" immer kleingeschrieben
- linksbündig
- normale Schriftstärke
- sekundäre Textfarbe
- 1 px horizontale Linie
- kein zusätzlicher Hilfetext