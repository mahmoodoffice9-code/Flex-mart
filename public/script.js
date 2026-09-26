let cartCount = 0;

async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        
        const grid = document.getElementById('product-grid');
        grid.innerHTML = '';

        if (products.length === 0) {
            grid.innerHTML = `<p class="text-gray-500 col-span-full text-center py-10">No products found in database. Add some via MongoDB Atlas!</p>`;
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = "bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col justify-between shadow-lg hover:border-amber-500 transition";
            
            card.innerHTML = `
                <div>
                    <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.name}" class="w-full h-48 object-cover rounded-lg mb-4 bg-gray-700">
                    <h3 class="font-bold text-lg text-white mb-1">${product.name}</h3>
                    <p class="text-gray-400 text-sm mb-4">${product.description || 'No description available.'}</p>
                </div>
                <div class="flex justify-between items-center mt-auto">
                    <span class="text-amber-400 font-bold text-lg">$${product.price}</span>
                    <button onclick="addToCart()" class="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition cursor-pointer">Add to Cart</button>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        document.getElementById('product-grid').innerHTML = `<p class="text-red-500 col-span-full text-center py-10">Failed to load products. Check your API connection.</p>`;
    }
}

function addToCart() {
    cartCount++;
    document.getElementById('cart-count').innerText = `Cart: ${cartCount}`;
}

// Load products when page opens
fetchProducts();
