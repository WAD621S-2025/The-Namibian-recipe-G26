-- Database setup for Taste Namibia Recipe Platform
-- This file contains the SQL commands to set up the database

-- Create database (MySQL)
CREATE DATABASE IF NOT EXISTS taste_namibia;
USE taste_namibia;

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    prep_time INT DEFAULT 0,
    cook_time INT DEFAULT 0,
    servings INT DEFAULT 1,
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Easy',
    ingredients JSON NOT NULL,
    instructions JSON NOT NULL,
    cultural_context TEXT,
    image_data LONGTEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_category ON recipes(category);
CREATE INDEX idx_difficulty ON recipes(difficulty);
CREATE INDEX idx_created_at ON recipes(created_at);
CREATE FULLTEXT INDEX idx_search ON recipes(name, description);

-- Insert sample data
INSERT INTO recipes (name, description, category, prep_time, cook_time, servings, difficulty, ingredients, instructions, cultural_context, image_url) VALUES
(
    'Traditional Biltong',
    'Air-dried meat seasoned with coriander and traditional spices, a beloved Namibian snack',
    'snacks',
    30,
    0,
    8,
    'Medium',
    '["2 kg beef silverside or topside", "200ml white vinegar", "3 tbsp coarse salt", "2 tbsp ground coriander", "1 tbsp ground black pepper", "1 tsp bicarbonate of soda"]',
    '["Cut meat along the grain into strips about 2-3cm thick", "Mix vinegar with bicarbonate of soda and dip meat strips briefly", "Combine salt, coriander, and black pepper in a bowl", "Coat each strip thoroughly with the spice mixture", "Hang strips in a well-ventilated, dry area for 3-5 days", "Test for dryness - properly dried biltong should crack when bent", "Store in paper bags or cloth bags in a cool, dry place"]',
    'Biltong is a traditional preservation method used by indigenous peoples and later adopted by settlers. It remains one of Namibias most popular foods.',
    'https://images.pexels.com/photos/4449068/pexels-photo-4449068.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
    'Potjiekos Stew',
    'Slow-cooked stew prepared in a traditional three-legged cast iron pot over open flames',
    'main-dish',
    20,
    120,
    6,
    'Easy',
    '["1 kg beef chuck, cubed", "2 large onions, sliced", "3 carrots, chopped", "4 potatoes, quartered", "2 cups beef stock", "3 tbsp vegetable oil", "2 bay leaves", "1 tsp paprika", "Salt and pepper to taste"]',
    '["Heat oil in a potjie pot over medium coals", "Brown the beef cubes on all sides", "Add onions and cook until softened", "Add paprika and bay leaves, cook for 1 minute", "Pour in stock and bring to a simmer", "Cover and cook for 1.5 hours, stirring occasionally", "Add carrots and potatoes in final 30 minutes", "Season with salt and pepper before serving"]',
    'Potjiekos represents the communal cooking tradition where families and friends gather around the fire, sharing stories while the meal slowly cooks.',
    'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
    'Mahangu Porridge',
    'Nutritious millet porridge, a staple food across northern Namibia',
    'breakfast',
    5,
    25,
    4,
    'Easy',
    '["2 cups mahangu (pearl millet) flour", "4 cups water", "1 tsp salt", "2 tbsp sugar (optional)", "Milk to serve"]',
    '["Bring water and salt to a boil in a large pot", "Gradually whisk in mahangu flour to prevent lumps", "Reduce heat and simmer for 20-25 minutes, stirring frequently", "Add sugar if desired for sweetness", "Cook until thick and creamy consistency", "Serve hot with milk or as a side dish"]',
    'Mahangu is drought-resistant and has sustained northern Namibian communities for centuries. It is rich in protein and essential nutrients.',
    'https://images.pexels.com/photos/4099237/pexels-photo-4099237.jpeg?auto=compress&cs=tinysrgb&w=800'
);

-- SQLite version (alternative for local development)
-- If using SQLite instead of MySQL, use this version:

/*
CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    prep_time INTEGER DEFAULT 0,
    cook_time INTEGER DEFAULT 0,
    servings INTEGER DEFAULT 1,
    difficulty TEXT DEFAULT 'Easy',
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    cultural_context TEXT,
    image_data TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_difficulty ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_created_at ON recipes(created_at);
*/