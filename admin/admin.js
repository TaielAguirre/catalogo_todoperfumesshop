// Panel de Administración - Lógica Principal

let currentEditingProductId = null;
let currentEditingCategoryId = null;

// Nota: loadCategories está definida en data-manager.js y la usamos directamente

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
    // Asegurar que los datos estén inicializados (migrar CSV si localStorage está vacío)
    initializeData();

    checkAuth();
    setupEventListeners();
    loadDashboard();
    loadProductsAdmin();
    loadCategoriesAdmin();
});

// Verificar autenticación
function checkAuth() {
    if (isAuthenticated()) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'flex';
    } else {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminPanel').style.display = 'none';
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            switchSection(section);
        });
    });

    // Búsqueda de productos
    const productSearch = document.getElementById('productSearch');
    if (productSearch) {
        productSearch.addEventListener('input', debounce(filterProducts, 300));
    }

    // Filtro de categoría
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }

    // Formulario de producto
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }

    // Preview de imagen
    const productImage = document.getElementById('productImage');
    if (productImage) {
        productImage.addEventListener('change', handleImagePreview);
    }

    // Formulario de categoría
    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
        categoryForm.addEventListener('submit', handleCategorySubmit);
    }
}

// Manejar login
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    const result = login(username, password);

    if (result.success) {
        errorDiv.style.display = 'none';
        checkAuth();
    } else {
        errorDiv.textContent = result.message;
        errorDiv.style.display = 'block';
    }
}

// Cerrar sesión
function handleLogout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        logout();
    }
}

// Cambiar sección
function switchSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.remove('active');
    });

    // Mostrar sección seleccionada
    document.getElementById(`${section}Section`).classList.add('active');

    // Actualizar botones de navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    // Cargar datos según la sección
    if (section === 'dashboard') {
        loadDashboard();
    } else if (section === 'products') {
        loadProductsAdmin();
    } else if (section === 'categories') {
        loadCategoriesAdmin();
    }
}

// Cargar dashboard
function loadDashboard() {
    const stats = getStatistics();

    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statMasculinos').textContent = stats.byCategory.masculinos || 0;
    document.getElementById('statFemeninos').textContent = stats.byCategory.femeninos || 0;
    document.getElementById('statUnisex').textContent = stats.byCategory.unisex || 0;
    document.getElementById('statVictoriaSecret').textContent = stats.byCategory['victoria-secret'] || 0;

    // Últimos productos agregados
    const recentContainer = document.getElementById('recentProducts');
    if (recentContainer) {
        recentContainer.innerHTML = stats.recent.length > 0
            ? stats.recent.map(p => `
                <div class="recent-item">
                    <div class="recent-item-name">${p.name}</div>
                    <div class="recent-item-date">${formatDate(p.createdAt)}</div>
                </div>
            `).join('')
            : '<p style="color: #888;">No hay productos recientes</p>';
    }

    // Productos actualizados
    const updatedContainer = document.getElementById('updatedProducts');
    if (updatedContainer) {
        updatedContainer.innerHTML = stats.updated.length > 0
            ? stats.updated.map(p => `
                <div class="recent-item">
                    <div class="recent-item-name">${p.name}</div>
                    <div class="recent-item-date">Actualizado: ${formatDate(p.updatedAt)}</div>
                </div>
            `).join('')
            : '<p style="color: #888;">No hay productos actualizados</p>';
    }
}

// Cargar productos en admin
function loadProductsAdmin() {
    const products = loadProducts();
    const tbody = document.getElementById('productsTableBody');
    const categoryFilter = document.getElementById('categoryFilter');

    // Llenar filtro de categorías
    const categories = loadCategories();
    categoryFilter.innerHTML = '<option value="">Todas las categorías</option>' +
        categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');

    // Renderizar productos
    renderProductsTable(products);
}

// Renderizar tabla de productos
function renderProductsTable(products) {
    const tbody = document.getElementById('productsTableBody');

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #888;">No hay productos</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => {
        const category = loadCategories().find(c => c.id === product.category);
        return `
            <tr>
                <td>
                    ${product.image
                ? `<img src="${product.image}" alt="${product.name}" class="product-image-cell">`
                : '<div class="product-image-cell" style="background: rgba(255,215,0,0.2); display: flex; align-items: center; justify-content: center; color: #888; font-size: 0.8rem;">Sin imagen</div>'
            }
                </td>
                <td class="product-name-cell">${product.name}</td>
                <td>
                    <span class="product-category-cell">${category ? category.name : product.category}</span>
                </td>
                <td>${product.retailPrice ? `$${formatNumber(product.retailPrice)} ARS` : '-'}</td>
                <td>${product.price5 ? `$${product.price5} USD` : '-'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="editProduct('${product.id}')">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-delete" onclick="deleteProductConfirm('${product.id}')">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Filtrar productos
function filterProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const products = loadProducts();

    const filtered = products.filter(product => {
        const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    renderProductsTable(filtered);
}

// Abrir formulario de producto
function openProductForm(productId = null) {
    currentEditingProductId = productId;
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('modalProductTitle');
    const imageInput = document.getElementById('productImage');
    const imageLabel = document.querySelector('label[for="productImage"]');

    // Limpiar formulario
    form.reset();

    // Llenar categorías en el select
    const categories = loadCategories();
    const categorySelect = document.getElementById('productCategory');
    categorySelect.innerHTML = '<option value="">Seleccionar...</option>' +
        categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');

    if (productId) {
        // Modo edición
        title.textContent = 'Editar Producto';

        const product = getProductById(productId);
        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('retailPrice').value = product.retailPrice || '';
            document.getElementById('price5').value = product.price5 || '';
            document.getElementById('price10').value = product.price10 || '';
            document.getElementById('price20').value = product.price20 || '';
            document.getElementById('price30').value = product.price30 || '';

            // Mostrar imagen existente
            const preview = document.getElementById('imagePreview');
            if (product.image) {
                // Producto con imagen: hacer campo opcional
                imageInput.removeAttribute('required');
                if (imageLabel) {
                    imageLabel.innerHTML = 'Imagen del Producto <span style="color: #888; font-weight: normal;">(opcional - dejar vacío para mantener la actual)</span>';
                }
                preview.innerHTML = `<img src="${product.image}" alt="Preview">`;
                preview.classList.remove('empty');
            } else {
                // Producto sin imagen: hacer campo obligatorio
                imageInput.setAttribute('required', 'required');
                if (imageLabel) {
                    imageLabel.innerHTML = 'Imagen del Producto * <span style="color: #ff6b6b; font-weight: normal;">(obligatorio - este producto no tiene imagen)</span>';
                }
                preview.innerHTML = '';
                preview.classList.add('empty');
            }
        }
    } else {
        // Modo nuevo producto
        title.textContent = 'Nuevo Producto';
        // Hacer imagen obligatoria en nuevo producto
        imageInput.setAttribute('required', 'required');
        if (imageLabel) {
            imageLabel.innerHTML = 'Imagen del Producto *';
        }
        // Limpiar preview
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = '';
        preview.classList.add('empty');
    }

    modal.style.display = 'block';
}

// Cerrar formulario de producto
function closeProductForm() {
    document.getElementById('productModal').style.display = 'none';
    currentEditingProductId = null;
    document.getElementById('productForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('imagePreview').classList.add('empty');
    document.getElementById('productFormError').style.display = 'none';

    // Restaurar estado del campo de imagen
    const imageInput = document.getElementById('productImage');
    const imageLabel = document.querySelector('label[for="productImage"]');
    imageInput.removeAttribute('required');
    if (imageLabel) {
        imageLabel.innerHTML = 'Imagen del Producto *';
    }
}

// Preview de imagen
function handleImagePreview(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');

    if (file) {
        compressImage(file, 800, 0.8, function (base64, error) {
            if (error) {
                showProductError(error);
                return;
            }

            preview.innerHTML = `<img src="${base64}" alt="Preview">`;
            preview.classList.remove('empty');
        });
    } else {
        preview.innerHTML = '';
        preview.classList.add('empty');
    }
}

// Manejar envío de formulario de producto
function handleProductSubmit(e) {
    e.preventDefault();
    const errorDiv = document.getElementById('productFormError');
    errorDiv.style.display = 'none';

    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const retailPrice = document.getElementById('retailPrice').value;
    const price5 = document.getElementById('price5').value;
    const price10 = document.getElementById('price10').value;
    const price20 = document.getElementById('price20').value;
    const price30 = document.getElementById('price30').value;
    const imageFile = document.getElementById('productImage').files[0];

    // Validaciones
    if (!name) {
        showProductError('El nombre del producto es obligatorio');
        return;
    }

    if (!category) {
        showProductError('La categoría es obligatoria');
        return;
    }

    // Obtener imagen
    const getImage = (callback) => {
        if (imageFile) {
            // Nueva imagen subida
            compressImage(imageFile, 800, 0.8, callback);
        } else if (currentEditingProductId) {
            // En edición, usar imagen existente si no se sube nueva
            const existingProduct = getProductById(currentEditingProductId);
            if (existingProduct && existingProduct.image) {
                // Mantener imagen existente
                callback(existingProduct.image, null);
            } else {
                // Producto sin imagen, requerir que se suba una
                callback('', 'La imagen es obligatoria. Este producto no tiene imagen.');
            }
        } else {
            // Nuevo producto sin imagen
            callback('', 'La imagen es obligatoria para nuevos productos');
        }
    };

    getImage((imageBase64, error) => {
        if (error) {
            showProductError(error);
            return;
        }

        const productData = {
            name: name,
            category: category,
            image: imageBase64,
            retailPrice: retailPrice || null,
            price5: price5 || null,
            price10: price10 || null,
            price20: price20 || null,
            price30: price30 || null
        };

        if (currentEditingProductId) {
            // Actualizar producto existente
            updateProduct(currentEditingProductId, productData);
        } else {
            // Crear nuevo producto
            addProduct(productData);
        }

        closeProductForm();
        loadProductsAdmin();
        loadDashboard();

        // Mostrar mensaje de éxito
        alert(currentEditingProductId ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
    });
}

// Mostrar error en formulario de producto
function showProductError(message) {
    const errorDiv = document.getElementById('productFormError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Editar producto
function editProduct(productId) {
    openProductForm(productId);
}

// Confirmar eliminación de producto
function deleteProductConfirm(productId) {
    const product = getProductById(productId);
    if (product && confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
        deleteProduct(productId);
        loadProductsAdmin();
        loadDashboard();
        alert('Producto eliminado exitosamente');
    }
}

// Cargar categorías (renderiza el grid y devuelve las categorías)
function loadCategoriesAdmin() {
    const categories = loadCategories();  // Usa la función de data-manager.js
    const grid = document.getElementById('categoriesGrid');

    if (grid) {
        grid.innerHTML = categories.map(cat => `
            <div class="category-card">
                <div class="category-icon">
                    <i class="fas fa-${cat.icon || 'tag'}"></i>
                </div>
                <div class="category-name">${cat.name}</div>
                <div class="category-actions">
                    <button class="btn-edit" onclick="editCategory('${cat.id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    ${cat.id !== 'masculinos' && cat.id !== 'femeninos' && cat.id !== 'unisex' && cat.id !== 'victoria-secret'
                ? `<button class="btn-delete" onclick="deleteCategoryConfirm('${cat.id}')">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>`
                : ''
            }
                </div>
            </div>
        `).join('');
    }

    return categories;
}

// Abrir formulario de categoría
function openCategoryForm(categoryId = null) {
    currentEditingCategoryId = categoryId;
    const modal = document.getElementById('categoryModal');
    const form = document.getElementById('categoryForm');
    const title = document.getElementById('modalCategoryTitle');

    if (categoryId) {
        // Modo edición
        title.textContent = 'Editar Categoría';
        const categories = loadCategories();
        const category = categories.find(c => c.id === categoryId);
        if (category) {
            document.getElementById('categoryName').value = category.name;
            document.getElementById('categoryIcon').value = category.icon || '';
        }
    } else {
        // Modo creación
        title.textContent = 'Nueva Categoría';
        form.reset();
    }

    modal.style.display = 'block';
}

// Cerrar formulario de categoría
function closeCategoryForm() {
    document.getElementById('categoryModal').style.display = 'none';
    currentEditingCategoryId = null;
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryFormError').style.display = 'none';
}

// Manejar envío de formulario de categoría
function handleCategorySubmit(e) {
    e.preventDefault();
    const errorDiv = document.getElementById('categoryFormError');
    errorDiv.style.display = 'none';

    const name = document.getElementById('categoryName').value.trim();
    const icon = document.getElementById('categoryIcon').value.trim();

    if (!name) {
        errorDiv.textContent = 'El nombre de la categoría es obligatorio';
        errorDiv.style.display = 'block';
        return;
    }

    const categories = loadCategories();

    if (currentEditingCategoryId) {
        // Actualizar categoría existente
        const index = categories.findIndex(c => c.id === currentEditingCategoryId);
        if (index !== -1) {
            categories[index].name = name;
            categories[index].icon = icon || 'tag';
            saveCategories(categories);
        }
    } else {
        // Crear nueva categoría
        const newCategory = {
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name: name,
            icon: icon || 'tag'
        };
        categories.push(newCategory);
        saveCategories(categories);
    }

    closeCategoryForm();
    loadCategoriesAdmin();
    loadProductsAdmin(); // Recargar para actualizar selects

    alert(currentEditingCategoryId ? 'Categoría actualizada exitosamente' : 'Categoría creada exitosamente');
}

// Editar categoría
function editCategory(categoryId) {
    openCategoryForm(categoryId);
}

// Confirmar eliminación de categoría
function deleteCategoryConfirm(categoryId) {
    const categories = loadCategories();
    const category = categories.find(c => c.id === categoryId);

    if (category && confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.name}"?`)) {
        // Verificar si hay productos usando esta categoría
        const products = loadProducts();
        const productsUsingCategory = products.filter(p => p.category === categoryId);

        if (productsUsingCategory.length > 0) {
            alert(`No se puede eliminar la categoría porque tiene ${productsUsingCategory.length} producto(s) asociado(s).`);
            return;
        }

        const filtered = categories.filter(c => c.id !== categoryId);
        saveCategories(filtered);
        loadCategoriesAdmin();
        alert('Categoría eliminada exitosamente');
    }
}

// Utilidades
function formatNumber(num) {
    return parseInt(num).toLocaleString('es-AR');
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

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

