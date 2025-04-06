<?php
// Database connection parameters
$servername = "localhost";
$user = "root"; // Replace with your DB username
$password = ""; // Replace with your DB password
$dbname = "travigo"; // Replace with your DB name

// Set headers for JSON response
header('Content-Type: application/json');

// Get JSON input data
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

// Initialize response array
$response = [];

// Check if the required parameters are provided
if (!isset($input['username']) || !isset($input['tripName']) || empty($input['tripName'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Username and trip name are required']);
    exit;
}

// Get the input parameters
$username = $input['username'];
$tripName = $input['tripName'];

try {
    // Create connection
    $conn = new mysqli($servername, $user, "", $dbname);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    // Prepare SQL statement for your actual table structure (Itineraries)
    $stmt = $conn->prepare("
        SELECT 
            day, 
            time, 
            place_name, 
            place_type
        FROM 
            Itineraries
        WHERE 
            username = ? 
            AND tripname = ?
        ORDER BY 
            day, time
    ");
    
    // Bind parameters
    $stmt->bind_param("ss", $username, $tripName);
    
    // Execute the query
    $stmt->execute();
    
    // Get result
    $result = $stmt->get_result();
    
    // Fetch all results
    $tripData = [];
    while ($row = $result->fetch_assoc()) {
        $tripData[] = [
            'day' => $row['day'],
            'time' => $row['time'],
            'place_name' => $row['place_name'],
            'place_type' => $row['place_type'],
            'name' => $row['place_name'] // Adding name field to match frontend expectations
        ];
    }
    
    // Return the trip data
    echo json_encode($tripData);
    
} catch(Exception $e) {
    // Set HTTP response code
    http_response_code(500);
    
    // Log the error (to server error log)
    error_log("Database error: " . $e->getMessage());
    
    // Return error message (minimal info for security)
    echo json_encode(['error' => 'Database error occurred: ' . $e->getMessage()]);
}

// Close connection
if (isset($conn)) {
    $conn->close();
}
?>