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
    downloadProductImages();
});

function downloadProductImages() {
    console.log('🌐 Downloading real product images from internet...\n');

    // Product image URLs from internet
    const productImages = [
        {
            name: 'Coca Cola 600ml',
            url: 'https://www.coca-cola.com/content/dam/onexp/mx/es/brands/coca-cola/coca-cola-original-600ml.png',
            filename: 'coca-cola-600ml.jpg'
        },
        {
            name: 'Doritos Nacho',
            url: 'https://static.wixstatic.com/media/2cd43b_2e2e2e2e2e2e4e2e8e2e2e2e2e2e2e2e~mv2.png/v1/fill/w_600,h_600,al_c,q_85/2cd43b_2e2e2e2e2e2e4e2e8e2e2e2e2e2e2e2e~mv2.png',
            filename: 'doritos-nacho.jpg'
        },
        {
            name: 'Pan de Molde',
            url: 'https://bimbo.com.mx/sites/default/files/styles/producto_detalle/public/2021-03/pan-blanco-bimbo-680g.png',
            filename: 'pan-molde.jpg'
        },
        {
            name: 'Leche Entera 1L',
            url: 'https://www.lala.com.mx/sites/default/files/styles/producto_detalle/public/2021-03/leche-entera-lala-1l.png',
            filename: 'leche-entera.jpg'
        },
        {
            name: 'Manzanas Rojas',
            url: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=300&h=200&fit=crop',
            filename: 'manzanas-rojas.jpg'
        }
    ];

    console.log(`Found ${productImages.length} products to download images for...\n`);

    let downloaded = 0;
    productImages.forEach((product) => {
        downloadImage(product.url, product.filename, (success) => {
            if (success) {
                // Update database with image path
                const imagePath = `/uploads/${product.filename}`;
                db.run(
                    'UPDATE products SET image = ? WHERE name = ?',
                    [imagePath, product.name],
                    function (err) {
                        if (err) {
                            console.error(`❌ Error updating ${product.name}:`, err);
                        } else {
                            console.log(`✅ Downloaded and updated: ${product.name}`);
                        }

                        downloaded++;

                        // Check if all images have been processed
                        if (downloaded === productImages.length) {
                            console.log('\n🎉 All product images have been downloaded!');
                            verifyDownloadedImages();
                        }
                    }
                );
            } else {
                console.log(`❌ Failed to download image for: ${product.name}`);
                downloaded++;

                if (downloaded === productImages.length) {
                    console.log('\n🎉 Download process completed!');
                    verifyDownloadedImages();
                }
            }
        });
    });
}

function downloadImage(url, filename, callback) {
    const filepath = path.join(__dirname, 'uploads', filename);
    const file = fs.createWriteStream(filepath);

    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(`📥 Downloaded: ${filename}`);
                callback(true);
            });
        } else {
            console.log(`❌ Failed to download ${filename}: Status ${response.statusCode}`);
            callback(false);
        }
    }).on('error', (err) => {
        console.log(`❌ Error downloading ${filename}:`, err.message);
        callback(false);
    });
}

function verifyDownloadedImages() {
    console.log('\n📋 Verifying downloaded images...\n');

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

        console.log(`📊 Resumen:`);
        console.log(`   Total de productos: ${total}`);
        console.log(`   Con imágenes: ${withImages}`);
        console.log(`   Sin imágenes: ${total - withImages}`);
        console.log(`   Porcentaje: ${((withImages / total) * 100).toFixed(1)}%`);

        if (withImages === total) {
            console.log('\n🎉 ¡Todos los productos tienen imágenes reales de internet!');
            console.log('\n💡 Ahora puedes:');
            console.log('   1. Ver los productos con imágenes reales en la aplicación');
            console.log('   2. Las imágenes se muestran automáticamente en el catálogo y carrito');
            console.log('   3. Reemplazar con otras imágenes desde el panel de administración');
        } else {
            console.log('\n⚠️  Algunos productos no tienen imágenes.');
        }

        db.close();
    });
} 