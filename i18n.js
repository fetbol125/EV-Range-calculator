// i18n.js

const translations = {
    // Языковые коды: ru - Russian, en - English
    'en': {
        // HEADER & LAYOUT
        title: "EV Range сalculator",
        subtitle: "Calculate your electric vehicle's estimated range based on real-world conditions",
        language: "Language: English",
        impactFactors: "Impact Factors",
        estimatedRange: "Estimated Range",
        kilometers: "kilometers",
        maxRange: "Max Range",
        currentBattery: "Current Battery",
        standard: "Standard",
        extended: "Extended",
        
        // STATUSES
        statusGood: "Good Range",
        statusWarn: "Moderate Range",
        statusDanger: "Low Range",

        // SIDEBAR ITEMS
        sidebarBattery: "Battery Level",
        sidebarSeason: "Season",
        sidebarConditions: "Driving conditions",
        sidebarMode: "Driving Mode",
        sidebarWeight: "Weight load",
        sidebarClimate: "Climate Control",
        sidebarWheels: "Wheel Size",
        sidebarWind: "Wind",
        sidebarTires: "Tire Pressure",
        sidebarDegradation: "Degradation",

        // STANDARD CONTROLS
        weightDriver: "driver",
        weightPartial: "half",
        weightFull: "full",
        seasonSummer: "summer",
        seasonSpring: "spr/aut",
        seasonWinter: "winter",
        roadCity: "city",
        roadHighway: "highway",
        roadMixed: "mixed",
        modeEco: "eco",
        modeNormal: "normal",
        modeSport: "sport",
        climateOn: "ON",
        climateOff: "OFF",
        
        // EXTENDED CONTROLS
        speed: "Speed",
        payload: "Payload",
        temperature: "Temperature",
        windTailwind: "Tailwind",
        windHeadwind: "Headwind",
        tireLow: "Low",
        tireNorm: "Norm",
        tireHigh: "High",
        climatePro: "Climate Pro",
        climateAC: "A/C",
        climateHeater: "Heater",
        batteryHealthLoss: "Battery Health Loss",

        // CAR MODAL
        modalTitle: "Enter custom car data",
        modalRangeLabel: "Maximum range on a single charge?",
        modalBatteryLabel: "How many kilowatts does the battery have?",
        modalWeightLabel: "The weight of an electric car?",
        modalWrite: "Write: ",
        modalCancel: "Cancel",
        modalDone: "Done",
        carOther: "Other car:",
        carSearchPlaceholder: "Search brand or model...",
        customModel: "Custom Model",
        customBrand: "Custom"
    },
    'ru': {
        // HEADER & LAYOUT
        title: "Калькулятор Запаса Хода EV",
        subtitle: "Рассчитайте предполагаемый запас хода вашего электромобиля в реальных условиях",
        language: "Язык: Русский",
        impactFactors: "Факторы Влияния",
        estimatedRange: "Расчетный Запас Хода",
        kilometers: "километров",
        maxRange: "Макс. Запас Хода",
        currentBattery: "Текущий Заряд",
        standard: "Стандартный",
        extended: "Расширенный",
        
        // STATUSES
        statusGood: "Хороший Запас",
        statusWarn: "Умеренный Запас",
        statusDanger: "Низкий Запас",

        // SIDEBAR ITEMS
        sidebarBattery: "Уровень Батареи",
        sidebarSeason: "Сезон",
        sidebarConditions: "Условия вождения",
        sidebarMode: "Режим Вождения",
        sidebarWeight: "Весовая Нагрузка",
        sidebarClimate: "Климат-контроль",
        sidebarWheels: "Размер Дисков",
        sidebarWind: "Ветер",
        sidebarTires: "Давл. в Шинах",
        sidebarDegradation: "Деградация",

        // STANDARD CONTROLS
        weightDriver: "водитель",
        weightPartial: "половина",
        weightFull: "полная",
        seasonSummer: "лето",
        seasonSpring: "весна/осень",
        seasonWinter: "зима",
        roadCity: "город",
        roadHighway: "трасса",
        roadMixed: "смешанный",
        modeEco: "эко",
        modeNormal: "норма",
        modeSport: "спорт",
        climateOn: "ВКЛ",
        climateOff: "ВЫКЛ",
        
        // EXTENDED CONTROLS
        speed: "Скорость",
        payload: "Полезная нагрузка",
        temperature: "Температура",
        windTailwind: "Попутный",
        windHeadwind: "Встречный",
        tireLow: "Низкое",
        tireNorm: "Норм",
        tireHigh: "Высокое",
        climatePro: "Климат Pro",
        climateAC: "Кондиционер",
        climateHeater: "Обогрев",
        batteryHealthLoss: "Потеря Здоровья Батареи",

        // CAR MODAL
        modalTitle: "Ввод данных своего авто",
        modalRangeLabel: "Максимальный запас хода на одном заряде?",
        modalBatteryLabel: "Сколько киловатт у батареи?",
        modalWeightLabel: "Вес электромобиля?",
        modalWrite: "Напишите: ",
        modalCancel: "Отмена",
        modalDone: "Готово",
        carOther: "Другое авто:",
        carSearchPlaceholder: "Поиск марки или модели...",
        customModel: "Своя Модель",
        customBrand: "Своя"
    }
};