// extended.js - Профессиональный режим (физический расчет)

function calculateExtendedMetrics(baseRange, batteryCapacity, s, factors, carWeight, carPower, carDrag, carDriveType) {
    if (!baseRange || !batteryCapacity || baseRange <= 0 || batteryCapacity <= 0) {
        return { range: 0, consumption: 0 };
    }

    // Одна базовая формула расхода, из которой затем вычисляется дальность.
    let consumption = (batteryCapacity / baseRange) * 100;

    // === СКОРОСТЬ ===
    const refSpeed = 50;
    let speedFactor = 1.0;

    const powerRatio = carPower / 150;
    const dragRatio = carDrag / 0.23;
    const awdPenalty = (carDriveType === 'AWD') ? 0.93 : 1.0;

    if (s.extSpeed > refSpeed) {
        const diff = s.extSpeed - refSpeed;
        const powerMultiplier = 0.0002 * Math.pow(powerRatio, 0.8);
        const aeroImpact = Math.pow(s.extSpeed / 100, 2) * (dragRatio - 1.0) * 0.12;
        speedFactor = 1.0 - (Math.pow(diff, 1.65) * powerMultiplier) - aeroImpact;
    } else if (s.extSpeed < 20) {
        speedFactor = 0.95;
    }

    speedFactor *= awdPenalty;
    if (speedFactor < 0.3) speedFactor = 0.3;
    consumption /= speedFactor;

    // === ТЕМПЕРАТУРА ===
    let tempFactor = 1.0;
    const t = s.extTemp;

    if (t < 20) tempFactor = 1.0 - (20 - t) * 0.015;
    else if (t > 25) tempFactor = 1.0 - (t - 25) * 0.008;

    if (tempFactor < 0.4) tempFactor = 0.4;
    consumption /= tempFactor;

    // === ПОДОГРЕВ / ОХЛАЖДЕНИЕ ===
    if (t <= BATTERY_HEATING_THRESHOLD) {
        consumption *= (1 + BATTERY_HEATING_IMPACT);
    } else if (t >= BATTERY_COOLING_THRESHOLD) {
        consumption *= (1 + BATTERY_COOLING_IMPACT);
    }

    // === ШИНЫ ===
    if (s.enableTires) {
        let tireFactor = 1.0;
        if (s.extTires === 0) tireFactor = 0.94;
        if (s.extTires === 2) tireFactor = 1.03;
        consumption /= tireFactor;
    }

    // === ВЕС ===
    const massRatio = s.extPayload / carWeight;
    const weightFactor = 1.0 - (massRatio * 0.4);
    if (weightFactor > 0) {
        consumption /= weightFactor;
    }

    // === ДИСКИ ===
    if (s.enableWheels) {
        let wheelFactor = 1.0;
        const w = s.extWheels;

        if (w === 18) wheelFactor = 1.02;
        else if (w === 20) wheelFactor = 0.97;
        else if (w === 21) wheelFactor = 0.94;
        else if (w >= 22) wheelFactor = 0.90;

        consumption /= wheelFactor;
    }

    // === ВЕТЕР ===
    if (s.enableWind) {
        if (s.extWind > 0) {
            consumption *= (1 + s.extWind * 0.015);
        } else if (s.extWind < 0) {
            consumption *= (1 - Math.abs(s.extWind) * 0.008);
        }
    }

    // === ОСАДКИ ===
    if (s.enableWeather) {
        if (s.extPrecip === 'rain') consumption *= (1 + PRECIP_RAIN_IMPACT);
        if (s.extPrecip === 'snow') consumption *= (1 + PRECIP_SNOW_IMPACT);
    }

    // === РЕЛЬЕФ ===
    if (s.enableRelief) {
        if (s.extRelief === 'hilly') consumption *= 1.12;
        if (s.extRelief === 'mountains') consumption *= 1.25;
    }

    // === КЛИМАТ ===
    if (s.extClimateMode === 'ac') consumption *= 1.12;
    if (s.extClimateMode === 'heater') consumption *= 1.22;

    // === ДОП ПОТРЕБИТЕЛИ ===
    if (s.enableEnergyConsumers) {
        if (s.seatHeating) consumption *= (1 + SEAT_HEATING_IMPACT);
        if (s.windowHeating) consumption *= (1 + WINDOW_HEATING_IMPACT);
        if (s.multimedia) consumption *= (1 + MULTIMEDIA_IMPACT);
    }

    // === РЕЖИМ ===
    if (s.enableExtMode && factors.mode[s.extMode]) {
        consumption /= factors.mode[s.extMode];
    }

    const healthFactor = s.enableDeg ? (1.0 - (s.extDeg / 100)) : 1.0;
    const batteryFactor = s.battery / 100;

    let range = 0;
    if (consumption > 0) {
        range = (batteryCapacity * batteryFactor) / (consumption / 100);
        range *= healthFactor;
    }

    return {
        range: Math.round(range),
        consumption: Math.round(consumption * 10) / 10
    };
}

function calculateExtendedRange(baseRange, batteryCapacity, s, factors, carWeight, carPower, carDrag, carDriveType, weightsDict, climateImpact) {
    return calculateExtendedMetrics(
        baseRange, batteryCapacity, s, factors, carWeight, carPower, carDrag, carDriveType
    ).range;
}

function calculateConsumptionExtended(baseRange, batteryCapacity, s, factors, carWeight, carPower, carDrag, carDriveType) {
    return calculateExtendedMetrics(
        baseRange, batteryCapacity, s, factors, carWeight, carPower, carDrag, carDriveType
    ).consumption;
}