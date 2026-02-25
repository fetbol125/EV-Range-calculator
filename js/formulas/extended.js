// extended.js - Профессиональный режим (физический расчет)

function calculateExtendedRange(baseRange, s, factors, carWeight, weightsDict, climateImpact) {
    // s = state (текущее состояние)

    // 1. ДЕГРАДАЦИЯ
    let maxTheoreticalRange = baseRange;
    if (s.enableDeg) {
        const healthFactor = 1.0 - (s.extDeg / 100);
        maxTheoreticalRange = baseRange * healthFactor;
    }

    // 2. ТЕКУЩИЙ ЗАРЯД
    let currentRange = maxTheoreticalRange * (s.battery / 100);

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

    // === АВТОМАТИЧЕСКИЙ ПОДОГРЕВ/ОХЛАЖДЕНИЕ БАТАРЕИ ===
    if (t <= BATTERY_HEATING_THRESHOLD) {
        // Подогрев батареи при низких температурах
        currentRange *= (1 - BATTERY_HEATING_IMPACT);
    } else if (t >= BATTERY_COOLING_THRESHOLD) {
        // Охлаждение батареи при высоких температурах
        currentRange *= (1 - BATTERY_COOLING_IMPACT);
    }


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

    // === ФАКТОР: ПОТРЕБИТЕЛИ ЭНЕРГИИ (Energy Consumers) - ПОДКЛЮЧАЕМЫЙ ===
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

    // === ФАКТОР: РЕЖИМ ВОЖДЕНИЯ (Driving Mode) - ПОДКЛЮЧАЕМЫЙ ===
    if (s.enableExtMode) {
        currentRange *= factors.mode[s.extMode];
    }
    
    return Math.round(currentRange);
}