// Тексты UI для Standard и Extended режимов

/**
 * Обновляет тексты для Standard Mode
 */
function updateStandardModeTexts(t) {
    document.querySelector('#weight-group button[data-value="driver"]').textContent = t.weightDriver;
    document.querySelector('#weight-group button[data-value="partial"]').textContent = t.weightPartial;
    document.querySelector('#weight-group button[data-value="full"]').textContent = t.weightFull;

    document.querySelector('#season-group button[data-value="summer"]').textContent = t.seasonSummer;
    document.querySelector('#season-group button[data-value="spring"]').textContent = t.seasonSpring;
    document.querySelector('#season-group button[data-value="winter"]').textContent = t.seasonWinter;

    document.querySelector('#road-group button[data-value="city"]').textContent = t.roadCity;
    document.querySelector('#road-group button[data-value="highway"]').textContent = t.roadHighway;
    document.querySelector('#road-group button[data-value="mixed"]').textContent = t.roadMixed;

    document.querySelector('#mode-group button[data-value="eco"]').textContent = t.modeEco;
    document.querySelector('#mode-group button[data-value="normal"]').textContent = t.modeNormal;
    document.querySelector('#mode-group button[data-value="sport"]').textContent = t.modeSport;

    document.querySelector('.climate-btn.on').textContent = t.climateOn;
    document.querySelector('.climate-btn.off').textContent = t.climateOff;
}

/**
 * Обновляет тексты для Extended Mode
 */
function updateExtendedModeTexts(t) {
    document.querySelector('#ext-climate-group button[data-value="off"]').textContent = t.climateOff;
    document.querySelector('#ext-climate-group button[data-value="ac"]').textContent = t.climateAC;
    document.querySelector('#ext-climate-group button[data-value="heater"]').textContent = t.climateHeater;

    document.querySelector('#group-wind > .control-label + input + div span:first-child').textContent = t.windTailwind;
    document.querySelector('#group-wind > .control-label + input + div span:last-child').textContent = t.windHeadwind;

    document.querySelector('#tires-slider + div span:nth-child(1)').textContent = t.tireLow;
    document.querySelector('#tires-slider + div span:nth-child(2)').textContent = t.tireNorm;
    document.querySelector('#tires-slider + div span:nth-child(3)').textContent = t.tireHigh;

    document.querySelector('#group-deg > input + div').textContent = t.batteryHealthLoss;

    document.querySelector('#mode-group-ext button[data-value="eco"]').textContent = t.modeEco;
    document.querySelector('#mode-group-ext button[data-value="normal"]').textContent = t.modeNormal;
    document.querySelector('#mode-group-ext button[data-value="sport"]').textContent = t.modeSport;
}
