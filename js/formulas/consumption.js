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
    // Используем ту же consumption-based модель, но БЕЗ учета заряда батареи
    
    let baseConsumption = (batteryCapacity / baseRange) * 100;
    let consumptionMultiplier = 1.0;

    // Копируем всю логику из calculateExtendedRange
    const refSpeed = 90;
    const speedRatio = s.extSpeed / refSpeed;
    let speedFactor = 0.5 + 0.5 * Math.pow(speedRatio, 2);
    const baseDrag = 0.23;
    const dragRatio = carDrag / baseDrag;
    const aeroFactor = 1.0 + (dragRatio - 1.0) * Math.pow(speedRatio, 2) * 0.3;
    const awdFactor = (carDriveType === 'AWD') ? 1.08 : 1.0;
    if (s.extSpeed < 30) speedFactor = 1.15;
    consumptionMultiplier *= speedFactor * aeroFactor * awdFactor;

    const t = s.extTemp;
    let tempFactor = 1.0;
    if (t < 20) {
        const drop = (20 - t) * 0.008;
        tempFactor = 1.0 + drop;
    } else if (t > 25) {
        const drop = (t - 25) * 0.005;
        tempFactor = 1.0 + drop;
    }
    if (tempFactor > 1.5) tempFactor = 1.5;
    consumptionMultiplier *= tempFactor;

    if (s.enableTires) {
        let tireFactor = 1.0;
        if (s.extTires === 0) tireFactor = 1.06;
        if (s.extTires === 2) tireFactor = 0.97;
        consumptionMultiplier *= tireFactor;
    }
    
    const addedMass = s.extPayload;
    const massRatio = addedMass / carWeight;
    const weightFactor = 1.0 + (massRatio * 0.15);
    consumptionMultiplier *= weightFactor;

    if (s.enableWheels) {
        let wheelFactor = 1.0;
        const w = s.extWheels;
        if (w === 18) wheelFactor = 0.98;
        else if (w === 19) wheelFactor = 1.00;
        else if (w === 20) wheelFactor = 1.03;
        else if (w === 21) wheelFactor = 1.06;
        else if (w >= 22) wheelFactor = 1.10;
        consumptionMultiplier *= wheelFactor;
    }

    if (s.enableWind) {
        const airSpeed = s.extSpeed + (s.extWind * 3.6);
        if (airSpeed > 0 && s.extSpeed > 0) {
            const windFactor = Math.pow(airSpeed / s.extSpeed, 2);
            consumptionMultiplier *= windFactor;
        }
    }

    if (s.enableRelief) {
        let reliefFactor = 1.0;
        if (s.extRelief === 'hilly') reliefFactor = 1.10;
        else if (s.extRelief === 'mountains') reliefFactor = 1.25;
        consumptionMultiplier *= reliefFactor;
    }

    if (s.enableExtMode) {
        let modeFactor = 1.0;
        if (s.extMode === 'eco') modeFactor = 0.90;
        else if (s.extMode === 'normal') modeFactor = 1.0;
        else if (s.extMode === 'sport') modeFactor = 1.18;
        consumptionMultiplier *= modeFactor;
    }

    let fixedConsumption = 0;
    if (s.extClimateMode === 'ac') fixedConsumption += 1.5;
    else if (s.extClimateMode === 'heater') fixedConsumption += 3.5;
    
    if (t <= BATTERY_HEATING_THRESHOLD) fixedConsumption += 1.2;
    else if (t >= BATTERY_COOLING_THRESHOLD) fixedConsumption += 0.8;
    
    if (s.enableWeather) {
        if (s.extPrecip === 'rain') fixedConsumption += 0.7;
        else if (s.extPrecip === 'snow') fixedConsumption += 2.0;
    }
    
    if (s.enableEnergyConsumers) {
        if (s.seatHeating) fixedConsumption += 0.5;
        if (s.windowHeating) fixedConsumption += 0.6;
        if (s.multimedia) fixedConsumption += 0.3;
    }

    const totalConsumption = (baseConsumption * consumptionMultiplier) + fixedConsumption;
    const calculatedRange = (batteryCapacity / totalConsumption) * 100;
    
    return Math.round(calculatedRange);
}