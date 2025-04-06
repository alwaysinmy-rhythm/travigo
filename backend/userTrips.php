<?php
/**
 * Function to get all trips for a specific user (without duplicates)
 * @param string $username - The username to find trips for
 * @return array - List of unique trips for the user
 */
function getUserTrips($username) {
    // Initialize empty array for trips
    $trips = array();
    
    // Database connection parameters
    $host = "localhost";
    $dbname = "travigo";
    $dbuser = "root";
    $dbpass = "";
    
    try {
        // Create database connection
        $conn = new PDO("mysql:host=$host;dbname=$dbname", $dbuser, "");
        
        // Set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Prepare SQL statement - Use DISTINCT to avoid duplicates
        $stmt = $conn->prepare("SELECT DISTINCT tripname FROM itineraries WHERE username = :username");
        
        // Bind parameters
        $stmt->bindParam(':username', $username);
        
        // Execute the query
        $stmt->execute();
        
        // Fetch all results
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Add each tripname to the trips array
        foreach ($results as $row) {
            $trips[] = $row['tripname'];
        }
        
    } catch(PDOException $e) {
        // Log the error
        error_log("Database error: " . $e->getMessage());
        
        // Return error indicator
        return array("error" => "Database error occurred: " . $e->getMessage());
    }
    
    // Close connection
    $conn = null;
    
    return $trips;
}

// Main script for the userTrips.php file

// Check if username parameter is provided
if (isset($_GET['username'])) {
    // Get username from request
    $username = $_GET['username'];
    
    // Get trips for this user
    $userTrips = getUserTrips($username);
    
    // Set content type to JSON
    header('Content-Type: application/json');
    
    // Return trips as JSON
    echo json_encode($userTrips);
} else {
    // No username provided
    header('Content-Type: application/json');
    echo json_encode(array("error" => "No username provided"));
}
?>