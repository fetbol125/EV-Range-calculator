var carsData = window.carsData = window.carsData || [];
var brandsData = window.brandsData = window.brandsData || [];
var carBrandIndex = window.carBrandIndex = window.carBrandIndex || new Map();

function registerCarBrand(brand) {
    if (!brand || !brand.id) return;

    const normalizedBrand = {
        id: brand.id,
        name: brand.name || brand.id,
        logo: brand.logo || ''
    };

    const existingIndex = brandsData.findIndex(item => item.id === normalizedBrand.id);
    if (existingIndex >= 0) {
        brandsData[existingIndex] = {
            ...brandsData[existingIndex],
            ...normalizedBrand
        };
    } else {
        brandsData.push(normalizedBrand);
    }

    carBrandIndex.set(normalizedBrand.id, brandsData.find(item => item.id === normalizedBrand.id));
}

function registerCarModels(models) {
    if (!Array.isArray(models)) return;

    models.forEach(model => {
        if (!model || !model.brandId) return;

        const brand = carBrandIndex.get(model.brandId) || brandsData.find(item => item.id === model.brandId);
        carsData.push({
            ...model,
            brand: model.brand || (brand && brand.name) || model.brandId,
            logo: model.logo || (brand && brand.logo) || ''
        });
    });
}

function loadCarScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = encodeURI(src);
        script.async = false;
        script.onload = () => resolve(src);
        script.onerror = () => reject(new Error('Failed to load car catalog script: ' + src));
        document.head.appendChild(script);
    });
}

function loadCarScriptSeries(srcList) {
    return Promise.all(srcList.map(src => loadCarScript(src)));
}

window.registerCarBrand = registerCarBrand;
window.registerCarModels = registerCarModels;
window.loadCarScript = loadCarScript;
window.loadCarScriptSeries = loadCarScriptSeries;
