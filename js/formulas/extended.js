// extended.js - Профессиональный режим (физический расчет)

function calculateExtendedMetrics(baseRange, batteryCapacity, s, factors, carWeight, carPower, carDrag, carDriveType) {
    if (!baseRange || !batteryCapacity || baseRange <= 0 || batteryCapacity <= 0) {
        return { range: 0, consumption: 0 };
    }

    // Глобальная калибровка под реальные дорожные тесты (снижает излишне оптимистичный пробег)
    const realWorldConsumptionFactor = 1.12;

    // For very heavy EVs with huge packs, datasets often store gross battery values.
    const usableBatteryFactor = (batteryCapacity >= 160 && carWeight >= 2500 && baseRange >= 650) ? 0.80 : 1.0;
    const usableBatteryCapacity = batteryCapacity * usableBatteryFactor;

    // Одна базовая формула расхода, из которой затем вычисляется дальность.
    let consumption = (usableBatteryCapacity / baseRange) * 100;

    // === СКОРОСТЬ ===
    // Используем физическую модель: потребление растет с квадратом скорости для аэро
    const refSpeed = 50;
    let speedMultiplier = 1.0;
    const dragRatio = carDrag / 0.23;
    const awdPenalty = (carDriveType === 'AWD') ? 0.93 : 1.0;

    if (s.extSpeed < 20) {
        speedMultiplier = 0.95;
    } else if (s.extSpeed >= 20 && s.extSpeed <= refSpeed) {
        speedMultiplier = 0.95 + (s.extSpeed - 20) / (refSpeed - 20) * 0.05;
    } else if (s.extSpeed > refSpeed && s.extSpeed <= 100) {
        // До 100 км/ч рост расхода делаем более плавным
        const tSpeed = (s.extSpeed - refSpeed) / (100 - refSpeed);
        const mildAeroGain = (0.02 + (dragRatio - 1) * 0.06) * tSpeed;
        speedMultiplier = 1.0 + mildAeroGain;
    } else {
        // После 100 км/ч аэродинамика начинает доминировать
        const baseAt100 = 1.0 + (0.02 + (dragRatio - 1) * 0.06);
        const highSpeedLoad = Math.pow((s.extSpeed - 100) / 20, 1.35) * 0.26 * dragRatio;
        speedMultiplier = baseAt100 + highSpeedLoad;

        // Мягкое ограничение без плато: рост замедляется, но не останавливается
        const softCapStart = 2.5;
        if (speedMultiplier > softCapStart) {
            speedMultiplier = softCapStart + Math.log1p(speedMultiplier - softCapStart) * 0.45;
        }
    }

    speedMultiplier *= awdPenalty;
    consumption *= speedMultiplier;

    // === ТЕМПЕРАТУРА ===
    let tempFactor = 1.0;
    const t = s.extTemp;
    let auxConsumptionAdd = 0;

    if (t < 20) tempFactor = 1.0 - (20 - t) * 0.009;
    else if (t > 25) tempFactor = 1.0 - (t - 25) * 0.006;

    if (tempFactor < 0.4) tempFactor = 0.4;
    consumption /= tempFactor;

    // === ПОДОГРЕВ / ОХЛАЖДЕНИЕ ===
    if (t <= BATTERY_HEATING_THRESHOLD) {
        auxConsumptionAdd += 0.8;
    } else if (t >= BATTERY_COOLING_THRESHOLD) {
        auxConsumptionAdd += 0.5;
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
    if (s.extClimateMode === 'ac') auxConsumptionAdd += 1.3;
    if (s.extClimateMode === 'heater') auxConsumptionAdd += 2.0;

    // === ДОП ПОТРЕБИТЕЛИ ===
    if (s.enableEnergyConsumers) {
        if (s.seatHeating) auxConsumptionAdd += 0.3;
        if (s.windowHeating) auxConsumptionAdd += 0.6;
        if (s.multimedia) auxConsumptionAdd += 0.2;
    }

    // === РЕЖИМ ===
    if (s.enableExtMode && factors.mode[s.extMode]) {
        consumption /= factors.mode[s.extMode];
    }

    // Потребители добавляют фиксированный расход (kWh/100км), без зависимости от скорости.
    consumption += auxConsumptionAdd;

    // Финальная калибровка расхода под реальный мир
    consumption *= realWorldConsumptionFactor;

    const healthFactor = s.enableDeg ? (1.0 - (s.extDeg / 100)) : 1.0;
    const batteryFactor = s.battery / 100;

    let range = 0;
    if (consumption > 0) {
        range = (usableBatteryCapacity * batteryFactor) / (consumption / 100);
        range *= healthFactor;

        // Не даем расчетной дальности превышать заявленную (масштабированную по SOC и деградации)
        const declaredCapRange = baseRange * batteryFactor * healthFactor;
        if (range > declaredCapRange) {
            range = declaredCapRange;
        }
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