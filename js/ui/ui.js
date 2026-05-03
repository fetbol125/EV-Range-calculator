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
    const blockRelief = document.getElementById('sidebar-block-relief');

    const extendedBlocks = [blockWheels, blockWeather, blockDeg, blockModeExt, blockEnergyConsumers, blockRelief];

    const sumWheels = document.getElementById('summary-wheels');
    const sumWeather = document.getElementById('summary-weather');
    const sumDeg = document.getElementById('summary-deg');
    const sumRelief = document.getElementById('summary-relief');

    // Обновление текстов контролов Standard Mode
    updateStandardModeTexts(t);

    // Обновление текстов контролов Extended Mode
    updateExtendedModeTexts(t);

    if (state.rangeType === 'standard') {
        updateStandardModeUI(t, lblTextSeason, lblIconSeason, lblTextMode, lblIconMode, blockRoad, blockSeason, extendedBlocks);
    } else {
        updateExtendedModeUI(t, lblTextSeason, lblIconSeason, lblTextMode, lblIconMode, blockRoad, blockSeason, extendedBlocks, sumWheels, sumWeather, sumDeg, sumRelief);
    }

    updateImpactVisuals();
    updateCalculation();
    updateBatteryGauge();

    if (typeof syncControlsAvailability === 'function') {
        syncControlsAvailability();
    }
}
