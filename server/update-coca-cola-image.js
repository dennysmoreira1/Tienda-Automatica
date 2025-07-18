const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.run(
    "UPDATE products SET image = '/uploads/coca-cola-600ml.jpg' WHERE LOWER(name) LIKE '%coca%'",
    function (err) {
        if (err) {
            console.error('Error actualizando la imagen:', err.message);
        } else {
            console.log('✅ Imagen de Coca Cola asignada correctamente.');
        }
        db.close();
    }
); 