// Переключение режима контролов (Standard/Extended)

/**
 * Переключает режим контролов (Standard/Extended)
 */
function toggleControlMode(mode) {
    const stdControls = document.getElementById('standard-controls');
    const extControls = document.getElementById('extended-controls');
    const modeExtControls = document.getElementById('mode-ext-controls');

    if (mode === 'extended') {
        stdControls.style.display = 'none';
        extControls.style.display = 'contents';
        modeExtControls.style.display = 'contents';
        if (sidebar) sidebar.classList.remove('standard-mode');

        setTimeout(() => {
            const climateGroup = document.getElementById('ext-climate-group');
            const modeGroupExt = document.getElementById('mode-group-ext');
            const reliefGroup = document.getElementById('relief-group');
            const precipGroup = document.getElementById('precip-group');

            if (climateGroup) {
                const activeClimateBtn = climateGroup.querySelector('.pill-btn.active');
                if (activeClimateBtn) updatePillSlider(climateGroup, activeClimateBtn);
            }

            if (modeGroupExt) {
                const activeModeBtn = modeGroupExt.querySelector('.pill-btn.active');
                if (activeModeBtn) updatePillSlider(modeGroupExt, activeModeBtn);
            }

            if (reliefGroup) {
                const activeReliefBtn = reliefGroup.querySelector('.pill-btn.active');
                if (activeReliefBtn) updatePillSlider(reliefGroup, activeReliefBtn);
            }

            if (precipGroup) {
                const activePrecipBtn = precipGroup.querySelector('.pill-btn.active');
                if (activePrecipBtn) updatePillSlider(precipGroup, activePrecipBtn);
            }
        }, 50);
    } else {
        stdControls.style.display = 'contents';
        extControls.style.display = 'none';
        modeExtControls.style.display = 'none';
        if (sidebar) sidebar.classList.add('standard-mode');
    }
}
