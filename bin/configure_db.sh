#!/bin/bash

database="Booking Db"

echo "Configuring db $database"

dropdb "Booking Db" --if-exists
createdb "Booking Db"


psql -U postgres "userdb" < ./db/sql/users.sql
psql -U postgres "userdb" < ./db/sql/bus.sql
psql -U postgres "userdb" < ./db/sql/seat.sql
psql -U postgres "userdb" < ./db/sql/seat_schedule.sql

echo "$database setup"