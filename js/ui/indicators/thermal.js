// Индикатор температурного статуса батареи

/**
 * Обновляет индикатор подогрева/охлаждения батареи
 */
function updateBatteryThermalStatus() {
    const statusElement = document.getElementById('battery-thermal-status');
    if (!statusElement) return;

    const t = translations[state.lang];
    const temp = state.extTemp;

    if (temp <= BATTERY_HEATING_THRESHOLD) {
        // Показываем подогрев батареи
        statusElement.innerHTML = `<i class="fa-solid fa-fire"></i> <span>${t.batteryHeating || 'Battery Heating'}</span>`;
        statusElement.style.display = 'inline-flex';
    } else if (temp >= BATTERY_COOLING_THRESHOLD) {
        // Показываем охлаждение батареи
        statusElement.innerHTML = `<i class="fa-solid fa-snowflake"></i> <span>${t.batteryCooling || 'Battery Cooling'}</span>`;
        statusElement.style.display = 'inline-flex';
    } else {
        // Скрываем индикатор
        statusElement.style.display = 'none';
    }
}
