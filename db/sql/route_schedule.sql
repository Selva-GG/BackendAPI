create table route_schedule (
    route_schedule_id serial primary key not null ,
	route_id int,
	date Date ,
	bus_id int,
	FOREIGN key (bus_id) references bus(bus_id),
	FOREIGN key (route_id) references routes(route_id)
)