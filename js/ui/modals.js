// Кастомный автомобиль

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