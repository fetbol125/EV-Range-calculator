// site ver1.zip/site ver1/script.js

// ==========================================
// 1. ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ==========================================
let currentMaxRange = 573; 
let currentCarWeight = 2069; 
const CIRCUMFERENCE = 2 * Math.PI * 120;
const currentCarBrand = document.getElementById('current-car-brand');

// Создание объединенной и сгруппированной структуры данных
let groupedCarsData = {};
let allCars = []; // Для поиска по всем моделям

// Состояние приложения
let state = {
    battery: 65,
    season: 'summer',
    road: 'city',
    mode: 'eco',
    weight: 'driver', 
    climate: false,
    rangeType: 'standard', 
    lang: 'en', 
    
    // Extended Values
    extSpeed: 90,    
    extPayload: 75,  
    extWheels: 19,   
    extTemp: 20,     
    extTires: 1,     
    extDeg: 0,
    extWind: 0,
    extClimateMode: 'off',
    extMode: 'eco', 
    // Состояния включения/отключения факторов Extended Mode
    enableWheels: true,
    enableWind: true,
    enableTires: true,
    enableDeg: true,
    enableExtMode: true 
};

const ADDED_WEIGHT_KG = { driver: 75, partial: 200, full: 400 };
const factors = {
    season: { summer: 1.0, spring: 0.96, winter: 0.75 },
    road: { city: 1.0, mixed: 0.90, highway: 0.75 },
    mode: { eco: 1.0, normal: 0.95, sport: 0.85 }
};
const CLIMATE_IMPACT = 0.10; 

// ==========================================
// 2. DOM ELEMENTS
// ==========================================
const rangeDisplay = document.getElementById('range-display');
const gaugeFill = document.getElementById('gauge-fill');
const gaugeStatus = document.querySelector('.gauge-status');
const slider = document.getElementById('battery-slider');
const sliderValDisplay = document.getElementById('slider-val-display');

// Footer/Sidebar
const footerBattery = document.getElementById('footer-battery');
const footerMaxRange = document.getElementById('footer-max-range');
const sumBattery = document.getElementById('summary-battery');
const sumSeason = document.getElementById('summary-season');
const sumRoad = document.getElementById('summary-road');
const sumMode = document.getElementById('summary-mode');
const sumWeight = document.getElementById('summary-weight');
const sumClimate = document.getElementById('summary-climate');
const iconSeason = document.getElementById('icon-season');
const iconRoad = document.getElementById('icon-road');
const iconMode = document.getElementById('icon-mode');
const iconWeight = document.getElementById('icon-weight');
const iconClimate = document.getElementById('icon-climate');
const sidebar = document.querySelector('.sidebar'); 

// Car Logic
const currentCarName = document.getElementById('current-car-name');
const currentCarImg = document.getElementById('current-car-img');
const currentCarRange = document.getElementById('current-car-range');
const currentCarBattery = document.getElementById('current-car-battery');
const carDropdown = document.getElementById('car-dropdown');
const carListContainer = document.getElementById('car-list-container');
const carArrow = document.getElementById('car-arrow');
const carSearchInput = document.getElementById('car-search-input');

// Новая переменная для радиокнопок
const modeToggleInputs = document.querySelectorAll('.mode-toggle input[name="rangeMode"]');
const modeToggleContainer = document.querySelector('.mode-toggle');

// ДОБАВЛЕНО: Элементы для Mode в Extended
const sumModeExt = document.getElementById('summary-mode-ext');
const iconModeExt = document.getElementById('icon-mode-ext');

// НОВЫЕ ЭЛЕМЕНТЫ ДЛЯ ЯЗЫКОВОГО МЕНЮ
const languageTrigger = document.getElementById('language-switcher-trigger');
const languageMenu = document.getElementById('language-menu');
const languageOptions = document.querySelectorAll('.language-option');
const currentLanguageText = document.getElementById('current-language-text');


// ==========================================
// 3. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // === НОВЫЙ БЛОК: СБОРКА ДАННЫХ ===
    if (typeof carsData !== 'undefined' && typeof brandsData !== 'undefined') {
        processCarData();
    }
    // =================================

    initStarfield();
    if(gaugeFill) gaugeFill.style.strokeDasharray = CIRCUMFERENCE;

    if (allCars.length > 0) {
        renderCarList(allCars);
        // Выбираем первый автомобиль из объединенного списка
        selectCar(allCars[0].id);
    }

    initExtendedListeners();
    initAllSlidersVisuals();
    
    // Устанавливаем начальный режим сайдбара 
    toggleControlMode(state.rangeType); 
    // На старте проверяем, нужно ли устанавливать класс extended-active
    if (state.rangeType === 'extended') {
        modeToggleContainer.classList.add('extended-active');
    }
    
    // --- НОВАЯ ЛОГИКА ДЛЯ МЕНЮ ЯЗЫКА ---
    if (languageTrigger) {
        // 1. Обработчик для открытия/закрытия меню
        languageTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            languageMenu.classList.toggle('show');
        });
        
        // 2. Обработчик для выбора языка
        languageOptions.forEach(option => {
            option.addEventListener('click', () => {
                const newLang = option.dataset.lang;
                if (newLang !== state.lang) {
                    setLanguage(newLang);
                }
                languageMenu.classList.remove('show');
            });
        });

        // 3. Закрытие меню при клике вне его
        document.addEventListener('click', (e) => {
            if (languageMenu && !languageMenu.contains(e.target) && !languageTrigger.contains(e.target)) {
                languageMenu.classList.remove('show');
            }
        });
    }

    // --- ЛОГИКА ЗАКРЫТИЯ МЕНЮ АВТОМОБИЛЕЙ ПРИ КЛИКЕ ВНЕ ЕГО ---
    const carBlock = document.querySelector('.car-block');
    document.addEventListener('click', (e) => {
        // Проверяем, открыто ли меню и был ли клик ВНЕ carBlock (который содержит dropdown)
        // Добавляем проверку, что клик не был внутри модального окна кастомного авто
        const isClickInsideModal = customModal && customModal.contains(e.target);

        if (carDropdown && carDropdown.classList.contains('show') && !carBlock.contains(e.target) && !isClickInsideModal) {
            window.toggleCarMenu();
        }
    });
    // ---------------------------------------------------------------------

    // Устанавливаем начальный язык (по умолчанию 'en')
    setLanguage(state.lang); 
    
    updateUI();
});

/**
 * Объединяет данные об автомобилях и брендах, группирует их.
 */
function processCarData() {
    // ВАЖНО: brandsData должен быть доступен глобально (добавлен в index.html)
    const brandMap = new Map(brandsData.map(brand => [brand.id, brand]));
    groupedCarsData = {};
    allCars = [];

    carsData.forEach(car => {
        const brand = brandMap.get(car.brandId);
        if (brand) {
            // Добавляем полное имя бренда и логотип в объект машины
            car.brand = brand.name;
            car.logo = brand.logo;
            allCars.push(car);

            if (!groupedCarsData[car.brandId]) {
                groupedCarsData[car.brandId] = {
                    ...brand,
                    models: []
                };
            }
            groupedCarsData[car.brandId].models.push(car);
        }
    });
}

function initExtendedListeners() {
    // Sliders
    const speedS = document.getElementById('speed-slider');
    const weightS = document.getElementById('ext-weight-slider');
    const wheelsS = document.getElementById('wheels-slider');
    const tempS = document.getElementById('temp-slider');
    const tiresS = document.getElementById('tires-slider');
    const degS = document.getElementById('deg-slider');
    const windS = document.getElementById('wind-slider');
    
    // Checkboxes (Toggles)
    const checkWheels = document.getElementById('check-wheels');
    const checkWind = document.getElementById('check-wind');
    const checkTires = document.getElementById('check-tires');
    const checkDeg = document.getElementById('check-deg');
    const checkModeExt = document.getElementById('check-mode-ext'); 
    
    // Groups (to add/remove .disabled class)
    const groupWheels = document.getElementById('group-wheels');
    const groupWind = document.getElementById('group-wind');
    const groupTires = document.getElementById('group-tires');
    const groupDeg = document.getElementById('group-deg'); 
    const groupModeExt = document.getElementById('group-mode-ext');

    // --- SLIDER LISTENERS ---
    if(speedS) {
        speedS.addEventListener('input', (e) => {
            state.extSpeed = parseInt(e.target.value);
            document.getElementById('val-speed').innerText = state.extSpeed + ' km/h';
            updateUI();
        });
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

        // --- CHECKBOX LISTENERS ---
        // Helper to toggle visual state
        const toggleState = (checkbox, group, stateKey) => {
            state[stateKey] = checkbox.checked;
            if(state[stateKey]) {
                if(group) group.classList.remove('disabled');
            } else {
                if(group) group.classList.add('disabled');
            }
            updateUI();
        };

        if(checkWheels) checkWheels.addEventListener('change', (e) => toggleState(e.target, groupWheels, 'enableWheels'));
        if(checkWind) checkWind.addEventListener('change', (e) => toggleState(e.target, groupWind, 'enableWind'));
        if(checkTires) checkTires.addEventListener('change', (e) => toggleState(e.target, groupTires, 'enableTires'));
        if(checkDeg) checkDeg.addEventListener('change', (e) => toggleState(e.target, groupDeg, 'enableDeg')); 
        if(checkModeExt) checkModeExt.addEventListener('change', (e) => toggleState(e.target, groupModeExt, 'enableExtMode')); 
    }

    // CLIMATE Buttons (ИСПРАВЛЕНО: Добавлена логика слайдера)
    const climateGroup = document.getElementById('ext-climate-group');
    if(climateGroup) {
        const btns = climateGroup.querySelectorAll('.pill-btn');

        // Инициализация ползунка при загрузке
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
                
                // Обновление ползунка при клике
                updatePillSlider(climateGroup, btn);
                
                updateUI();
            });
        });
    }
    
    // ДОБАВЛЕНО: Инициализация кнопок Driving Mode в Extended Mode
    setupPillGroup('mode-group-ext', 'extMode');
}

// ==========================================
// 4. CALCULATION
// ==========================================
function updateCalculation() {
    let finalRange = 0;
    try {
        if (state.rangeType === 'extended') {
            finalRange = calculateExtendedRange(
                currentMaxRange, state, factors, currentCarWeight, ADDED_WEIGHT_KG, CLIMATE_IMPACT
            );
        } else {
            finalRange = calculateStandardRange(
                currentMaxRange, state, factors, currentCarWeight, ADDED_WEIGHT_KG, CLIMATE_IMPACT
            );
        }
    } catch (e) {
        console.error(e);
        rangeDisplay.innerText = "ERR";
        return;
    }
    const maxLimit = state.rangeType === 'extended' ? currentMaxRange * 1.5 : currentMaxRange;
    const safeRange = Math.min(finalRange, maxLimit);
    const currentDisplayed = parseInt(rangeDisplay.innerText) || 0;
    animateValue(rangeDisplay, currentDisplayed, safeRange, 500);
    updateGauge(safeRange);
}

function updateGauge(currentVal) {
    let maxScale = currentMaxRange;
    let efficiency = currentVal / maxScale;
    if (efficiency > 1) efficiency = 1;
    if (efficiency < 0) efficiency = 0;

    const offset = CIRCUMFERENCE - (efficiency * CIRCUMFERENCE);
    gaugeFill.style.strokeDashoffset = offset;

    // ИСПРАВЛЕНО: Восстанавливаем цвета и свечение
    const ACCENT_COLOR = '#06b6d4'; 
    const WARNING_COLOR = '#fbbf24';
    const DANGER_COLOR = '#ef4444';
    
    let strokeColor = ACCENT_COLOR;
    let statusText = translations[state.lang].statusGood; 
    let statusClass = 'status-good';
    let filterStyle = `drop-shadow(0 0 8px ${ACCENT_COLOR})`; 

    if (efficiency > 0.65) { 
        // Good Range: Синий
        strokeColor = ACCENT_COLOR; 
        statusText = translations[state.lang].statusGood; 
        statusClass = 'status-good'; 
        filterStyle = `drop-shadow(0 0 8px ${ACCENT_COLOR})`; 
    } else if (efficiency > 0.35) { 
        // Moderate Range: Желтый
        strokeColor = WARNING_COLOR; 
        statusText = translations[state.lang].statusWarn; 
        statusClass = 'status-warn'; 
        filterStyle = `drop-shadow(0 0 8px ${WARNING_COLOR})`; 
    } else { 
        // Low Range: Красный
        strokeColor = DANGER_COLOR; 
        statusText = translations[state.lang].statusDanger; 
        statusClass = 'status-danger'; 
        filterStyle = `drop-shadow(0 0 8px ${DANGER_COLOR})`; 
    }

    gaugeFill.style.stroke = strokeColor;
    gaugeFill.style.filter = filterStyle; 
    
    gaugeStatus.innerText = statusText;
    gaugeStatus.className = `gauge-status ${statusClass}`;
}

// ==========================================
// 5. ОБНОВЛЕНИЕ UI
// ==========================================
function updateUI() {
    // Получаем текущие переводы
    const t = translations[state.lang];
    
    // 1. Базовые обновления
    sliderValDisplay.innerText = state.battery + '%';
    footerBattery.innerText = state.battery + '%';
    sumBattery.innerText = state.battery + '%';
    
    // Обновление единиц измерения и заголовков (для Gauge и Footer)
    document.querySelector('.gauge-unit').textContent = t.kilometers;
    document.querySelector('.gauge-content > div:first-child').textContent = t.estimatedRange;
    document.querySelector('.footer-item.border-right .footer-label').textContent = t.currentBattery;
    document.querySelector('.footer-item:not(.border-right) .footer-label').textContent = t.maxRange;

    // Элементы для динамической замены
    const lblTextSeason = document.getElementById('lbl-text-season');
    const lblIconSeason = document.getElementById('lbl-icon-season');
    const lblTextMode = document.getElementById('lbl-text-mode');
    const lblIconMode = document.getElementById('lbl-icon-mode');
    
    // Блоки сайдбара
    const blockRoad = document.getElementById('sidebar-block-road');
    
    // Новые блоки сайдбара (теперь они всегда существуют)
    const blockWheels = document.getElementById('sidebar-block-wheels');
    const blockWind = document.getElementById('sidebar-block-wind');
    const blockTires = document.getElementById('sidebar-block-tires');
    const blockDeg = document.getElementById('sidebar-block-deg');
    const blockModeExt = document.getElementById('sidebar-block-mode-ext'); 

    // Массив всех анимируемых блоков Extended Mode
    const extendedBlocks = [blockWheels, blockWind, blockTires, blockDeg, blockModeExt];

    // Значения новых блоков
    const sumWheels = document.getElementById('summary-wheels');
    const sumWind = document.getElementById('summary-wind');
    const sumTires = document.getElementById('summary-tires');
    const sumDeg = document.getElementById('summary-deg');
    
    // Обновление текстов в контролах Standard Mode (которые не обновляются через applyTranslation)
    document.querySelector('#weight-group button[data-value="driver"]').textContent = t.weightDriver;
    document.querySelector('#weight-group button[data-value="partial"]').textContent = t.weightPartial;
    document.querySelector('#weight-group button[data-value="full"]').textContent = t.weightFull;
    
    document.querySelector('#season-group button[data-value="summer"]').textContent = t.seasonSummer;
    document.querySelector('#season-group button[data-value="spring"]').textContent = t.seasonSpring;
    document.querySelector('#season-group button[data-value="winter"]').textContent = t.seasonWinter;
    
    document.querySelector('#road-group button[data-value="city"]').textContent = t.roadCity;
    document.querySelector('#road-group button[data-value="highway"]').textContent = t.roadHighway;
    document.querySelector('#road-group button[data-value="mixed"]').textContent = t.roadMixed;

    document.querySelector('#mode-group button[data-value="eco"]').textContent = t.modeEco;
    document.querySelector('#mode-group button[data-value="normal"]').textContent = t.modeNormal;
    document.querySelector('#mode-group button[data-value="sport"]').textContent = t.modeSport;

    document.querySelector('.climate-btn.on').textContent = t.climateOn;
    document.querySelector('.climate-btn.off').textContent = t.climateOff;
    
    // Обновление текстов в контролах Extended Mode (динамические)
    document.querySelector('#ext-climate-group button[data-value="off"]').textContent = t.climateOff;
    document.querySelector('#ext-climate-group button[data-value="ac"]').textContent = t.climateAC;
    document.querySelector('#ext-climate-group button[data-value="heater"]').textContent = t.climateHeater;
    
    document.querySelector('#group-wind > .control-label + input + div span:first-child').textContent = t.windTailwind;
    document.querySelector('#group-wind > .control-label + input + div span:last-child').textContent = t.windHeadwind;
    
    document.querySelector('#group-tires > .control-label + input + div span:nth-child(1)').textContent = t.tireLow;
    document.querySelector('#group-tires > .control-label + input + div span:nth-child(2)').textContent = t.tireNorm;
    document.querySelector('#group-tires > .control-label + input + div span:nth-child(3)').textContent = t.tireHigh;
    
    document.querySelector('#group-deg > input + div').textContent = t.batteryHealthLoss;
    
    document.querySelector('#mode-group-ext button[data-value="eco"]').textContent = t.modeEco;
    document.querySelector('#mode-group-ext button[data-value="normal"]').textContent = t.modeNormal;
    document.querySelector('#mode-group-ext button[data-value="sport"]').textContent = t.modeSport;


    if (state.rangeType === 'standard') {
        // === STANDARD MODE ===
        lblTextSeason.textContent = t.sidebarSeason;
        lblIconSeason.className = 'fa-regular fa-snowflake';
        lblTextMode.textContent = t.sidebarMode;
        lblIconMode.className = 'fa-solid fa-bolt';

        // Road должен быть виден в Standard Mode
        if(blockRoad) blockRoad.classList.remove('hidden-factor');
        
        // Скрываем расширенные блоки с анимацией
        extendedBlocks.forEach(block => {
            if(block) block.classList.add('hidden-factor');
        });

        // Заполняем стандартные (ИСПРАВЛЕНО: используем переводы)
        sumSeason.innerText = t['season' + capitalize(state.season)];
        sumRoad.innerText = t['road' + capitalize(state.road)];
        sumMode.innerText = t['mode' + capitalize(state.mode)];

        sumClimate.innerText = state.climate ? t.climateOn : t.climateOff;
        
        let weightText = t.weightDriver;
        if(state.weight === 'partial') weightText = t.weightPartial;
        if(state.weight === 'full') weightText = t.weightFull;
        sumWeight.innerText = weightText;

    } else {
        // === EXTENDED MODE ===
        // Базовые элементы Standard Mode теперь используются для других факторов
        lblTextSeason.textContent = t.temperature;
        lblIconSeason.className = 'fa-solid fa-temperature-half';
        lblTextMode.textContent = t.speed;
        lblIconMode.className = 'fa-solid fa-gauge-high';

        // Road должен СКРЫТЬСЯ в Extended Mode
        if(blockRoad) blockRoad.classList.add('hidden-factor');

        // Показываем расширенные блоки с анимацией
        extendedBlocks.forEach(block => {
            if(block) block.classList.remove('hidden-factor');
        });

        // Заполняем значения
        sumSeason.innerText = state.extTemp + '°C';
        sumMode.innerText = state.extSpeed + ' km/h'; // Speed теперь использует sumMode
        
        const clims = {off:t.climateOff, ac:t.climateAC, heater:t.climateHeater};
        sumClimate.innerText = clims[state.extClimateMode] || t.climateOff;
        sumWeight.innerText = state.extPayload + ' kg';

        // Заполняем новые блоки
        if(sumWheels) sumWheels.innerText = state.extWheels + '"';
        
        const head = t.windHeadwind;
        const tail = t.windTailwind;
        let windText = state.extWind + ' m/s';
        if(state.extWind > 0) windText = '+' + windText + ` (${head})`;
        if(state.extWind < 0) windText = windText + ` (${tail})`;
        if(sumWind) sumWind.innerText = windText;
        
        const tireLabels = [t.tireLow, t.tireNorm, t.tireHigh];
        if(sumTires) sumTires.innerText = tireLabels[state.extTires] || t.tireNorm;
        
        if(sumDeg) sumDeg.innerText = state.extDeg + '%';
        if(sumModeExt) sumModeExt.innerText = capitalize(state.extMode); 
        if(document.getElementById('val-mode-ext')) document.getElementById('val-mode-ext').innerText = capitalize(state.extMode); 


        // === ЛОГИКА ЗАТЕМНЕНИЯ (DISABLED) ===
        // Если функция отключена (галочка снята), добавляем класс disabled
        if (!state.enableWheels) blockWheels.classList.add('disabled'); else blockWheels.classList.remove('disabled');
        if (!state.enableWind) blockWind.classList.add('disabled'); else blockWind.classList.remove('disabled');
        if (!state.enableTires) blockTires.classList.add('disabled'); else blockTires.classList.remove('disabled');
        
        const groupDeg = document.getElementById('group-deg');
        if (!state.enableDeg) { 
            if(blockDeg) blockDeg.classList.add('disabled');
            if(groupDeg) groupDeg.classList.add('disabled');
        } else {
            if(blockDeg) blockDeg.classList.remove('disabled');
            if(groupDeg) groupDeg.classList.remove('disabled');
        }
        
        const groupModeExt = document.getElementById('group-mode-ext');
        if (!state.enableExtMode) { 
            if(blockModeExt) blockModeExt.classList.add('disabled');
            if(groupModeExt) groupModeExt.classList.add('disabled');
        } else {
            if(blockModeExt) blockModeExt.classList.remove('disabled');
            if(groupModeExt) groupModeExt.classList.remove('disabled');
        }
    }

    updateImpactVisuals();
    updateCalculation();
}

slider.addEventListener('input', (e) => { state.battery = parseInt(e.target.value); updateUI(); });

// НОВЫЙ ОБРАБОТЧИК ДЛЯ РАДИОКНОПОК
modeToggleInputs.forEach(input => {
    input.addEventListener('change', (e) => {
        state.rangeType = e.target.value; 
        
        // НОВАЯ ЛОГИКА ДЛЯ ПЕРЕМЕЩЕНИЯ ПОЛЗУНКА
        if (state.rangeType === 'extended') {
            modeToggleContainer.classList.add('extended-active');
        } else {
            modeToggleContainer.classList.remove('extended-active');
        }
        
        toggleControlMode(state.rangeType);
        updateUI();
    });
});
// УДАЛЕН старый обработчик rangeTypeBtns

function toggleControlMode(mode) {
    const stdControls = document.getElementById('standard-controls');
    const extControls = document.getElementById('extended-controls');
    // ДОБАВЛЕНО: Управление видимостью нового блока Driving Mode
    const modeExtControls = document.getElementById('mode-ext-controls'); 
    
    // Управляем классом сайдбара для стилей Standard Mode
    if (mode === 'extended') {
        stdControls.style.display = 'none';
        extControls.style.display = 'contents'; 
        modeExtControls.style.display = 'contents'; // ПОКАЗЫВАЕМ НОВЫЙ БЛОК
        if(sidebar) sidebar.classList.remove('standard-mode'); // Extended Mode: Две колонки
    } else {
        stdControls.style.display = 'contents';
        extControls.style.display = 'none';
        modeExtControls.style.display = 'none'; // СКРЫВАЕМ НОВЫЙ БЛОК
        if(sidebar) sidebar.classList.add('standard-mode'); // Standard Mode: Одна колонка (через CSS)
    }
}

// УДАЛЕНА функция animateSlider()

/**
 * Обновляет позицию и ширину ползунка ::before в Pill Group.
 * @param {HTMLElement} group - Контейнер .pill-group.
 * @param {HTMLElement} activeBtn - Активная кнопка.
 */
function updatePillSlider(group, activeBtn) {
    if (!group || !activeBtn) return;
    
    // 1. Получаем позицию и размеры кнопки относительно группы
    const groupRect = group.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    
    // 2. Рассчитываем смещение (transform: translateX)
    // Разница между левыми краями кнопки и группы минус 3px отступа (padding: 3px)
    const offset = btnRect.left - groupRect.left - 3; 
    
    // 3. Ширина ползунка
    const width = btnRect.width + 6; // +6px для учета padding: 3px слева и справа
    
    // 4. Применяем стили к элементу ::before через CSS-переменные
    group.style.setProperty('--slider-x', `${offset}px`);
    group.style.setProperty('--slider-width', `${width}px`);
}


function setupPillGroup(groupId, stateKey) {
    const group = document.getElementById(groupId);
    if(!group) return;
    const buttons = group.querySelectorAll('.pill-btn');
    
    // === ДОБАВЛЕНО: Устанавливаем начальное положение ползунка при загрузке ===
    const initialActiveBtn = group.querySelector('.pill-btn.active');
    // Задержка 0 мс, чтобы удостовериться, что все кнопки отрендерились и имеют правильный размер
    setTimeout(() => {
        updatePillSlider(group, initialActiveBtn); 
    }, 0);
    // ========================================================================
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state[stateKey] = btn.dataset.value;
            
            // === ДОБАВЛЕНО: Обновляем положение ползунка при клике ===
            updatePillSlider(group, btn);
            // ========================================================
            
            updateUI();
        });
    });
}
setupPillGroup('season-group', 'season');
setupPillGroup('road-group', 'road');
setupPillGroup('mode-group', 'mode');
setupPillGroup('weight-group', 'weight');

window.toggleClimate = function(isOn) {
    state.climate = isOn;
    const btnOn = document.querySelector('.climate-btn.on');
    const btnOff = document.querySelector('.climate-btn.off');
    if(isOn) { if(btnOn) btnOn.classList.add('active'); if(btnOff) btnOff.classList.remove('active'); } 
    else { if(btnOff) btnOff.classList.add('active'); if(btnOn) btnOn.classList.remove('active'); }
    updateUI();
}

function updateImpactVisuals() {
    const setVisual = (valEl, iconEl, status) => {
        if(valEl) valEl.className = 'factor-value';
        if(iconEl) iconEl.className = 'trend-icon';
        if (status === 'good') { if(valEl) valEl.classList.add('text-success'); if(iconEl) iconEl.classList.add('text-success'); if(iconEl) iconEl.innerHTML = '<i class="fa-solid fa-arrow-trend-up"></i>'; } 
        else if (status === 'warn') { if(valEl) valEl.classList.add('text-warning'); if(iconEl) iconEl.classList.add('text-warning'); if(iconEl) iconEl.innerHTML = '<i class="fa-solid fa-arrow-trend-down"></i>'; } 
        else if (status === 'bad') { if(valEl) valEl.classList.add('text-danger'); if(iconEl) iconEl.classList.add('text-danger'); if(iconEl) iconEl.innerHTML = '<i class="fa-solid fa-arrow-trend-down"></i>'; }
    };
    
    const setNeutralVisual = (valEl, iconEl) => { // ДОБАВЛЕНО для отключенных факторов
        if(iconEl) iconEl.innerHTML = '<i class="fa-solid fa-minus"></i>';
        if(valEl) valEl.className = 'factor-value';
        if(iconEl) iconEl.className = 'trend-icon';
    }
    
    // Элементы Extended Mode, которые могут быть отключены
    const sumWheels = document.getElementById('summary-wheels');
    const iconWheels = document.getElementById('icon-wheels');
    const sumWind = document.getElementById('summary-wind');
    const iconWind = document.getElementById('icon-wind');
    const sumTires = document.getElementById('summary-tires');
    const iconTires = document.getElementById('icon-tires');
    const sumDeg = document.getElementById('summary-deg');
    const iconDeg = document.getElementById('icon-deg');
    const sumModeExt = document.getElementById('summary-mode-ext');
    const iconModeExt = document.getElementById('icon-mode-ext');
    
    if (state.rangeType === 'standard') {
        if (state.season === 'summer') setVisual(sumSeason, iconSeason, 'good'); else if (state.season === 'spring') setVisual(sumSeason, iconSeason, 'warn'); else setVisual(sumSeason, iconSeason, 'bad');
        if (state.road === 'city') setVisual(sumRoad, iconRoad, 'good'); else if (state.road === 'mixed') setVisual(sumRoad, iconRoad, 'warn'); else setVisual(sumRoad, iconRoad, 'bad');
        if (state.mode === 'eco') setVisual(sumMode, iconMode, 'good'); else if (state.mode === 'normal') setVisual(sumMode, iconMode, 'warn'); else setVisual(sumMode, iconMode, 'bad');
        if (!state.climate) setVisual(sumClimate, iconClimate, 'good'); else setVisual(sumClimate, iconClimate, 'bad');
        if (state.weight === 'driver') setVisual(sumWeight, iconWeight, 'good'); else setVisual(sumWeight, iconWeight, 'warn');
    } else {
        // === EXTENDED MODE VISUALS ===
        
        // Temperature/Season (используется блок Season)
        if (state.extTemp >= 20 && state.extTemp <= 25) setVisual(sumSeason, iconSeason, 'good'); 
        else if(state.extTemp < 5 || state.extTemp > 30) setVisual(sumSeason, iconSeason, 'bad');
        else setVisual(sumSeason, iconSeason, 'warn');

        // Speed/Mode (используется блок Mode)
        if (state.extSpeed <= 60) setVisual(sumMode, iconMode, 'good');
        else if (state.extSpeed > 110) setVisual(sumMode, iconMode, 'bad');
        else setVisual(sumMode, iconMode, 'warn');
        
        // Climate Pro (используется блок Climate)
        if (state.extClimateMode === 'off') setVisual(sumClimate, iconClimate, 'good');
        else if (state.extClimateMode === 'ac') setVisual(sumClimate, iconClimate, 'warn');
        else setVisual(sumClimate, iconClimate, 'bad'); 

        // Payload (используется блок Weight)
        if (state.extPayload > 200) setVisual(sumWeight, iconWeight, 'warn'); else setVisual(sumWeight, iconWeight, 'good');
        
        // Driving Mode (New Factor)
        if (state.enableExtMode) {
            if (state.extMode === 'eco') setVisual(sumModeExt, iconModeExt, 'good'); 
            else if (state.extMode === 'normal') setVisual(sumModeExt, iconModeExt, 'warn'); 
            else setVisual(sumModeExt, iconModeExt, 'bad');
        } else {
            setNeutralVisual(sumModeExt, iconModeExt);
        }
        
        // Wheel Size
        if (state.enableWheels) {
            if (state.extWheels <= 19) setVisual(sumWheels, iconWheels, 'good');
            else setVisual(sumWheels, iconWheels, 'warn');
        } else {
            setNeutralVisual(sumWheels, iconWheels);
        }
        
        // Wind
        if (state.enableWind) {
            if (state.extWind <= 0) setVisual(sumWind, iconWind, 'good');
            else if (state.extWind > 10) setVisual(sumWind, iconWind, 'bad');
            else setVisual(sumWind, iconWind, 'warn');
        } else {
            setNeutralVisual(sumWind, iconWind);
        }
        
        // Tire Pressure
        if (state.enableTires) {
            if (state.extTires === 2) setVisual(sumTires, iconTires, 'good');
            else if (state.extTires === 1) setVisual(sumTires, iconTires, 'warn');
            else setVisual(sumTires, iconTires, 'bad');
        } else {
            setNeutralVisual(sumTires, iconTires);
        }

        // Degradation
        if (state.enableDeg) {
            if (state.extDeg <= 5) setVisual(sumDeg, iconDeg, 'good');
            else setVisual(sumDeg, iconDeg, 'bad');
        } else {
            setNeutralVisual(sumDeg, iconDeg);
        }
    }
}

function updateRangeBackground(rangeInput) {
    const min = parseFloat(rangeInput.min) || 0;
    const max = parseFloat(rangeInput.max) || 100;
    const val = parseFloat(rangeInput.value) || 0;
    const percentage = ((val - min) / (max - min)) * 100;
    rangeInput.style.setProperty('--percent', percentage + '%');
}

function initAllSlidersVisuals() {
    const allSliders = document.querySelectorAll('input[type=range]');
    allSliders.forEach(slider => {
        updateRangeBackground(slider);
        slider.addEventListener('input', (e) => { updateRangeBackground(e.target); });
    });
}

// ==========================================
// 6. ЛОГИКА ЛОКАЛИЗАЦИИ
// ==========================================

/**
 * Устанавливает новый язык и обновляет UI.
 */
function setLanguage(newLang) {
    state.lang = newLang;
    const currentTranslations = translations[state.lang];

    // 1. Обновляем статус 'active' в меню
    languageOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.lang === newLang) {
            option.classList.add('active');
        }
    });
    
    // 2. Применяем переводы ко всем статическим элементам с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        // Переводим все, кроме placeholder'ов, которые обрабатываются отдельно
        if (currentTranslations[key] && element.getAttribute('data-i18n-placeholder') === null) {
            element.textContent = currentTranslations[key];
        }
    });
    
    // 3. Отдельно переводим placeholder для поиска
    const searchPlaceholderKey = carSearchInput.getAttribute('data-i18n-placeholder');
    if (searchPlaceholderKey && currentTranslations[searchPlaceholderKey]) {
        carSearchInput.placeholder = currentTranslations[searchPlaceholderKey];
    }
    
    // 4. Обновляем текст в триггере меню
    currentLanguageText.textContent = currentTranslations.language;

    // 5. Обновляем атрибут lang в <html>
    document.documentElement.lang = newLang;
    
    // 6. Запускаем updateUI, чтобы обновить все динамические тексты
    updateUI(); 
    
    // 7. Обновляем ползунки Pill Groups, так как их размер/положение могло измениться после смены текста
    document.querySelectorAll('.pill-group, #ext-climate-group').forEach(group => {
        const activeBtn = group.querySelector('.pill-btn.active') || group.querySelector('.climate-btn.active');
        if (activeBtn) updatePillSlider(group, activeBtn);
    });
}


// Utility functions
carSearchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    // Фильтруем автомобили по бренду или названию
    const filteredCars = allCars.filter(car => 
        car.name.toLowerCase().includes(searchTerm) || car.brand.toLowerCase().includes(searchTerm)
    );
    
    renderCarList(filteredCars);
});

carSearchInput.addEventListener('click', (e) => { e.stopPropagation(); });

/**
 * Рендерит список автомобилей, сгруппированный по брендам.
 * @param {Array} dataToRender - Отфильтрованный массив автомобилей.
 */
function renderCarList(dataToRender) {
    carListContainer.innerHTML = '';
    const t = translations[state.lang];

    if(dataToRender.length === 0) { 
        carListContainer.innerHTML = `<div style="padding:10px; color: #64748b; text-align:center;">${t.carSearchPlaceholder}</div>`; 
        return; 
    }
    
    // 1. Создаем временную Map для группировки отфильтрованных данных
    const groupedFilteredData = new Map();
    dataToRender.forEach(car => {
        if (!groupedFilteredData.has(car.brandId)) {
            // Копируем данные бренда из основной структуры
            groupedFilteredData.set(car.brandId, {
                name: car.brand,
                logo: car.logo,
                models: []
            });
        }
        // Убедимся, что car.brandId существует в Map, даже если car.brandId === null
        if(groupedFilteredData.has(car.brandId)) {
            groupedFilteredData.get(car.brandId).models.push(car);
        }
    });
    
    // 2. Сортируем по имени бренда (алфавитный порядок)
    const sortedBrandGroups = Array.from(groupedFilteredData.values()).sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    // 3. Рендерим группы
    sortedBrandGroups.forEach(brandGroup => {
        // Создаем заголовок группы (Brand Block)
        const brandHeader = document.createElement('div');
        brandHeader.className = 'car-brand-header';
        brandHeader.innerHTML = `
            <div class="brand-info">
                <img src="${brandGroup.logo}" alt="${brandGroup.name} Logo" class="brand-logo">
                <span class="brand-name">${brandGroup.name}</span>
            </div>
        `;
        carListContainer.appendChild(brandHeader);
        
        // Рендерим модели внутри группы
        // Сортируем модели по названию
        brandGroup.models.sort((a, b) => a.name.localeCompare(b.name));
        
        brandGroup.models.forEach(car => {
            const div = document.createElement('div'); 
            div.className = 'car-list-item';
            div.onclick = (e) => { e.stopPropagation(); selectCar(car.id); };
            
            // ИЗМЕНЕНИЕ: Убираем бренд из item, так как он есть в заголовке
            div.innerHTML = `<div class="car-item-left">
                                <div class="car-item-thumb"><img src="${car.img}" alt="${car.name}"></div>
                                <div style="font-weight: bold;">${car.name}</div>
                            </div>
                            <div class="car-item-specs">
                                <div><div style="font-size: 0.7rem; color: #64748b;">${t.maxRange}</div><div style="font-weight: bold;">${car.range}km</div></div>
                                <div><div style="font-size: 0.7rem; color: #64748b;">${t.currentBattery}</div><div style="font-weight: bold;">${car.battery}kWh</div></div>
                            </div>`;
            carListContainer.appendChild(div);
        });
    });
}


window.toggleCarMenu = function() {
    if (carDropdown.classList.contains('show')) { 
        carDropdown.classList.remove('show'); 
        carArrow.style.transform = 'rotate(0deg)'; 
        carSearchInput.value = ''; 
        // При закрытии восстанавливаем полный список для следующего открытия
        renderCarList(allCars); 
    } 
    else { 
        carDropdown.classList.add('show'); 
        carArrow.style.transform = 'rotate(180deg)'; 
        carSearchInput.focus(); 
    }
}
function selectCar(id) {
    // Ищем машину в объединенном массиве allCars
    const car = allCars.find(c => c.id === id); 
    if (!car) return;
    const t = translations[state.lang];

    // Используем car.brand, которое было добавлено в processCarData
    if (currentCarBrand) currentCarBrand.innerText = car.brand; 

    currentCarName.innerText = car.name; 
    currentCarImg.src = car.img; 
    currentCarRange.innerText = car.range; 
    currentCarBattery.innerText = car.battery;
    currentMaxRange = car.range; 
    currentCarWeight = car.weightKg || 2000; 
    
    if(footerMaxRange) footerMaxRange.innerText = car.range;
    
    if (carDropdown.classList.contains('show')) { toggleCarMenu(); }
    updateCalculation();
}
const customModal = document.getElementById('custom-car-modal');
const otherCarBtn = document.querySelector('.other-car-btn');
const inputRange = document.getElementById('custom-range');
const inputBattery = document.getElementById('custom-battery');
const inputWeight = document.getElementById('custom-weight');
if (otherCarBtn) { otherCarBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleCarMenu(); openCustomModal(); }); }
function openCustomModal() { 
    const t = translations[state.lang];
    customModal.style.display = 'flex'; 
    inputRange.value = ''; 
    inputBattery.value = ''; 
    inputWeight.value = ''; 
    inputRange.focus(); 
    
    // Обновляем тексты в модальном окне
    document.querySelector('.modal-content h3').textContent = t.modalTitle;
    document.querySelector('.input-group:nth-child(1) label').textContent = t.modalRangeLabel;
    document.querySelector('.input-group:nth-child(1) .input-wrapper span:first-child').textContent = t.modalWrite;
    document.querySelector('.input-group:nth-child(2) label').textContent = t.modalBatteryLabel;
    document.querySelector('.input-group:nth-child(2) .input-wrapper span:first-child').textContent = t.modalWrite;
    document.querySelector('.input-group:nth-child(3) label').textContent = t.modalWeightLabel;
    document.querySelector('.input-group:nth-child(3) .input-wrapper span:first-child').textContent = t.modalWrite;
    document.querySelector('.modal-btn.cancel').textContent = t.modalCancel;
    document.querySelector('.modal-btn.done').textContent = t.modalDone;

}
window.closeCustomModal = function() { customModal.style.display = 'none'; }
window.applyCustomCar = function() {
    const r = parseFloat(inputRange.value); const b = parseFloat(inputBattery.value); const w = parseFloat(inputWeight.value);
    const t = translations[state.lang];
    if (!r || !b || !w) { alert(state.lang === 'ru' ? "Пожалуйста, заполните все поля!" : "Please fill in all fields!"); return; }

    if (currentCarBrand) currentCarBrand.innerText = t.customBrand;

    currentCarName.innerText = t.customModel; currentCarRange.innerText = r; currentCarBattery.innerText = b; currentMaxRange = r; currentCarWeight = w;
    if(footerMaxRange) footerMaxRange.innerText = r; updateCalculation(); closeCustomModal();
}
customModal.addEventListener('click', (e) => { if (e.target === customModal) { closeCustomModal(); } });
function animateValue(obj, start, end, duration) {
    if (start === end) return; let startTimestamp = null;
    const step = (timestamp) => { if (!startTimestamp) startTimestamp = timestamp; const progress = Math.min((timestamp - startTimestamp) / duration, 1); obj.innerHTML = Math.floor(progress * (end - start) + start); if (progress < 1) { window.requestAnimationFrame(step); } };
    window.requestAnimationFrame(step);
}
function capitalize(s) { return s && s[0].toUpperCase() + s.slice(1); }
function initStarfield() {
    const canvas = document.getElementById('starfield'); if (!canvas) return;
    const ctx = canvas.getContext('2d'); let stars = []; const numStars = 150; const starSpeed = 0.2; 
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; stars = []; for (let i = 0; i < numStars; i++) { stars.push(new Star()); } }
    class Star { constructor() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.radius = Math.random() * 1.5; this.alpha = Math.random(); this.velocity = { x: (Math.random() - 0.5) * starSpeed, y: (Math.random() - 0.5) * starSpeed }; } draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`; ctx.fill(); } update() { this.x += this.velocity.x; this.y += this.velocity.y; if (this.x < 0 || this.x > canvas.width) this.x = Math.random() * canvas.width; if (this.y < 0 || this.y > canvas.height) this.y = Math.random() * canvas.height; this.alpha += (Math.random() - 0.5) * 0.01; if (this.alpha > 1) this.alpha = 1; if (this.alpha < 0.1) this.alpha = 0.1; } }
    function animate() { requestAnimationFrame(animate); ctx.clearRect(0, 0, canvas.width, canvas.height); stars.forEach(star => { star.update(); star.draw(); }); }
    resizeCanvas(); animate(); window.addEventListener('resize', resizeCanvas);
}