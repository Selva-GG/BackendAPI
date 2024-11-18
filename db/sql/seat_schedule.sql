CREATE TYPE seat_status AS ENUM (
    'Pending',
    'Booked',
    'Available'
);

CREATE TABLE seat_schedule (
    schedule_id SERIAL PRIMARY KEY,
    seat_id INT NOT NULL,
    bus_id INT NOT NULL,
    travel_date DATE NOT NULL,
    status seat_status NOT NULL DEFAULT 'Available',
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id) on delete cascade,
    FOREIGN KEY (bus_id) REFERENCES bus(bus_id) on delete cascade
);
