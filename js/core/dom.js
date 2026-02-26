// DOM элементы

// Gauge и индикаторы
const rangeDisplay = document.getElementById('range-display');
const gaugeFill = document.getElementById('gauge-fill');
const batteryIcon = document.getElementById('battery-icon');
const gaugeStatus = document.querySelector('.gauge-status');
const slider = document.getElementById('battery-slider');
const sliderValDisplay = document.getElementById('slider-val-display');

// Consumption gauge элементы
const consumptionGauge = document.getElementById('consumption-gauge');
const consumptionDisplay = document.getElementById('consumption-display');
const consumptionStatus = document.getElementById('consumption-status');

// Footer/Sidebar элементы
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

// Элементы для Extended Mode
const sumModeExt = document.getElementById('summary-mode-ext');
const iconModeExt = document.getElementById('icon-mode-ext');

// Energy Consumers elements
const sumEnergyConsumers = document.getElementById('summary-energy-consumers');
const iconEnergyConsumers = document.getElementById('icon-energy-consumers');

// Элементы выбора автомобиля
const currentCarName = document.getElementById('current-car-name');
const currentCarImg = document.getElementById('current-car-img');
const currentCarRange = document.getElementById('current-car-range');
const currentCarBattery = document.getElementById('current-car-battery');
const currentCarBrand = document.getElementById('current-car-brand');
const carDropdown = document.getElementById('car-dropdown');
const carListContainer = document.getElementById('car-list-container');
const carArrow = document.getElementById('car-arrow');
const carSearchInput = document.getElementById('car-search-input');
const allBrandsBtn = document.getElementById('all-brands-btn');

// Переключатель режимов
const modeToggleInputs = document.querySelectorAll('.mode-toggle input[name="rangeMode"]');
const modeToggleContainer = document.querySelector('.mode-toggle');

// Элементы языкового меню
const languageTrigger = document.getElementById('language-switcher-trigger');
const languageMenu = document.getElementById('language-menu');
const languageOptions = document.querySelectorAll('.language-option');
const currentLanguageText = document.getElementById('current-language-text');

// Energy Consumers Dropdown elements
const energyConsumersTrigger = document.getElementById('energy-consumers-trigger');
const energyConsumersMenu = document.getElementById('energy-consumers-menu');
const energyConsumersDropdown = document.getElementById('energy-consumers-dropdown');

// Wheels Dropdown elements
const wheelsTrigger = document.getElementById('wheels-trigger');
const wheelsMenu = document.getElementById('wheels-menu');
const wheelsDropdown = document.getElementById('wheels-dropdown');

// Модальные окна
const customModal = document.getElementById('custom-car-modal');
const infoCarModal = document.getElementById('info-car-modal');
const otherCarBtn = document.querySelector('.other-car-btn');
const infoCarBtn = document.getElementById('info-car-btn');

// Поля ввода кастомного авто
const inputRange = document.getElementById('custom-range');
const inputBattery = document.getElementById('custom-battery');
const inputWeight = document.getElementById('custom-weight');
