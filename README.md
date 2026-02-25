# EV Range Calculator

An interactive calculator that estimates electric vehicle range under real-world conditions. The project runs fully on the client and does not require a build step.

## Features

- Two calculation modes: Standard and Extended.
- Car selection from a brand/model database.
- Custom car entry with manual parameters.
- Visual range gauge and energy consumption indicator.
- Multilingual UI (EN, SK, RU, UK).
- Responsive layout and atmospheric canvas starfield background.

## Quick Start

1. Open `index.html` in a browser.
2. Or run a local server (recommended for reliable asset loading):
   - VS Code Live Server.
   - Any other static server.

## How to Use

1. Select a car from the dropdown.
2. Set the battery level with the slider.
3. In Standard mode, adjust season, driving conditions, mode, and climate.
4. In Extended mode, adjust speed, temperature, payload, wheels, wind, tire pressure, degradation, and climate.
5. Review the final range in the circular gauge and the consumption panel.

## Calculation Modes

### Standard
Uses a baseline model where range depends on:
- Battery level.
- Season.
- Road type.
- Driving mode.
- Weight load.
- Climate control.

Logic is implemented in [js/formulas/standard.js](js/formulas/standard.js).

### Extended
Professional mode with additional physical factors:
- Speed and temperature.
- Tire pressure (optional).
- Payload.
- Wheel size (optional).
- Wind (optional).
- Climate Pro.
- Battery degradation (optional).
- Driving mode (optional).

Logic is implemented in [js/formulas/extended.js](js/formulas/extended.js) and [js/formulas/consumption.js](js/formulas/consumption.js).

## Project Structure

- [index.html](index.html) - UI markup and resource loading.
- [css/](css/) - styles (global, components, responsive, modals).
- [js/core/](js/core/) - initialization, DOM, configuration, utilities.
- [js/formulas/](js/formulas/) - range and consumption formulas.
- [js/cars/](js/cars/) - car database and selection logic.
- [js/ui/](js/ui/) - UI updates, modals, background.
- [js/languages/](js/languages/) - translation dictionaries and language switcher.
- [img/](img/) - images (brands, favicons, etc.).

## Car Data

- Main data lives in [js/cars/data.js](js/cars/data.js).
- Brands and logos live in [js/cars/brands.js](js/cars/brands.js).

To add a new car:
1. Add an object to the `carsData` array.
2. Ensure `brandId` matches a brand in `brandsData`.
3. Verify the brand logo exists in `img/logos/`.

## Localization

Translation dictionaries are in [js/languages/i18n.js](js/languages/i18n.js). Language switching is implemented in [js/languages/localization.js](js/languages/localization.js).

## Tech Stack

- HTML5, CSS3, JavaScript (Vanilla)
- Font Awesome for icons
- Canvas for the animated background

## Known Limitations

- No bundler and no server-side part.
- Formula ranges and coefficients are approximate.