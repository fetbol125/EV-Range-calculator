// Главный файл инициализации приложения

document.addEventListener('DOMContentLoaded', () => {
    // Обработка данных автомобилей и брендов
    if (typeof carsData !== 'undefined' && typeof brandsData !== 'undefined') {
        processCarData();
    }

    // Инициализация фона
    initStarfield();
    
    // Инициализация gauge
    if(gaugeFill) gaugeFill.style.strokeDasharray = CIRCUMFERENCE;

    // Инициализация списка автомобилей
    if (allCars.length > 0) {
        renderCarList(allCars);
        selectCar(allCars[0].id);
    }

    // Инициализация различных компонентов
    initExtendedListeners();
    initAllSlidersVisuals();
    initPillGroups();
    initBatterySlider();
    initModeToggle();
    initLanguageMenu();
    initCarMenuHandlers();
    initCarSearch();
    initEnergyConsumersDropdown();
    initWheelsDropdown();
    initModals();
    
    // Установка начального режима
    toggleControlMode(state.rangeType); 
    toggleConsumptionDisplay(state.rangeType === 'extended');
    if (state.rangeType === 'extended') {
        modeToggleContainer.classList.add('extended-active');
    }
    
    // Установка начального языка
    setLanguage(state.lang); 
    
    // Первичное обновление UI после загрузки картинки машины
    if (currentCarImg.complete) {
        // Если картинка уже в кэше браузера
        updateUI();
        updateBatteryThermalStatus();
    } else {
        // Ждём загрузки картинки
        currentCarImg.onload = () => {
            updateUI();
            updateBatteryThermalStatus();
        };
        currentCarImg.onerror = () => {
            updateUI();
            updateBatteryThermalStatus();
        };
    }
});
