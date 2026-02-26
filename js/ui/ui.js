// Обновление UI и визуализации

/**
 * Главная функция обновления пользовательского интерфейса
 */
function updateUI() {
    const t = translations[state.lang];
    
    // Базовые обновления
    sliderValDisplay.innerText = state.battery + '%';
    footerBattery.innerText = state.battery + '%';
    sumBattery.innerText = state.battery + '%';
    
    // Обновление единиц измерения
    document.querySelector('.gauge-unit').textContent = t.kilometers;
    document.querySelector('.gauge-content > div:first-child').textContent = t.estimatedRange;
    document.querySelector('.footer-item.border-right .footer-label').textContent = t.currentBattery;
    document.querySelector('.footer-item:not(.border-right) .footer-label').textContent = t.maxRange;

    const lblTextSeason = document.getElementById('lbl-text-season');
    const lblIconSeason = document.getElementById('lbl-icon-season');
    const lblTextMode = document.getElementById('lbl-text-mode');
    const lblIconMode = document.getElementById('lbl-icon-mode');
    
    const blockRoad = document.getElementById('sidebar-block-road');
    const blockSeason = document.getElementById('sidebar-block-season');
    const blockWheels = document.getElementById('sidebar-block-wheels');
    const blockWeather = document.getElementById('sidebar-block-weather');
    const blockDeg = document.getElementById('sidebar-block-deg');
    const blockModeExt = document.getElementById('sidebar-block-mode-ext');
    const blockEnergyConsumers = document.getElementById('sidebar-block-energy-consumers');

    const extendedBlocks = [blockWheels, blockWeather, blockDeg, blockModeExt, blockEnergyConsumers];

    const sumWheels = document.getElementById('summary-wheels');
    const sumWeather = document.getElementById('summary-weather');
    const sumDeg = document.getElementById('summary-deg');
    
    // Обновление текстов контролов Standard Mode
    updateStandardModeTexts(t);
    
    // Обновление текстов контролов Extended Mode
    updateExtendedModeTexts(t);

    if (state.rangeType === 'standard') {
        updateStandardModeUI(t, lblTextSeason, lblIconSeason, lblTextMode, lblIconMode, blockRoad, blockSeason, extendedBlocks);
    } else {
        updateExtendedModeUI(t, lblTextSeason, lblIconSeason, lblTextMode, lblIconMode, blockRoad, blockSeason, extendedBlocks, sumWheels, sumWeather, sumDeg);
    }

    updateImpactVisuals();
    updateCalculation();
    updateBatteryGauge();
}

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

/**
 * Обновляет UI в Standard режиме
 */
function updateStandardModeUI(t, lblTextSeason, lblIconSeason, lblTextMode, lblIconMode, blockRoad, blockSeason, extendedBlocks) {
    lblTextSeason.textContent = t.sidebarSeason;
    lblIconSeason.className = 'fa-regular fa-snowflake';
    lblTextMode.textContent = t.sidebarMode;
    lblIconMode.className = 'fa-solid fa-bolt';

    if(blockRoad) blockRoad.classList.remove('hidden-factor');
    if(blockSeason) blockSeason.classList.remove('hidden-factor');

    extendedBlocks.forEach(block => {
        if(block) block.classList.add('hidden-factor');
    });

    sumSeason.innerText = t['season' + capitalize(state.season)];
    sumRoad.innerText = t['road' + capitalize(state.road)];
    sumMode.innerText = t['mode' + capitalize(state.mode)];
    sumClimate.innerText = state.climate ? t.climateOn : t.climateOff;
    
    let weightText = t.weightDriver;
    if(state.weight === 'partial') weightText = t.weightPartial;
    if(state.weight === 'full') weightText = t.weightFull;
    sumWeight.innerText = weightText;
}

/**
 * Обновляет UI в Extended режиме
 */
function updateExtendedModeUI(t, lblTextSeason, lblIconSeason, lblTextMode, lblIconMode, blockRoad, blockSeason, extendedBlocks, sumWheels, sumWeather, sumDeg) {
    lblTextSeason.textContent = t.sidebarSeason;
    lblIconSeason.className = 'fa-regular fa-snowflake';
    lblTextMode.textContent = t.speed;
    lblIconMode.className = 'fa-solid fa-gauge-high';

    if(blockRoad) blockRoad.classList.add('hidden-factor');
    if(blockSeason) blockSeason.classList.add('hidden-factor');

    extendedBlocks.forEach(block => {
        if(block) block.classList.remove('hidden-factor');
    });

    sumMode.innerText = state.extSpeed + ' km/h';
    
    const clims = {off:t.climateOff, ac:t.climateAC, heater:t.climateHeater};
    sumClimate.innerText = clims[state.extClimateMode] || t.climateOff;
    sumWeight.innerText = state.extPayload + ' kg';

    const tireLabels = [t.tireLow, t.tireNorm, t.tireHigh];
    const tireLabel = tireLabels[state.extTires] || t.tireNorm;
    if(sumWheels) sumWheels.innerHTML = state.extWheels + '" <span>' + tireLabel + '</span>';
    
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
    if(sumWeather) sumWeather.innerText = `${temp}, ${wind}, ${precipText}`;
    
    if(sumDeg) sumDeg.innerText = state.extDeg + '%';
    
    const sumModeExt = document.getElementById('summary-mode-ext');
    const sumEnergyConsumers = document.getElementById('summary-energy-consumers');
    
    if(sumModeExt) sumModeExt.innerText = capitalize(state.extMode); 
    if(document.getElementById('val-mode-ext')) document.getElementById('val-mode-ext').innerText = capitalize(state.extMode);

    // Update Energy Consumers
    const seatText = state.seatHeating ? t.climateOn : t.climateOff;
    const windowText = state.windowHeating ? t.climateOn : t.climateOff;
    const multText = state.multimedia ? t.climateOn : t.climateOff;
    if(document.getElementById('val-seat-heating')) document.getElementById('val-seat-heating').innerText = seatText;
    if(document.getElementById('val-window-heating')) document.getElementById('val-window-heating').innerText = windowText;
    if(document.getElementById('val-multimedia')) document.getElementById('val-multimedia').innerText = multText;

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
    
    if(sumEnergyConsumers) {
        if (activeCount === 0) {
            sumEnergyConsumers.innerText = t.climateOff;
        } else if (activeCount === 1) {
            if (state.seatHeating) sumEnergyConsumers.innerText = t.seatHeating;
            else if (state.windowHeating) sumEnergyConsumers.innerText = t.windowHeating;
            else sumEnergyConsumers.innerText = t.multimedia;
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
    const groupDeg = document.getElementById('group-deg');
    const groupModeExt = document.getElementById('group-mode-ext');
    const groupEnergyConsumers = document.getElementById('energy-consumers-dropdown');
    const groupWeather = document.getElementById('weather-dropdown');

    if (!state.enableWheels) blockWheels.classList.add('disabled'); 
    else blockWheels.classList.remove('disabled');
    
    if (!state.enableWeather) {
        if(blockWeather) blockWeather.classList.add('disabled');
        if(groupWeather) groupWeather.classList.add('disabled');
    } else {
        if(blockWeather) blockWeather.classList.remove('disabled');
        if(groupWeather) groupWeather.classList.remove('disabled');
    }
    
    if (!state.enableDeg) { 
        if(blockDeg) blockDeg.classList.add('disabled');
        if(groupDeg) groupDeg.classList.add('disabled');
    } else {
        if(blockDeg) blockDeg.classList.remove('disabled');
        if(groupDeg) groupDeg.classList.remove('disabled');
    }
    
    if (!state.enableExtMode) { 
        if(blockModeExt) blockModeExt.classList.add('disabled');
        if(groupModeExt) groupModeExt.classList.add('disabled');
    } else {
        if(blockModeExt) blockModeExt.classList.remove('disabled');
        if(groupModeExt) groupModeExt.classList.remove('disabled');
    }
    
    if (!state.enableEnergyConsumers) { 
        if(blockEnergyConsumers) blockEnergyConsumers.classList.add('disabled');
        if(groupEnergyConsumers) groupEnergyConsumers.classList.add('disabled');
    } else {
        if(blockEnergyConsumers) blockEnergyConsumers.classList.remove('disabled');
        if(groupEnergyConsumers) groupEnergyConsumers.classList.remove('disabled');
    }
}

/**
 * Обновляет визуальные индикаторы влияния факторов
 */
function updateImpactVisuals() {
    const setVisual = (valEl, iconEl, status) => {
        if(valEl) valEl.className = 'factor-value';
        if(iconEl) iconEl.className = 'trend-icon';
        if (status === 'good') { 
            if(valEl) valEl.classList.add('text-success'); 
            if(iconEl) iconEl.classList.add('text-success'); 
            if(iconEl) iconEl.innerHTML = '<i class="fa-solid fa-arrow-trend-up"></i>'; 
        } else if (status === 'warn') { 
            if(valEl) valEl.classList.add('text-warning'); 
            if(iconEl) iconEl.classList.add('text-warning'); 
            if(iconEl) iconEl.innerHTML = '<i class="fa-solid fa-arrow-trend-down"></i>'; 
        } else if (status === 'bad') { 
            if(valEl) valEl.classList.add('text-danger'); 
            if(iconEl) iconEl.classList.add('text-danger'); 
            if(iconEl) iconEl.innerHTML = '<i class="fa-solid fa-arrow-trend-down"></i>'; 
        }
    };
    
    const setNeutralVisual = (valEl, iconEl) => {
        if(iconEl) iconEl.innerHTML = '<i class="fa-solid fa-minus"></i>';
        if(valEl) valEl.className = 'factor-value';
        if(iconEl) iconEl.className = 'trend-icon';
    }

    const formatImpactPercent = (value) => {
        if (value === null || value === undefined) return '--';
        const rounded = Math.round(value);
        if (rounded === 0) return '0%';
        return `${rounded > 0 ? '+' : ''}${rounded}%`;
    };

    const setImpactText = (el, value) => {
        if (!el) return;
        el.className = 'impact-percent';

        if (value === null || value === undefined) {
            el.textContent = '--';
            return;
        }

        const rounded = Math.round(value);
        if (rounded >= 2) {
            el.classList.add('text-success');
        } else if (rounded <= -8) {
            el.classList.add('text-danger');
        } else if (rounded <= -2) {
            el.classList.add('text-warning');
        }

        el.textContent = formatImpactPercent(rounded);
    };

    const getWeatherMultiplier = () => {
        if (!state.enableWeather) return 1;
        let tempFactor = 1.0;
        const t = state.extTemp;
        if (t < 20) {
            const drop = (20 - t) * 0.015;
            tempFactor = 1.0 - drop;
        } else if (t > 25) {
            const drop = (t - 25) * 0.008;
            tempFactor = 1.0 - drop;
        }
        if (tempFactor < 0.4) tempFactor = 0.4;

        let thermalFactor = 1.0;
        if (t <= BATTERY_HEATING_THRESHOLD) {
            thermalFactor = 1.0 - BATTERY_HEATING_IMPACT;
        } else if (t >= BATTERY_COOLING_THRESHOLD) {
            thermalFactor = 1.0 - BATTERY_COOLING_IMPACT;
        }

        let windFactor = 1.0;
        if (state.enableWind) {
            if (state.extWind > 0) {
                windFactor = 1.0 - (state.extWind * 0.015);
            } else if (state.extWind < 0) {
                windFactor = 1.0 + (Math.abs(state.extWind) * 0.008);
            }
        }

        let precipFactor = 1.0;
        if (state.extPrecip === 'rain') {
            precipFactor = 1.0 - PRECIP_RAIN_IMPACT;
        } else if (state.extPrecip === 'snow') {
            precipFactor = 1.0 - PRECIP_SNOW_IMPACT;
        }

        return tempFactor * thermalFactor * windFactor * precipFactor;
    };

    const getWheelsMultiplier = () => {
        if (!state.enableWheels) return 1;
        let wheelFactor = 1.0;
        const w = state.extWheels;
        if (w === 18) wheelFactor = 1.02;
        else if (w === 19) wheelFactor = 1.00;
        else if (w === 20) wheelFactor = 0.97;
        else if (w === 21) wheelFactor = 0.94;
        else if (w >= 22) wheelFactor = 0.90;
        return wheelFactor;
    };

    const getDegMultiplier = () => {
        if (!state.enableDeg) return 1;
        return 1.0 - (state.extDeg / 100);
    };

    const getEnergyMultiplier = () => {
        if (!state.enableEnergyConsumers) return 1;
        let energyFactor = 1.0;
        if (state.seatHeating) energyFactor *= (1 - SEAT_HEATING_IMPACT);
        if (state.windowHeating) energyFactor *= (1 - WINDOW_HEATING_IMPACT);
        if (state.multimedia) energyFactor *= (1 - MULTIMEDIA_IMPACT);
        return energyFactor;
    };

    const getModeMultiplier = () => {
        if (!state.enableExtMode) return 1;
        return factors.mode[state.extMode] || 1;
    };

    const getSpeedMultiplier = () => {
        if (state.rangeType !== 'extended') return null;
        const refSpeed = 50;
        let speedFactor = 1.0;
        if (state.extSpeed > refSpeed) {
            const diff = state.extSpeed - refSpeed;
            speedFactor = 1.0 - (Math.pow(diff, 1.65) * 0.0002);
        } else {
            if (state.extSpeed < 20) speedFactor = 0.95;
        }
        if (speedFactor < 0.3) speedFactor = 0.3;
        return speedFactor;
    };

    const getWeightMultiplier = () => {
        if (state.rangeType === 'extended') {
            const addedMass = state.extPayload;
            const massRatio = addedMass / currentCarWeight;
            return 1.0 - (massRatio * 0.4);
        }

        const addedMass = ADDED_WEIGHT_KG[state.weight];
        const massRatio = addedMass / currentCarWeight;
        return 1.0 - (massRatio * 0.6);
    };

    const getClimateMultiplier = () => {
        if (state.rangeType === 'extended') {
            if (state.extClimateMode === 'ac') return 0.88;
            if (state.extClimateMode === 'heater') return 0.78;
            return 1.0;
        }

        return state.climate ? (1.0 - CLIMATE_IMPACT) : 1.0;
    };
    
    const sumWheels = document.getElementById('summary-wheels');
    const iconWheels = document.getElementById('icon-wheels');
    const sumWeather = document.getElementById('summary-weather');
    const iconWeather = document.getElementById('icon-weather');
    const sumDeg = document.getElementById('summary-deg');
    const iconDeg = document.getElementById('icon-deg');
    const sumModeExt = document.getElementById('summary-mode-ext');
    const iconModeExt = document.getElementById('icon-mode-ext');
    const sumEnergyConsumers = document.getElementById('summary-energy-consumers');
    const iconEnergyConsumers = document.getElementById('icon-energy-consumers');

    const impactWeather = document.getElementById('impact-weather');
    const impactWheels = document.getElementById('impact-wheels');
    const impactDeg = document.getElementById('impact-deg');
    const impactModeExt = document.getElementById('impact-mode-ext');
    const impactEnergy = document.getElementById('impact-energy-consumers');
    const impactWeight = document.getElementById('impact-weight');
    const impactClimate = document.getElementById('impact-climate');
    const impactSpeed = document.getElementById('impact-speed');
    
    if (state.rangeType === 'standard') {
        updateStandardModeVisuals(setVisual);
        setImpactText(impactWeather, null);
        setImpactText(impactWheels, null);
        setImpactText(impactDeg, null);
        setImpactText(impactModeExt, null);
        setImpactText(impactEnergy, null);
        setImpactText(impactSpeed, null);
        setImpactText(impactWeight, null);
        setImpactText(impactClimate, null);
    } else {
        updateExtendedModeVisuals(setVisual, setNeutralVisual, sumWheels, iconWheels, sumWeather, iconWeather, sumDeg, iconDeg, sumModeExt, iconModeExt, sumEnergyConsumers, iconEnergyConsumers);

        const weatherImpact = state.enableWeather ? (getWeatherMultiplier() - 1) * 100 : null;
        const wheelsImpact = state.enableWheels ? (getWheelsMultiplier() - 1) * 100 : null;
        const degImpact = state.enableDeg ? (getDegMultiplier() - 1) * 100 : null;
        const modeImpact = state.enableExtMode ? (getModeMultiplier() - 1) * 100 : null;
        const energyImpact = state.enableEnergyConsumers ? (getEnergyMultiplier() - 1) * 100 : null;
        const speedImpact = (getSpeedMultiplier() - 1) * 100;
        const weightImpact = (getWeightMultiplier() - 1) * 100;
        const climateImpact = (getClimateMultiplier() - 1) * 100;

        setImpactText(impactWeather, weatherImpact);
        setImpactText(impactWheels, wheelsImpact);
        setImpactText(impactDeg, degImpact);
        setImpactText(impactModeExt, modeImpact);
        setImpactText(impactEnergy, energyImpact);
        setImpactText(impactSpeed, speedImpact);
        setImpactText(impactWeight, weightImpact);
        setImpactText(impactClimate, climateImpact);
    }
}

/**
 * Обновляет визуальные индикаторы для Standard режима
 */
function updateStandardModeVisuals(setVisual) {
    if (state.season === 'summer') setVisual(sumSeason, iconSeason, 'good'); 
    else if (state.season === 'spring') setVisual(sumSeason, iconSeason, 'warn'); 
    else setVisual(sumSeason, iconSeason, 'bad');
    
    if (state.road === 'city') setVisual(sumRoad, iconRoad, 'good'); 
    else if (state.road === 'mixed') setVisual(sumRoad, iconRoad, 'warn'); 
    else setVisual(sumRoad, iconRoad, 'bad');
    
    if (state.mode === 'eco') setVisual(sumMode, iconMode, 'good'); 
    else if (state.mode === 'normal') setVisual(sumMode, iconMode, 'warn'); 
    else setVisual(sumMode, iconMode, 'bad');
    
    if (!state.climate) setVisual(sumClimate, iconClimate, 'good'); 
    else setVisual(sumClimate, iconClimate, 'bad');
    
    if (state.weight === 'driver') setVisual(sumWeight, iconWeight, 'good'); 
    else if (state.weight === 'partial') setVisual(sumWeight, iconWeight, 'warn');
    else setVisual(sumWeight, iconWeight, 'bad');
}

/**
 * Обновляет визуальные индикаторы для Extended режима
 */
function updateExtendedModeVisuals(setVisual, setNeutralVisual, sumWheels, iconWheels, sumWeather, iconWeather, sumDeg, iconDeg, sumModeExt, iconModeExt, sumEnergyConsumers, iconEnergyConsumers) {
    // Weather визуализация с учетом подогрева/охлаждения батареи и ветра
    if (state.enableWeather) {
        let weatherImpact = 'good';
        
        // Проверка температуры
        if (state.extTemp >= 20 && state.extTemp <= 25) {
            // Идеальная температура
        } else if (state.extTemp <= BATTERY_HEATING_THRESHOLD || state.extTemp >= BATTERY_COOLING_THRESHOLD) {
            // При активном подогреве или охлаждении батареи
            weatherImpact = 'bad';
        } else if (state.extTemp < 15 || state.extTemp > 30) {
            weatherImpact = 'warn';
        }
        
        // Проверка ветра
        if (state.enableWind) {
            const absWind = Math.abs(state.extWind);
            if (absWind > 10) {
                weatherImpact = 'bad';
            } else if (absWind > 5) {
                if (weatherImpact === 'good') weatherImpact = 'warn';
            }
            // Встречный ветер (положительный) хуже попутного
            if (state.extWind > 0 && absWind > 5) {
                weatherImpact = 'bad';
            }
        }

        // Проверка осадков
        if (state.extPrecip === 'snow') {
            weatherImpact = 'bad';
        } else if (state.extPrecip === 'rain' && weatherImpact === 'good') {
            weatherImpact = 'warn';
        }
        
        setVisual(sumWeather, iconWeather, weatherImpact);
    } else {
        setNeutralVisual(sumWeather, iconWeather);
    }

    if (state.extSpeed <= 60) setVisual(sumMode, iconMode, 'good');
    else if (state.extSpeed > 110) setVisual(sumMode, iconMode, 'bad');
    else setVisual(sumMode, iconMode, 'warn');
    
    if (state.extClimateMode === 'off') setVisual(sumClimate, iconClimate, 'good');
    else if (state.extClimateMode === 'ac') setVisual(sumClimate, iconClimate, 'warn');
    else setVisual(sumClimate, iconClimate, 'bad'); 

    if (state.extPayload > 300) setVisual(sumWeight, iconWeight, 'bad');
    else if (state.extPayload > 200) setVisual(sumWeight, iconWeight, 'warn'); 
    else setVisual(sumWeight, iconWeight, 'good');
    
    if (state.enableExtMode) {
        if (state.extMode === 'eco') setVisual(sumModeExt, iconModeExt, 'good'); 
        else if (state.extMode === 'normal') setVisual(sumModeExt, iconModeExt, 'warn'); 
        else setVisual(sumModeExt, iconModeExt, 'bad');
    } else {
        setNeutralVisual(sumModeExt, iconModeExt);
    }
    
    if (state.enableWheels) {
        if (state.extWheels <= 19 && state.extTires === 2) setVisual(sumWheels, iconWheels, 'good');
        else if (state.extWheels <= 19 && state.extTires === 1) setVisual(sumWheels, iconWheels, 'warn');
        else if (state.extWheels <= 19 && state.extTires === 0) setVisual(sumWheels, iconWheels, 'warn');
        else if (state.extWheels > 19 && state.extTires === 2) setVisual(sumWheels, iconWheels, 'warn');
        else setVisual(sumWheels, iconWheels, 'bad');
    } else {
        setNeutralVisual(sumWheels, iconWheels);
    }

    if (state.enableDeg) {
        if (state.extDeg <= 5) setVisual(sumDeg, iconDeg, 'good');
        else setVisual(sumDeg, iconDeg, 'bad');
    } else {
        setNeutralVisual(sumDeg, iconDeg);
    }

    // Energy Consumers visualization - combined impact
    if (state.enableEnergyConsumers) {
        let totalImpact = 0;
        if (state.seatHeating) totalImpact += SEAT_HEATING_IMPACT;
        if (state.windowHeating) totalImpact += WINDOW_HEATING_IMPACT;
        if (state.multimedia) totalImpact += MULTIMEDIA_IMPACT;

        if (totalImpact === 0) {
            setNeutralVisual(sumEnergyConsumers, iconEnergyConsumers);
        } else if (totalImpact <= 0.02) {
            // Only multimedia (2%) - green
            setVisual(sumEnergyConsumers, iconEnergyConsumers, 'good');
        } else if (totalImpact <= 0.05) {
            // Multimedia + one heating OR one heating only (3-5%) - yellow
            setVisual(sumEnergyConsumers, iconEnergyConsumers, 'warn');
        } else {
            // Multiple items (>5%) - red
            setVisual(sumEnergyConsumers, iconEnergyConsumers, 'bad');
        }
    } else {
        setNeutralVisual(sumEnergyConsumers, iconEnergyConsumers);
    }
}

/**
 * Обновляет фон слайдера (заполнение)
 */
function updateRangeBackground(rangeInput) {
    const min = parseFloat(rangeInput.min) || 0;
    const max = parseFloat(rangeInput.max) || 100;
    const val = parseFloat(rangeInput.value) || 0;
    const percentage = ((val - min) / (max - min)) * 100;
    rangeInput.style.setProperty('--percent', percentage + '%');
}

/**
 * Инициализирует визуальное отображение всех слайдеров
 */
function initAllSlidersVisuals() {
    const allSliders = document.querySelectorAll('input[type=range]');
    allSliders.forEach(slider => {
        updateRangeBackground(slider);
        slider.addEventListener('input', (e) => { 
            updateRangeBackground(e.target); 
        });
    });
}

/**
 * Обновляет позицию ползунка в pill group
 */
function updatePillSlider(group, activeBtn) {
    if (!group || !activeBtn) return;
    
    const groupRect = group.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    
    const offset = btnRect.left - groupRect.left - 3; 
    const width = btnRect.width + 6;
    
    group.style.setProperty('--slider-x', `${offset}px`);
    group.style.setProperty('--slider-width', `${width}px`);
}

/**
 * Переключает режим контролов (Standard/Extended)
 */
function toggleControlMode(mode) {
    const stdControls = document.getElementById('standard-controls');
    const extControls = document.getElementById('extended-controls');
    const modeExtControls = document.getElementById('mode-ext-controls'); 
    
    if (mode === 'extended') {
        stdControls.style.display = 'none';
        extControls.style.display = 'contents'; 
        modeExtControls.style.display = 'contents';
        if(sidebar) sidebar.classList.remove('standard-mode');
        
        setTimeout(() => {
            const climateGroup = document.getElementById('ext-climate-group');
            const modeGroupExt = document.getElementById('mode-group-ext');
            
            if (climateGroup) {
                const activeClimateBtn = climateGroup.querySelector('.pill-btn.active');
                if (activeClimateBtn) updatePillSlider(climateGroup, activeClimateBtn);
            }
            
            if (modeGroupExt) {
                const activeModeBtn = modeGroupExt.querySelector('.pill-btn.active');
                if (activeModeBtn) updatePillSlider(modeGroupExt, activeModeBtn);
            }
        }, 50);
    } else {
        stdControls.style.display = 'contents';
        extControls.style.display = 'none';
        modeExtControls.style.display = 'none';
        if(sidebar) sidebar.classList.add('standard-mode');
    }
}

/**
 * Обновляет индикатор подогрева/охлаждения батареи
 */
function updateBatteryThermalStatus() {
    const statusElement = document.getElementById('battery-thermal-status');
    if (!statusElement) return;

    const t = translations[state.lang];
    const temp = state.extTemp;

    if (temp <= BATTERY_HEATING_THRESHOLD) {
        // Показываем подогрев батареи
        statusElement.innerHTML = `<i class="fa-solid fa-fire"></i> <span>${t.batteryHeating || 'Battery Heating'}</span>`;
        statusElement.style.display = 'inline-flex';
    } else if (temp >= BATTERY_COOLING_THRESHOLD) {
        // Показываем охлаждение батареи
        statusElement.innerHTML = `<i class="fa-solid fa-snowflake"></i> <span>${t.batteryCooling || 'Battery Cooling'}</span>`;
        statusElement.style.display = 'inline-flex';
    } else {
        // Скрываем индикатор
        statusElement.style.display = 'none';
    }
}
