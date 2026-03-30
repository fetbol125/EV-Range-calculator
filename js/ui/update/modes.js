// UI-обновления для Standard и Extended режимов

/**
 * Обновляет UI в Standard режиме
 */
function updateStandardModeUI(t, lblTextSeason, lblIconSeason, lblTextMode, lblIconMode, blockRoad, blockSeason, extendedBlocks) {
    lblTextSeason.textContent = t.sidebarSeason;
    lblIconSeason.className = 'fa-regular fa-snowflake';
    lblTextMode.textContent = t.sidebarMode;
    lblIconMode.className = 'fa-solid fa-bolt';

    if (blockRoad) blockRoad.classList.remove('hidden-factor');
    if (blockSeason) blockSeason.classList.remove('hidden-factor');

    extendedBlocks.forEach(block => {
        if (block) block.classList.add('hidden-factor');
    });

    sumSeason.innerText = t['season' + capitalize(state.season)];
    sumRoad.innerText = t['road' + capitalize(state.road)];
    sumMode.innerText = t['mode' + capitalize(state.mode)];
    sumClimate.innerText = state.climate ? t.climateOn : t.climateOff;

    let weightText = t.weightDriver;
    if (state.weight === 'partial') weightText = t.weightPartial;
    if (state.weight === 'full') weightText = t.weightFull;
    sumWeight.innerText = weightText;
}

/**
 * Обновляет UI в Extended режиме
 */
function updateExtendedModeUI(t, lblTextSeason, lblIconSeason, lblTextMode, lblIconMode, blockRoad, blockSeason, extendedBlocks, sumWheels, sumWeather, sumDeg, sumRelief) {
    lblTextSeason.textContent = t.sidebarSeason;
    lblIconSeason.className = 'fa-regular fa-snowflake';
    lblTextMode.textContent = t.speed;
    lblIconMode.className = 'fa-solid fa-gauge-high';

    if (blockRoad) blockRoad.classList.add('hidden-factor');
    if (blockSeason) blockSeason.classList.add('hidden-factor');

    extendedBlocks.forEach(block => {
        if (block) block.classList.remove('hidden-factor');
    });

    sumMode.innerText = state.extSpeed + ' km/h';

    const clims = { off: t.climateOff, ac: t.climateAC, heater: t.climateHeater };
    sumClimate.innerText = clims[state.extClimateMode] || t.climateOff;
    sumWeight.innerText = state.extPayload + ' kg';

    const tireLabels = [t.tireLow, t.tireNorm, t.tireHigh];
    const tireLabel = tireLabels[state.extTires] || t.tireNorm;
    if (sumWheels) sumWheels.innerHTML = state.extWheels + '" <span>' + tireLabel + '</span>';

    // Update Weather summary
    const temp = state.extTemp + '°C';
    let wind = state.extWind + ' m/s';
    if (state.extWind > 0) wind = '+' + wind;
    const precipLabels = {
        none: t.precipNone,
        rain: t.precipRain,
        snow: t.precipSnow
    };
    const precipText = precipLabels[state.extPrecip] || t.precipNone;
    if (sumWeather) sumWeather.innerText = `${temp}, ${wind}, ${precipText}`;

    // Update Relief summary
    const reliefLabels = { flat: t.reliefFlat, hilly: t.reliefHilly, mountains: t.reliefMountains };
    if (sumRelief) sumRelief.innerText = capitalize(reliefLabels[state.extRelief] || t.reliefFlat);

    if (sumDeg) sumDeg.innerText = state.extDeg + '%';

    const sumModeExt = document.getElementById('summary-mode-ext');
    const sumEnergyConsumers = document.getElementById('summary-energy-consumers');

    if (sumModeExt) sumModeExt.innerText = capitalize(state.extMode);
    if (document.getElementById('val-mode-ext')) document.getElementById('val-mode-ext').innerText = capitalize(state.extMode);

    // Update Energy Consumers
    const seatText = state.seatHeating ? t.climateOn : t.climateOff;
    const windowText = state.windowHeating ? t.climateOn : t.climateOff;
    const multText = state.multimedia ? t.climateOn : t.climateOff;
    if (document.getElementById('val-seat-heating')) document.getElementById('val-seat-heating').innerText = seatText;
    if (document.getElementById('val-window-heating')) document.getElementById('val-window-heating').innerText = windowText;
    if (document.getElementById('val-multimedia')) document.getElementById('val-multimedia').innerText = multText;

    // Update Energy Consumers summary
    const activeCount = [state.seatHeating, state.windowHeating, state.multimedia].filter(Boolean).length;
    const valEnergyConsumers = document.getElementById('val-energy-consumers');
    if (valEnergyConsumers) {
        if (activeCount === 0) {
            valEnergyConsumers.innerText = t.climateOff;
        } else {
            valEnergyConsumers.innerText = activeCount + ' ' + t.energyActive;
        }
    }

    if (sumEnergyConsumers) {
        if (activeCount === 0) {
            sumEnergyConsumers.innerText = t.climateOff;
        } else {
            sumEnergyConsumers.innerText = activeCount + ' ' + t.energyActive;
        }
    }

    updateExtendedDisabledStates();
}

/**
 * Обновляет состояния disabled для Extended режима
 */
function updateExtendedDisabledStates() {
    const blockWheels = document.getElementById('sidebar-block-wheels');
    const blockWeather = document.getElementById('sidebar-block-weather');
    const blockDeg = document.getElementById('sidebar-block-deg');
    const blockModeExt = document.getElementById('sidebar-block-mode-ext');
    const blockEnergyConsumers = document.getElementById('sidebar-block-energy-consumers');
    const blockRelief = document.getElementById('sidebar-block-relief');
    const groupDeg = document.getElementById('group-deg');
    const groupModeExt = document.getElementById('group-mode-ext');
    const groupEnergyConsumers = document.getElementById('energy-consumers-dropdown');
    const groupWeather = document.getElementById('weather-dropdown');
    const groupRelief = document.getElementById('group-relief');

    if (!state.enableWheels) blockWheels.classList.add('disabled');
    else blockWheels.classList.remove('disabled');

    if (!state.enableWeather) {
        if (blockWeather) blockWeather.classList.add('disabled');
        if (groupWeather) groupWeather.classList.add('disabled');
    } else {
        if (blockWeather) blockWeather.classList.remove('disabled');
        if (groupWeather) groupWeather.classList.remove('disabled');
    }

    if (!state.enableDeg) {
        if (blockDeg) blockDeg.classList.add('disabled');
        if (groupDeg) groupDeg.classList.add('disabled');
    } else {
        if (blockDeg) blockDeg.classList.remove('disabled');
        if (groupDeg) groupDeg.classList.remove('disabled');
    }

    if (!state.enableExtMode) {
        if (blockModeExt) blockModeExt.classList.add('disabled');
        if (groupModeExt) groupModeExt.classList.add('disabled');
    } else {
        if (blockModeExt) blockModeExt.classList.remove('disabled');
        if (groupModeExt) groupModeExt.classList.remove('disabled');
    }

    if (!state.enableEnergyConsumers) {
        if (blockEnergyConsumers) blockEnergyConsumers.classList.add('disabled');
        if (groupEnergyConsumers) groupEnergyConsumers.classList.add('disabled');
    } else {
        if (blockEnergyConsumers) blockEnergyConsumers.classList.remove('disabled');
        if (groupEnergyConsumers) groupEnergyConsumers.classList.remove('disabled');
    }

    if (!state.enableRelief) {
        if (blockRelief) blockRelief.classList.add('disabled');
        if (groupRelief) groupRelief.classList.add('disabled');
    } else {
        if (blockRelief) blockRelief.classList.remove('disabled');
        if (groupRelief) groupRelief.classList.remove('disabled');
    }
}
