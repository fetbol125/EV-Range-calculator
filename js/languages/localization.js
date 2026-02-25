// Локализация

/**
 * Устанавливает новый язык и обновляет UI
 * @param {string} newLang - Код языка ('en' или 'ru')
 */
function setLanguage(newLang) {
    state.lang = newLang;
    const currentTranslations = translations[state.lang];

    // Обновляем статус 'active' в меню
    languageOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.lang === newLang) {
            option.classList.add('active');
        }
    });
    
    // Применяем переводы ко всем статическим элементам с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (currentTranslations[key] && element.getAttribute('data-i18n-placeholder') === null) {
            // Для элементов с data-i18n-keep-html обновляем только текст, сохраняя HTML (иконки)
            if (element.hasAttribute('data-i18n-keep-html')) {
                // Заменяем текст, оставляя HTML элементы
                const firstChild = element.firstChild;
                if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
                    firstChild.textContent = ' ' + currentTranslations[key];
                } else if (element.lastChild && element.lastChild.nodeType === Node.TEXT_NODE) {
                    element.lastChild.textContent = ' ' + currentTranslations[key];
                } else {
                    // Если нет текстового узла, добавляем текст в конец
                    element.appendChild(document.createTextNode(' ' + currentTranslations[key]));
                }
            } else {
                element.textContent = currentTranslations[key];
            }
        }
    });
    
    // Переводим placeholder для поиска
    const searchPlaceholderKey = carSearchInput.getAttribute('data-i18n-placeholder');
    if (searchPlaceholderKey && currentTranslations[searchPlaceholderKey]) {
        carSearchInput.placeholder = currentTranslations[searchPlaceholderKey];
    }
    
    // Обновляем текст в триггере меню
    currentLanguageText.textContent = currentTranslations.language;

    // Обновляем атрибут lang в <html>
    document.documentElement.lang = newLang;
    
    // Обновляем динамические тексты
    updateUI(); 
    updateBatteryThermalStatus();
    
    // Обновляем ползунки после смены языка
    document.querySelectorAll('.pill-group, #ext-climate-group').forEach(group => {
        const activeBtn = group.querySelector('.pill-btn.active') || group.querySelector('.climate-btn.active');
        if (activeBtn) updatePillSlider(group, activeBtn);
    });
}
