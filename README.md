# EV-Range-alculator

# Kalkulátor dojazdu elektromobilu

Webová aplikácia (statická stránka) na odhad **dojazdu elektromobilu** v závislosti od reálnych podmienok: úroveň nabitia, ročné obdobie/teplota, typ cesty, štýl jazdy, hmotnosť nákladu a ďalšie faktory (v rozšírenom režime).

Projekt funguje úplne na frontende: **HTML + CSS + JavaScript**, bez servera a kompilátora.

---

## Možnosti

- Výber **značky a modelu** elektromobilu z integrovanej databázy
- Zobrazenie:
  - **Estimated Range** (odhad aktuálneho dojazdu)
  - **Max Range** (pasový/základný maximálny dojazd pre vybraný model)
- Prepínanie režimov:
  - **Standard** — rýchly výpočet podľa koeficientov
  - **Extended** — „profesionálny“ režim s pripojiteľnými fyzickými opravami
- Prepínanie jazyka rozhrania: **English / Русский**
- Animované používateľské rozhranie (indikátor/ukazovateľ atď.)

---

## Rýchly štart

### Variant 1 — jednoducho otvorte stránku
1. Stiahnite si projekt
2. Otvorte súbor `index.html` v prehliadači

### Variant 2 — cez Live Server (odporúčané)
Ak používate VS Code:
1. Nainštalujte rozšírenie **Live Server**
2. Otvorte `index.html`
3. Kliknite na **Go Live**

---

## Štruktúra projektu

- `index.html` — rozloženie a hlavné bloky rozhrania
- `style.css` — štýly
- `script.js` — logika UI, stav aplikácie, spracovatelia, renderovanie, volanie vzorcov
- `standard.js` — vzorec výpočtu režimu **Standard**
- `extended.js` — vzorec výpočtu režimu **Extended**
- `brands.js` — zoznam značiek (id, názov, logo)
- `data.js` — databáza modelov áut (range, battery, weightKg, img)
- `i18n.js` — slovník prekladov EN/RU

---

## Údaje o automobiloch

Údaje sú uložené v `data.js` v poli objektov `carsData`:

```js
{
  id: ‚q4-e-tron‘,
  brandId: ‚audi‘,
  name: ‚Q4 e-tron‘,
  range: 520,      // základný/pasový dojazd (km)
  battery: 77,     // kapacita batérie (kW⋅h) — na zobrazenie
  weightKg: 2050,  // hmotnosť automobilu (kg) — na úpravu hmotnosti
  img: ‚https://...‘
}
