// Главный файл инициализации приложения

document.addEventListener('DOMContentLoaded', async () => {
    // Инициализируем оболочку сразу, не дожидаясь подгрузки каталога автомобилей.
    initStarfield();

    if(gaugeFill) gaugeFill.style.strokeDasharray = CIRCUMFERENCE;

    initExtendedListeners();
    initAllSlidersVisuals();
    initPillGroups();
    initBatterySlider();
    initModeToggle();
    initLanguageMenu();
    initCarMenuHandlers();
    initCarSearch();
    initEnergyConsumersDropdown();
    initWeatherDropdown();
    initWheelsDropdown();
    initModals();

    toggleControlMode(state.rangeType);
    toggleConsumptionDisplay(state.rangeType === 'extended');
    if (state.rangeType === 'extended') {
        modeToggleContainer.classList.add('extended-active');
    }

    setLanguage(state.lang);

    try {
        if (window.carCatalogPromise) {
            await window.carCatalogPromise;
        }
    } catch (error) {
        console.error('Failed to load car catalog:', error);
    }

    // Обработка данных автомобилей и брендов
    if (typeof carsData !== 'undefined' && typeof brandsData !== 'undefined') {
        processCarData();
    }

    // Инициализация списка автомобилей
    if (allCars.length > 0) {
        renderCarList(allCars);
        setNoCarSelectedState();
    }
    
    // Первичное обновление UI после загрузки картинки машины
    if (currentCarImg.complete) {
        // Если картинка уже в кэше браузера
        updateUI();
        updateBatteryThermalStatus();
        updateWeatherValue();
    } else {
        // Ждём загрузки картинки
        currentCarImg.onload = () => {
            updateUI();
            updateBatteryThermalStatus();
            updateWeatherValue();
        };
        currentCarImg.onerror = () => {
            updateUI();
            updateBatteryThermalStatus();
            updateWeatherValue();
        };
    }
});
