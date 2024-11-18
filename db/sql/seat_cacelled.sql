create table seat_cancelled (
    schedule_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL
    seat_id INT NOT NULL,
    bus_id INT NOT NULL,
    travel_date DATE NOT NULL,
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id) on delete cascade,
    FOREIGN KEY (user_id) REFERENCES users(user_id) on delete cascade
    FOREIGN KEY (bus_id) REFERENCES bus(bus_id) on delete cascade
)