const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.run("UPDATE products SET image = '' WHERE name = 'Manzanas Rojas'", function (err) {
    if (err) {
        console.error('Error al limpiar la imagen de Manzanas Rojas:', err.message);
    } else {
        console.log('✅ Imagen de Manzanas Rojas eliminada correctamente.');
    }
    db.close();
}); 