CREATE TABLE seats (
    seat_id SERIAL UNIQUE NOT NULL ,
    bus_id INT ,
    seat_name TEXT,
    FOREIGN KEY(bus_id) references bus(bus_id) on delete cascade
)