CREATE TABLE Itineraries (
    username VARCHAR(50),
    tripname VARCHAR(100),
    day VARCHAR(20),
    time TIME,
    place_name VARCHAR(100),
    place_type VARCHAR(50),
    PRIMARY KEY (username, tripname, day, time),
    FOREIGN KEY (username) REFERENCES Users(username)
);

INSERT INTO Itineraries (username, tripname, day, time, place_name, place_type) VALUES
-- Arriving Day
('testuser', 'Dubai Discovery', 'Arriving Day', '09:00:00', 'Dubai International Airport', 'arrival'),
('testuser', 'Dubai Discovery', 'Arriving Day', '11:00:00', 'Hotel Atlantis The Palm', 'check-in'),
('testuser', 'Dubai Discovery', 'Arriving Day', '13:00:00', 'Dubai Marina Walk', 'relaxation'),
('testuser', 'Dubai Discovery', 'Arriving Day', '16:00:00', 'The Dubai Mall', 'shopping'),
('testuser', 'Dubai Discovery', 'Arriving Day', '19:00:00', 'Burj Khalifa - Observation Deck', 'sightseeing'),

-- Exploration Day 1
('testuser', 'Dubai Discovery', 'Exploration Day 1', '09:00:00', 'Desert Safari with BBQ Dinner', 'adventure'),
('testuser', 'Dubai Discovery', 'Exploration Day 1', '11:30:00', 'Al Fahidi Historical Neighborhood', 'culture'),
('testuser', 'Dubai Discovery', 'Exploration Day 1', '14:00:00', 'Dubai Frame', 'architecture'),
('testuser', 'Dubai Discovery', 'Exploration Day 1', '17:00:00', 'La Mer Beach', 'relaxation'),
('testuser', 'Dubai Discovery', 'Exploration Day 1', '20:00:00', 'Global Village', 'entertainment'),

-- Exploration Day 2
('testuser', 'Dubai Discovery', 'Exploration Day 2', '09:00:00', 'IMG Worlds of Adventure', 'theme park'),
('testuser', 'Dubai Discovery', 'Exploration Day 2', '12:00:00', 'Dubai Miracle Garden', 'nature'),
('testuser', 'Dubai Discovery', 'Exploration Day 2', '15:00:00', 'Ski Dubai (Mall of the Emirates)', 'adventure'),
('testuser', 'Dubai Discovery', 'Exploration Day 2', '18:00:00', 'Dubai Fountain Show', 'entertainment'),
('testuser', 'Dubai Discovery', 'Exploration Day 2', '20:00:00', 'Dinner at Pierchic', 'fine dining');
