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
function calculateExtendedRangeForConsumption(baseRange, batteryCapacity, s, factors, carWeight, carPower, carDrag, carDriveType, weightsDict, climateImpact) {
    // Копируем логику из нового calculateExtendedRange, но БЕЗ учета заряда батареи и деградации
    // Используем 100% батареи для расчета потребления
    
    let currentRange = baseRange; // Без учета деградации и заряда

    // === ФАКТОР: СКОРОСТЬ ===
    const refSpeed = 50; 
    let speedFactor = 1.0;
    
    const basePower = 150;
    const powerRatio = carPower / basePower;
    
    const baseDrag = 0.23;
    const dragRatio = carDrag / baseDrag;
    
    const awdPenalty = (carDriveType === 'AWD') ? 0.93 : 1.0;
    
    if (s.extSpeed > refSpeed) {
        const diff = s.extSpeed - refSpeed;
        const powerMultiplier = 0.0002 * Math.pow(powerRatio, 0.8);
        const aeroImpact = Math.pow(s.extSpeed / 100, 2) * (dragRatio - 1.0) * 0.12;
        speedFactor = 1.0 - (Math.pow(diff, 1.65) * powerMultiplier) - aeroImpact;
    } else {
        if (s.extSpeed < 20) speedFactor = 0.95;
    }
    
    speedFactor *= awdPenalty;
    if (speedFactor < 0.3) speedFactor = 0.3;
    currentRange *= speedFactor;

    // === ФАКТОР: ТЕМПЕРАТУРА ===
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

    // === ПОДОГРЕВ/ОХЛАЖДЕНИЕ БАТАРЕИ ===
    if (t <= BATTERY_HEATING_THRESHOLD) {
        currentRange *= (1 - BATTERY_HEATING_IMPACT);
    } else if (t >= BATTERY_COOLING_THRESHOLD) {
        currentRange *= (1 - BATTERY_COOLING_IMPACT);
    }

    // === ФАКТОР: ДАВЛЕНИЕ В ШИНАХ ===
    if (s.enableTires) {
        let tireFactor = 1.0;
        if (s.extTires === 0) tireFactor = 0.94;
        if (s.extTires === 2) tireFactor = 1.03;
        currentRange *= tireFactor;
    }

    // === ФАКТОР: ВЕС ===
    const addedMass = s.extPayload;
    const massRatio = addedMass / carWeight;
    const weightFactor = 1.0 - (massRatio * 0.4);
    currentRange *= weightFactor;

    // === ФАКТОР: ДИСКИ ===
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

    // === ФАКТОР: ВЕТЕР ===
    if (s.enableWind) {
        let windFactor = 1.0;
        if (s.extWind > 0) {
            windFactor = 1.0 - (s.extWind * 0.015);
        } else if (s.extWind < 0) {
            windFactor = 1.0 + (Math.abs(s.extWind) * 0.008);
        }
        currentRange *= windFactor;
    }

    // === ФАКТОР: ОСАДКИ ===
    if (s.enableWeather) {
        if (s.extPrecip === 'rain') {
            currentRange *= (1 - PRECIP_RAIN_IMPACT);
        } else if (s.extPrecip === 'snow') {
            currentRange *= (1 - PRECIP_SNOW_IMPACT);
        }
    }

    // === ФАКТОР: РЕЛЬЕФ ===
    if (s.enableRelief) {
        let reliefFactor = 1.0;
        if (s.extRelief === 'hilly') {
            reliefFactor = 0.88;
        } else if (s.extRelief === 'mountains') {
            reliefFactor = 0.75;
        }
        currentRange *= reliefFactor;
    }

    // === ФАКТОР: КЛИМАТ PRO ===
    let climateProFactor = 1.0;
    if (s.extClimateMode === 'ac') {
        climateProFactor = 0.88;
    } else if (s.extClimateMode === 'heater') {
        climateProFactor = 0.78;
    }
    currentRange *= climateProFactor;

    // === ФАКТОР: ПОТРЕБИТЕЛИ ЭНЕРГИИ ===
    if (s.enableEnergyConsumers) {
        if (s.seatHeating) {
            currentRange *= (1 - SEAT_HEATING_IMPACT);
        }
        if (s.windowHeating) {
            currentRange *= (1 - WINDOW_HEATING_IMPACT);
        }
        if (s.multimedia) {
            currentRange *= (1 - MULTIMEDIA_IMPACT);
        }
    }

    // === ФАКТОР: РЕЖИМ ВОЖДЕНИЯ ===
    if (s.enableExtMode) {
        currentRange *= factors.mode[s.extMode];
    }
    
    return Math.round(currentRange);
}