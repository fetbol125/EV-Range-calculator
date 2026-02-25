// Логика выбора автомобиля

let selectedBrandFilter = null; // Переменная для хранения выбранного бренда
let selectedBrandName = null; // Название выбранного бренда
let isShowingBrandsList = false; // Флаг для отслеживания видимости списка брендов

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
 * Восстанавливает изображение машины в thumb (удаляет иконку)
 */
function restoreCarThumbImage() {
    const carThumb = document.querySelector('.car-thumb');
    if (carThumb) {
        carThumb.innerHTML = '<img id="current-car-img" src="" alt="Car">';
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
        selectedBrandFilter = null;
        selectedBrandName = null;
        isShowingBrandsList = false;
        const allBrandsBtn = document.getElementById('all-brands-btn');
        if (allBrandsBtn) {
            const t = translations[state.lang];
            allBrandsBtn.innerHTML = `<i class="fa-solid fa-list"></i> ${t.allBrands}`;
        }
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

    currentSelectedCarId = id;

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
        currentImg.src = car.img;
    }
    
    currentCarRange.innerText = car.range; 
    currentCarBattery.innerText = car.battery;
    currentMaxRange = car.range; 
    currentCarWeight = car.weightKg || 2000; 
    
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
    const t = translations[state.lang];

    if(dataToRender.length === 0) { 
        carListContainer.innerHTML = `<div style="padding:10px; color: #64748b; text-align:center;">${t.carSearchPlaceholder}</div>`; 
        return; 
    }
    
    const groupedFilteredData = new Map();
    dataToRender.forEach(car => {
        if (!groupedFilteredData.has(car.brandId)) {
            groupedFilteredData.set(car.brandId, {
                name: car.brand,
                logo: car.logo,
                models: []
            });
        }
        if(groupedFilteredData.has(car.brandId)) {
            groupedFilteredData.get(car.brandId).models.push(car);
        }
    });
    
    const sortedBrandGroups = Array.from(groupedFilteredData.values()).sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    sortedBrandGroups.forEach(brandGroup => {
        const brandHeader = document.createElement('div');
        brandHeader.className = 'car-brand-header';
        brandHeader.innerHTML = `
            <div class="brand-info">
                <img src="${brandGroup.logo}" alt="${brandGroup.name} Logo" class="brand-logo">
                <span class="brand-name">${brandGroup.name}</span>
            </div>
        `;
        carListContainer.appendChild(brandHeader);
        
        brandGroup.models.sort((a, b) => a.name.localeCompare(b.name));
        
        brandGroup.models.forEach(car => {
            const div = document.createElement('div'); 
            div.className = 'car-list-item';
            div.onclick = (e) => { e.stopPropagation(); selectCar(car.id); };
            
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

/**
 * Рендерит список доступных брендов
 */
function renderBrandsList() {
    carListContainer.innerHTML = '';
    const t = translations[state.lang];
    isShowingBrandsList = true;

    // Добавляем кнопку "All Brands" в начало
    const allBrandsItem = document.createElement('div');
    allBrandsItem.className = 'car-brand-item';
    allBrandsItem.style.cssText = 'padding: 12px 15px; display: flex; align-items: center; gap: 12px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background-color 0.2s; background-color: rgba(6, 182, 212, 0.1);';
    allBrandsItem.onclick = (e) => { 
        e.stopPropagation(); 
        selectedBrandFilter = null;
        selectedBrandName = null;
        isShowingBrandsList = false;
        const allBrandsBtn = document.getElementById('all-brands-btn');
        if (allBrandsBtn) {
            allBrandsBtn.innerHTML = `<i class="fa-solid fa-list"></i> ${t.allBrands}`;
        }
        renderCarList(allCars);
    };
    
    allBrandsItem.innerHTML = `
        <i class="fa-solid fa-th-list" style="font-size: 1.1rem; color: var(--accent);"></i>
        <span style="flex-grow: 1; font-weight: 600;">${t.allBrands}</span>
    `;
    
    carListContainer.appendChild(allBrandsItem);

    // Получаем уникальные бренды
    const uniqueBrands = [...new Map(allCars.map(car => [car.brandId, { 
        id: car.brandId,
        name: car.brand, 
        logo: car.logo,
        count: allCars.filter(c => c.brandId === car.brandId).length
    }])).values()].sort((a, b) => a.name.localeCompare(b.name));

    uniqueBrands.forEach(brand => {
        const brandItem = document.createElement('div');
        brandItem.className = 'car-brand-item';
        brandItem.style.cssText = 'padding: 12px 15px; display: flex; align-items: center; gap: 12px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background-color 0.2s;';
        brandItem.onclick = (e) => { 
            e.stopPropagation(); 
            filterByBrand(brand.id, brand.name);
        };
        brandItem.onmouseover = () => { brandItem.style.backgroundColor = 'rgba(6, 182, 212, 0.1)'; };
        brandItem.onmouseout = () => { brandItem.style.backgroundColor = 'transparent'; };
        
        brandItem.innerHTML = `
            <img src="${brand.logo}" alt="${brand.name}" style="width: 32px; height: 32px; object-fit: contain;">
            <span style="flex-grow: 1;">${brand.name}</span>
            <span style="color: #64748b; font-size: 0.85rem;">${brand.count}</span>
        `;
        
        carListContainer.appendChild(brandItem);
    });
}

/**
 * Фильтрует машины по бренду
 * @param {string} brandId - ID бренда
 * @param {string} brandName - Имя бренда
 */
function filterByBrand(brandId, brandName) {
    selectedBrandFilter = brandId;
    selectedBrandName = brandName;
    
    // Обновляем текст кнопки All Brands на название бренда
    const allBrandsBtn = document.getElementById('all-brands-btn');
    if (allBrandsBtn) {
        allBrandsBtn.innerHTML = `<i class="fa-solid fa-check"></i> ${brandName}`;
    }
    
    const filteredCars = allCars.filter(car => car.brandId === brandId);
    renderCarList(filteredCars);
    carSearchInput.value = '';
}

/**
 * Инициализирует обработчики для поиска автомобилей
 */
function initCarSearch() {
    const allBrandsBtn = document.getElementById('all-brands-btn');
    
    carSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (selectedBrandFilter) {
            // Если выбран бренд, ищем только в его машинах
            const brandCars = allCars.filter(car => car.brandId === selectedBrandFilter);
            const filteredCars = brandCars.filter(car => 
                car.name.toLowerCase().includes(searchTerm)
            );
            renderCarList(filteredCars);
        } else {
            // Ищем во всех машинах
            const filteredCars = allCars.filter(car => 
                car.name.toLowerCase().includes(searchTerm) || 
                car.brand.toLowerCase().includes(searchTerm)
            );
            renderCarList(filteredCars);
        }
    });

    carSearchInput.addEventListener('click', (e) => { 
        e.stopPropagation(); 
    });

    // Обработчик для кнопки "All Brands" с функцией переключения
    if (allBrandsBtn) {
        allBrandsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isShowingBrandsList) {
                // Если список брендов уже показан, скрываем его и показываем все машины
                selectedBrandFilter = null;
                selectedBrandName = null;
                isShowingBrandsList = false;
                allBrandsBtn.innerHTML = `<i class="fa-solid fa-list"></i> ${translations[state.lang].allBrands}`;
                renderCarList(allCars);
                carSearchInput.value = '';
            } else {
                // Иначе показываем список брендов
                renderBrandsList();
                carSearchInput.value = '';
            }
        });
    }
}
