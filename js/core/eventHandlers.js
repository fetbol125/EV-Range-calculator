// Обработчики событий

/**
 * Инициализирует обработчики для Extended Mode
 */
function initExtendedListeners() {
    // Слайдеры
    const speedS = document.getElementById('speed-slider');
    const weightS = document.getElementById('ext-weight-slider');
    const wheelsS = document.getElementById('wheels-slider');
    const tempS = document.getElementById('temp-slider');
    const tiresS = document.getElementById('tires-slider');
    const degS = document.getElementById('deg-slider');
    const windS = document.getElementById('wind-slider');
    
    // Чекбоксы
    const checkWheels = document.getElementById('check-wheels');
    const checkWind = document.getElementById('check-wind');
    const checkDeg = document.getElementById('check-deg');
    const checkModeExt = document.getElementById('check-mode-ext');
    const checkEnergyConsumers = document.getElementById('check-energy-consumers'); 
    
    // Группы контролов
    const groupWind = document.getElementById('group-wind');
    const groupDeg = document.getElementById('group-deg'); 
    const groupModeExt = document.getElementById('group-mode-ext');
    const groupEnergyConsumers = document.getElementById('energy-consumers-dropdown');

    if(speedS) {
        speedS.addEventListener('input', (e) => {
            state.extSpeed = parseInt(e.target.value);
            document.getElementById('val-speed').innerText = state.extSpeed + ' km/h';
            updateUI();
        });
    }
    
    if(weightS) weightS.addEventListener('input', (e) => {
        state.extPayload = parseInt(e.target.value);
        document.getElementById('val-ext-weight').innerText = state.extPayload + ' kg';
        updateUI();
    });
    
    if(wheelsS) wheelsS.addEventListener('input', (e) => {
        state.extWheels = parseInt(e.target.value);
        document.getElementById('val-wheels').innerText = state.extWheels + '"';
        updateUI();
    });
    
    if(tempS) tempS.addEventListener('input', (e) => {
        state.extTemp = parseInt(e.target.value);
        document.getElementById('val-temp').innerText = state.extTemp + '°C';
        updateBatteryThermalStatus();
        updateUI();
    });
    
    if(tiresS) tiresS.addEventListener('input', (e) => {
        state.extTires = parseInt(e.target.value);
        const labels = [translations[state.lang].tireLow, translations[state.lang].tireNorm, translations[state.lang].tireHigh];
        document.getElementById('val-tires').innerText = labels[state.extTires];
        updateUI();
    });
    
    if(degS) degS.addEventListener('input', (e) => {
        state.extDeg = parseInt(e.target.value);
        document.getElementById('val-deg').innerText = state.extDeg + '%';
        updateUI();
    });
    
    if(windS) windS.addEventListener('input', (e) => {
        state.extWind = parseInt(e.target.value);
        let text = state.extWind + ' m/s';
        const head = translations[state.lang].windHeadwind;
        const tail = translations[state.lang].windTailwind;
        
        if(state.extWind > 0) text = '+' + text + ` (${head})`;
        if(state.extWind < 0) text = text + ` (${tail})`;
        document.getElementById('val-wind').innerText = text;
        updateUI();
    });

    const toggleState = (checkbox, group, stateKey) => {
        state[stateKey] = checkbox.checked;
        if(state[stateKey]) {
            if(group) group.classList.remove('disabled');
        } else {
            if(group) group.classList.add('disabled');
        }
        updateUI();
    };

    if(checkWheels) checkWheels.addEventListener('change', (e) => toggleState(e.target, wheelsDropdown, 'enableWheels'));
    if(checkWind) checkWind.addEventListener('change', (e) => toggleState(e.target, groupWind, 'enableWind'));
    if(checkDeg) checkDeg.addEventListener('change', (e) => toggleState(e.target, groupDeg, 'enableDeg')); 
    if(checkModeExt) checkModeExt.addEventListener('change', (e) => toggleState(e.target, groupModeExt, 'enableExtMode'));
    if(checkEnergyConsumers) checkEnergyConsumers.addEventListener('change', (e) => toggleState(e.target, groupEnergyConsumers, 'enableEnergyConsumers'));

    // Climate кнопки
    const climateGroup = document.getElementById('ext-climate-group');
    if(climateGroup) {
        const btns = climateGroup.querySelectorAll('.pill-btn');

        const initialActiveBtn = climateGroup.querySelector('.pill-btn.active');
        setTimeout(() => {
            updatePillSlider(climateGroup, initialActiveBtn); 
        }, 0);
        
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.extClimateMode = btn.dataset.value;
                const labels = {off: translations[state.lang].climateOff, ac: translations[state.lang].climateAC, heater: translations[state.lang].climateHeater};
                document.getElementById('val-ext-climate').innerText = labels[state.extClimateMode];
                
                updatePillSlider(climateGroup, btn);
                
                updateUI();
            });
        });
    }
    
    setupPillGroup('mode-group-ext', 'extMode');
}

/**
 * Настраивает pill group (кнопки выбора)
 */
function setupPillGroup(groupId, stateKey) {
    const group = document.getElementById(groupId);
    if(!group) return;
    const buttons = group.querySelectorAll('.pill-btn');
    
    const initialActiveBtn = group.querySelector('.pill-btn.active');
    setTimeout(() => {
        updatePillSlider(group, initialActiveBtn); 
    }, 0);
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state[stateKey] = btn.dataset.value;
            
            updatePillSlider(group, btn);
            
            updateUI();
        });
    });
}

/**
 * Переключает климат-контроль
 */
window.toggleClimate = function(isOn) {
    state.climate = isOn;
    const btnOn = document.querySelector('.climate-btn.on');
    const btnOff = document.querySelector('.climate-btn.off');
    if(isOn) { 
        if(btnOn) btnOn.classList.add('active'); 
        if(btnOff) btnOff.classList.remove('active'); 
    } else { 
        if(btnOff) btnOff.classList.add('active'); 
        if(btnOn) btnOn.classList.remove('active'); 
    }
    updateUI();
}

/**
 * Toggles Seat/Wheel Heating
 */
window.toggleSeatHeating = function(isOn) {
    state.seatHeating = isOn;
    const seatGroup = document.querySelector('#val-seat-heating').closest('.control-group');
    const btnOn = seatGroup ? seatGroup.querySelector('.climate-btn.on') : null;
    const btnOff = seatGroup ? seatGroup.querySelector('.climate-btn.off') : null;
    if (isOn) {
        if (btnOn) btnOn.classList.add('active');
        if (btnOff) btnOff.classList.remove('active');
    } else {
        if (btnOff) btnOff.classList.add('active');
        if (btnOn) btnOn.classList.remove('active');
    }
    const valEl = document.getElementById('val-seat-heating');
    if (valEl) valEl.innerText = isOn ? translations[state.lang].climateOn : translations[state.lang].climateOff;
    updateUI();
}

/**
 * Toggles Window Heating
 */
window.toggleWindowHeating = function(isOn) {
    state.windowHeating = isOn;
    const windowGroup = document.querySelector('#val-window-heating').closest('.control-group');
    const btnOn = windowGroup ? windowGroup.querySelector('.climate-btn.on') : null;
    const btnOff = windowGroup ? windowGroup.querySelector('.climate-btn.off') : null;
    if (isOn) {
        if (btnOn) btnOn.classList.add('active');
        if (btnOff) btnOff.classList.remove('active');
    } else {
        if (btnOff) btnOff.classList.add('active');
        if (btnOn) btnOn.classList.remove('active');
    }
    const valEl = document.getElementById('val-window-heating');
    if (valEl) valEl.innerText = isOn ? translations[state.lang].climateOn : translations[state.lang].climateOff;
    updateUI();
}

/**
 * Toggles Multimedia
 */
window.toggleMultimedia = function(isOn) {
    state.multimedia = isOn;
    const multGroup = document.querySelector('#val-multimedia').closest('.control-group');
    const btnOn = multGroup ? multGroup.querySelector('.climate-btn.on') : null;
    const btnOff = multGroup ? multGroup.querySelector('.climate-btn.off') : null;
    if (isOn) {
        if (btnOn) btnOn.classList.add('active');
        if (btnOff) btnOff.classList.remove('active');
    } else {
        if (btnOff) btnOff.classList.add('active');
        if (btnOn) btnOn.classList.remove('active');
    }
    const valEl = document.getElementById('val-multimedia');
    if (valEl) valEl.innerText = isOn ? translations[state.lang].climateOn : translations[state.lang].climateOff;
    updateUI();
}

/**
 * Инициализирует обработчики для языкового меню
 */
function initLanguageMenu() {
    if (languageTrigger) {
        languageTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            languageMenu.classList.toggle('show');
        });
        
        languageOptions.forEach(option => {
            option.addEventListener('click', () => {
                const newLang = option.dataset.lang;
                if (newLang !== state.lang) {
                    setLanguage(newLang);
                }
                languageMenu.classList.remove('show');
            });
        });

        document.addEventListener('click', (e) => {
            if (languageMenu && !languageMenu.contains(e.target) && !languageTrigger.contains(e.target)) {
                languageMenu.classList.remove('show');
            }
        });
    }
}

/**
 * Инициализирует обработчики для меню автомобилей
 */
function initCarMenuHandlers() {
    const carBlock = document.querySelector('.car-block');
    
    if (carBlock) {
        carBlock.addEventListener('click', (e) => {
            if (carDropdown && carDropdown.contains(e.target)) {
                return;
            }
            if (customModal && customModal.contains(e.target)) {
                return;
            }
            window.toggleCarMenu();
        });
    }
    
    document.addEventListener('click', (e) => {
        const isClickInsideCustomModal = customModal && customModal.contains(e.target);
        const isClickInsideInfoCarModal = infoCarModal && infoCarModal.contains(e.target);

        if (carDropdown && carDropdown.classList.contains('show') && !carBlock.contains(e.target) && !isClickInsideCustomModal && !isClickInsideInfoCarModal) {
            window.toggleCarMenu();
        }
    });
}

/**
 * Инициализирует переключатель режимов
 */
function initModeToggle() {
    modeToggleInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            state.rangeType = e.target.value; 
            
            if (state.rangeType === 'extended') {
                modeToggleContainer.classList.add('extended-active');
            } else {
                modeToggleContainer.classList.remove('extended-active');
            }
            
            toggleControlMode(state.rangeType);
            toggleConsumptionDisplay(state.rangeType === 'extended');
            updateUI();
        });
    });
}

/**
 * Инициализирует слайдер батареи
 */
function initBatterySlider() {
    slider.addEventListener('input', (e) => { 
        state.battery = parseInt(e.target.value); 
        updateUI(); 
    });
}

/**
 * Инициализирует все pill groups
 */
function initPillGroups() {
    setupPillGroup('season-group', 'season');
    setupPillGroup('road-group', 'road');
    setupPillGroup('mode-group', 'mode');
    setupPillGroup('weight-group', 'weight');
}

/**
 * Инициализирует dropdown меню Energy Consumers
 */
function initEnergyConsumersDropdown() {
    if (energyConsumersTrigger && energyConsumersMenu) {
        energyConsumersTrigger.addEventListener('click', (e) => {
            // Не открываем меню при клике на чекбокс
            if (e.target.id === 'check-energy-consumers' || e.target.type === 'checkbox') {
                return;
            }
            e.stopPropagation();
            energyConsumersMenu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (energyConsumersMenu && !energyConsumersMenu.contains(e.target) && !energyConsumersTrigger.contains(e.target)) {
                energyConsumersMenu.classList.remove('show');
            }
        });
    }
}

/**
 * Инициализирует dropdown меню Wheels
 */
function initWheelsDropdown() {
    if (wheelsTrigger && wheelsMenu) {
        wheelsTrigger.addEventListener('click', (e) => {
            // Не открываем меню при клике на чекбокс
            if (e.target.id === 'check-wheels' || e.target.type === 'checkbox') {
                return;
            }
            e.stopPropagation();
            wheelsMenu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (wheelsMenu && !wheelsMenu.contains(e.target) && !wheelsTrigger.contains(e.target)) {
                wheelsMenu.classList.remove('show');
            }
        });
    }
}
