CREATE TABLE park(
    id INT NOT NULL,
    parks_name VARCHAR(100),
    location VARCHAR(100),
    date_est INT, 
    size VARCHAR (100),
    visitors INT, 
    description TEXT,
    visited BOOLEAN,
    PRIMARY KEY(id)
);