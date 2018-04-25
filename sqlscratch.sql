create table PerformanceRaw2(
  FL_DATE DATE,
    CARRIER VARCHAR(20),
    FL_NUM INT,
    ORIGIN VARCHAR(20),
    DEST VARCHAR(20),
    DEP_DELAY DOUBLE,
    ARR_DELAY DOUBLE,
    CANCELED BIT
);

LOAD DATA LOCAL INFILE  'C:/Users/baozi.wx/Downloads/2017/201801.csv'
INTO TABLE PerformanceRaw2
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;


alter table airports
  add column airport_country_id int,
  add foreign key fk_country_id(airport_country_id) references country(id);

update airports
join country on country.country = airports.airport_country
set airports.airport_country_id = country.id;



alter table airports
  add column airport_city_id int;
alter table airports
  add foreign key fk_city_id(airport_city_id) references city(id);

update airports
left join city on city.city = airports.city
set airports.airport_city_id = city.id;




alter table airlines
  add column airline_country_id int;
alter table airlines
  add foreign key fk_country_id(airline_country_id) references country(id);

update airlines
join country on country.country = airlines.airline_country
set airlines.airline_country_id = country.id;


CREATE TABLE country AS (select distinct trim(airport_country) as country from airports where airport_country is not null and airport_country <> '' ) Union (select distinct trim(airline_country) as country from airlines where airline_country is not null and airline_country <> '' ) order by country;
Alter table country add column id integer auto_increment primary key;

create table city as select distinct trim(both '"' from city) as city from airports where city is not null and city <> '' order by city;
select * from city;
Alter table city add column id integer auto_increment primary key;
UPDATE airports SET city = TRIM(BOTH '"' FROM city);

alter table PerformanceRaw
 add column origin_id int;
alter table PerformanceRaw
 add foreign key fk_origin_id(origin_id) references airports(airport_id);
  
alter table PerformanceRaw
 add column dest_id int;
alter table PerformanceRaw
 add foreign key fk_dest_id(dest_id) references airports(airport_id);
  
update PerformanceRaw
left join airports on PerformanceRaw.ORIGIN = airports.airport_iata
set PerformanceRaw.origin_id = airports.airport_id;

update PerformanceRaw
left join airports on PerformanceRaw.DEST = airports.airport_iata
set PerformanceRaw.dest_id = airports.airport_id;
update PerformanceRaw p join
(
select r.ORIGIN,  a.airport_id
from PerformanceRaw r left join airports a
on r.ORIGIN = a.airport_iata
order by r.ORIGIN
limit 1000
) s
on p.ORIGIN = s.ORIGIN
set p.origin_id = s.airport_id;


alter table PerformanceRaw
 add column airline_id int;
alter table PerformanceRaw
 add foreign key fk_airline_id(airline_id) references airlines(airline_id);
 
update PerformanceRaw
left join airlines on PerformanceRaw.CARRIER = airlines.airline_id
set PerformanceRaw.airline_id = airlines.airline_id;

update routes 
left join airlines on routes.r_airline_code = airlines.airline_iata
set routes.r_airline_id = airlines.airline_id
where routes.r_airline_id is null;

update routes 
left join airports on routes.sr_airport_code = airports.airport_iata
set routes.sr_airport_id = airports.airport_id
where routes.sr_airport_id is null;

update routes 
left join airports on routes.dst_airport_code = airports.airport_iata
set routes.dst_airport_id = airports.airport_id
where routes.dst_airport_id is null;

delete from incidents where airline_id is null;



create table airline_alias as (select distinct airline_name, Alias as alias from airlines where Alias is not null and Alias <> '');
ALTER TABLE `myFlights`.`airline_alias` 
CHANGE COLUMN `airline_name` `airline_name` VARCHAR(50) BINARY NOT NULL ,
ADD PRIMARY KEY (`airline_name`);


alter table airlines drop Alias;




select airport_city_id, airport_country_id, timezone from airports where airport_city_id is null;
create table city_timezone as ( select distinct airport_city_id as id, airport_country_id as country_id, timezone from airports order by id);
select * from city2;
alter table city_timezone add primary key (`id`,`country_id`);


select * from routes;
alter table routes  drop column r_airline_code,  drop column sr_airport_code, drop column dst_airport_code;

alter table PerformanceRaw
drop column ORIGIN, drop column CARRIER, drop column DEST;
