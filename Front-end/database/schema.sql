-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS tourism_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tourism_app;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar TEXT
);

-- Tabela de configurações de biometria por usuário
CREATE TABLE IF NOT EXISTS user_biometrics (
    user_id VARCHAR(64) PRIMARY KEY,
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de categorias de atrações
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Inserção das categorias padrão
INSERT IGNORE INTO categories (name) VALUES
    ('Todos'),
    ('Monumentos'),
    ('Museus'),
    ('Natureza'),
    ('Religiosos'),
    ('Parques'),
    ('Arquitetura');

-- Tabela de atrações
CREATE TABLE IF NOT EXISTS attractions (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    rating DECIMAL(2,1) DEFAULT 0,
    reviews INT DEFAULT 0,
    category_id INT,
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tabela de avaliações de atrações (reviews)
CREATE TABLE IF NOT EXISTS attraction_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attraction_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    rating DECIMAL(2,1) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attraction_id) REFERENCES attractions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela para armazenar localização do usuário (opcional, se necessário)
CREATE TABLE IF NOT EXISTS user_locations (
    user_id VARCHAR(64) PRIMARY KEY,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_attractions_category ON attractions(category_id);
CREATE INDEX idx_reviews_attraction ON attraction_reviews(attraction_id);
CREATE INDEX idx_reviews_user ON attraction_reviews(user_id);
