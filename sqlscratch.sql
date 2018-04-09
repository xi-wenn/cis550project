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



