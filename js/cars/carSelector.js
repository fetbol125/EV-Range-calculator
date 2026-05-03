// Логика выбора автомобиля

let expandedBrandIds = new Set(); // Набор раскрытых брендов в списке
let currentCarSearchTerm = ''; // Текущее значение поиска по марке/модели

/**
 * Устанавливает иконку знака вопроса в thumb машины вместо изображения
 */
function setCarThumbIcon() {
    const carThumb = document.querySelector('.car-thumb');
    if (carThumb) {
        carThumb.innerHTML = '<i class="fa-solid fa-circle-question" style="font-size: 36px; color: var(--accent); display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;"></i>';
    }
}

/**
 * Устанавливает пустое состояние плашки выбора автомобиля
 */
function setNoCarSelectedState() {
    const carBlock = document.querySelector('.car-block');
    const currentImg = document.getElementById('current-car-img');
    const infoCarBtn = document.getElementById('info-car-btn');
    const t = translations[state.lang];

    currentSelectedCarId = null;

    if (carBlock) {
        carBlock.classList.add('no-car-selected');
    }

    if (currentCarBrand) {
        currentCarBrand.innerText = '';
    }

    if (currentCarName) {
        currentCarName.innerText = t.chooseAutomobile || 'choose a car';
    }

    if (currentCarRange) {
        currentCarRange.innerText = '--';
    }

    if (currentCarBattery) {
        currentCarBattery.innerText = '--';
    }

    if (footerMaxRange) {
        footerMaxRange.innerText = '--';
    }

    if (currentImg) {
        currentImg.style.display = 'none';
        currentImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    }

    if (infoCarBtn) {
        infoCarBtn.disabled = true;
    }
}

/**
 * Восстанавливает изображение машины в thumb (удаляет иконку)
 */
function restoreCarThumbImage() {
    const carThumb = document.querySelector('.car-thumb');
    if (carThumb) {
        carThumb.innerHTML = '<img id="current-car-img" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" alt="" aria-hidden="true" style="display:none;">';
    }
}

/**
 * Переключает видимость выпадающего меню выбора автомобиля
 */
window.toggleCarMenu = function() {
    if (carDropdown.classList.contains('show')) { 
        carDropdown.classList.remove('show'); 
        carArrow.style.transform = 'rotate(0deg)'; 
        carSearchInput.value = ''; 
        currentCarSearchTerm = '';
        expandedBrandIds.clear();
        renderCarList(allCars); 
    } else { 
        carDropdown.classList.add('show'); 
        carArrow.style.transform = 'rotate(180deg)'; 
        carSearchInput.focus(); 
    }
}

/**
 * Выбирает автомобиль по ID
 * @param {string} id - ID автомобиля
 */
function selectCar(id) {
    const car = allCars.find(c => c.id === id); 
    if (!car) return;
    const t = translations[state.lang];
    const carBlock = document.querySelector('.car-block');
    const infoCarBtn = document.getElementById('info-car-btn');

    currentSelectedCarId = id;

    if (carBlock) {
        carBlock.classList.remove('no-car-selected');
    }

    if (infoCarBtn) {
        infoCarBtn.disabled = false;
    }

    if (currentCarBrand) currentCarBrand.innerText = car.brand; 

    currentCarName.innerText = car.name;
    
    // Если вместо img сейчас стоит иконка (custom car), восстанавливаем img элемент
    const carThumb = document.querySelector('.car-thumb');
    if (carThumb && carThumb.querySelector('i')) {
        restoreCarThumbImage();
    }
    
    // Получаем img элемент по id (может быть новый если только что восстановили)
    const currentImg = document.getElementById('current-car-img');
    if (currentImg) {
        // Скрываем превью до полной загрузки, чтобы не было "кривого" кадра при первом рендере
        currentImg.style.display = 'none';
        currentImg.dataset.usingFallback = 'false';

        const onImageLoaded = () => {
            currentImg.style.display = 'block';
        };

        const onImageError = () => {
            if (currentImg.dataset.usingFallback !== 'true') {
                currentImg.dataset.usingFallback = 'true';
                currentImg.src = EMPTY_CAR_IMAGE;
                return;
            }

            setCarThumbIcon();
        };

        currentImg.addEventListener('load', onImageLoaded, { once: true });
        currentImg.addEventListener('error', onImageError, { once: true });

        const imageSrc = getCarImageSrc(car);
        currentImg.dataset.usingFallback = imageSrc === EMPTY_CAR_IMAGE ? 'true' : 'false';
        currentImg.src = imageSrc;

        if (currentImg.complete && currentImg.naturalWidth > 0) {
            currentImg.style.display = 'block';
        }
    }
    
    currentCarRange.innerText = car.range; 
    currentCarBattery.innerText = car.battery;
    currentMaxRange = car.range; 
    currentCarWeight = car.weightKg || 2000;
    
    // Извлекаем мощность в kW из строки вида "150 kW (204 HP)"
    const powerMatch = car.power.match(/(\d+)\s*kW/);
    currentCarPower = powerMatch ? parseInt(powerMatch[1]) : 150;
    
    // Извлекаем данные об аэродинамике и типе привода
    currentCarDrag = car.dragCoefficient || 0.28;
    currentCarDriveType = car.driveType || 'RWD';
    currentCarBatteryCapacity = car.battery || 77;
    
    // Извлекаем макс скорость из строки вида "250 km/h" и обновляем слайдер
    if (car.topSpeed) {
        const speedMatch = car.topSpeed.match(/(\d+)/);
        if (speedMatch) {
            currentMaxSpeed = parseInt(speedMatch[1]);
            const speedSlider = document.getElementById('speed-slider');
            if (speedSlider) {
                speedSlider.max = currentMaxSpeed;
                // Если текущая скорость больше новой максимальной, устанавливаем новую максимальную
                if (parseInt(speedSlider.value) > currentMaxSpeed) {
                    speedSlider.value = currentMaxSpeed;
                    state.extSpeed = currentMaxSpeed;
                    document.getElementById('val-speed').innerText = currentMaxSpeed + ' km/h';
                }
                updateRangeBackground(speedSlider);
            }
        }
    }
    
    if(footerMaxRange) footerMaxRange.innerText = car.range;
    
    if (carDropdown.classList.contains('show')) { 
        toggleCarMenu(); 
    }
    updateCalculation();
}

/**
 * Рендерит список автомобилей, сгруппированный по брендам
 * @param {Array} dataToRender - Массив автомобилей для отображения
 */
function renderCarList(dataToRender) {
    carListContainer.innerHTML = '';
    const filteredCars = getFilteredCarsBySearch(dataToRender, currentCarSearchTerm);
    const groupedCars = getGroupedCars(filteredCars);

    if (groupedCars.length === 0) {
        const t = translations[state.lang];
        carListContainer.innerHTML = `<div style="padding:10px; color: #64748b; text-align:center;">${t.carSearchPlaceholder}</div>`; 
        return; 
    }

    const isSearchActive = currentCarSearchTerm.trim().length > 0;
    if (isSearchActive) {
        groupedCars.forEach(brandGroup => expandedBrandIds.add(brandGroup.id));
    }

    groupedCars.forEach(brandGroup => {
        const uniqueModels = getUniqueModelsByName(brandGroup.models);
        const isExpanded = expandedBrandIds.has(brandGroup.id);
        const brandSection = document.createElement('div');
        brandSection.className = 'brand-section';

        const brandToggle = document.createElement('button');
        brandToggle.type = 'button';
        brandToggle.className = `car-brand-toggle${isExpanded ? ' expanded' : ''}`;
        brandToggle.innerHTML = `
            <div class="brand-info">
                <img src="${brandGroup.logo}" alt="${brandGroup.name} Logo" class="brand-logo">
                <div class="brand-meta">
                    <span class="brand-name">${brandGroup.name}</span>
                    <span class="brand-count">models: ${uniqueModels.length}</span>
                </div>
            </div>
            <i class="fa-solid fa-chevron-down brand-chevron" aria-hidden="true"></i>
        `;
        brandToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleBrandSection(brandGroup.id, dataToRender);
        });

        const modelList = document.createElement('div');
        modelList.className = `brand-models${isExpanded ? ' expanded' : ''}`;

        if (isExpanded) {
            uniqueModels.forEach(car => {
                modelList.appendChild(createModelListItem(car));
            });
        }

        brandSection.appendChild(brandToggle);
        brandSection.appendChild(modelList);
        carListContainer.appendChild(brandSection);
    });
}

/**
 * Удаляет дубликаты моделей внутри бренда по имени
 * @param {Array} models - Массив моделей бренда
 * @returns {Array}
 */
function getUniqueModelsByName(models) {
    const uniqueMap = new Map();

    models.forEach(model => {
        const key = (model.name || '').trim().toLowerCase();
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, model);
        }
    });

    return Array.from(uniqueMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Переключает раскрытие бренда в аккордеоне
 * @param {string} brandId - ID бренда
 * @param {Array} sourceCars - Исходный список машин для рендера
 */
function toggleBrandSection(brandId, sourceCars) {
    if (expandedBrandIds.has(brandId)) {
        expandedBrandIds.delete(brandId);
    } else {
        expandedBrandIds.add(brandId);
    }
    renderCarList(sourceCars);
}

/**
 * Создаёт элемент модели внутри раскрытого бренда
 * @param {Object} car - Объект автомобиля
 * @returns {HTMLDivElement}
 */
function createModelListItem(car) {
    const div = document.createElement('div');
    div.className = 'car-list-item';
    div.onclick = (e) => {
        e.stopPropagation();
        if (typeof window.openModelDetailsModal === 'function') {
            window.openModelDetailsModal(car.id);
        } else {
            selectCar(car.id);
        }
    };

    div.innerHTML = `
        <div class="car-item-left">
            <div style="font-weight: bold;">${car.name}</div>
        </div>
        <i class="fa-solid fa-chevron-right" aria-hidden="true" style="color: #94a3b8;"></i>
    `;

    return div;
}

/**
 * Группирует машины по бренду и сортирует марки/модели
 * @param {Array} sourceCars - Список автомобилей
 * @returns {Array}
 */
function getGroupedCars(sourceCars) {
    const groupedData = new Map();

    sourceCars.forEach(car => {
        if (!groupedData.has(car.brandId)) {
            groupedData.set(car.brandId, {
                id: car.brandId,
                name: car.brand,
                logo: car.logo,
                models: []
            });
        }
        groupedData.get(car.brandId).models.push(car);
    });

    const sortedGroups = Array.from(groupedData.values()).sort((a, b) => a.name.localeCompare(b.name));
    sortedGroups.forEach(group => group.models.sort((a, b) => a.name.localeCompare(b.name)));

    return sortedGroups;
}

/**
 * Возвращает машины, отфильтрованные по строке поиска
 * @param {Array} sourceCars - Исходный список автомобилей
 * @param {string} searchTerm - Текущая строка поиска
 * @returns {Array}
 */
function getFilteredCarsBySearch(sourceCars, searchTerm) {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
        return sourceCars;
    }

    return sourceCars.filter(car => {
        return car.name.toLowerCase().includes(normalizedSearch) || car.brand.toLowerCase().includes(normalizedSearch);
    });
}

/**
 * Инициализирует обработчики для поиска автомобилей
 */
function initCarSearch() {
    carSearchInput.addEventListener('input', (e) => {
        currentCarSearchTerm = e.target.value;
        renderCarList(allCars);
    });

    carSearchInput.addEventListener('click', (e) => { 
        e.stopPropagation(); 
    });
}
