// Визуализация влияния факторов на запас хода

/**
 * Обновляет визуальные индикаторы влияния факторов
 */
function updateImpactVisuals() {
    const setVisual = (valEl, iconEl, status) => {
        if (valEl) valEl.className = 'factor-value';
        if (iconEl) iconEl.className = 'trend-icon';
        if (status === 'good') {
            if (valEl) valEl.classList.add('text-success');
            if (iconEl) iconEl.classList.add('text-success');
            if (iconEl) iconEl.innerHTML = '<i class="fa-solid fa-arrow-trend-up"></i>';
        } else if (status === 'warn') {
            if (valEl) valEl.classList.add('text-warning');
            if (iconEl) iconEl.classList.add('text-warning');
            if (iconEl) iconEl.innerHTML = '<i class="fa-solid fa-arrow-trend-down"></i>';
        } else if (status === 'bad') {
            if (valEl) valEl.classList.add('text-danger');
            if (iconEl) iconEl.classList.add('text-danger');
            if (iconEl) iconEl.innerHTML = '<i class="fa-solid fa-arrow-trend-down"></i>';
        }
    };

    const setNeutralVisual = (valEl, iconEl) => {
        if (iconEl) iconEl.innerHTML = '<i class="fa-solid fa-minus"></i>';
        if (valEl) valEl.className = 'factor-value';
        if (iconEl) iconEl.className = 'trend-icon';
    };

    const formatImpactPercent = (value) => {
        if (value === null || value === undefined) return '--';
        const rounded = Math.round(value);
        if (rounded === 0) return '0%';
        return `${rounded > 0 ? '+' : ''}${rounded}%`;
    };

    const setImpactText = (el, value, status = null) => {
        if (!el) return;
        el.className = 'impact-percent';

        if (value === null || value === undefined) {
            el.textContent = '--';
            return;
        }

        const rounded = Math.round(value);

        if (status === 'good') {
            // При зеленой стрелке не окрашиваем проценты
        } else if (status === 'warn') {
            el.classList.add('text-warning');
        } else if (status === 'bad') {
            el.classList.add('text-danger');
        } else {
            if (rounded >= 2) {
                // Положительное влияние - не окрашиваем
            } else if (rounded <= -8) {
                el.classList.add('text-danger');
            } else if (rounded <= -2) {
                el.classList.add('text-warning');
            }
        }

        el.textContent = formatImpactPercent(rounded);
    };

    const updateSpeedShakeState = (el) => {
        if (!el) return;
        if (state.rangeType === 'extended' && state.extSpeed > 160) {
            el.classList.add('speed-shake');
            return;
        }
        el.classList.remove('speed-shake');
    };

    const getWeatherMultiplier = () => {
        if (!state.enableWeather) return 1;
        let tempFactor = 1.0;
        const temp = state.extTemp;
        if (temp < 20) {
            const drop = (20 - temp) * 0.015;
            tempFactor = 1.0 - drop;
        } else if (temp > 25) {
            const drop = (temp - 25) * 0.008;
            tempFactor = 1.0 - drop;
        }
        if (tempFactor < 0.4) tempFactor = 0.4;

        let thermalFactor = 1.0;
        if (temp <= BATTERY_HEATING_THRESHOLD) {
            thermalFactor = 1.0 - BATTERY_HEATING_IMPACT;
        } else if (temp >= BATTERY_COOLING_THRESHOLD) {
            thermalFactor = 1.0 - BATTERY_COOLING_IMPACT;
        }

        let windFactor = 1.0;
        if (state.enableWind) {
            if (state.extWind > 0) {
                windFactor = 1.0 - (state.extWind * 0.015);
            } else if (state.extWind < 0) {
                windFactor = 1.0 + (Math.abs(state.extWind) * 0.008);
            }
        }

        let precipFactor = 1.0;
        if (state.extPrecip === 'rain') {
            precipFactor = 1.0 - PRECIP_RAIN_IMPACT;
        } else if (state.extPrecip === 'snow') {
            precipFactor = 1.0 - PRECIP_SNOW_IMPACT;
        }

        return tempFactor * thermalFactor * windFactor * precipFactor;
    };

    const getWheelsMultiplier = () => {
        if (!state.enableWheels) return 1;
        let wheelFactor = 1.0;
        const wheels = state.extWheels;
        if (wheels === 18) wheelFactor = 1.02;
        else if (wheels === 19) wheelFactor = 1.00;
        else if (wheels === 20) wheelFactor = 0.97;
        else if (wheels === 21) wheelFactor = 0.94;
        else if (wheels >= 22) wheelFactor = 0.90;
        return wheelFactor;
    };

    const getDegMultiplier = () => {
        if (!state.enableDeg) return 1;
        return 1.0 - (state.extDeg / 100);
    };

    const getEnergyMultiplier = () => {
        if (!state.enableEnergyConsumers) return 1;
        let energyFactor = 1.0;
        if (state.seatHeating) energyFactor *= (1 - SEAT_HEATING_IMPACT);
        if (state.windowHeating) energyFactor *= (1 - WINDOW_HEATING_IMPACT);
        if (state.multimedia) energyFactor *= (1 - MULTIMEDIA_IMPACT);
        return energyFactor;
    };

    const getModeMultiplier = () => {
        if (!state.enableExtMode) return 1;
        return factors.mode[state.extMode] || 1;
    };

    const getReliefMultiplier = () => {
        if (!state.enableRelief) return 1;
        if (state.extRelief === 'hilly') return 0.88;
        if (state.extRelief === 'mountains') return 0.75;
        return 1.0;
    };

    const getSpeedMultiplier = () => {
        if (state.rangeType !== 'extended') return null;
        const refSpeed = 50;
        let speedMultiplier = 1.0;
        const dragRatio = 0.24 / 0.23; // примерный dragRatio

        if (state.extSpeed < 20) {
            speedMultiplier = 0.95;
        } else if (state.extSpeed >= 20 && state.extSpeed <= refSpeed) {
            speedMultiplier = 0.95 + (state.extSpeed - 20) / (refSpeed - 20) * 0.05;
        } else if (state.extSpeed > refSpeed && state.extSpeed <= 100) {
            const tSpeed = (state.extSpeed - refSpeed) / (100 - refSpeed);
            const mildAeroGain = (0.02 + (dragRatio - 1) * 0.06) * tSpeed;
            speedMultiplier = 1.0 + mildAeroGain;
        } else {
            const baseAt100 = 1.0 + (0.02 + (dragRatio - 1) * 0.06);
            const highSpeedLoad = Math.pow((state.extSpeed - 100) / 20, 1.35) * 0.26 * dragRatio;
            speedMultiplier = baseAt100 + highSpeedLoad;

            const softCapStart = 2.5;
            if (speedMultiplier > softCapStart) {
                speedMultiplier = softCapStart + Math.log1p(speedMultiplier - softCapStart) * 0.45;
            }
        }

        return speedMultiplier;
    };

    const getWeightMultiplier = () => {
        if (state.rangeType === 'extended') {
            const addedMass = state.extPayload;
            const massRatio = addedMass / currentCarWeight;
            return 1.0 - (massRatio * 0.4);
        }

        const addedMass = ADDED_WEIGHT_KG[state.weight];
        const massRatio = addedMass / currentCarWeight;
        return 1.0 - (massRatio * 0.6);
    };

    const getClimateMultiplier = () => {
        if (state.rangeType === 'extended') {
            if (state.extClimateMode === 'ac') return 0.88;
            if (state.extClimateMode === 'heater') return 0.78;
            return 1.0;
        }

        return state.climate ? (1.0 - CLIMATE_IMPACT) : 1.0;
    };

    const sumWheels = document.getElementById('summary-wheels');
    const iconWheels = document.getElementById('icon-wheels');
    const sumWeather = document.getElementById('summary-weather');
    const iconWeather = document.getElementById('icon-weather');
    const sumDeg = document.getElementById('summary-deg');
    const iconDeg = document.getElementById('icon-deg');
    const sumModeExt = document.getElementById('summary-mode-ext');
    const iconModeExt = document.getElementById('icon-mode-ext');
    const sumEnergyConsumers = document.getElementById('summary-energy-consumers');
    const iconEnergyConsumers = document.getElementById('icon-energy-consumers');
    const sumRelief = document.getElementById('summary-relief');
    const iconRelief = document.getElementById('icon-relief');

    const impactWeather = document.getElementById('impact-weather');
    const impactWheels = document.getElementById('impact-wheels');
    const impactDeg = document.getElementById('impact-deg');
    const impactModeExt = document.getElementById('impact-mode-ext');
    const impactEnergy = document.getElementById('impact-energy-consumers');
    const impactWeight = document.getElementById('impact-weight');
    const impactClimate = document.getElementById('impact-climate');
    const impactSpeed = document.getElementById('impact-speed');
    const impactRelief = document.getElementById('impact-relief');

    if (state.rangeType === 'standard') {
        updateStandardModeVisuals(setVisual);
        setImpactText(impactWeather, null);
        setImpactText(impactWheels, null);
        setImpactText(impactDeg, null);
        setImpactText(impactModeExt, null);
        setImpactText(impactEnergy, null);
        setImpactText(impactSpeed, null);
        setImpactText(impactWeight, null);
        setImpactText(impactClimate, null);
        setImpactText(impactRelief, null);
    } else {
        updateExtendedModeVisuals(
            setVisual,
            setNeutralVisual,
            sumWheels,
            iconWheels,
            sumWeather,
            iconWeather,
            sumDeg,
            iconDeg,
            sumModeExt,
            iconModeExt,
            sumEnergyConsumers,
            iconEnergyConsumers,
            sumRelief,
            iconRelief
        );

        const weatherImpact = state.enableWeather ? (getWeatherMultiplier() - 1) * 100 : null;
        const wheelsImpact = state.enableWheels ? (getWheelsMultiplier() - 1) * 100 : null;
        const degImpact = state.enableDeg ? (getDegMultiplier() - 1) * 100 : null;
        const modeImpact = state.enableExtMode ? (getModeMultiplier() - 1) * 100 : null;
        const energyImpact = state.enableEnergyConsumers ? (getEnergyMultiplier() - 1) * 100 : null;
        const speedImpact = (getSpeedMultiplier() - 1) * 100;
        const weightImpact = (getWeightMultiplier() - 1) * 100;
        const climateImpact = (getClimateMultiplier() - 1) * 100;
        const reliefImpact = state.enableRelief ? (getReliefMultiplier() - 1) * 100 : null;

        let degStatus = null;
        if (state.enableDeg) {
            if (state.extDeg <= 2) degStatus = 'good';
            else if (state.extDeg <= 5) degStatus = 'warn';
            else degStatus = 'bad';
        }

        let energyStatus = null;
        if (state.enableEnergyConsumers) {
            let totalImpact = 0;
            if (state.seatHeating) totalImpact += SEAT_HEATING_IMPACT;
            if (state.windowHeating) totalImpact += WINDOW_HEATING_IMPACT;
            if (state.multimedia) totalImpact += MULTIMEDIA_IMPACT;

            if (totalImpact === 0) {
                energyStatus = null;
            } else if (totalImpact <= 0.05) {
                energyStatus = 'warn';
            } else {
                energyStatus = 'bad';
            }
        }

        let climateStatus = 'bad';
        if (state.extClimateMode === 'off') climateStatus = 'good';
        else if (state.extClimateMode === 'ac') climateStatus = 'warn';

        let weatherStatus = null;
        if (state.enableWeather) {
            weatherStatus = 'good';

            if (state.extTemp >= 20 && state.extTemp <= 25) {
                // ideal temperature
            } else if (state.extTemp <= BATTERY_HEATING_THRESHOLD || state.extTemp >= BATTERY_COOLING_THRESHOLD) {
                weatherStatus = 'bad';
            } else if (state.extTemp < 15 || state.extTemp > 30) {
                weatherStatus = 'warn';
            }

            if (state.enableWind) {
                const absWind = Math.abs(state.extWind);
                if (absWind > 10) {
                    weatherStatus = 'bad';
                } else if (absWind > 5) {
                    if (weatherStatus === 'good') weatherStatus = 'warn';
                }
                if (state.extWind > 0 && absWind > 5) {
                    weatherStatus = 'bad';
                }
            }

            if (state.extPrecip === 'snow') {
                weatherStatus = 'bad';
            } else if (state.extPrecip === 'rain' && weatherStatus === 'good') {
                weatherStatus = 'warn';
            }
        }

        let reliefStatus = null;
        if (state.enableRelief) {
            if (state.extRelief === 'flat') reliefStatus = 'good';
            else if (state.extRelief === 'hilly') reliefStatus = 'warn';
            else if (state.extRelief === 'mountains') reliefStatus = 'bad';
        }

        let wheelsStatus = null;
        if (state.enableWheels) {
            if (state.extWheels <= 19 && state.extTires === 2) wheelsStatus = 'good';
            else if (state.extWheels <= 19 && state.extTires === 1) wheelsStatus = 'good';
            else if (state.extWheels <= 19 && state.extTires === 0) wheelsStatus = 'warn';
            else if (state.extWheels > 19 && state.extTires === 2) wheelsStatus = 'warn';
            else wheelsStatus = 'bad';
        }

        let speedStatus = 'warn';
        if (state.extSpeed <= 60) speedStatus = 'good';
        else if (state.extSpeed > 110) speedStatus = 'bad';

        let weightStatus = 'good';
        if (state.extPayload > 300) weightStatus = 'bad';
        else if (state.extPayload > 200) weightStatus = 'warn';

        setImpactText(impactWeather, weatherImpact, weatherStatus);
        setImpactText(impactWheels, wheelsImpact, wheelsStatus);
        setImpactText(impactDeg, degImpact, degStatus);
        setImpactText(impactModeExt, modeImpact);
        setImpactText(impactEnergy, energyImpact, energyStatus);
        setImpactText(impactSpeed, speedImpact, speedStatus);
        setImpactText(impactWeight, weightImpact, weightStatus);
        setImpactText(impactClimate, climateImpact, climateStatus);
        setImpactText(impactRelief, reliefImpact, reliefStatus);
    }

    updateSpeedShakeState(sumMode);
}

/**
 * Обновляет визуальные индикаторы для Standard режима
 */
function updateStandardModeVisuals(setVisual) {
    if (state.season === 'summer') setVisual(sumSeason, iconSeason, 'good');
    else if (state.season === 'spring') setVisual(sumSeason, iconSeason, 'warn');
    else setVisual(sumSeason, iconSeason, 'bad');

    if (state.road === 'city') setVisual(sumRoad, iconRoad, 'good');
    else if (state.road === 'mixed') setVisual(sumRoad, iconRoad, 'warn');
    else setVisual(sumRoad, iconRoad, 'bad');

    if (state.mode === 'eco') setVisual(sumMode, iconMode, 'good');
    else if (state.mode === 'normal') setVisual(sumMode, iconMode, 'warn');
    else setVisual(sumMode, iconMode, 'bad');

    if (!state.climate) setVisual(sumClimate, iconClimate, 'good');
    else setVisual(sumClimate, iconClimate, 'bad');

    if (state.weight === 'driver') setVisual(sumWeight, iconWeight, 'good');
    else if (state.weight === 'partial') setVisual(sumWeight, iconWeight, 'warn');
    else setVisual(sumWeight, iconWeight, 'bad');
}

/**
 * Обновляет визуальные индикаторы для Extended режима
 */
function updateExtendedModeVisuals(setVisual, setNeutralVisual, sumWheels, iconWheels, sumWeather, iconWeather, sumDeg, iconDeg, sumModeExt, iconModeExt, sumEnergyConsumers, iconEnergyConsumers, sumRelief, iconRelief) {
    if (state.enableWeather) {
        let weatherImpact = 'good';

        if (state.extTemp >= 20 && state.extTemp <= 25) {
            // Идеальная температура
        } else if (state.extTemp <= BATTERY_HEATING_THRESHOLD || state.extTemp >= BATTERY_COOLING_THRESHOLD) {
            weatherImpact = 'bad';
        } else if (state.extTemp < 15 || state.extTemp > 30) {
            weatherImpact = 'warn';
        }

        if (state.enableWind) {
            const absWind = Math.abs(state.extWind);
            if (absWind > 10) {
                weatherImpact = 'bad';
            } else if (absWind > 5) {
                if (weatherImpact === 'good') weatherImpact = 'warn';
            }
            if (state.extWind > 0 && absWind > 5) {
                weatherImpact = 'bad';
            }
        }

        if (state.extPrecip === 'snow') {
            weatherImpact = 'bad';
        } else if (state.extPrecip === 'rain' && weatherImpact === 'good') {
            weatherImpact = 'warn';
        }

        setVisual(sumWeather, iconWeather, weatherImpact);
    } else {
        setNeutralVisual(sumWeather, iconWeather);
    }

    if (state.extSpeed <= 60) setVisual(sumMode, iconMode, 'good');
    else if (state.extSpeed > 110) setVisual(sumMode, iconMode, 'bad');
    else setVisual(sumMode, iconMode, 'warn');

    if (state.extClimateMode === 'off') setVisual(sumClimate, iconClimate, 'good');
    else if (state.extClimateMode === 'ac') setVisual(sumClimate, iconClimate, 'warn');
    else setVisual(sumClimate, iconClimate, 'bad');

    if (state.extPayload > 300) setVisual(sumWeight, iconWeight, 'bad');
    else if (state.extPayload > 200) setVisual(sumWeight, iconWeight, 'warn');
    else setVisual(sumWeight, iconWeight, 'good');

    if (state.enableExtMode) {
        if (state.extMode === 'eco') setVisual(sumModeExt, iconModeExt, 'good');
        else if (state.extMode === 'normal') setVisual(sumModeExt, iconModeExt, 'warn');
        else setVisual(sumModeExt, iconModeExt, 'bad');
    } else {
        setNeutralVisual(sumModeExt, iconModeExt);
    }

    if (state.enableWheels) {
        if (state.extWheels <= 19 && state.extTires === 2) setVisual(sumWheels, iconWheels, 'good');
        else if (state.extWheels <= 19 && state.extTires === 1) setVisual(sumWheels, iconWheels, 'good');
        else if (state.extWheels <= 19 && state.extTires === 0) setVisual(sumWheels, iconWheels, 'warn');
        else if (state.extWheels > 19 && state.extTires === 2) setVisual(sumWheels, iconWheels, 'warn');
        else setVisual(sumWheels, iconWheels, 'bad');
    } else {
        setNeutralVisual(sumWheels, iconWheels);
    }

    if (state.enableDeg) {
        if (state.extDeg <= 2) setVisual(sumDeg, iconDeg, 'good');
        else if (state.extDeg <= 5) setVisual(sumDeg, iconDeg, 'warn');
        else setVisual(sumDeg, iconDeg, 'bad');
    } else {
        setNeutralVisual(sumDeg, iconDeg);
    }

    if (state.enableEnergyConsumers) {
        let totalImpact = 0;
        if (state.seatHeating) totalImpact += SEAT_HEATING_IMPACT;
        if (state.windowHeating) totalImpact += WINDOW_HEATING_IMPACT;
        if (state.multimedia) totalImpact += MULTIMEDIA_IMPACT;

        if (totalImpact === 0) {
            setNeutralVisual(sumEnergyConsumers, iconEnergyConsumers);
        } else if (totalImpact <= 0.05) {
            setVisual(sumEnergyConsumers, iconEnergyConsumers, 'warn');
        } else {
            setVisual(sumEnergyConsumers, iconEnergyConsumers, 'bad');
        }
    } else {
        setNeutralVisual(sumEnergyConsumers, iconEnergyConsumers);
    }

    if (state.enableRelief) {
        if (state.extRelief === 'flat') setVisual(sumRelief, iconRelief, 'good');
        else if (state.extRelief === 'hilly') setVisual(sumRelief, iconRelief, 'warn');
        else setVisual(sumRelief, iconRelief, 'bad');
    } else {
        setNeutralVisual(sumRelief, iconRelief);
    }
}
