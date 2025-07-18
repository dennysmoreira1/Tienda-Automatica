const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Database connection
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err);
        return;
    }
    console.log('Connected to SQLite database');
    downloadAdvancedImages();
});

function downloadAdvancedImages() {
    console.log('🌐 Advanced Product Image Downloader\n');

    // Multiple image sources for each product
    const productImageSources = [
        {
            name: 'Coca Cola 600ml',
            sources: [
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
            ],
            filename: 'coca-cola-600ml.jpg'
        },
        {
            name: 'Doritos Nacho',
            sources: [
                'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop',
            ],
            filename: 'doritos-nacho.jpg'
        },
        {
            name: 'Pan de Molde',
            sources: [
                'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
            ],
            filename: 'pan-molde.jpg'
        },
        {
            name: 'Leche Entera 1L',
            sources: [
                'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
            ],
            filename: 'leche-entera.jpg'
        },
        {
            name: 'Manzanas Rojas',
            sources: [
                'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
            ],
            filename: 'manzanas-rojas.jpg'
        }
    ];

    console.log(`Found ${productImageSources.length} products to process...\n`);

    let processed = 0;
    productImageSources.forEach((product) => {
        downloadWithFallback(product, (success) => {
            processed++;

            if (processed === productImageSources.length) {
                console.log('\n🎉 All products processed!');
                showFinalSummary();
            }
        });
    });
}

function downloadWithFallback(product, callback) {
    console.log(`🔄 Processing: ${product.name}`);

    let currentSourceIndex = 0;

    function tryNextSource() {
        if (currentSourceIndex >= product.sources.length) {
            console.log(`❌ Failed to download image for: ${product.name} (all sources failed)`);
            callback(false);
            return;
        }

        const url = product.sources[currentSourceIndex];
        console.log(`  📥 Trying source ${currentSourceIndex + 1}/${product.sources.length}: ${url.substring(0, 50)}...`);

        downloadImage(url, product.filename, (success) => {
            if (success) {
                // Update database with image path
                const imagePath = `/uploads/${product.filename}`;
                db.run(
                    'UPDATE products SET image = ? WHERE name = ?',
                    [imagePath, product.name],
                    function (err) {
                        if (err) {
                            console.error(`❌ Error updating ${product.name}:`, err);
                            callback(false);
                        } else {
                            console.log(`✅ Successfully downloaded and updated: ${product.name}`);
                            callback(true);
                        }
                    }
                );
            } else {
                currentSourceIndex++;
                console.log(`  ⚠️  Source ${currentSourceIndex} failed, trying next...`);
                setTimeout(tryNextSource, 1000); // Wait 1 second before trying next source
            }
        });
    }

    tryNextSource();
}

function downloadImage(url, filename, callback) {
    const filepath = path.join(__dirname, 'uploads', filename);
    const file = fs.createWriteStream(filepath);

    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);

            file.on('finish', () => {
                file.close();
                callback(true);
            });

            file.on('error', (err) => {
                console.log(`  ❌ File write error for ${filename}:`, err.message);
                callback(false);
            });
        } else {
            console.log(`  ❌ HTTP ${response.statusCode} for ${filename}`);
            callback(false);
        }
    });

    request.setTimeout(10000, () => {
        console.log(`  ❌ Timeout for ${filename}`);
        request.destroy();
        callback(false);
    });

    request.on('error', (err) => {
        console.log(`  ❌ Network error for ${filename}:`, err.message);
        callback(false);
    });
}

function showFinalSummary() {
    console.log('\n📋 Final Summary of Downloaded Images\n');

    db.all('SELECT id, name, category, price, image FROM products ORDER BY id', (err, rows) => {
        if (err) {
            console.error('Error fetching products:', err);
            return;
        }

        rows.forEach(row => {
            const status = row.image ? '✅' : '❌';
            const imageInfo = row.image ? `(${row.image})` : 'Sin imagen';
            console.log(`${status} ID ${row.id}: ${row.name}`);
            console.log(`   Categoría: ${row.category || 'Sin categoría'}`);
            console.log(`   Precio: $${row.price.toFixed(2)}`);
            console.log(`   Imagen: ${imageInfo}`);
            console.log('');
        });

        const withImages = rows.filter(row => row.image).length;
        const total = rows.length;

        console.log(`📊 Statistics:`);
        console.log(`   Total products: ${total}`);
        console.log(`   With images: ${withImages}`);
        console.log(`   Without images: ${total - withImages}`);
        console.log(`   Success rate: ${((withImages / total) * 100).toFixed(1)}%`);

        if (withImages === total) {
            console.log('\n🎉 ¡Perfect! All products have real images from internet!');
            console.log('\n💡 Next steps:');
            console.log('   1. Start the server: npm start');
            console.log('   2. Start the client: cd ../client && npm start');
            console.log('   3. View products with real images in the catalog');
            console.log('   4. Replace images via admin panel if needed');
        } else {
            console.log('\n⚠️  Some products are missing images.');
            console.log('   You can manually upload images via the admin panel.');
        }

        db.close();
    });
} 