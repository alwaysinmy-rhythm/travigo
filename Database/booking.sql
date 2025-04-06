CREATE TABLE booking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    acco_name TEXT,
    acco_type TEXT,
    acco_description TEXT,
    city TEXT,
    rating FLOAT,
    price INT
);

-- Hotels
INSERT INTO booking (acco_name, acco_type, acco_description, city, rating, price) VALUES
('Burj Al Arab', 'accommodation', 'Luxury 7-star hotel with sea views and private beach', 'Dubai', 4.9, 2500),
('Atlantis The Palm', 'accommodation', 'Iconic hotel with underwater suites and waterpark access', 'Dubai', 4.8, 2000),
('Rove Downtown', 'accommodation', 'Modern hotel close to Dubai Mall with budget-friendly options', 'Dubai', 4.4, 500);

-- Restaurants
INSERT INTO booking (acco_name, acco_type, acco_description, city, rating, price) VALUES
('Al Hadheerah', 'food', 'Authentic Arabian dining with live entertainment in the desert', 'Dubai', 4.7, 300),
('Pierchic', 'food', 'Seafood restaurant on a pier with views of the Burj Al Arab', 'Dubai', 4.6, 400),
('Ravi Restaurant', 'food', 'Popular Pakistani eatery known for budget-friendly delicious food', 'Dubai', 4.3, 100);

-- Attractions/Activities
INSERT INTO booking (acco_name, acco_type, acco_description, city, rating, price) VALUES
('Burj Khalifa Observation Deck', 'activity', 'Access to the tallest building in the world with panoramic views', 'Dubai', 4.8, 150),
('Desert Safari', 'activity', 'Evening desert safari with dune bashing, BBQ dinner, and cultural show', 'Dubai', 4.5, 200),
('Dubai Frame', 'activity', 'Futuristic landmark offering skyline views and historical exhibits', 'Dubai', 4.6, 120),
('Dubai Aquarium & Underwater Zoo', 'activity', 'Huge indoor aquarium inside Dubai Mall with glass tunnel walk', 'Dubai', 4.7, 130);
