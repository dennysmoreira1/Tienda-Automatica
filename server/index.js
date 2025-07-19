const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://tienda-automatica-1oulsndpu-dennys-alejandros-projects.vercel.app', 'http://localhost:3000']
        : 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'), false);
        }
    }
});

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initDatabase();
    }
});

// Initialize database tables
function initDatabase() {
    db.serialize(() => {
        // Customers table
        db.run(`CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password TEXT NOT NULL,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

        // Products table
        db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT,
      category TEXT,
      stock INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

        // Orders table (updated to include customer_id)
        db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_phone TEXT,
      customer_email TEXT,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers (id)
    )`);

        // Order items table
        db.run(`CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )`);

        // Admin users table
        db.run(`CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

        // Insert sample data
        insertSampleData();
    });
}

function insertSampleData() {
    // Check if products already exist
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
        if (err) {
            console.error('Error checking products:', err);
            return;
        }

        if (row.count === 0) {
            const sampleProducts = [
                ['Coca Cola 600ml', 'Refresco de cola', 2.50, '', 'Bebidas', 50],
                ['Pepsi 600ml', 'Refresco de cola Pepsi', 2.40, '', 'Bebidas', 40],
                ['Agua Mineral 500ml', 'Agua mineral embotellada', 1.80, '', 'Bebidas', 60],
                ['Jugo de Naranja 1L', 'Jugo natural de naranja', 3.20, '', 'Bebidas', 30],
                ['Galletas Oreo', 'Galletas de chocolate con crema', 2.20, '', 'Snacks', 35],
                ['Galletas Marías', 'Galletas clásicas Marías', 1.50, '', 'Snacks', 40],
                ['Doritos Nacho', 'Tortillas de maíz con sabor nacho', 3.00, '', 'Snacks', 30],
                ['Sabritas Clásicas', 'Papas fritas clásicas', 2.80, '', 'Snacks', 25],
                ['Pan de Molde', 'Pan integral fresco', 4.50, '', 'Panadería', 20],
                ['Bolillo', 'Pan bolillo fresco', 0.80, '', 'Panadería', 50],
                ['Leche Entera 1L', 'Leche fresca de vaca', 3.80, '', 'Lácteos', 25],
                ['Queso Manchego 200g', 'Queso manchego en rebanadas', 4.90, '', 'Lácteos', 18],
                ['Yogur Natural 150g', 'Yogur natural sin azúcar', 1.50, '', 'Lácteos', 22],
                ['Huevos 12 piezas', 'Huevo blanco fresco', 3.60, '', 'Despensa', 30],
                ['Arroz 1kg', 'Arroz blanco de grano largo', 2.10, '', 'Despensa', 40],
                ['Frijol Negro 1kg', 'Frijol negro limpio', 2.30, '', 'Despensa', 35],
                ['Aceite de Oliva 500ml', 'Aceite de oliva extra virgen', 6.50, '', 'Despensa', 10],
                ['Azúcar 1kg', 'Azúcar refinada', 1.90, '', 'Despensa', 30],
                ['Sal 1kg', 'Sal de mesa', 0.90, '', 'Despensa', 25],
                ['Manzanas Rojas', 'Manzanas frescas por kilo', 5.00, '', 'Frutas', 15],
                ['Plátanos', 'Plátanos frescos por kilo', 3.20, '', 'Frutas', 20],
                ['Tomates', 'Tomates frescos por kilo', 2.80, '', 'Verduras', 25],
                ['Cebollas', 'Cebollas blancas por kilo', 2.10, '', 'Verduras', 18],
                ['Papel Higiénico 4 rollos', 'Papel higiénico suave', 2.50, '', 'Hogar', 30],
                ['Detergente 1L', 'Detergente líquido multiusos', 3.00, '', 'Hogar', 20],
                ['Shampoo 400ml', 'Shampoo para todo tipo de cabello', 3.80, '', 'Higiene', 15],
                ['Pasta Dental 100ml', 'Pasta dental con flúor', 2.20, '', 'Higiene', 18],
                ['Jabón de Tocador', 'Jabón suave para manos y cuerpo', 1.10, '', 'Higiene', 25]
            ];

            const stmt = db.prepare('INSERT INTO products (name, description, price, image, category, stock) VALUES (?, ?, ?, ?, ?, ?)');
            sampleProducts.forEach(product => {
                stmt.run(product);
            });
            stmt.finalize();
            console.log('Sample products inserted');
        }
    });

    // Check if admin user exists
    db.get("SELECT COUNT(*) as count FROM admin_users", (err, row) => {
        if (err) {
            console.error('Error checking admin users:', err);
            return;
        }

        if (row.count === 0) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = bcrypt.hashSync('admin123', 10);
            db.run('INSERT INTO admin_users (username, password, email) VALUES (?, ?, ?)',
                ['admin', hashedPassword, 'admin@tienda.com']);
            console.log('Admin user created (username: admin, password: admin123)');
        }
    });
}

// JWT middleware for customer authentication
const jwt = require('jsonwebtoken');
const authenticateCustomer = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.customer = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

// Customer Authentication Routes
app.post('/api/customers/register', async (req, res) => {
    const { name, email, phone, password, address } = req.body;
    const bcrypt = require('bcryptjs');

    try {
        // Check if email already exists
        db.get('SELECT id FROM customers WHERE email = ?', [email], (err, customer) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (customer) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Hash password and create customer
            const hashedPassword = bcrypt.hashSync(password, 10);
            db.run(
                'INSERT INTO customers (name, email, phone, password, address) VALUES (?, ?, ?, ?, ?)',
                [name, email, phone, hashedPassword, address],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    // Create token
                    const token = jwt.sign(
                        { id: this.lastID, email, name },
                        process.env.JWT_SECRET || 'your-secret-key',
                        { expiresIn: '7d' }
                    );

                    res.json({
                        message: 'Customer registered successfully',
                        token,
                        customer: { id: this.lastID, name, email, phone }
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/customers/login', async (req, res) => {
    const { email, password } = req.body;
    const bcrypt = require('bcryptjs');

    try {
        db.get('SELECT * FROM customers WHERE email = ?', [email], (err, customer) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!customer || !bcrypt.compareSync(password, customer.password)) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Create token
            const token = jwt.sign(
                { id: customer.id, email: customer.email, name: customer.name },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '7d' }
            );

            res.json({
                message: 'Login successful',
                token,
                customer: {
                    id: customer.id,
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone,
                    address: customer.address
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get customer profile
app.get('/api/customers/profile', authenticateCustomer, (req, res) => {
    db.get('SELECT id, name, email, phone, address, created_at FROM customers WHERE id = ?',
        [req.customer.id], (err, customer) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }
            res.json(customer);
        });
});

// Update customer profile
app.put('/api/customers/profile', authenticateCustomer, (req, res) => {
    const { name, phone, address } = req.body;

    db.run(
        'UPDATE customers SET name = ?, phone = ?, address = ? WHERE id = ?',
        [name, phone, address, req.customer.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Profile updated successfully' });
        }
    );
});

// API Routes

// Products
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Upload product image
app.post('/api/products/upload-image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({
            message: 'Image uploaded successfully',
            imageUrl: imageUrl,
            filename: req.file.filename
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', (req, res) => {
    const { name, description, price, image, category, stock } = req.body;
    db.run(
        'INSERT INTO products (name, description, price, image, category, stock) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description, price, image, category, stock],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, message: 'Product created successfully' });
        }
    );
});

app.put('/api/products/:id', (req, res) => {
    const { name, description, price, image, category, stock } = req.body;
    db.run(
        'UPDATE products SET name = ?, description = ?, price = ?, image = ?, category = ?, stock = ? WHERE id = ?',
        [name, description, price, image, category, stock, req.params.id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Product updated successfully' });
        }
    );
});

app.delete('/api/products/:id', (req, res) => {
    // First get the product to delete its image
    db.get('SELECT image FROM products WHERE id = ?', [req.params.id], (err, product) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Delete the image file if it exists
        if (product && product.image && product.image !== '') {
            const imagePath = path.join(__dirname, 'uploads', path.basename(product.image));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Delete the product from database
        db.run('DELETE FROM products WHERE id = ?', req.params.id, function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Product deleted successfully' });
        });
    });
});

// Orders (updated to include customer authentication)
app.get('/api/orders', (req, res) => {
    db.all(`
    SELECT o.*,
           c.name as customer_name,
           c.email as customer_email,
           c.phone as customer_phone,
           GROUP_CONCAT(p.name || ' (x' || oi.quantity || ')') as items
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `, (err, rows) => {
        if (err) {
            // En vez de error 500, devuelve un array vacío y un mensaje
            return res.json([]);
        }
        res.json(rows);
    });
});

// Get customer's own orders
app.get('/api/customers/orders', authenticateCustomer, (req, res) => {
    db.all(`
    SELECT o.*,
           GROUP_CONCAT(p.name || ' (x' || oi.quantity || ')') as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.customer_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `, [req.customer.id], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/orders', authenticateCustomer, (req, res) => {
    const { total_amount, items } = req.body;

    // Get customer info
    db.get('SELECT name, email, phone FROM customers WHERE id = ?', [req.customer.id], (err, customer) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        db.run(
            'INSERT INTO orders (customer_id, customer_name, customer_phone, customer_email, total_amount) VALUES (?, ?, ?, ?, ?)',
            [req.customer.id, customer.name, customer.phone, customer.email, total_amount],
            function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }

                const orderId = this.lastID;

                // Insert order items
                const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
                items.forEach(item => {
                    stmt.run([orderId, item.product_id, item.quantity, item.price]);
                });
                stmt.finalize();

                res.json({
                    id: orderId,
                    message: 'Order created successfully',
                    order_number: `ORD-${orderId.toString().padStart(4, '0')}`
                });
            }
        );
    });
});

app.put('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    db.run(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, req.params.id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Order status updated successfully' });
        }
    );
});

// Admin authentication
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

    db.get('SELECT * FROM admin_users WHERE username = ?', [username], (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (!user || !bcrypt.compareSync(password, user.password)) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 