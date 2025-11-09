// Variables globales
let allProducts = [];
let filteredProducts = [];
let currentCategory = 'todos';

// Elementos del DOM
let searchInput;
let productsContainer;
let loading;
let noResults;
let modal;
let modalContent;
let closeModal;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar elementos del DOM
    searchInput = document.getElementById('searchInput');
    productsContainer = document.getElementById('productsContainer');
    loading = document.getElementById('loading');
    noResults = document.getElementById('noResults');
    modal = document.getElementById('productModal');
    modalContent = document.getElementById('modalContent');
    
    loadProductsCatalog();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Búsqueda
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Filtros de categoría
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            setActiveFilter(category);
            filterProducts();
        });
    });
    
    // Cerrar modal al hacer clic fuera
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProductModal();
            }
        });
    }
    
    // Escape key para cerrar modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeProductModal();
        }
    });
}

// Cargar productos desde JSON (localStorage)
function loadProductsCatalog() {
    try {
        // Inicializar datos si no existen
        initializeData();
        
        // Cargar productos desde localStorage usando data-manager.js
        const products = loadProducts();
        
        allProducts = products;
        filteredProducts = products;
        
        hideLoading();
        renderProducts();
        
    } catch (error) {
        console.error('Error cargando productos:', error);
        hideLoading();
        showError('Error al cargar el catálogo. Por favor, recarga la página.');
    }
}

// Las funciones de parseo CSV ya no son necesarias, se usa data-manager.js

// Renderizar productos
function renderProducts() {
    if (filteredProducts.length === 0) {
        showNoResults();
        return;
    }
    
    hideNoResults();
    
    const productsHTML = filteredProducts.map(product => createProductCard(product)).join('');
    productsContainer.innerHTML = productsHTML;
    
    // Agregar event listeners a las tarjetas
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.dataset.productId;
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                showProductModal(product);
            }
        });
    });
}

// Crear tarjeta de producto
function createProductCard(product) {
    const mainPrice = product.retailPrice || product.price5 || product.price10 || product.price20 || product.price30;
    const currency = product.retailPrice ? 'ARS' : 'USD';
    
    // Obtener nombre de categoría
    const categories = loadCategories();
    const category = categories.find(c => c.id === product.category);
    const categoryName = category ? category.name : getCategoryDisplayName(product.category);
    
    return `
        <div class="product-card" data-product-id="${product.id}" data-product-name="${product.name}">
            ${product.image ? `
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
            ` : ''}
            
            <div class="product-header">
                <div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-category">${categoryName}</div>
                </div>
            </div>
            
            <div class="product-price">
                ${formatPrice(mainPrice, currency)}
            </div>
            
            <div class="price-details">
                ${product.retailPrice ? `
                    <div class="price-detail">
                        <span class="price-label">Precio Minorista:</span>
                        <span class="price-value">$${formatNumber(product.retailPrice)} <span class="currency">ARS</span></span>
                    </div>
                ` : ''}
                
                ${product.price5 ? `
                    <div class="price-detail">
                        <span class="price-label">x5 Unidades:</span>
                        <span class="price-value">$${product.price5} <span class="currency">USD</span></span>
                    </div>
                ` : ''}
                
                ${product.price10 ? `
                    <div class="price-detail">
                        <span class="price-label">x10 Unidades:</span>
                        <span class="price-value">$${product.price10} <span class="currency">USD</span></span>
                    </div>
                ` : ''}
                
                ${product.price20 ? `
                    <div class="price-detail">
                        <span class="price-label">x20 Unidades:</span>
                        <span class="price-value">$${product.price20} <span class="currency">USD</span></span>
                    </div>
                ` : ''}
                
                ${product.price30 ? `
                    <div class="price-detail">
                        <span class="price-label">x30 Unidades:</span>
                        <span class="price-value">$${product.price30} <span class="currency">USD</span></span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Obtener nombre de categoría para mostrar
function getCategoryDisplayName(category) {
    const names = {
        'masculinos': 'Masculino',
        'femeninos': 'Femenino',
        'unisex': 'Unisex',
        'victoria-secret': 'Victoria Secret'
    };
    return names[category] || category;
}

// Formatear precio
function formatPrice(price, currency) {
    if (!price) return 'Precio a consultar';
    return `$${formatNumber(price)} ${currency}`;
}

// Formatear número
function formatNumber(num) {
    return parseInt(num).toLocaleString('es-AR');
}

// Manejar búsqueda
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    filterProducts(searchTerm);
}

// Filtrar productos
function filterProducts(searchTerm = '') {
    filteredProducts = allProducts.filter(product => {
        const matchesCategory = currentCategory === 'todos' || product.category === currentCategory;
        const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });
    
    renderProducts();
}

// Establecer filtro activo
function setActiveFilter(category) {
    currentCategory = category;
    
    // Actualizar botones
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
}

// Mostrar modal de producto
function showProductModal(product) {
    const categories = loadCategories();
    const category = categories.find(c => c.id === product.category);
    const categoryName = category ? category.name : getCategoryDisplayName(product.category);
    
    const modalHTML = `
        ${product.image ? `
            <div class="modal-product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
        ` : ''}
        <div class="modal-product-name">${product.name}</div>
        <div class="modal-product-category">${categoryName}</div>
        <div class="modal-prices">
            ${product.retailPrice ? `
                <div class="modal-price-item">
                    <span class="modal-price-label">Precio Minorista</span>
                    <span class="modal-price-value">$${formatNumber(product.retailPrice)} ARS</span>
                </div>
            ` : ''}
            
            ${product.price5 ? `
                <div class="modal-price-item">
                    <span class="modal-price-label">x5 Unidades</span>
                    <span class="modal-price-value">$${product.price5} USD</span>
                </div>
            ` : ''}
            
            ${product.price10 ? `
                <div class="modal-price-item">
                    <span class="modal-price-label">x10 Unidades</span>
                    <span class="modal-price-value">$${product.price10} USD</span>
                </div>
            ` : ''}
            
            ${product.price20 ? `
                <div class="modal-price-item">
                    <span class="modal-price-label">x20 Unidades</span>
                    <span class="modal-price-value">$${product.price20} USD</span>
                </div>
            ` : ''}
            
            ${product.price30 ? `
                <div class="modal-price-item">
                    <span class="modal-price-label">x30 Unidades</span>
                    <span class="modal-price-value">$${product.price30} USD</span>
                </div>
            ` : ''}
        </div>
        
        <div style="text-align: center; margin-top: 2rem;">
            <button class="btn-contact" onclick="contactar()">
                <i class="fas fa-phone"></i> Consultar Disponibilidad
            </button>
        </div>
    `;
    
    modalContent.innerHTML = modalHTML;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Configurar cierre del modal
    setupModalClose();
}

// Cerrar modal
function closeProductModal() {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Configurar cierre del modal después de renderizar
function setupModalClose() {
    // Buscar el botón de cerrar dentro del modal
    const closeBtn = document.querySelector('#productModal .close');
    if (closeBtn) {
        // Remover listener anterior si existe
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        newCloseBtn.addEventListener('click', closeProductModal);
    }
}

// Mostrar loading
function showLoading() {
    loading.style.display = 'flex';
    productsContainer.style.display = 'none';
}

// Ocultar loading
function hideLoading() {
    loading.style.display = 'none';
    productsContainer.style.display = 'grid';
}

// Mostrar sin resultados
function showNoResults() {
    noResults.style.display = 'block';
    productsContainer.style.display = 'none';
}

// Ocultar sin resultados
function hideNoResults() {
    noResults.style.display = 'none';
    productsContainer.style.display = 'grid';
}

// Mostrar error
function showError(message) {
    productsContainer.innerHTML = `
        <div style="text-align: center; padding: 4rem 0; color: #ff6b6b;">
            <i class="fas fa-exclamation-triangle" style="font-size: 4rem; margin-bottom: 1rem;"></i>
            <h3>Error</h3>
            <p>${message}</p>
        </div>
    `;
}

// Función de contacto
function contactar() {
    const phone = '+54 9 2914 74-8255';
    const message = 'Hola! Me interesa consultar sobre los perfumes del catálogo.';
    
    // Intentar abrir WhatsApp
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
