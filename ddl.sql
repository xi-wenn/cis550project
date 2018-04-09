CREATE TABLE Airport (
  AirportID INT NOT NULL,
  AirportName CHAR(100),
  CityID CHAR(100),
  CountryID CHAR(100),
  IATA CHAR(3),
  ICAO CHAR(4),
  TimeZone CHAR(100),
  PRIMARY KEY (AirportID),
  FOREIGN KEY (CityID) REFERENCES City,
  FOREIGN KEY (CountryID) REFERENCES Country
);

CREATE TABLE Country (
  CountryID INT NOT NULL,
  CountryName CHAR(100)
  PRIMARY KEY (CountryID)
);

CREATE TABLE City (
  CityID INT NOT NULL,
  CityName CHAR(100),
  PRIMARY KEY (CityID)
);

CREATE TABLE Airline(
AirlineID INT NOT NULL,
AirlineName CHAR(100),
Alias CHAR(100),
IATA CHAR(2),
ICAO CHAR(2),
CountryId INT,
Active CHAR(1),
PRIMARY KEY (AirlineID),
FOREIGN KEY (CountryId) REFERENCES Country
);

CREATE TABLE Route(
AirlineID int NOT NULL,
SourceAirportID int NOT NULL,
DestAirportID int NOT NULL,
Codeshare char(1),
StopsNum int,
Equipment char(3),
PRIMARY KEY (AirlineID,SourceAirportID,DestAirportID),
FOREIGN KEY (AirlineID) REFERENCES Airline,
FOREIGN KEY (SourceAirportID) REFERENCES Airport,
FOREIGN KEY (DestAirportID) REFERENCES Airport
);

CREATE TABLE Incident(
  IncidentId INT NOT NULL,
  IncidentDate Date NOT NULL,
  AirlineID INT NOT NULL,
  PRIMARY KEY (IncidentId, IncidentDate, AirlineID)
);

CREATE TABLE Performance(
  FlightDate Date NOT NULL,
  FlightNumber INT NOT NULL,
  AirlineID INT NOT NULL,
  OriginAirportID INT NOT NULL,
  DestAirportID INT NOT NULL,
  DepartureDelay INT,
  ArrivalDelay INT,
  IsCancelled CHAR(1),
  PRIMARY KEY (FlightDate, OriginAirportID, DestAirportID, FlightNumber),
  FOREIGN KEY (OriginAirportID) REFERENCES Airport,
  FOREIGN KEY (DestAirportID) REFERENCES Airport,
  FOREIGN Key (AirlineID) REFERENCES Airline
);

