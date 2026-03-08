// extended.js - Профессиональный режим (consumption-based физический расчет)

function calculateExtendedRange(baseRange, batteryCapacity, s, factors, carWeight, carPower, carDrag, carDriveType, weightsDict, climateImpact) {
    // s = state (текущее состояние)
    
    // ============================================================
    // CONSUMPTION-BASED MODEL (физически корректная)
    // ============================================================
    
    // 1. БАЗОВОЕ ПОТРЕБЛЕНИЕ (kWh/100km)
    let baseConsumption = (batteryCapacity / baseRange) * 100;
    
    // 2. ДЕГРАДАЦИЯ - влияет на доступную емкость батареи
    let availableBattery = batteryCapacity;
    if (s.enableDeg) {
        const healthFactor = 1.0 - (s.extDeg / 100);
        availableBattery = batteryCapacity * healthFactor;
    }
    
    // 3. ТЕКУЩИЙ ЗАРЯД - доступная энергия в kWh
    const availableEnergy = availableBattery * (s.battery / 100);

    // ============================================================
    // МУЛЬТИПЛИКАТИВНЫЕ ФАКТОРЫ (влияют на потребление)
    // ============================================================
    
    let consumptionMultiplier = 1.0;
    
    // === ФАКТОР: СКОРОСТЬ ===
    // Аэродинамическое сопротивление: Power ∝ v³, поэтому consumption ∝ v²
    const refSpeed = 90; // оптимальная скорость для EV
    const speedRatio = s.extSpeed / refSpeed;
    
    // Базовый фактор скорости (квадратичная зависимость)
    let speedFactor = 0.5 + 0.5 * Math.pow(speedRatio, 2);
    
    // Влияние аэродинамики (Cd)
    const baseDrag = 0.23;
    const dragRatio = carDrag / baseDrag;
    const aeroFactor = 1.0 + (dragRatio - 1.0) * Math.pow(speedRatio, 2) * 0.3;
    
    // AWD penalty - полный привод потребляет больше
    const awdFactor = (carDriveType === 'AWD') ? 1.08 : 1.0;
    
    // На низких скоростях - городской цикл с частыми остановками
    if (s.extSpeed < 30) {
        speedFactor = 1.15; // город менее эффективен
    }
    
    consumptionMultiplier *= speedFactor * aeroFactor * awdFactor;


    // === ФАКТОР: ТЕМПЕРАТУРА ===
    // Влияет на внутреннее сопротивление батареи
    const t = s.extTemp;
    let tempFactor = 1.0;
    
    if (t < 20) {
        // Холод увеличивает внутреннее сопротивление
        const drop = (20 - t) * 0.008; // снижено с 0.015
        tempFactor = 1.0 + drop;
    } else if (t > 25) {
        // Жара тоже немного увеличивает потребление
        const drop = (t - 25) * 0.005; // снижено с 0.008
        tempFactor = 1.0 + drop;
    }
    
    if (tempFactor > 1.5) tempFactor = 1.5; // максимум +50%
    consumptionMultiplier *= tempFactor;


    // === ФАКТОР: ДАВЛЕНИЕ В ШИНАХ ===
    if (s.enableTires) {
        let tireFactor = 1.0;
        if (s.extTires === 0) tireFactor = 1.06; // Low - больше сопротивление
        if (s.extTires === 2) tireFactor = 0.97; // High - меньше сопротивление
        consumptionMultiplier *= tireFactor;
    }


    // === ФАКТОР: ВЕС ===
    const addedMass = s.extPayload;
    const massRatio = addedMass / carWeight;
    const weightFactor = 1.0 + (massRatio * 0.15); // вес увеличивает потребление
    consumptionMultiplier *= weightFactor;


    // === ФАКТОР: ДИСКИ ===
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

    // === ФАКТОР: ВЕТЕР ===
    if (s.enableWind) {
        // Встречный ветер увеличивает относительную скорость воздуха
        // Попутный ветер уменьшает
        const airSpeed = s.extSpeed + (s.extWind * 3.6); // переводим м/с в км/ч
        
        // Аэродинамическое сопротивление ∝ v², поэтому consumption ∝ (airSpeed)²
        if (airSpeed > 0 && s.extSpeed > 0) {
            const windFactor = Math.pow(airSpeed / s.extSpeed, 2);
            consumptionMultiplier *= windFactor;
        }
    }

    // === ФАКТОР: РЕЛЬЕФ ===
    if (s.enableRelief) {
        let reliefFactor = 1.0;
        if (s.extRelief === 'hilly') {
            reliefFactor = 1.10; // холмы +10% потребления
        } else if (s.extRelief === 'mountains') {
            reliefFactor = 1.25; // горы +25% потребления
        }
        consumptionMultiplier *= reliefFactor;
    }
    
    // === РЕЖИМ ВОЖДЕНИЯ ===
    if (s.enableExtMode) {
        let modeFactor = 1.0;
        if (s.extMode === 'eco') modeFactor = 0.90;
        else if (s.extMode === 'normal') modeFactor = 1.0;
        else if (s.extMode === 'sport') modeFactor = 1.18;
        consumptionMultiplier *= modeFactor;
    }

    // ============================================================
    // АДДИТИВНЫЕ ФАКТОРЫ (фиксированное потребление в kWh/100km)
    // ============================================================
    
    let fixedConsumption = 0;
    
    // === КЛИМАТ (HVAC) ===
    // Фиксированная мощность кондиционера/обогревателя
    if (s.extClimateMode === 'ac') {
        fixedConsumption += 1.5; // кондиционер ~1.5 kWh/100km
    } else if (s.extClimateMode === 'heater') {
        fixedConsumption += 3.5; // обогрев ~3.5 kWh/100km (более энергозатратно!)
    }
    
    // === ПОДОГРЕВ/ОХЛАЖДЕНИЕ БАТАРЕИ ===
    if (t <= BATTERY_HEATING_THRESHOLD) {
        fixedConsumption += 1.2; // подогрев батареи ~1.2 kWh/100km
    } else if (t >= BATTERY_COOLING_THRESHOLD) {
        fixedConsumption += 0.8; // охлаждение батареи ~0.8 kWh/100km
    }
    
    // === ОСАДКИ ===
    // Увеличенное сопротивление качению
    if (s.enableWeather) {
        if (s.extPrecip === 'rain') {
            fixedConsumption += 0.7; // дождь +0.7 kWh/100km
        } else if (s.extPrecip === 'snow') {
            fixedConsumption += 2.0; // снег +2.0 kWh/100km
        }
    }
    
    // === ПОТРЕБИТЕЛИ ЭНЕРГИИ ===
    if (s.enableEnergyConsumers) {
        if (s.seatHeating) fixedConsumption += 0.5;
        if (s.windowHeating) fixedConsumption += 0.6;
        if (s.multimedia) fixedConsumption += 0.3;
    }
    
    // ============================================================
    // ИТОГОВЫЙ РАСЧЕТ
    // ============================================================
    
    // Итоговое потребление (kWh/100km)
    const totalConsumption = (baseConsumption * consumptionMultiplier) + fixedConsumption;
    
    // Дальность = доступная энергия / потребление * 100
    const calculatedRange = (availableEnergy / totalConsumption) * 100;
    
    return Math.round(calculatedRange);
}