let categories = [];
let products = [];
let currentPage = 1;
const productsPerPage = 12;

function loadData() {
    const storedCategories = localStorage.getItem('categories');
    const storedProducts = localStorage.getItem('products');
    
    if (storedCategories) {
        categories = JSON.parse(storedCategories);
    } else {
        categories = ['all', 'super_start', 'adidas', 'nike', 'puma', 'vans', 'reebok', 'watches'];
    }
    
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        products = [];
    }
    
    console.log("Data loaded:", { categories, products });
}

function saveData() {
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('products', JSON.stringify(products));
    console.log("Data saved to localStorage");
    updateMainPage();
}

function displayCategories() {
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = '';
    categories.forEach(category => {
        if (category !== 'all') {
            const li = document.createElement('li');
            li.textContent = category;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.classList.add('delete-category-btn');
            deleteBtn.setAttribute('data-category', category);
            deleteBtn.addEventListener('click', deleteCategory);
            li.appendChild(deleteBtn);
            categoryList.appendChild(li);
        }
    });
}

function deleteCategory(event) {
    const categoryToDelete = event.target.getAttribute('data-category');
    if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryToDelete}"?`)) {
        categories = categories.filter(category => category !== categoryToDelete);
        saveData();
        displayCategories();
        populateCategoryOptions();
        populateCategoryFilter(); // Actualizar el filtro de categorías
    }
}

function displayProducts(page = 1, searchTerm = '', categoryFilter = 'all') {
    const productList = document.getElementById('product-list');
    const pageInfo = document.getElementById('page-info');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    let filteredProducts = products;

    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (categoryFilter !== 'all') {
        if (categoryFilter === 'uncategorized') {
            filteredProducts = filteredProducts.filter(product => 
                !product.category || product.category === ''
            );
        } else {
            filteredProducts = filteredProducts.filter(product => 
                product.category === categoryFilter
            );
        }
    }

    filteredProducts.sort((a, b) => {
        if (categoryFilter === 'price') {
            return a.price - b.price;
        } else if (categoryFilter === 'category') {
            return a.category.localeCompare(b.category);
        } else {
            return a.name.localeCompare(b.name);
        }
    });

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

    productList.innerHTML = '';
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('admin-product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Categoría: ${product.category}</p>
            <p>Precio: $${product.price}</p>
            <p>Tallas: ${product.sizes.join(', ')}</p>
            <button class="edit-product-btn" data-id="${product.id}">Editar</button>
            <button class="delete-product-btn" data-id="${product.id}">Eliminar</button>
        `;
        productList.appendChild(productCard);
    });

    pageInfo.textContent = `Página ${page} de ${totalPages}`;
    prevButton.disabled = page === 1;
    nextButton.disabled = page === totalPages;

    // Añadir event listeners a los botones de editar y eliminar
    addProductButtonListeners();
}

function addProductButtonListeners() {
    const editButtons = document.querySelectorAll('.edit-product-btn');
    const deleteButtons = document.querySelectorAll('.delete-product-btn');

    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            openEditProductModal(productId);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            deleteProduct(productId);
        });
    });
}

function openEditProductModal(productId) {
    console.log('Opening edit modal for product:', productId);
    const product = products.find(p => p.id === productId);
    const editProductModal = document.getElementById('edit-product-modal');
    
    if (product && editProductModal) {
        document.getElementById('edit-product-id').value = product.id;
        document.getElementById('edit-product-name').value = product.name;
        document.getElementById('edit-product-price').value = product.price;
        populateCategoryOptions('edit-product-category');
        document.getElementById('edit-product-category').value = product.category;
        document.getElementById('edit-product-sizes').value = product.sizes.join(', ');
        
        const imagePreview = document.getElementById('edit-product-image-preview');
        if (imagePreview) {
            imagePreview.src = product.image;
            imagePreview.style.display = 'block';
        }
        
        editProductModal.style.display = 'block';
    } else {
        console.error('Product not found or edit modal not found:', productId);
        showMessage('Error: No se pudo abrir el modal de edición', true);
    }
}

function updateProduct(productId, updatedData) {
    console.log('Updating product:', productId, updatedData);
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedData };
        saveData();
        displayProducts();
        showMessage('Producto actualizado exitosamente');
    } else {
        showMessage('Error: Producto no encontrado', true);
    }
}

function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products.splice(index, 1);
            saveData();
            displayProducts();
            showMessage('Producto eliminado exitosamente');
        }
    }
}

function populateCategoryOptions(selectId) {
    const select = document.getElementById(selectId);
    if (select) {
        select.innerHTML = '<option value="">Seleccionar Categoría</option>';
        categories.forEach(category => {
            if (category !== 'all') {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                select.appendChild(option);
            }
        });
    } else {
        console.error('Category select not found:', selectId);
    }
}

function updateMainPage() {
    if (window.opener && !window.opener.closed) {
        console.log('Updating main page');
        window.opener.postMessage('updateCatalog', '*');
    } else {
        console.log('Main page not found or closed');
    }
}

function addCategory(categoryName) {
    console.log('Adding category:', categoryName);
    if (!categories.includes(categoryName)) {
        categories.push(categoryName);
        console.log('Updated categories:', categories);
        saveData();
        displayCategories();
        populateCategoryOptions();
        populateCategoryFilter(); // Actualizar el filtro de categorías
        showMessage('Nueva categoría añadida y guardada: ' + categoryName);
    } else {
        showMessage('Esta categoría ya existe: ' + categoryName, true);
    }
}

function showMessage(message, isError = false) {
    console.log('Showing message:', message);
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.className = isError ? 'message error' : 'message success';

    const container = document.getElementById('admin-panel');
    if (container) {
        container.insertBefore(messageDiv, container.firstChild);
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    } else {
        console.error('Admin panel container not found');
    }
}

// Función para manejar la selección de imagen en el formulario de añadir producto
function handleAddProductImageSelect() {
    const imageInput = document.getElementById('product-image');
    const imagePreview = document.getElementById('add-product-image-preview');

    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        } else {
            imagePreview.src = '';
            imagePreview.style.display = 'none';
        }
    });
}

// Función para manejar la selección de imagen en el formulario de editar producto
function handleEditProductImageSelect() {
    const imageInput = document.getElementById('edit-product-image');
    const imagePreview = document.getElementById('edit-product-image-preview');

    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        } else {
            imagePreview.src = '';
            imagePreview.style.display = 'none';
        }
    });
}

function populateCategoryFilter() {
    const categoryFilter = document.getElementById('product-category-filter');
    categoryFilter.innerHTML = '<option value="all">Todas las categorías</option>';
    categoryFilter.innerHTML += '<option value="uncategorized">Sin categoría</option>';
    categories.forEach(category => {
        if (category !== 'all') {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.appendChild(option);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");
    
    loadData();
    displayProducts();
    displayCategories();
    populateCategoryOptions('product-category');
    populateCategoryFilter();

    const addCategoryBtn = document.getElementById('add-category-btn');
    const addCategoryModal = document.getElementById('add-category-modal');
    const closeButton = addCategoryModal.querySelector('.close');

    if (addCategoryBtn && addCategoryModal) {
        addCategoryBtn.addEventListener('click', () => {
            console.log('Add Category button clicked');
            addCategoryModal.style.display = 'block';
        });
    } else {
        console.error('Add category button or modal not found');
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            console.log('Close button clicked');
            addCategoryModal.style.display = 'none';
        });
    } else {
        console.error('Close button not found');
    }

    window.addEventListener('click', (event) => {
        if (event.target === addCategoryModal) {
            addCategoryModal.style.display = 'none';
        }
    });

    const addCategoryForm = document.getElementById('add-category-form');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Add Category form submitted');
            const newCategoryInput = document.getElementById('category-name');
            if (newCategoryInput) {
                const newCategory = newCategoryInput.value.trim().toLowerCase();
                console.log('New category name:', newCategory);
                if (newCategory) {
                    addCategory(newCategory);
                    addCategoryModal.style.display = 'none';
                    this.reset();
                } else {
                    console.log('Category name is empty');
                    showMessage('El nombre de la categoría no puede estar vacío', true);
                }
            } else {
                console.error('Category name input not found');
                showMessage('Error: No se encontró el campo de nombre de categoría', true);
            }
        });
    } else {
        console.error('Add category form not found');
    }

    const editProductForm = document.getElementById('edit-product-form');
    if (editProductForm) {
        editProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Edit Product form submitted');
            const productId = document.getElementById('edit-product-id').value;
            const imageInput = document.getElementById('edit-product-image');
            const imageFile = imageInput.files[0];

            const updateProductData = (imageSrc) => {
                const updatedData = {
                    name: document.getElementById('edit-product-name').value,
                    price: parseFloat(document.getElementById('edit-product-price').value),
                    category: document.getElementById('edit-product-category').value,
                    sizes: document.getElementById('edit-product-sizes').value.split(',').map(size => size.trim()),
                    image: imageSrc
                };

                console.log('Updated product data:', updatedData);
                
                // Encuentra el índice del producto en el array
                const productIndex = products.findIndex(p => p.id === productId);
                if (productIndex !== -1) {
                    // Actualiza el producto en el array
                    products[productIndex] = { ...products[productIndex], ...updatedData };
                    saveData();
                    displayProducts();
                    document.getElementById('edit-product-modal').style.display = 'none';
                    showMessage('Producto actualizado exitosamente');
                } else {
                    showMessage('Error: Producto no encontrado', true);
                }
            };

            if (imageFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    updateProductData(e.target.result);
                }
                reader.readAsDataURL(imageFile);
            } else {
                // Si no se seleccionó una nueva imagen, mantener la imagen existente
                const existingProduct = products.find(p => p.id === productId);
                updateProductData(existingProduct ? existingProduct.image : '');
            }
        });
    } else {
        console.error('Edit product form not found');
    }

    const editProductModal = document.getElementById('edit-product-modal');
    const closeEditButton = editProductModal.querySelector('.close');
    
    function closeEditModal() {
        console.log('Closing edit product modal');
        editProductModal.style.display = 'none';
    }

    if (closeEditButton) {
        closeEditButton.addEventListener('click', closeEditModal);
    } else {
        console.error('Close edit modal button not found');
    }

    window.addEventListener('click', (event) => {
        if (event.target === editProductModal) {
            closeEditModal();
        }
    });

    const addProductBtn = document.getElementById('add-product-btn');
    const addProductModal = document.getElementById('add-product-modal');
    
    if (addProductBtn && addProductModal) {
        addProductBtn.addEventListener('click', () => {
            console.log('Add Product button clicked');
            addProductModal.style.display = 'block';
            populateCategoryOptions('product-category');
        });
    } else {
        console.error('Add product button or modal not found');
    }

    const closeAddProductButton = addProductModal.querySelector('.close');
    if (closeAddProductButton) {
        closeAddProductButton.addEventListener('click', () => {
            addProductModal.style.display = 'none';
        });
    }

    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Add Product form submitted');
            
            const imageInput = document.getElementById('product-image');
            const imageFile = imageInput.files[0];

            if (imageFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const newProductData = {
                        id: 'P' + (products.length + 1),
                        name: document.getElementById('product-name').value,
                        price: parseFloat(document.getElementById('product-price').value),
                        category: document.getElementById('product-category').value,
                        sizes: document.getElementById('product-sizes').value.split(',').map(size => size.trim()),
                        image: e.target.result // Guardamos la imagen como una cadena base64
                    };

                    console.log('New product data:', newProductData);

                    products.push(newProductData);
                    saveData();
                    displayProducts();
                    addProductForm.reset();
                    document.getElementById('add-product-image-preview').style.display = 'none';
                    document.getElementById('add-product-modal').style.display = 'none';
                    showMessage('Nuevo producto añadido exitosamente');
                }
                reader.readAsDataURL(imageFile);
            } else {
                showMessage('Por favor, selecciona una imagen para el producto', true);
            }
        });
    } else {
        console.error('Add product form not found');
    }

    const productSearch = document.getElementById('product-search');
    const categoryFilter = document.getElementById('product-category-filter');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');

    productSearch.addEventListener('input', () => {
        currentPage = 1;
        displayProducts(currentPage, productSearch.value, categoryFilter.value);
    });

    categoryFilter.addEventListener('change', () => {
        currentPage = 1;
        displayProducts(currentPage, productSearch.value, categoryFilter.value);
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayProducts(currentPage, productSearch.value, categoryFilter.value);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(products.length / productsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayProducts(currentPage, productSearch.value, categoryFilter.value);
        }
    });

    // Inicializar la visualización de productos
    displayProducts();

    handleAddProductImageSelect();
    handleEditProductImageSelect();

    const adminAccountBtn = document.getElementById('admin-account-btn');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const adminAccountModal = document.getElementById('admin-account-modal');
    const adminAccountForm = document.getElementById('admin-account-form');
    const adminAccountMessage = document.getElementById('admin-account-message');
    const closeSpan = adminAccountModal.querySelector('.close');

    adminAccountBtn.addEventListener('click', () => {
        adminAccountModal.style.display = 'block';
        // Cargar datos actuales del administrador
        const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
        document.getElementById('admin-email').value = adminData.email || '';
    });

    closeSpan.addEventListener('click', () => {
        adminAccountModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === adminAccountModal) {
            adminAccountModal.style.display = 'none';
        }
    });

    adminLogoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isAdminLoggedIn');
        window.location.href = 'login.html';
    });

    adminAccountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('admin-email').value;
        const currentPassword = document.getElementById('admin-current-password').value;
        const newPassword = document.getElementById('admin-new-password').value;
        const confirmPassword = document.getElementById('admin-confirm-password').value;

        // Verificar la contraseña actual
        if (currentPassword !== localStorage.getItem('adminPassword')) {
            adminAccountMessage.textContent = 'Contraseña actual incorrecta';
            return;
        }

        // Actualizar el correo electrónico
        let adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
        adminData.email = email;
        localStorage.setItem('adminData', JSON.stringify(adminData));

        // Actualizar la contraseña si se proporciona una nueva
        if (newPassword) {
            if (newPassword !== confirmPassword) {
                adminAccountMessage.textContent = 'Las nuevas contraseñas no coinciden';
                return;
            }
            localStorage.setItem('adminPassword', newPassword);
        }

        adminAccountMessage.textContent = 'Cuenta actualizada exitosamente';
        setTimeout(() => {
            adminAccountModal.style.display = 'none';
            adminAccountMessage.textContent = '';
        }, 2000);
    });
});
function openLightbox(imageSrc, altText) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = imageSrc;
    lightboxImg.alt = altText;
    lightbox.style.display = 'flex';
}
