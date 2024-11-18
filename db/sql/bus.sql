CREATE TYPE bus_type AS ENUM (
    'AC',
    'Non-AC',
);

CREATE TYPE bus_status AS ENUM (
    'Active',
    'Inactive',
);

CREATE TABLE bus (
    bus_id SERIAL PRIMARY KEY,
    bus_name TEXT NOT NULL,
    capacity INT CHECK (capacity > 0),
    type bus_type NOT NULL,
    status bus_status NOT NULL
);
