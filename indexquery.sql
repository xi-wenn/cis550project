select 
	FL_DATE as flight_date, 
    airline_name, 
    FL_NUM as flight_number, 
    oairport.airport_iata as origin_airport_iata, 
    ocity.city as origin_city, 
    ocountry.country as origin_country, 
    dairport.airport_iata as destination_airport_iata, 
    dcity.city as destination_city, 
    dcountry.country as destination_country, 
    ARR_DELAY as arrival_delay,
    DEP_DELAY as departure_delay from PerformanceRawBackupNoIndex performance
join airlines on airlines.airline_id = performance.airline_id
join airports oairport on oairport.airport_id = performance.origin_id
left join city ocity on oairport.airport_city_id = ocity.id
left join country ocountry on oairport.airport_country_id = ocountry.id
join airports dairport on  dairport.airport_id = performance.dest_id
left join city dcity on dairport.airport_city_id = dcity.id
left join country dcountry on dairport.airport_country_id = dcountry.id
where airline_name = "American Airlines"
and oairport.airport_iata = "PHL"
and FL_DATE = "2017-12-25"
limit 1000;

#CREATE TABLE PerformanceRawBackupNoIndex LIKE PerformanceRawBackup; 
#INSERT PerformanceRawBackupNoIndex SELECT * FROM PerformanceRawBackup;
ALTER TABLE `myFlights`.`PerformanceRawBackupNoIndex` 
ADD INDEX `fk_date_idx` (`FL_DATE` ASC),
ADD INDEX `fk_airline` (`airline_id` ASC),
ADD INDEX `fk_ocity` (`origin_id` ASC),
ADD INDEX `fk_dcity` (`dest_id` ASC);

select avg(ARR_DELAY) as average_delay from PerformanceRawBackupNoIndex performance 
join airlines on airlines.airline_id = performance.airline_id 
join airports oairport on oairport.airport_id = performance.origin_id 
left join city ocity on oairport.airport_city_id = ocity.id 
left join country ocountry on oairport.airport_country_id = ocountry.id 
join airports dairport on  dairport.airport_id = performance.dest_id 
left join city dcity on dairport.airport_city_id = dcity.id 
left join country dcountry on dairport.airport_country_id = dcountry.id 
where airline_name = "american airlines" 
group by airline_name;

ALTER TABLE `myFlights`.`PerformanceRawBackupNoIndex` 
ADD INDEX `fk_avgdly_idx` (`ARR_DELAY` ASC);

ALTER TABLE `myFlights`.`PerformanceRawBackupNoIndex` 
ADD INDEX `fk_delay` (`ARR_DELAY` ASC, `CARRIER` ASC);


ALTER TABLE `myFlights`.`routes` 
ADD INDEX `fk_airlineid` (`r_airline_id` ASC),
ADD INDEX `fk_srap` (`sr_airport_id` ASC),
ADD INDEX `fk_dtap` (`dst_airport_id` ASC);


select 
	FL_DATE as flight_date, 
    airline_name, 
    FL_NUM as flight_number, 
    oairport.airport_iata as origin_airport_iata, 
    ocity.city as origin_city, 
    ocountry.country as origin_country, 
    dairport.airport_iata as destination_airport_iata, 
    dcity.city as destination_city, 
    dcountry.country as destination_country, 
    ARR_DELAY as arrival_delay,
    DEP_DELAY as departure_delay,
    routes.equipment
from PerformanceRawBackupNoIndex performance
join airlines on airlines.airline_id = performance.airline_id
join airports oairport on oairport.airport_id = performance.origin_id
left join city ocity on oairport.airport_city_id = ocity.id
left join country ocountry on oairport.airport_country_id = ocountry.id
join airports dairport on  dairport.airport_id = performance.dest_id
left join city dcity on dairport.airport_city_id = dcity.id
left join country dcountry on dairport.airport_country_id = dcountry.id
left join routes on routes.sr_airport_id = performance.origin_id and routes.dst_airport_id = performance.dest_id and routes.r_airline_id= performance.airline_id
where airline_name = "American Airlines"
and oairport.airport_iata = "PHL"
and FL_DATE = "2017-12-25"
and FL_NUM>300
limit 1000;