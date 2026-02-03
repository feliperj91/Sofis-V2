-- Database Initialization Script

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    roles TEXT[] DEFAULT '{TECNICO}',
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    force_password_reset BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Role Permissions Table
CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL,
    module VARCHAR(50) NOT NULL,
    can_view BOOLEAN DEFAULT FALSE,
    can_create BOOLEAN DEFAULT FALSE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    UNIQUE(role_name, module)
);

-- 3. Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    document VARCHAR(50),
    isbt_code VARCHAR(50),
    contacts JSONB DEFAULT '[]',
    servers JSONB DEFAULT '[]',
    vpns JSONB DEFAULT '[]',
    hosts JSONB DEFAULT '[]',
    urls JSONB DEFAULT '[]',
    notes TEXT,
    web_laudo JSONB,
    inactive_contract JSONB,
    has_collection_point BOOLEAN DEFAULT FALSE,
    collection_points JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Versions Table
CREATE TABLE IF NOT EXISTS versions (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) NOT NULL,
    release_date DATE,
    changelog TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEED DATA --

-- Initial Admin User (password: admin123)
-- Hash generated with password_hash('admin123', PASSWORD_BCRYPT)
INSERT INTO users (username, full_name, password_hash, roles, is_active, force_password_reset)
VALUES 
('admin', 'Administrador', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '{ADMIN}', TRUE, FALSE)
ON CONFLICT (username) DO NOTHING;

-- Initial Role Permissions (ADMIN)
INSERT INTO role_permissions (role_name, module, can_view, can_create, can_edit, can_delete)
VALUES 
('ADMIN', 'users', TRUE, TRUE, TRUE, TRUE),
('ADMIN', 'clients', TRUE, TRUE, TRUE, TRUE),
('ADMIN', 'products', TRUE, TRUE, TRUE, TRUE),
('ADMIN', 'versions', TRUE, TRUE, TRUE, TRUE),
('ADMIN', 'audit', TRUE, FALSE, FALSE, FALSE)
ON CONFLICT (role_name, module) DO NOTHING;

-- Initial Role Permissions (TECNICO)
INSERT INTO role_permissions (role_name, module, can_view, can_create, can_edit, can_delete)
VALUES 
('TECNICO', 'users', FALSE, FALSE, FALSE, FALSE),
('TECNICO', 'clients', TRUE, FALSE, TRUE, FALSE),
('TECNICO', 'products', TRUE, FALSE, FALSE, FALSE),
('TECNICO', 'versions', TRUE, FALSE, FALSE, FALSE),
('TECNICO', 'audit', FALSE, FALSE, FALSE, FALSE)
ON CONFLICT (role_name, module) DO NOTHING;
