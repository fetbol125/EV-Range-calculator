// Расчеты дальности

/**
 * Обновляет расчет дальности в зависимости от режима
 */
function updateCalculation() {
    let finalRange = 0;
    try {
        if (state.rangeType === 'extended') {
            finalRange = calculateExtendedRange(
                currentMaxRange, state, factors, currentCarWeight, ADDED_WEIGHT_KG, CLIMATE_IMPACT
            );
        } else {
            finalRange = calculateStandardRange(
                currentMaxRange, state, factors, currentCarWeight, ADDED_WEIGHT_KG, CLIMATE_IMPACT
            );
        }
    } catch (e) {
        console.error(e);
        rangeDisplay.innerText = "ERR";
        return;
    }
    const maxLimit = state.rangeType === 'extended' ? currentMaxRange * 1.5 : currentMaxRange;
    const safeRange = Math.min(finalRange, maxLimit);
    const currentDisplayed = parseInt(rangeDisplay.innerText) || 0;
    animateValue(rangeDisplay, currentDisplayed, safeRange, 500);
    updateGauge(safeRange);

    // Обновляем потребление если включен extended режим
    if (state.rangeType === 'extended') {
        updateConsumptionDisplay();
    }
}

/**
 * Обновляет визуальное отображение gauge (круговой индикатор)
 * @param {number} currentVal - Текущее значение дальности
 */
function updateGauge(currentVal) {
    let maxScale = currentMaxRange;
    let efficiency = currentVal / maxScale;
    if (efficiency > 1) efficiency = 1;
    if (efficiency < 0) efficiency = 0;

    const offset = CIRCUMFERENCE - (efficiency * CIRCUMFERENCE);
    gaugeFill.style.strokeDashoffset = offset;

    const ACCENT_COLOR = '#06b6d4'; 
    const WARNING_COLOR = '#fbbf24';
    const DANGER_COLOR = '#ef4444';
    
    let strokeColor = ACCENT_COLOR;
    let statusText = translations[state.lang].statusGood; 
    let statusClass = 'status-good';
    let filterStyle = `drop-shadow(0 0 6px ${ACCENT_COLOR})`; 

    if (efficiency > 0.65) {
        strokeColor = ACCENT_COLOR; 
        statusText = translations[state.lang].statusGood; 
        statusClass = 'status-good'; 
        filterStyle = `drop-shadow(0 0 6px ${ACCENT_COLOR})`; 
    } else if (efficiency > 0.35) {
        strokeColor = WARNING_COLOR; 
        statusText = translations[state.lang].statusWarn; 
        statusClass = 'status-warn'; 
        filterStyle = `drop-shadow(0 0 6px ${WARNING_COLOR})`; 
    } else {
        strokeColor = DANGER_COLOR; 
        statusText = translations[state.lang].statusDanger; 
        statusClass = 'status-danger'; 
        filterStyle = `drop-shadow(0 0 6px ${DANGER_COLOR})`; 
    }

    gaugeFill.style.stroke = strokeColor;
    gaugeFill.style.filter = filterStyle; 
    
    gaugeStatus.innerText = statusText;
    gaugeStatus.className = `gauge-status ${statusClass}`;
}

/**
 * Обновляет визуальное отображение индикатора батареи
 */
function updateBatteryGauge() {
    if (!batteryIcon || !footerBattery) return;
    
    // Определяем цвет и иконку в зависимости от уровня заряда
    let color = '#10b981'; // Зеленый для высокого заряда
    let iconClass = 'fa-battery-full';
    
    if (state.battery <= 10) {
        color = '#ef4444'; // Красный для критического заряда
        iconClass = 'fa-battery-empty';
    } else if (state.battery <= 25) {
        color = '#ef4444'; // Красный для низкого заряда
        iconClass = 'fa-battery-quarter';
    } else if (state.battery <= 50) {
        color = '#fbbf24'; // Оранжевый для среднего заряда
        iconClass = 'fa-battery-half';
    } else if (state.battery <= 75) {
        color = '#10b981'; // Зеленый
        iconClass = 'fa-battery-three-quarters';
    } else {
        color = '#10b981'; // Зеленый для высокого заряда
        iconClass = 'fa-battery-full';
    }
    
    // Удаляем все классы батареи и добавляем нужный
    batteryIcon.className = `fa-solid ${iconClass}`;
    
    // Применяем цвет к иконке и тексту
    batteryIcon.style.color = color;
    footerBattery.style.color = color;
}
/**
 * Обновляет отображение потребления энергии в кВт⋅ч/100км
 */
function updateConsumptionDisplay() {
    if (!consumptionDisplay || !currentCarBattery || !consumptionStatus) return;
    
    // Получаем емкость батареи автомобиля
    const batteryCapacity = parseFloat(currentCarBattery.innerText);
    
    // Рассчитываем пробег БЕЗ влияния батареи и деградации (только остальные факторы)
    const rangeForConsumption = calculateExtendedRangeForConsumption(
        currentMaxRange, state, factors, currentCarWeight, ADDED_WEIGHT_KG, CLIMATE_IMPACT
    );
    
    // Рассчитываем потребление на основе полной батареи и расчетного пробега
    const consumption = calculateConsumption(batteryCapacity, rangeForConsumption);
    
    // Обновляем отображение потребления
    consumptionDisplay.innerText = consumption.toFixed(1);
    
    // Обновляем статус потребления
    updateConsumptionStatus(consumption, consumptionStatus);
}

/**
 * Обновляет статус потребления в зависимости от значения
 * @param {number} currentConsumption - Текущее потребление в кВт⋅ч/100км
 * @param {HTMLElement} statusElement - Элемент для отображения статуса
 */
function updateConsumptionStatus(currentConsumption, statusElement) {
    let statusText = translations[state.lang].consumptionEfficient;
    let statusClass = 'status-good';
    
    // Чем меньше потребление, тем лучше
    if (currentConsumption < 20) {
        statusText = translations[state.lang].consumptionEfficient;
        statusClass = 'status-good';
    } else if (currentConsumption < 25) {
        statusText = translations[state.lang].consumptionModerate;
        statusClass = 'status-warn';
    } else {
        statusText = translations[state.lang].consumptionHigh;
        statusClass = 'status-danger';
    }
    
    statusElement.innerText = statusText;
    statusElement.className = `gauge-status ${statusClass}`;
}

/**
 * Показывает или скрывает элемент потребления в зависимости от режима
 * @param {boolean} show - Показывать ли элемент потребления
 */
function toggleConsumptionDisplay(show) {
    if (!consumptionGauge) return;
    
    if (show && state.rangeType === 'extended') {
        consumptionGauge.style.display = 'flex';
    } else {
        consumptionGauge.style.display = 'none';
    }
}

