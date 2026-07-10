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

# Zahlenformatierung (Projektstandard)

Für die gesamte Anwendung gelten folgende Formatierungsregeln.
Diese Regeln sind verbindlich und gelten für Projektseite, Auswertung, PDF sowie alle zukünftigen Erweiterungen.

| Datentyp | Format | Beispiel |
|----------|--------|----------|
| Euro | immer 2 Nachkommastellen | 1.440,00 € |
| €/kWh | immer 3 Nachkommastellen | 0,288 €/kWh |
| kWh | immer 2 Nachkommastellen | 18,58 kWh |
| kWp | immer 2 Nachkommastellen | 11,30 kWp |
| Prozent | keine Nachkommastellen | 60 % |
| Stück | keine Nachkommastellen | 24 Stk. |

## Darstellung

- Deutsche Zahlenformatierung verwenden.
- Tausendertrennzeichen mit Punkt.
- Dezimaltrennzeichen mit Komma.
- Einheit immer mit Leerzeichen hinter dem Zahlenwert darstellen.
- Einheiten grundsätzlich nicht übersetzen.

## Implementierung

Formatierungen sollen nach Möglichkeit zentral erfolgen (Formatter/Utilities) und nicht mehrfach im Code mit `toFixed()` implementiert werden.

Neue Ansichten, Berechnungen und PDF-Ausgaben müssen diese Formatierungsregeln automatisch verwenden.

# UI-Standards

## Alternativ-Eingaben ("oder")

Bei Eingabepaaren mit einem "oder"-Trenner gilt:

- Änderung im ersten Feld setzt das zweite Feld automatisch auf 0.
- Änderung im zweiten Feld setzt das erste Feld automatisch auf 0.
- Keine Warnmeldungen oder Dialoge anzeigen.
- Diese Logik ist projektweit wiederzuverwenden.

## Automatisch berechnete Werte

Berechnete Werte werden in einem hellgrauen Informationsbereich dargestellt.

Der Benutzer erkennt dadurch sofort:

- berechnete Werte
- manuell editierbare Werte

## Überschriften

Abschnittsüberschriften werden in normaler Schreibweise verwendet.

Beispiele:

PV-Auslegung

Speicherauslegung

Nicht in Versalien schreiben.

## Empfehlungen

Automatisch berechnete Empfehlungen dürfen durch Benutzereingaben nicht verändert werden.

Benutzereingaben (z. B. "Gewünschte Leistung") beeinflussen ausschließlich die nachgelagerte Wirtschaftlichkeitsberechnung.

Corporate Design ist abgeschlossen. Änderungen am Erscheinungsbild erfolgen künftig nur noch, wenn sie einen konkreten funktionalen oder ergonomischen Nutzen haben.