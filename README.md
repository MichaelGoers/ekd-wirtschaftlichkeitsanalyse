# EKD Wirtschaftlichkeitsanalyse

Die EKD Wirtschaftlichkeitsanalyse ist eine browserbasierte Beratungsanwendung
zum Vergleich der laufenden Energiekosten einer bestehenden Versorgung mit
verschiedenen Wärmepumpen- und Photovoltaik-Szenarien.

## Funktionen

- Erfassung von Kunden-, Investitions- und Verbrauchsdaten
- Vergleich der aktuellen Situation mit:
  - Wärmepumpe
  - Wärmepumpe und Photovoltaik
  - Wärmepumpe, Photovoltaik und EKDFlow
- Darstellung zentraler Kosten- und Ersparniskennzahlen
- Zentrale, von der Benutzeroberfläche getrennte Berechnungslogik

Die Anwendung arbeitet derzeit vollständig im Browser. Projektdaten werden
nicht dauerhaft gespeichert und gehen beim Neuladen der Seite verloren.

## Technologie

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- Tailwind CSS

## Projektstruktur

```text
src/
├── components/
│   ├── layout/             Übergreifendes Anwendungslayout
│   └── ui/                 Wiederverwendbare UI-Komponenten
├── domain/
│   ├── calculation/        Berechnungen, Standardwerte und Analyse-Service
│   └── project/            Standardprojekt
├── features/
│   ├── dashboard/          Ergebnisübersicht
│   └── project/            Erfassung der Projektdaten
├── store/                  Globaler Projektzustand
├── types/                  Projekt- und Ergebnistypen
├── utils/                  Formatierungsfunktionen
├── router.tsx              Routing-Konfiguration
└── main.tsx                Einstiegspunkt
```

Die Berechnungslogik befindet sich ausschließlich unter
`src/domain/calculation`. React-Komponenten greifen über den zentralen
Analyse-Service darauf zu.

## Lokale Entwicklung

Voraussetzung ist eine aktuelle Node.js-Version.

```bash
npm install
npm run dev
```

Vite gibt anschließend die lokale Adresse der Anwendung aus.

## Verfügbare Skripte

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

- `npm run dev` startet den Entwicklungsserver.
- `npm run build` führt die TypeScript-Prüfung aus und erstellt den
  Produktions-Build.
- `npm run lint` prüft den Quellcode mit ESLint.
- `npm run preview` zeigt den erstellten Produktions-Build lokal an.

## Routen

- `/` – Dashboard und Kostenvergleich
- `/project` – Eingabe der Kunden-, Investitions- und Verbrauchsdaten

## Fachlicher Rahmen

Die Anwendung bildet ausschließlich die vorgegebenen Regeln der
EKD-Wirtschaftlichkeitsanalyse ab. Sie verwendet keine finanzmathematischen
Modelle wie Inflation, Barwert, Finanzierung, Kapitalwert oder Rendite.

Die aktuell implementierten Formeln sind unter
[`docs/calculations.md`](docs/calculations.md) dokumentiert.

## Projektregeln

Die verbindlichen Entwicklungs- und Fachregeln stehen in
[`AGENTS.md`](AGENTS.md).
