// Конфигурация и глобальные переменные

// Глобальные переменные состояния
let currentMaxRange = 573; 
let currentCarWeight = 2069; 
let currentSelectedCarId = null;

// Структуры данных для автомобилей
let groupedCarsData = {};
let allCars = [];

// Константы
const CIRCUMFERENCE = 2 * Math.PI * 120;
const ADDED_WEIGHT_KG = { driver: 75, partial: 200, full: 400 };
const CLIMATE_IMPACT = 0.10;
const SEAT_HEATING_IMPACT = 0.03;
const WINDOW_HEATING_IMPACT = 0.04;
const MULTIMEDIA_IMPACT = 0.02;
const BATTERY_HEATING_IMPACT = 0.05; // Подогрев батареи при t <= 5°C
const BATTERY_COOLING_IMPACT = 0.04; // Охлаждение батареи при t >= 30°C
const PRECIP_RAIN_IMPACT = 0.05;
const PRECIP_SNOW_IMPACT = 0.12;
const BATTERY_HEATING_THRESHOLD = 5; // Порог включения подогрева
const BATTERY_COOLING_THRESHOLD = 30; // Порог включения охлаждения

// Факторы влияния на дальность
const factors = {
    season: { summer: 1.0, spring: 0.96, winter: 0.75 },
    road: { city: 1.0, mixed: 0.90, highway: 0.75 },
    mode: { eco: 1.0, normal: 0.95, sport: 0.85 }
};

// Состояние приложения
const state = {
    battery: 65,
    season: 'summer',
    road: 'city',
    mode: 'eco',
    weight: 'driver', 
    climate: false,
    rangeType: 'standard', 
    lang: 'en', 
    
    // Extended Mode Values
    extSpeed: 90,    
    extPayload: 75,  
    extWheels: 19,   
    extTemp: 20,     
    extTires: 1,     
    extDeg: 0,
    extWind: 0,
    extPrecip: 'none',
    extClimateMode: 'off',
    extMode: 'eco',
    
    // Energy Consumers
    seatHeating: false,
    windowHeating: false,
    multimedia: false,
    
    // Состояния включения/отключения факторов Extended Mode
    enableWheels: true,
    enableWind: true,
    enableTires: true,
    enableDeg: true,
    enableExtMode: true,
    enableEnergyConsumers: true,
    enableWeather: true
};
