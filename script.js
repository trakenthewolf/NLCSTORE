// Product data
window.products = [// Super Start
    {
        id: 'SS1',
        name: 'Super Start Floral',
        price: 23900,
        category: 'super_start',
        sizes: [35, 36, 37, 40],
        image: 'super_start_ss1.jpg'
    }, {
        id: 'SS2',
        name: 'Super Start Orange',
        price: 23900,
        category: 'super_start',
        sizes: [36, 38, 39, 40],
        image: 'super_start_ss2.jpg'
    }
    // Add more products for other categories (Puma, Vans, Reebok, Watches) here...
    ];
    
    let cart = [];

    // Function to display products
    function displayProducts(category = 'all') {
        const sneakerGrid = document.getElementById('sneaker-grid');
        sneakerGrid.innerHTML = '';
        products.forEach(product => {
            if (category === 'all' || product.category === category) {
                const productCard = document.createElement('div');
                productCard.classList.add('sneaker-card');
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <h3>${product.name}</h3>
                    <p>Precio: $${product.price}</p>
                    <p>Talle Argentino:</p>
                    <select class="size-select">
                        ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                    </select>
                    <button class="add-to-cart-btn" data-id="${product.id}">Añadir al carrito</button>
                `;
                sneakerGrid.appendChild(productCard);
    
                const productImage = productCard.querySelector('.product-image');
                productImage.addEventListener('click', () => openLightbox(product.image, product.name));
    
                const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
                const sizeSelect = productCard.querySelector('.size-select');
                addToCartBtn.addEventListener('click', () => addToCart(product.id, sizeSelect.value));
            }
        });
    }

    function openLightbox(imageSrc, productName) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        lightboxImg.src = imageSrc;
        lightboxImg.alt = productName;
        lightbox.style.display = 'flex';
    }
    
    // Function to add item to cart
    function addToCart(productId, selectedSize) {
        const product = products.find(p => p.id === productId);
    
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            size: selectedSize,
            quantity: 1
        };
    
        const existingItemIndex = cart.findIndex(item => item.id === cartItem.id && item.size === cartItem.size);
    
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity++;
        } else {
            cart.push(cartItem);
        }
    
        updateCart();
        updateCartCounter();
    }
    
    // Function to update cart
    function updateCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        cartItems.innerHTML = '';
        let total = 0;
    
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            const itemTotal = item.price * item.quantity;
            li.innerHTML = `
                ${item.name} - Size: ${item.size} - Quantity: ${item.quantity} - $${itemTotal.toLocaleString('es-AR')}
                <button class="remove-item" data-index="${index}">Remove</button>
            `;
            cartItems.appendChild(li);
            total += itemTotal;
        });
    
        cartTotal.textContent = total.toLocaleString('es-AR');
    
        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }
    
    // Function to remove item from cart
    function removeFromCart(event) {
        const index = parseInt(event.target.getAttribute('data-index'));
        cart.splice(index, 1);
        updateCart();
        updateCartCounter();
    }
    
    // Function to handle checkout
    function checkout() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Por favor, inicia sesión para finalizar la compra');
            window.location.href = 'login.html';
            return;
        }

        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        let message = `Orden de ${currentUser.email}:\n\n`;
        cart.forEach(item => {
            message += `${item.name} - Talle: ${item.size} - Cantidad: ${item.quantity} - $${item.price * item.quantity}\n`;
        });
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        message += `\nTotal: $${total}`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/5492616012677?text=${encodedMessage}`, '_blank');

        cart = [];
        updateCart();
        updateCartCounter();
    }
    
    // Event listeners
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelector('main').style.display = 'block';
        updateCartCounter();
    
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const category = event.target.getAttribute('data-category');
                displayProducts(category);
    
                // Update active class
                filterButtons.forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');
            });
        });
    
        const cartBtn = document.getElementById('cart-btn');
        const cartModal = document.getElementById('cart-modal');
        const closeBtn = document.querySelector('.close');
    
        cartBtn.addEventListener('click', () => {
            cartModal.style.display = 'block';
            updateCart();
        });
    
        closeBtn.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
    
        window.addEventListener('click', (event) => {
            if (event.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    
        const checkoutBtn = document.getElementById('checkout-btn');
        checkoutBtn.addEventListener('click', checkout);

        const lightbox = document.getElementById('lightbox');
        const lightboxClose = document.querySelector('.lightbox-close');

        lightboxClose.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });

        const guestButtons = document.getElementById('guest-buttons');
        const userPanel = document.getElementById('user-panel');
        const accountBtn = document.getElementById('account-btn');
        const userEmail = document.getElementById('user-email');
        const logoutBtn = document.getElementById('logout-btn');

        function updateUserInterface() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                guestButtons.style.display = 'none';
                userPanel.style.display = 'block';
                userEmail.textContent = currentUser.email;
            } else {
                guestButtons.style.display = 'block';
                userPanel.style.display = 'none';
            }
        }

        // Llamar a updateUserInterface al cargar la página
        updateUserInterface();

        accountBtn.addEventListener('click', () => {
            // Redirigir a la página de cuenta del usuario
            window.location.href = 'account.html';
        });

        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            updateUserInterface();
            // Opcional: recargar la página o redirigir al inicio
            window.location.reload();
        });

        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');

        loginBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });

        registerBtn.addEventListener('click', () => {
            window.location.href = 'register.html';
        });

        displayProducts();
    });
    
    // Update cart counter
    function updateCartCounter() {
        const cartCounter = document.getElementById('cart-counter');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCounter.textContent = totalItems;
    }

    function updateCatalog() {
        const storedCategories = localStorage.getItem('categories');
        const storedProducts = localStorage.getItem('products');
        
        if (storedCategories) {
            categories = JSON.parse(storedCategories);
            updateCategoryFilters();
        }
        
        if (storedProducts) {
            products = JSON.parse(storedProducts);
            displayProducts();
        }
    }

    function updateCategoryFilters() {
        const filtersSection = document.getElementById('filters');
        filtersSection.innerHTML = '<button class="filter-btn active" data-category="all">Todos</button>';
        categories.forEach(category => {
            if (category !== 'all') {
                const button = document.createElement('button');
                button.classList.add('filter-btn');
                button.setAttribute('data-category', category);
                button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                filtersSection.appendChild(button);
            }
        });
        
        // Re-add event listeners to filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const category = event.target.getAttribute('data-category');
                displayProducts(category);
                filterButtons.forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');
            });
        });
    }

    // Call updateCatalog when the page loads
    document.addEventListener('DOMContentLoaded', () => {
        updateCatalog();
        // ... rest of your existing code ...
    });
