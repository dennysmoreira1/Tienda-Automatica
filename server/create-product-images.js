const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Database connection
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err);
        return;
    }
    console.log('Connected to SQLite database');
    createProductImages();
});

function createProductImages() {
    // Get all products from database
    db.all('SELECT id, name, category, price FROM products', (err, products) => {
        if (err) {
            console.error('Error fetching products:', err);
            return;
        }

        console.log(`Found ${products.length} products to update with images...`);

        products.forEach((product, index) => {
            // Create SVG image for the product
            const svgContent = createProductSVG(product);
            const imagePath = `/uploads/product-${product.id}.svg`;
            const fullPath = path.join(__dirname, 'uploads', `product-${product.id}.svg`);

            // Write the SVG file
            fs.writeFileSync(fullPath, svgContent);

            // Update database with image path
            db.run(
                'UPDATE products SET image = ? WHERE id = ?',
                [imagePath, product.id],
                function (err) {
                    if (err) {
                        console.error(`Error updating product ${product.name}:`, err);
                    } else {
                        console.log(`✅ Created image for: ${product.name}`);
                    }

                    // Check if this is the last item
                    if (index === products.length - 1) {
                        console.log('\n🎉 All product images have been created!');
                        console.log('\n📋 Products with images:');

                        // Show all products with their images
                        db.all('SELECT name, image FROM products ORDER BY id', (err, rows) => {
                            if (err) {
                                console.error('Error fetching products:', err);
                            } else {
                                rows.forEach(row => {
                                    const status = row.image ? '✅' : '❌';
                                    console.log(`${status} ${row.name}: ${row.image || 'Sin imagen'}`);
                                });
                            }

                            console.log('\n💡 Note: These are generated product images. You can replace them with real photos through the admin panel!');
                            db.close();
                        });
                    }
                }
            );
        });
    });
}

function createProductSVG(product) {
    const colors = {
        'Bebidas': { bg: '#ff6b6b', icon: '🥤' },
        'Snacks': { bg: '#4ecdc4', icon: '🍿' },
        'Panadería': { bg: '#45b7d1', icon: '🍞' },
        'Lácteos': { bg: '#96ceb4', icon: '🥛' },
        'Frutas': { bg: '#feca57', icon: '🍎' }
    };

    const productColor = colors[product.category] || { bg: '#7fd3b6', icon: '🛒' };

    return `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${productColor.bg}20;stop-opacity:1" />
      <stop offset="100%" style="stop-color:${productColor.bg}40;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#00000020"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="300" height="200" fill="url(#bg)" rx="15"/>
  
  <!-- Product Card -->
  <rect x="20" y="20" width="260" height="160" fill="white" rx="12" filter="url(#shadow)"/>
  
  <!-- Product Icon -->
  <text x="150" y="80" font-family="Arial, sans-serif" font-size="48" text-anchor="middle" fill="${productColor.bg}">
    ${productColor.icon}
  </text>
  
  <!-- Product Name -->
  <text x="150" y="110" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#2d5a4a">
    ${product.name}
  </text>
  
  <!-- Category Badge -->
  <rect x="100" y="120" width="100" height="20" fill="${productColor.bg}" rx="10"/>
  <text x="150" y="133" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="white">
    ${product.category || 'General'}
  </text>
  
  <!-- Price -->
  <text x="150" y="155" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#7fd3b6">
    $${product.price.toFixed(2)}
  </text>
  
  <!-- Product ID -->
  <text x="150" y="175" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#8a8a9a">
    ID: ${product.id}
  </text>
</svg>`;
} 