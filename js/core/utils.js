// Вспомогательные функции

/**
 * Анимирует изменение числового значения
 * @param {HTMLElement} obj - Элемент для анимации
 * @param {number} start - Начальное значение
 * @param {number} end - Конечное значение  
 * @param {number} duration - Длительность анимации в мс
 */
function animateValue(obj, start, end, duration) {
    if (start === end) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

/**
 * Делает первую букву заглавной
 * @param {string} s - Строка
 * @returns {string} Строка с заглавной первой буквой
 */
function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
}

/**
 * Обрабатывает данные автомобилей и брендов, объединяя их
 */
function processCarData() {
    const brandMap = new Map(brandsData.map(brand => [brand.id, brand]));
    groupedCarsData = {};
    allCars = [];

    carsData.forEach(car => {
        const brand = brandMap.get(car.brandId);
        if (brand) {
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
