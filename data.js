
const carsData = [
    
//=========================================================================AUDI=======================================================================

    {
        id: 'q4-e-tron',
        brandId: 'audi', 
        name: 'Q4 e-tron',
        range: 520,
        battery: 77,
        weightKg: 2050,
        img: 'https://images.unsplash.com/photo-1626075195957-35df77c508ea?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop,focalpoint&fp-x=0.5&fp-y=0.6&w=70&h=70&q=80'
    },
    {
        id: 'e-tron-gt',
        brandId: 'audi', 
        name: 'e-tron GT',
        range: 488,
        battery: 83.7,
        weightKg: 2350,
        img: 'https://images.unsplash.com/photo-1655126275641-21e114342284?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop,focalpoint&fp-x=0.5&fp-y=0.6&w=70&h=70&q=80'
    },

//=========================================================================BMW=======================================================================

    {
        id: 'i4',
        brandId: 'bmw', 
        name: 'i4 eDrive40',
        range: 590,
        battery: 80.7,
        weightKg: 2050,
        img: 'https://images.unsplash.com/photo-1727994832515-7888b6edd884?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop,focalpoint&fp-x=0.5&fp-y=0.6&w=70&h=70&q=80'
    },
    {
        id: 'i5',
        brandId: 'bmw', 
        name: 'i5 eDrive40',
        range: 582,
        battery: 81.2,
        weightKg: 2130,
        img: 'https://images.unsplash.com/photo-1708908864331-d54c1e556e26?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop,focalpoint&fp-x=0.5&fp-y=0.6&w=70&h=70&q=80'
    },

//=========================================================================TESLA=======================================================================

    {
        id: 'model-s',
        brandId: 'tesla', 
        name: 'Model S',
        range: 573,
        battery: 77,
        weightKg: 3000, 
        img: 'https://images.unsplash.com/photo-1716558964076-1abe07448abf?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop,focalpoint&fp-x=0.5&fp-y=0.6&w=70&h=70&q=80'
    },
    {
        id: 'model-3',
        brandId: 'tesla', 
        name: 'Model 3',
        range: 513,
        battery: 60,
        weightKg: 1765, 
        img: 'https://images.unsplash.com/photo-1636060889550-20762f149c5b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop,focalpoint&fp-x=0.5&fp-y=0.6&w=70&h=70&q=80'
    },
    {
        id: 'model-x',
        brandId: 'tesla', 
        name: 'Model X',
        range: 450,
        battery: 75,
        weightKg: 2335,
        img: 'https://images.unsplash.com/photo-1587304878169-505d63fd6b0c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop,focalpoint&fp-x=0.5&fp-y=0.6&w=70&h=70&q=80'
    },
//=========================================================================TESLA=======================================================================

    {
    "id": "ioniq-5",
    "brandId": "hyundai",
    "name": "IONIQ 5",
    "range": 507, 
    "battery": 77.4,
    "weightKg": 2095,
    "img": 'https://images.unsplash.com/photo-1647934441921-4ed1e182e4b3?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop,focalpoint&fp-x=0.5&fp-y=0.6&w=70&h=70&q=80'
    },
    {
    "id": "kona-electric",
    "brandId": "hyundai",
    "name": "KONA Electric",
    "range": 514,
    "battery": 64.8,
    "weightKg": 1698,
    "img": "https://images.unsplash.com/photo-1672278374378-8ef184d2e685?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop,focalpoint&fp-x=0.5&fp-y=0.6&w=70&h=70&q=80"
    },
    {
    "id": "ioniq-6",
    "brandId": "hyundai",
    "name": "IONIQ 6",
    "range": 614,
    "battery": 77.4,
    "weightKg": 1910,
    "img": "https://images.unsplash.com/photo-1694676518566-874b80d2d160?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop,focalpoint&fp-x=0.5&fp-y=0.6&w=70&h=70&q=80"
    },
];