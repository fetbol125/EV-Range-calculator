// UI-утилиты для слайдеров и pill-групп

/**
 * Обновляет фон слайдера (заполнение)
 */
function updateRangeBackground(rangeInput) {
    const min = parseFloat(rangeInput.min) || 0;
    const max = parseFloat(rangeInput.max) || 100;
    const val = parseFloat(rangeInput.value) || 0;
    const percentage = ((val - min) / (max - min)) * 100;
    rangeInput.style.setProperty('--percent', percentage + '%');
}

/**
 * Инициализирует визуальное отображение всех слайдеров
 */
function initAllSlidersVisuals() {
    const allSliders = document.querySelectorAll('input[type=range]');
    allSliders.forEach(slider => {
        updateRangeBackground(slider);
        slider.addEventListener('input', (e) => {
            updateRangeBackground(e.target);
        });
    });
}

/**
 * Обновляет позицию ползунка в pill group
 */
function updatePillSlider(group, activeBtn) {
    if (!group || !activeBtn) return;

    const groupRect = group.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    const offset = btnRect.left - groupRect.left - 3;
    const width = btnRect.width + 6;

    group.style.setProperty('--slider-x', `${offset}px`);
    group.style.setProperty('--slider-width', `${width}px`);
}
