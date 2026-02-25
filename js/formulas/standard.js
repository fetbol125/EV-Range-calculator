// standard.js - Формула для стандартного режима

function calculateStandardRange(baseRange, currentState, factorsDict, carWeight, weightsDict, climateImpact) {
    // 1. Базовый расчет от процента батареи
    let range = baseRange * (currentState.battery / 100);

    // 2. Применяем коэффициенты (Сезон, Дорога, Режим)
    range *= factorsDict.season[currentState.season];
    range *= factorsDict.road[currentState.road];
    range *= factorsDict.mode[currentState.mode];

    // 3. Учет веса
    const addedMass = weightsDict[currentState.weight];
    const massRatio = addedMass / carWeight; 
    const weightFactor = 1.0 - (massRatio * 0.6); 
    range *= weightFactor;

    // 4. Климат-контроль
    if (currentState.climate) { 
        range = range * (1 - climateImpact); 
    }

    return Math.round(range);
}