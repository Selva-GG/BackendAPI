
CREATE TABLE if not exists users (
    id SERIAL PRIMARY KEY ,        
    username VARCHAR(50) UNIQUE NOT NULL, 
    password VARCHAR(255) NOT NULL,       
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

