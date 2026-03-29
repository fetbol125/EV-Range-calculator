// Кастомный автомобиль

let pendingModelConfigCarId = null;

/**
 * Открывает модальное окно для ввода кастомного автомобиля
 */
function openCustomModal() { 
    const t = translations[state.lang];
    customModal.style.display = 'flex'; 
    inputRange.value = ''; 
    inputBattery.value = ''; 
    inputWeight.value = ''; 
    inputRange.focus(); 
    
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

/**
 * Закрывает модальное окно кастомного авто
 */
window.closeCustomModal = function() { 
    customModal.style.display = 'none'; 
}

/**
 * Применяет параметры кастомного автомобиля
 */
window.applyCustomCar = function() {
    const r = parseFloat(inputRange.value); 
    const b = parseFloat(inputBattery.value); 
    const w = parseFloat(inputWeight.value);
    const t = translations[state.lang];
    
    if (!r || !b || !w) { 
        alert(state.lang === 'ru' ? "Пожалуйста, заполните все поля!" : "Please fill in all fields!"); 
        return; 
    }

    if (currentCarBrand) currentCarBrand.innerText = t.customBrand;

    currentCarName.innerText = t.customModel;
    
    // Замена изображения машины на иконку вопроса для custom car
    setCarThumbIcon();
    
    currentCarRange.innerText = r; 
    currentCarBattery.innerText = b; 
    currentMaxRange = r; 
    currentCarWeight = w;
    
    if(footerMaxRange) footerMaxRange.innerText = r; 
    updateCalculation(); 
    closeCustomModal();
}

/**
 * Открывает модальное окно с детальной информацией об автомобиле
 */
function openInfoCarModal() {
    const currentCarNameText = currentCarName.innerText;
    const t = translations[state.lang];
    
    if (currentCarNameText === t.customModel) {
        alert(state.lang === 'ru' 
            ? "Информация недоступна для пользовательских автомобилей" 
            : "Information not available for custom cars");
        return;
    }
    
    const car = allCars.find(c => c.name === currentCarNameText);
    if (!car) {
        alert(state.lang === 'ru' ? "Машина не найдена" : "Car not found");
        return;
    }
    
    currentSelectedCarId = car.id;
    
    document.getElementById('info-car-logo').src = car.logo || '';
    document.getElementById('info-car-name').innerText = car.name;
    document.getElementById('info-car-brand').innerText = car.brand;
    document.getElementById('info-car-range').innerText = car.range + ' km';
    document.getElementById('info-car-battery').innerText = car.battery + ' kWh';
    document.getElementById('info-car-weight').innerText = car.weightKg + ' kg';
    
    document.getElementById('info-car-power').innerText = car.power || 'N/A';
    document.getElementById('info-car-acceleration').innerText = car.acceleration || 'N/A';
    document.getElementById('info-car-topspeed').innerText = car.topSpeed || 'N/A';
    document.getElementById('info-car-charging').innerText = car.charging || 'N/A';
    document.getElementById('info-car-drivetype').innerText = car.driveType || 'N/A';
    document.getElementById('info-car-seats').innerText = car.seats || 'N/A';
    document.getElementById('info-car-year').innerText = car.year || 'N/A';
    
    infoCarModal.style.display = 'flex';
}

/**
 * Закрывает модальное окно информации об авто
 */
window.closeInfoCarModal = function() {
    infoCarModal.style.display = 'none';
}

/**
 * Нормализует имя модели для поиска похожих конфигураций
 * @param {string} modelName - Имя модели
 * @returns {string}
 */
function normalizeModelName(modelName) {
    return (modelName || '')
        .toLowerCase()
        .replace(/\b(quattro|performance|long range|standard range|plaid|ultimate|premium|sport|pro|awd|rwd)\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Находит варианты одной модели в рамках бренда
 * @param {Object} baseCar - Базовый автомобиль
 * @returns {Array}
 */
function getModelVariants(baseCar) {
    if (!baseCar) {
        return [];
    }

    const exactMatches = allCars.filter(car => {
        return car.brandId === baseCar.brandId && car.name.toLowerCase() === baseCar.name.toLowerCase();
    });

    if (exactMatches.length > 0) {
        return exactMatches;
    }

    const normalizedBaseName = normalizeModelName(baseCar.name);
    const relatedMatches = allCars.filter(car => {
        return car.brandId === baseCar.brandId && normalizeModelName(car.name) === normalizedBaseName;
    });

    return relatedMatches.length > 0 ? relatedMatches : [baseCar];
}

/**
 * Возвращает числовой вес года для сортировки
 * @param {string} yearLabel - Текст года (например 2025+ или 2021-2024)
 * @returns {number}
 */
function getYearSortValue(yearLabel) {
    if (!yearLabel) {
        return 0;
    }

    const years = String(yearLabel).match(/\d{4}/g);
    if (!years || years.length === 0) {
        return 0;
    }

    return parseInt(years[years.length - 1], 10) || 0;
}

/**
 * Рендерит список вариантов модели, сгруппированный по годам
 * @param {Array} variants - Доступные варианты модели
 */
function renderModelVariants(variants) {
    if (!modelDetailsVariants) {
        return;
    }

    modelDetailsVariants.innerHTML = '';

    const yearGroups = new Map();
    variants.forEach(variant => {
        const yearLabel = variant.year || 'N/A';
        if (!yearGroups.has(yearLabel)) {
            yearGroups.set(yearLabel, []);
        }
        yearGroups.get(yearLabel).push(variant);
    });

    const sortedYears = Array.from(yearGroups.keys()).sort((a, b) => getYearSortValue(b) - getYearSortValue(a));

    sortedYears.forEach(yearLabel => {
        const yearTitle = document.createElement('div');
        yearTitle.className = 'model-variants-year';
        yearTitle.textContent = yearLabel;
        modelDetailsVariants.appendChild(yearTitle);

        yearGroups.get(yearLabel).forEach(variant => {
            const item = document.createElement('div');
            item.className = 'model-variant-item';

            const batteryText = typeof variant.battery === 'number' ? `${variant.battery} kWh` : 'N/A';
            const specText = `${variant.driveType || 'N/A'} • ${batteryText}`;
            const variantTitle = variant.trim || variant.name;

            item.innerHTML = `
                <div class="model-variant-main">
                    <div class="model-variant-name">${variantTitle}</div>
                    <div class="model-variant-spec">${specText}</div>
                </div>
                <div class="model-variant-actions">
                    <button type="button" class="model-variant-select" aria-label="Select ${variant.name}">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            `;

            const selectBtn = item.querySelector('.model-variant-select');
            if (selectBtn) {
                selectBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.openModelConfigModal(variant.id);
                });
            }

            item.addEventListener('click', () => {
                window.openModelConfigModal(variant.id);
            });

            modelDetailsVariants.appendChild(item);
        });
    });
}

/**
 * Открывает модальное окно с детальным выбором модели
 * @param {string} carId - ID автомобиля
 */
window.openModelDetailsModal = function(carId) {
    const selectedCar = allCars.find(car => car.id === carId);
    if (!selectedCar || !modelDetailsModal) {
        return;
    }

    if (carDropdown && carDropdown.classList.contains('show')) {
        toggleCarMenu();
    }

    const variants = getModelVariants(selectedCar).sort((a, b) => {
        return getYearSortValue(b.year) - getYearSortValue(a.year);
    });

    const brandLogo = document.getElementById('model-details-brand-logo');
    const brandName = document.getElementById('model-details-brand-name');
    const modelName = document.getElementById('model-details-model-name');

    if (brandLogo) {
        const logoWrap = document.querySelector('.model-details-logo-wrap');
        const logoPlaceholder = document.getElementById('model-details-logo-placeholder');
        
        // Сначала проверяем, есть ли логотип
        if (!selectedCar.logo || !selectedCar.logo.trim()) {
            // Нету логотипа - показываем иконку
            if (logoPlaceholder) logoPlaceholder.classList.add('show');
            brandLogo.style.display = 'none';
            brandLogo.src = '';
        } else {
            // Есть логотип - пытаемся загрузить
            brandLogo.src = selectedCar.logo;
            brandLogo.alt = `${selectedCar.brand} Logo`;
            
            // Если логотип загружается успешно
            brandLogo.onload = function() {
                if (logoPlaceholder) logoPlaceholder.classList.remove('show');
                brandLogo.style.display = 'block';
            };
            
            // Если логотип не загружается
            brandLogo.onerror = function() {
                if (logoPlaceholder) logoPlaceholder.classList.add('show');
                brandLogo.style.display = 'none';
            };
            
            // Проверяем кеш браузера - если изображение уже загружено
            if (brandLogo.complete) {
                brandLogo.onload();
            }
        }
    }

    if (brandName) {
        brandName.textContent = selectedCar.brand;
    }

    if (modelName) {
        modelName.textContent = selectedCar.name;
    }

    renderModelVariants(variants);
    modelDetailsModal.style.display = 'flex';
}

/**
 * Закрывает модальное окно детального выбора модели
 */
window.closeModelDetailsModal = function() {
    if (!modelDetailsModal) {
        return;
    }
    modelDetailsModal.style.display = 'none';
};

/**
 * Открывает карточку выбранной модификации авто
 * @param {string} carId - ID автомобиля
 */
window.openModelConfigModal = function(carId) {
    const car = allCars.find(item => item.id === carId);
    if (!car || !modelConfigModal) {
        return;
    }

    pendingModelConfigCarId = car.id;

    const configImage = document.getElementById('model-config-image');
    const configLogo = document.getElementById('model-config-logo');
    const configBrand = document.getElementById('model-config-brand');
    const configModel = document.getElementById('model-config-model');
    const configYear = document.getElementById('model-config-year');
    const configBattery = document.getElementById('model-config-battery');
    const configPower = document.getElementById('model-config-power');
    const configWeight = document.getElementById('model-config-weight');
    const configDrive = document.getElementById('model-config-drive');
    const configAcceleration = document.getElementById('model-config-acceleration');
    const configTopSpeed = document.getElementById('model-config-topspeed');
    const configRange = document.getElementById('model-config-range');
    const configCharging = document.getElementById('model-config-charging');
    const configSeats = document.getElementById('model-config-seats');

    if (configImage) {
        const imageWrap = document.querySelector('.model-config-image-wrap');
        const placeholder = document.getElementById('model-config-image-placeholder');
        
        // Сначала проверяем, есть ли изображение
        if (!car.img || !car.img.trim()) {
            // Нету изображения - показываем иконку
            if (imageWrap) imageWrap.classList.add('no-image');
            if (placeholder) placeholder.classList.add('show');
            configImage.style.display = 'none';
            configImage.src = '';
        } else {
            // Есть изображение - пытаемся загрузить
            configImage.src = car.img;
            configImage.alt = `${car.brand} ${car.name}`;
            
            // Если изображение загружается успешно
            configImage.onload = function() {
                if (imageWrap) imageWrap.classList.remove('no-image');
                if (placeholder) placeholder.classList.remove('show');
                configImage.style.display = 'block';
            };
            
            // Если изображение не загружается
            configImage.onerror = function() {
                if (imageWrap) imageWrap.classList.add('no-image');
                if (placeholder) placeholder.classList.add('show');
                configImage.style.display = 'none';
            };
            
            // Проверяем кеш браузера - если изображение уже загружено
            if (configImage.complete) {
                configImage.onload();
            }
        }
    }

    if (configLogo) {
        configLogo.src = car.logo || '';
        configLogo.alt = `${car.brand} Logo`;
    }

    if (configBrand) {
        configBrand.textContent = car.brand || 'Brand';
    }

    if (configModel) {
        configModel.textContent = `${car.name}${car.trim ? ' ' + car.trim : ''}`;
    }

    if (configYear) {
        configYear.textContent = car.year || 'N/A';
    }

    if (configBattery) {
        configBattery.textContent = `${car.battery || 'N/A'} kWh`;
    }

    if (configPower) {
        configPower.textContent = car.power || 'N/A';
    }

    if (configWeight) {
        configWeight.textContent = car.weightKg ? `${car.weightKg} kg` : 'N/A';
    }

    if (configDrive) {
        configDrive.textContent = car.driveType || 'N/A';
    }

    if (configAcceleration) {
        configAcceleration.textContent = car.acceleration || 'N/A';
    }

    if (configTopSpeed) {
        configTopSpeed.textContent = car.topSpeed || 'N/A';
    }

    if (configRange) {
        configRange.textContent = `${car.range || 'N/A'} km`;
    }

    if (configCharging) {
        configCharging.textContent = car.charging || 'N/A';
    }

    if (configSeats) {
        configSeats.textContent = car.seats || 'N/A';
    }

    modelConfigModal.style.display = 'flex';
};

/**
 * Закрывает карточку выбранной модификации
 */
window.closeModelConfigModal = function() {
    if (!modelConfigModal) {
        return;
    }
    modelConfigModal.style.display = 'none';
};

/**
 * Подтверждает выбор модификации и применяет авто
 */
window.applyModelConfigSelection = function() {
    if (!pendingModelConfigCarId) {
        return;
    }

    if (typeof selectCar === 'function') {
        selectCar(pendingModelConfigCarId);
    }

    pendingModelConfigCarId = null;
    closeModelConfigModal();
    closeModelDetailsModal();
};

/**
 * Открывает модальное окно How It Works
 */
window.openHowItWorksModal = function() {
    const howItWorksModal = document.getElementById('how-it-works-modal');
    if (!howItWorksModal) return;

    howItWorksModal.style.display = 'flex';
    resetHowItWorksSelection(howItWorksModal);
    closeHowItemInfoModal();
}

/**
 * Закрывает модальное окно How It Works
 */
window.closeHowItWorksModal = function() {
    const howItWorksModal = document.getElementById('how-it-works-modal');
    if (!howItWorksModal) return;
    howItWorksModal.style.display = 'none';
    resetHowItWorksSelection(howItWorksModal);
    closeHowItemInfoModal();
}

/**
 * Сбрасывает активные элементы в модальном окне How It Works
 */
function resetHowItWorksSelection(howItWorksModal) {
    howItWorksModal.querySelectorAll('.how-item.active').forEach(item => {
        item.classList.remove('active');
    });
}

/**
 * Открывает модальное окно детальной карточки выбранного элемента
 */
window.openHowItemInfoModal = function(title, description, iconClass) {
    const itemInfoModal = document.getElementById('how-item-info-modal');
    const itemInfoIcon = document.getElementById('how-item-info-icon');
    const itemInfoTitle = document.getElementById('how-item-info-title');
    const itemInfoDescription = document.getElementById('how-item-info-description');

    if (!itemInfoModal || !itemInfoIcon || !itemInfoTitle || !itemInfoDescription) return;

    itemInfoTitle.textContent = title || 'Details';
    itemInfoDescription.textContent = description || '';
    itemInfoIcon.className = iconClass || 'fa-solid fa-circle-info';

    itemInfoModal.style.display = 'flex';
}

/**
 * Закрывает модальное окно детальной карточки How It Works
 */
window.closeHowItemInfoModal = function() {
    const itemInfoModal = document.getElementById('how-item-info-modal');
    if (!itemInfoModal) return;
    itemInfoModal.style.display = 'none';
}

/**
 * Инициализирует переключатель режимов в модальном окне How It Works
 */
function initHowFactorsModeToggle(howItWorksModal) {
    const modeButtons = howItWorksModal.querySelectorAll('.how-mode-btn');
    const factorsContainers = howItWorksModal.querySelectorAll('.how-factors-container');

    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetMode = btn.getAttribute('data-mode');

            // Обновляем активные кнопки
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Показываем/скрываем соответствующие контейнеры факторов
            factorsContainers.forEach(container => {
                const containerMode = container.getAttribute('data-mode');
                if (containerMode === targetMode) {
                    container.style.display = 'flex';
                } else {
                    container.style.display = 'none';
                }
            });

            // Сбрасываем активные элементы и закрываем детальную карточку
            resetHowItWorksSelection(howItWorksModal);
            closeHowItemInfoModal();
        });
    });
}

/**
 * Инициализирует карточки в модальном окне How It Works
 */
function initHowItWorksCards(howItWorksModal) {
    const toggles = howItWorksModal.querySelectorAll('.how-item-toggle');

    const itemInfoModal = document.getElementById('how-item-info-modal');
    const closeItemInfoBtn = itemInfoModal ? itemInfoModal.querySelector('.how-item-info-close') : null;

    if (itemInfoModal) {
        itemInfoModal.addEventListener('click', (e) => {
            if (e.target === itemInfoModal) {
                closeHowItemInfoModal();
                resetHowItWorksSelection(howItWorksModal);
            }
        });
    }

    if (closeItemInfoBtn) {
        closeItemInfoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeHowItemInfoModal();
            resetHowItWorksSelection(howItWorksModal);
        });
    }

    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const item = toggle.closest('.how-item');
            if (!item) return;

            const sourceIcon = item.querySelector('.how-item-toggle span i');
            const sourceTitle = item.querySelector('.how-item-toggle span');
            const sourceText = item.querySelector('.how-item-content');

            const title = sourceTitle ? sourceTitle.textContent.trim() : 'Details';
            const description = sourceText ? sourceText.textContent.trim() : '';
            const iconClass = sourceIcon ? sourceIcon.className : 'fa-solid fa-circle-info';

            resetHowItWorksSelection(howItWorksModal);
            item.classList.add('active');

            openHowItemInfoModal(title, description, iconClass);
        });
    });
}

/**
 * Инициализирует обработчики для модальных окон
 */
function initModals() {
    if (otherCarBtn) { 
        otherCarBtn.addEventListener('click', (e) => { 
            e.stopPropagation(); 
            toggleCarMenu(); 
            openCustomModal(); 
        }); 
    }

    if (infoCarBtn) {
        infoCarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openInfoCarModal();
        });
    }

    if (customModal) {
        customModal.addEventListener('click', (e) => { 
            if (e.target === customModal) { 
                closeCustomModal(); 
            } 
        });
    }

    if (infoCarModal) {
        infoCarModal.addEventListener('click', (e) => {
            if (e.target === infoCarModal) {
                e.stopPropagation();
                closeInfoCarModal();
            }
        });

        // Обработчик для кнопки закрытия
        const closeButton = infoCarModal.querySelector('.modal-close-btn');
        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                closeInfoCarModal();
            });
        }
    }

    if (modelDetailsModal) {
        modelDetailsModal.addEventListener('click', (e) => {
            if (e.target === modelDetailsModal) {
                closeModelDetailsModal();
            }
        });
    }

    if (modelDetailsCloseBtn) {
        modelDetailsCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModelDetailsModal();
        });
    }

    if (modelConfigModal) {
        modelConfigModal.addEventListener('click', (e) => {
            if (e.target === modelConfigModal) {
                closeModelConfigModal();
            }
        });
    }

    if (modelConfigCloseBtn) {
        modelConfigCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModelConfigModal();
        });
    }

    if (modelConfigChooseBtn) {
        modelConfigChooseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            applyModelConfigSelection();
        });
    }

    const howItWorksBtn = document.getElementById('how-it-works-btn');
    const howItWorksModal = document.getElementById('how-it-works-modal');

    if (howItWorksBtn && howItWorksModal) {
        howItWorksBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openHowItWorksModal();
        });

        howItWorksModal.addEventListener('click', (e) => {
            if (e.target === howItWorksModal) {
                closeHowItWorksModal();
            }
        });

        const closeHowItWorksBtn = howItWorksModal.querySelector('.how-it-works-close');
        if (closeHowItWorksBtn) {
            closeHowItWorksBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeHowItWorksModal();
            });
        }

        initHowFactorsModeToggle(howItWorksModal);
        initHowItWorksCards(howItWorksModal);
    }
}
// Контакты

/**
 * Открывает модальное окно Info
 */
window.openInfoModal = function() {
    const infoModal = document.getElementById('info-modal');
    if (infoModal) {
        infoModal.style.display = 'flex';
    }
}

/**
 * Закрывает модальное окно Info
 */
window.closeInfoModal = function() {
    const infoModal = document.getElementById('info-modal');
    if (infoModal) {
        infoModal.style.display = 'none';
    }
}

/**
 * Открывает модальное окно с контактами
 */
window.openContactsModal = function() {
    const contactsModal = document.getElementById('contacts-modal');
    if (contactsModal) {
        contactsModal.style.display = 'flex';
    }
}

/**
 * Закрывает модальное окно с контактами
 */
window.closeContactsModal = function() {
    const contactsModal = document.getElementById('contacts-modal');
    if (contactsModal) {
        contactsModal.style.display = 'none';
    }
}

// Закрытие модали при клике на фон
document.addEventListener('DOMContentLoaded', function() {
    const infoModal = document.getElementById('info-modal');
    if (infoModal) {
        infoModal.addEventListener('click', function(e) {
            if (e.target === infoModal) {
                closeInfoModal();
            }
        });
    }

    const contactsModal = document.getElementById('contacts-modal');
    if (contactsModal) {
        contactsModal.addEventListener('click', function(e) {
            if (e.target === contactsModal) {
                closeContactsModal();
            }
        });
    }
});