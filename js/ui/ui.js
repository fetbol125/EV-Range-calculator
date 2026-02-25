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
    const blockWheels = document.getElementById('sidebar-block-wheels');
    const blockWind = document.getElementById('sidebar-block-wind');
    const blockTires = document.getElementById('sidebar-block-tires');
    const blockDeg = document.getElementById('sidebar-block-deg');
    const blockModeExt = document.getElementById('sidebar-block-mode-ext'); 

    const extendedBlocks = [blockWheels, blockWind, blockTires, blockDeg, blockModeExt];

    const sumWheels = document.getElementById('summary-wheels');
    const sumWind = document.getElementById('summary-wind');
    const sumTires = document.getElementById('summary-tires');
    const sumDeg = document.getElementById('summary-deg');
    
    // Обновление текстов контролов Standard Mode
    updateStandardModeTexts(t);
    
    // Обновление текстов контролов Extended Mode
    updateExtendedModeTexts(t);

    if (state.rangeType === 'standard') {
        updateStandardModeUI(t, lblTextSeason, lblIconSeason, lblTextMode, lblIconMode, blockRoad, extendedBlocks);
    } else {
        updateExtendedModeUI(t, lblTextSeason, lblIconSeason, lblTextMode, lblIconMode, blockRoad, extendedBlocks, sumWheels, sumWind, sumTires, sumDeg);
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
    
    document.querySelector('#group-tires > .control-label + input + div span:nth-child(1)').textContent = t.tireLow;
    document.querySelector('#group-tires > .control-label + input + div span:nth-child(2)').textContent = t.tireNorm;
    document.querySelector('#group-tires > .control-label + input + div span:nth-child(3)').textContent = t.tireHigh;
    
    document.querySelector('#group-deg > input + div').textContent = t.batteryHealthLoss;
    
    document.querySelector('#mode-group-ext button[data-value="eco"]').textContent = t.modeEco;
    document.querySelector('#mode-group-ext button[data-value="normal"]').textContent = t.modeNormal;
    document.querySelector('#mode-group-ext button[data-value="sport"]').textContent = t.modeSport;
}

/**
 * Обновляет UI в Standard режиме
 */
function updateStandardModeUI(t, lblTextSeason, lblIconSeason, lblTextMode, lblIconMode, blockRoad, extendedBlocks) {
    lblTextSeason.textContent = t.sidebarSeason;
    lblIconSeason.className = 'fa-regular fa-snowflake';
    lblTextMode.textContent = t.sidebarMode;
    lblIconMode.className = 'fa-solid fa-bolt';

    if(blockRoad) blockRoad.classList.remove('hidden-factor');
    
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
function updateExtendedModeUI(t, lblTextSeason, lblIconSeason, lblTextMode, lblIconMode, blockRoad, extendedBlocks, sumWheels, sumWind, sumTires, sumDeg) {
    lblTextSeason.textContent = t.temperature;
    lblIconSeason.className = 'fa-solid fa-temperature-half';
    lblTextMode.textContent = t.speed;
    lblIconMode.className = 'fa-solid fa-gauge-high';

    if(blockRoad) blockRoad.classList.add('hidden-factor');

    extendedBlocks.forEach(block => {
        if(block) block.classList.remove('hidden-factor');
    });

    sumSeason.innerText = state.extTemp + '°C';
    sumMode.innerText = state.extSpeed + ' km/h';
    
    const clims = {off:t.climateOff, ac:t.climateAC, heater:t.climateHeater};
    sumClimate.innerText = clims[state.extClimateMode] || t.climateOff;
    sumWeight.innerText = state.extPayload + ' kg';

    if(sumWheels) sumWheels.innerText = state.extWheels + '"';
    
    const head = t.windHeadwind;
    const tail = t.windTailwind;
    let windText = state.extWind + ' m/s';
    if(state.extWind > 0) windText = '+' + windText + ` (${head})`;
    if(state.extWind < 0) windText = windText + ` (${tail})`;
    if(sumWind) sumWind.innerText = windText;
    
    const tireLabels = [t.tireLow, t.tireNorm, t.tireHigh];
    if(sumTires) sumTires.innerText = tireLabels[state.extTires] || t.tireNorm;
    
    if(sumDeg) sumDeg.innerText = state.extDeg + '%';
    if(sumModeExt) sumModeExt.innerText = capitalize(state.extMode); 
    if(document.getElementById('val-mode-ext')) document.getElementById('val-mode-ext').innerText = capitalize(state.extMode);

    updateExtendedDisabledStates();
}

/**
 * Обновляет состояния disabled для Extended режима
 */
function updateExtendedDisabledStates() {
    const blockWheels = document.getElementById('sidebar-block-wheels');
    const blockWind = document.getElementById('sidebar-block-wind');
    const blockTires = document.getElementById('sidebar-block-tires');
    const blockDeg = document.getElementById('sidebar-block-deg');
    const blockModeExt = document.getElementById('sidebar-block-mode-ext');
    const groupDeg = document.getElementById('group-deg');
    const groupModeExt = document.getElementById('group-mode-ext');

    if (!state.enableWheels) blockWheels.classList.add('disabled'); 
    else blockWheels.classList.remove('disabled');
    
    if (!state.enableWind) blockWind.classList.add('disabled'); 
    else blockWind.classList.remove('disabled');
    
    if (!state.enableTires) blockTires.classList.add('disabled'); 
    else blockTires.classList.remove('disabled');
    
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
    
    const sumWheels = document.getElementById('summary-wheels');
    const iconWheels = document.getElementById('icon-wheels');
    const sumWind = document.getElementById('summary-wind');
    const iconWind = document.getElementById('icon-wind');
    const sumTires = document.getElementById('summary-tires');
    const iconTires = document.getElementById('icon-tires');
    const sumDeg = document.getElementById('summary-deg');
    const iconDeg = document.getElementById('icon-deg');
    const sumModeExt = document.getElementById('summary-mode-ext');
    const iconModeExt = document.getElementById('icon-mode-ext');
    
    if (state.rangeType === 'standard') {
        updateStandardModeVisuals(setVisual);
    } else {
        updateExtendedModeVisuals(setVisual, setNeutralVisual, sumWheels, iconWheels, sumWind, iconWind, sumTires, iconTires, sumDeg, iconDeg, sumModeExt, iconModeExt);
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
function updateExtendedModeVisuals(setVisual, setNeutralVisual, sumWheels, iconWheels, sumWind, iconWind, sumTires, iconTires, sumDeg, iconDeg, sumModeExt, iconModeExt) {
    if (state.extTemp >= 20 && state.extTemp <= 25) setVisual(sumSeason, iconSeason, 'good'); 
    else if(state.extTemp < 5 || state.extTemp > 30) setVisual(sumSeason, iconSeason, 'bad');
    else setVisual(sumSeason, iconSeason, 'warn');

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
        if (state.extWheels <= 19) setVisual(sumWheels, iconWheels, 'good');
        else setVisual(sumWheels, iconWheels, 'warn');
    } else {
        setNeutralVisual(sumWheels, iconWheels);
    }
    
    if (state.enableWind) {
        if (state.extWind <= 0) setVisual(sumWind, iconWind, 'good');
        else if (state.extWind > 10) setVisual(sumWind, iconWind, 'bad');
        else setVisual(sumWind, iconWind, 'warn');
    } else {
        setNeutralVisual(sumWind, iconWind);
    }
    
    if (state.enableTires) {
        if (state.extTires === 2) setVisual(sumTires, iconTires, 'good');
        else if (state.extTires === 1) setVisual(sumTires, iconTires, 'warn');
        else setVisual(sumTires, iconTires, 'bad');
    } else {
        setNeutralVisual(sumTires, iconTires);
    }

    if (state.enableDeg) {
        if (state.extDeg <= 5) setVisual(sumDeg, iconDeg, 'good');
        else setVisual(sumDeg, iconDeg, 'bad');
    } else {
        setNeutralVisual(sumDeg, iconDeg);
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
