// Gestor de Datos - Almacenamiento en localStorage con JSON
const DATA_STORAGE_KEY = 'tps_products_data_v1';
const CATEGORIES_STORAGE_KEY = 'tps_categories';

// Categorías por defecto
const DEFAULT_CATEGORIES = [
    { id: 'masculinos', name: 'Masculinos', icon: 'mars' },
    { id: 'femeninos', name: 'Femeninos', icon: 'venus' },
    { id: 'unisex', name: 'Unisex', icon: 'venus-mars' },
    { id: 'victoria-secret', name: 'Victoria Secret', icon: 'star' }
];

// Inicializar datos si no existen
function initializeData() {
    if (!localStorage.getItem(DATA_STORAGE_KEY)) {
        // Migrar datos del CSV a JSON
        const products = migrateCSVToJSON();
        saveProducts(products);
    }

    if (!localStorage.getItem(CATEGORIES_STORAGE_KEY)) {
        saveCategories(DEFAULT_CATEGORIES);
    }
}

// Migrar datos del CSV a JSON (datos hardcodeados del CSV)
function migrateCSVToJSON() {
    const csvData = `Producto,Precio Minorista,x30 Unidades,x20 Unidades,x10 Unidades,x5 Unidades
Perfumes | Masculinos,,x30 Unidades,x20 Unidades,x10 Unidades,x5 Unidades
Afnan 9PM (Negro),"$68,000",$32,$36,$39,$47
Afnan 9PM Rebel (Rojo),"$95,000.00",$37,$41,$44,$52
Armaf Odyssey Mandarin Sky,"$89,000.00",$44,$48,$51,$59
Armaf Odyssey Wild One Gold ,"$75,000",$36,$40,$43,$51
Armaf Odyssey Homme White ,"$75,000",$36,$40,$43,$51
Al Wataniah Bareeq Al Dhahab ,"$45,000",$18,$22,$25,$33
Sauvage – Dior 100ml,"$175,000",$105,$109,$112,$120
Al Wataniah Kenz Al Malik ,"$45,000",$18,$22,$25,$33
Set Neceser Jaguar ,"$75,000",$27,$31,$34,$42
Azzaro The Most Wanted Parfum,"$190,000",$107,$111,$114,$122
Xerjoff Erba Pura ,"$383,600",$201,$205,$208,$216
Salvo - Maison Alhambra ,"$50,000",$18,$22,$25,$33
Al Haramain Amber Oud Dubai Night,"$134,999",$54,$58,$61,$69
Bharara King 200ml,"$170,000",$70,$74,$77,$85
Bharara King 150ml,"$150,000",$72,$76,$79,$87
Bharara King 100ml,"$125,000",$55,$59,$62,$70
Club de Nuit Iconic,"$85,000",$44,$48,$51,$59
Club de Nuit Intense,"$65,000",$29,$33,$36,$44
Club de Nuit Urban Elixir,"$80,000",$39,$43,$46,$54
Maison Alhambra Alpine Homme Sport ,"$50,000",$21,$25,$28,$36
Kismet Magic - Maison Alhambra ,"$55,000",$25,$29,$32,$40
Noir en Leather - Pendora Scents,"$60,000",$29,$33,$36,$44
Lattafa The Kingdom ,"$68,000",$36,$40,$43,$51
Lattafa Asad,"$55,000",$25,$29,$32,$40
Lattafa Asad Bourbon,"$69,000",$34,$38,$41,$49
Lattafa Bade Al Oud For Glory (Negro),"$47,999",$23,$27,$30,$38
Lattafa Fakhar Black Masculino,"$55,000",$23,$27,$30,$38
Lattafa Musaman Men ,"$79,000",$39,$43,$46,$54
Le Male Elixir Jean Paul Gaultier,"$199,000",$110,$114,$117,$125
Rasasi Hawas,"$92,999.00",$44,$48,$51,$59
Afnan Supremacy,"$88,000",$35,$39,$42,$50
Perfumes | Unisex,,x30 Unidades,x20 Unidades,x10 Unidades,x5 Unidades
Lattafa Confidential Private Gold EDP,"$50,000",$20,$24,$27,$35
9am Dive,"$80,000",$34,$38,$41,$49
Armaf Club de Nuit Precieux ,"$120,000",$20,$24,$27,$35
Amber Rouge – Orientica,"$118,000",$20,$24,$27,$35
Philos Pura - Maison Alhambra,"$60,000",$23,$27,$30,$38
Infini Elixir - Maison Alhambra ,"$55,000",$19,$23,$26,$34
Eternal Touch - Maison Alhambra ,"$75,000",$27,$31,$34,$42
Voux Turquoise - Paris Corner ,"$98,000",$50,$54,$57,$65
Ameerati - Al wataniah,"$45,000",$18,$22,$25,$33
Al Haramain Amber Oud White Edition ,"$120,000",$50,$54,$57,$65
Al Haramain Ruby Edition ,"$159,000",$61,$65,$68,$76
Al Haramain Bleu Edition ,"$140,000",$60,$64,$67,$75
Al Haramain Amber Oud Aqua Dubai,"$130,000",$62,$66,$69,$77
Al Haramain Amber Oud Gold Edition,"$130,000",$57,$61,$64,$72
Al Haramain Amber Oud Gold Extreme,"$155,000",$71,$75,$78,$86
Al Haramain Oudh Musk,"$150,000",$55,$59,$62,$70
Club de Nuit Untold,"$90,000",$23,$27,$30,$38
Lattafa Winners Trophy,"$65,000",$32,$36,$39,$47
Lattafa Azeezah ,"$45,000",$16,$20,$23,$31
Lattafa Ejaazi Intensive Silver,"$50,000",$21,$25,$28,$36
Lattafa Al Noble Wazeer,"$60,000",$27,$31,$34,$42
Lattafa Al Noble Safeer Green,"$55,000",$24,$28,$31,$39
Lattafa Bade Al Oud Amethyst,"$50,000",$24,$28,$31,$39
Lattafa Bade Al Oud Honor & Glory,"$65,000",$25,$29,$32,$40
Lattafa Bade Al Oud Sublime,"$55,000",$26,$30,$33,$41
Lattafa Emeer,"$70,000",$31,$35,$38,$46
Lattafa Khamrah,"$55,000",$31,$35,$38,$46
Lattafa Khamrah Qawha,"$59,000",$26,$30,$33,$41
Lattafa Masa,"$90,000",$42,$46,$49,$57
Lattafa Nebras Pride,"$69,000",$33,$37,$40,$48
Lattafa Qaed Fursan,"$45,000",$18,$22,$25,$33
Lattafa Qaed Fursan Unlimited,"$45,000",$19,$23,$26,$34
Lattafa Qaa´ed ,"$48,000",$19,$23,$26,$34
Perfumes | Femeninos,,x30 Unidades,x20 Unidades,x10 Unidades,x5 Unidades
212 VIP Rose Elixir NYC,"$180,000.00",$32,$36,$39,$47
Olympea – Paco Rabanne ,"$135,000",$37,$41,$44,$52
Afnan 9AM Pour Femme (Rosa),"$79,000",$36,$40,$43,$51
Afnan 9PM Pour Femme (Violeta),"$73,000",$18,$22,$25,$33
Al Haramain Ultra Violet,"$159,000",$18,$22,$25,$33
Lattafa Fakhar Rose Femenino,"$55,000",$27,$31,$34,$42
Lattafa Yara Candy ,"$59,000",$107,$111,$114,$122
Lattafa Yara Pink ,"$55,000",$201,$205,$208,$216
Lattafa Yara Tous,"$55,000",$18,$22,$25,$33
Lattafa Yara Moi,"$55,000",$54,$58,$61,$69
Lattafa Eclaire ,"$69,000",$70,$74,$77,$85
Lattafa Emaan ,"$60,000",$72,$76,$79,$87
Lattafa Ansaam Gold ,"$65,000",$55,$59,$62,$70
Lattafa Haya ,"$60,000",$44,$48,$51,$59
Lattafa Hayaati Florence,"$55,000",$29,$33,$36,$44
Lattafa Mayar,"$55,000",$39,$43,$46,$54
Lattafa Bade Al Oud Noble Blush,"$75,000",$21,$25,$28,$36
Lattafa Atheeri,"$85,000",$25,$29,$32,$40
Lattafa Qimmah For Woman,"$65,000",$29,$33,$36,$44
Maison alhambra Como Moiselle ,"$50,000",$36,$40,$43,$51
Al Wataniah Durrat Al Aroos,"$60,000",$25,$29,$32,$40
Armaf Oddysey Candee,"$88,000",$35,$39,$42,$50
Calvin Klein One Shock For Her,"$80,000",$34,$38,$41,$49
Club de Nuit Imperiale,"$85,000",$23,$27,$30,$38
Club de Nuit Woman,"$65,000",$23,$27,$30,$38
Halloween EDT Femenino,"$85,000",$39,$43,$46,$54
Scandal – Jean Paul Gaultier ,"$153,000",$110,$114,$117,$125
Toy 2 – Moschino ,"$112,000",$44,$48,$51,$59
VICTORIA SECRET,,,,,
* BODY SPLASH 250 ML:,,,,,
Agua kiss,"$38,000",$5,$9,$12,$20
Rush New,"$38,000",$5,$9,$12,$20
Temptation ,"$38,000",$5,$9,$12,$20
Love spell,"$38,000",$5,$9,$12,$20
Romantic,"$38,000",$5,$9,$12,$20
Midnight Bloom,"$38,000",$5,$9,$12,$20
Bare vainilla,"$38,000",$5,$9,$12,$20
Coconut passion,"$38,000",$5,$9,$12,$20
Pure seduction,"$38,000",$5,$9,$12,$20
Amber romance,"$38,000",$5,$9,$12,$20
Strawberry champagne,"$38,000",$5,$9,$12,$20
Puré seduction daydream,"$38,000",$5,$9,$12,$20
Velvet petals,"$38,000",$5,$9,$12,$20
* BODY LOTION 236 ML:,,,,,
Bare vainilla,"$35,000",$5,$9,$12,$20
Bare vainilla Shimmer,"$35,000",$5,$9,$12,$20
Coconut passion,"$35,000",$5,$9,$12,$20
Puré seduction,"$35,000",$5,$9,$12,$20
Love spell,"$35,000",$5,$9,$12,$20
Love spell Shimmer,"$35,000",$5,$9,$12,$20
Velvet petals Shimmer,"$35,000",$5,$9,$12,$20
* GLOSS:,,,,,
LIP plumper pink,"$28,000",$5,$9,$12,$20
Ph lip oil pink,"$28,000",$5,$9,$12,$20
Gleaming color shine lip gloss,"$28,000",$5,$9,$12,$20
* BRUMA:,,,,,
V.s tease sugar fleur 250ml,"$48,999",$5,$9,$12,$20
* PACKS:,,,,,
Pcs x 2 very sexy night,,$5,$9,$12,$20
Pcs x 2 bombeshell,"$49,000",$33,$37,$40,$48
Pcs x 5 tease,"$189,000",$110,$114,$117,$125
* FRAGANCIAS:,,,,,
Victoria Secret Bombeshell glamour,"$139,000.00",$93,$97,$100,$108
Crema Karsell ,"$37,000",$26,$30,$33,$41`;

    const lines = csvData.trim().split('\n');
    const products = [];
    let currentCategory = '';
    let productId = 1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Parse CSV line respecting quotes
        // Split by comma only if not inside quotes
        const columns = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
        // Clean quotes from the parsed columns
        const cleanColumns = columns.map(col => col.trim().replace(/^"|"$/g, '').trim());

        // Detectar categorías
        if (columns[0].includes('Perfumes | Masculinos')) {
            currentCategory = 'masculinos';
        } else if (columns[0].includes('Perfumes | Femeninos')) {
            currentCategory = 'femeninos';
        } else if (columns[0].includes('Perfumes | Unisex')) {
            currentCategory = 'unisex';
        } else if (columns[0].includes('VICTORIA SECRET')) {
            currentCategory = 'victoria-secret';
        }

        // Detectar productos válidos
        if (isValidProduct(cleanColumns)) {
            const product = createProductFromCSV(cleanColumns, currentCategory, productId++);
            if (product) {
                products.push(product);
            }
        }
    }

    return products;
}

function isValidProduct(columns) {
    return columns[0] &&
        columns[0] !== 'Producto' &&
        !columns[0].includes('Perfumes |') &&
        !columns[0].includes('VICTORIA SECRET') &&
        !columns[0].includes('*') &&
        columns[0].length > 2;
}

function createProductFromCSV(columns, category, id) {
    const name = columns[0];
    const retailPrice = columns[1];
    const price30 = columns[2];
    const price20 = columns[3];
    const price10 = columns[4];
    const price5 = columns[5];

    if (!retailPrice && !price30 && !price20 && !price10 && !price5) {
        return null;
    }

    return {
        id: `prod_${id}`,
        name: name,
        category: category || 'unisex',
        image: '', // Se agregará imagen por defecto o el usuario subirá una
        retailPrice: cleanPrice(retailPrice),
        price5: cleanPrice(price5),
        price10: cleanPrice(price10),
        price20: cleanPrice(price20),
        price30: cleanPrice(price30),
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
}

function cleanPrice(price) {
    if (!price) return null;
    // Si tiene decimales (.00), quitarlos primero para evitar que se unan (ej: 95000.00 -> 95000)
    let clean = price.split('.')[0];
    return clean.replace(/[^\d]/g, '');
}

// Guardar productos
function saveProducts(products) {
    try {
        localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(products));
        return true;
    } catch (e) {
        console.error('Error guardando productos:', e);
        return false;
    }
}

// Cargar productos
function loadProducts() {
    try {
        const data = localStorage.getItem(DATA_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error cargando productos:', e);
        return [];
    }
}

// Guardar categorías
function saveCategories(categories) {
    try {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
        return true;
    } catch (e) {
        console.error('Error guardando categorías:', e);
        return false;
    }
}

// Cargar categorías
function loadCategories() {
    try {
        const data = localStorage.getItem(CATEGORIES_STORAGE_KEY);
        return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
    } catch (e) {
        console.error('Error cargando categorías:', e);
        return DEFAULT_CATEGORIES;
    }
}

// Obtener producto por ID
function getProductById(id) {
    const products = loadProducts();
    return products.find(p => p.id === id);
}

// Agregar producto
function addProduct(product) {
    const products = loadProducts();
    const newProduct = {
        ...product,
        id: `prod_${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    products.push(newProduct);
    saveProducts(products);
    return newProduct;
}

// Actualizar producto
function updateProduct(id, updates) {
    const products = loadProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = {
            ...products[index],
            ...updates,
            updatedAt: Date.now()
        };
        saveProducts(products);
        return products[index];
    }
    return null;
}

// Eliminar producto
function deleteProduct(id) {
    const products = loadProducts();
    const filtered = products.filter(p => p.id !== id);
    saveProducts(filtered);
    return filtered.length < products.length;
}

// Obtener estadísticas
function getStatistics() {
    const products = loadProducts();
    const categories = loadCategories();

    const stats = {
        total: products.length,
        byCategory: {},
        recent: products
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 5),
        updated: products
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .slice(0, 5)
    };

    categories.forEach(cat => {
        stats.byCategory[cat.id] = products.filter(p => p.category === cat.id).length;
    });

    return stats;
}

// Convertir imagen a base64
function imageToBase64(file, callback) {
    if (!file || !file.type.startsWith('image/')) {
        callback(null, 'Tipo de archivo no válido');
        return;
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
        callback(null, 'La imagen es demasiado grande (máximo 2MB)');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        callback(e.target.result, null);
    };
    reader.onerror = function () {
        callback(null, 'Error al leer la imagen');
    };
    reader.readAsDataURL(file);
}

// Comprimir imagen
function compressImage(file, maxWidth = 800, quality = 0.8, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function () {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(function (blob) {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = function (e) {
                    callback(e.target.result, null);
                };
            }, 'image/jpeg', quality);
        };
    };
}

// Inicializar al cargar
if (typeof window !== 'undefined') {
    initializeData();
}

