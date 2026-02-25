// Расчеты потребления энергии (кВт⋅ч / 100 км)

/**
 * Рассчитывает потребление энергии в кВт⋅ч на 100 км
 * @param {number} batteryCapacity - Емкость батареи в кВт⋅ч
 * @param {number} estimatedRange - Расчетная дальность в км
 * @returns {number} Потребление в кВт⋅ч / 100 км
 */
function calculateConsumption(batteryCapacity, estimatedRange) {
    if (!batteryCapacity || !estimatedRange || estimatedRange <= 0) {
        return 0;
    }
    
    // Формула: (кВт⋅ч / км) * 100 = кВт⋅ч / 100км
    const consumption = (batteryCapacity / estimatedRange) * 100;
    
    // Возвращаем с одной десятичной точностью
    return Math.round(consumption * 10) / 10;
}

/**
 * Рассчитывает потребление энергии с учетом полной батареи (без влияния заряда)
 * @param {number} batteryCapacity - Полная емкость батареи в кВт⋅ч
 * @param {number} currentBatteryPercent - Текущий процент заряда батареи (не используется)
 * @param {number} estimatedRange - Расчетная дальность в км
 * @returns {number} Потребление в кВт⋅ч / 100 км
 */
function calculateConsumptionWithBatteryLevel(batteryCapacity, currentBatteryPercent, estimatedRange) {
    if (!batteryCapacity || !estimatedRange || estimatedRange <= 0) {
        return 0;
    }
    
    // Используем полную емкость батареи, без учета текущего заряда
    // Формула: (полная емкость / км) * 100 = кВт⋅ч / 100км
    const consumption = (batteryCapacity / estimatedRange) * 100;
    
    // Возвращаем с одной десятичной точностью
    return Math.round(consumption * 10) / 10;
}

/**
 * Рассчитывает потребление энергии на основе полной батареи и максимальной дальности
 * (для стандартных и базовых расчетов)
 * @param {number} maxRange - Максимальная дальность при 100% заряде в км
 * @param {number} batteryCapacity - Полная емкость батареи в кВт⋅ч
 * @returns {number} Потребление в кВт⋅ч / 100 км
 */
function calculateStandardConsumption(maxRange, batteryCapacity) {
    if (!maxRange || !batteryCapacity || maxRange <= 0) {
        return 0;
    }
    
    const consumption = (batteryCapacity / maxRange) * 100;
    return Math.round(consumption * 10) / 10;
}
/**
 * Рассчитывает базовый пробег для потребления БЕЗ влияния батареи и деградации
 * (используется только для расчета потребления электроэнергии)
 */
function calculateExtendedRangeForConsumption(baseRange, s, factors, carWeight, weightsDict, climateImpact) {
    // Начинаем с базового пробега БЕЗ коэффициентов батареи и деградации
    let currentRange = baseRange;

    // === ФАКТОР: СКОРОСТЬ (Speed) - Всегда активен ===
    const refSpeed = 50; 
    let speedFactor = 1.0;
    if (s.extSpeed > refSpeed) {
        const diff = s.extSpeed - refSpeed;
        speedFactor = 1.0 - (Math.pow(diff, 1.65) * 0.0002);
    } else {
        if (s.extSpeed < 20) speedFactor = 0.95;
    }
    if (speedFactor < 0.3) speedFactor = 0.3;
    currentRange *= speedFactor;

    // === ФАКТОР: ТЕМПЕРАТУРА (Temperature) - Всегда активен ===
    let tempFactor = 1.0;
    const t = s.extTemp;
    if (t < 20) {
        const drop = (20 - t) * 0.015;
        tempFactor = 1.0 - drop;
    } else if (t > 25) {
        const drop = (t - 25) * 0.008;
        tempFactor = 1.0 - drop;
    }
    if (tempFactor < 0.4) tempFactor = 0.4;
    currentRange *= tempFactor;

    // === ФАКТОР: ДАВЛЕНИЕ В ШИНАХ (Tires) - ПОДКЛЮЧАЕМЫЙ ===
    if (s.enableTires) {
        let tireFactor = 1.0;
        if (s.extTires === 0) tireFactor = 0.94; // Low
        if (s.extTires === 2) tireFactor = 1.03; // High
        currentRange *= tireFactor;
    }

    // === ФАКТОР: ВЕС (Payload) - Всегда активен ===
    const addedMass = s.extPayload; 
    const massRatio = addedMass / carWeight;
    const weightFactor = 1.0 - (massRatio * 0.4); 
    currentRange *= weightFactor;

    // === ФАКТОР: ДИСКИ (Wheel Size) - ПОДКЛЮЧАЕМЫЙ ===
    if (s.enableWheels) {
        let wheelFactor = 1.0;
        const w = s.extWheels;
        if (w === 18) wheelFactor = 1.02; 
        else if (w === 19) wheelFactor = 1.00; 
        else if (w === 20) wheelFactor = 0.97; 
        else if (w === 21) wheelFactor = 0.94; 
        else if (w >= 22) wheelFactor = 0.90; 
        currentRange *= wheelFactor;
    }

    // === ФАКТОР: ВЕТЕР (Wind) - ПОДКЛЮЧАЕМЫЙ ===
    if (s.enableWind) {
        let windFactor = 1.0;
        if (s.extWind > 0) {
            windFactor = 1.0 - (s.extWind * 0.015);
        } else if (s.extWind < 0) {
            windFactor = 1.0 + (Math.abs(s.extWind) * 0.008);
        }
        currentRange *= windFactor;
    }

    // === ФАКТОР: КЛИМАТ PRO (Climate) - Всегда активен (есть кнопка Off) ===
    let climateProFactor = 1.0;
    if (s.extClimateMode === 'ac') {
        climateProFactor = 0.88; 
    } else if (s.extClimateMode === 'heater') {
        climateProFactor = 0.78;
    }
    currentRange *= climateProFactor;

    // === ФАКТОР: РЕЖИМ ВОЖДЕНИЯ (Driving Mode) - ПОДКЛЮЧАЕМЫЙ ===
    if (s.enableExtMode) {
        currentRange *= factors.mode[s.extMode];
    }
    
    return Math.round(currentRange);
}