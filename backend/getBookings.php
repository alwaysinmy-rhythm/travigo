<?php
// Database connection parameters
$servername = "localhost";
$username = "root"; // Replace with your DB username
$password = ""; // Replace with your DB password
$dbname = "travigo"; // Replace with your DB name

// Set headers for JSON response
header('Content-Type: application/json');

// Get JSON input data
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

// Initialize response array
$response = [];

// Check if city parameter is provided
if (!isset($input['city']) || empty($input['city'])) {
    http_response_code(400);
    echo json_encode(['error' => 'City parameter is required']);
    exit;
}

// Get the city from input
$city = $input['city'];

try {
    // Create connection
    $conn = new mysqli($servername, $username, "", $dbname, 3307);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    // Prepare SQL statement to fetch accommodations by city
    $stmt = $conn->prepare("
        SELECT 
            acco_name, 
            acco_type, 
            acco_description, 
            city, 
            rating, 
            price
        FROM 
            booking
        WHERE 
            city LIKE ?
        ORDER BY 
            rating DESC
    ");
    
    // Bind parameter with wildcard for partial matching
    $searchCity = "%" . $city . "%";
    $stmt->bind_param("s", $searchCity);
    
    // Execute the query
    $stmt->execute();
    
    // Get result
    $result = $stmt->get_result();
    
    // Fetch all results
    $accommodations = [];
    while ($row = $result->fetch_assoc()) {
        $accommodations[] = $row;
    }
    
    // Return accommodations
    echo json_encode($accommodations);
    
} catch(Exception $e) {
    // Set HTTP response code
    http_response_code(500);
    
    // Log the error (to server error log)
    error_log("Database error: " . $e->getMessage());
    
    // Return error message
    echo json_encode(['error' => 'Database error occurred']);
}

// Close connection
if (isset($conn)) {
    $conn->close();
}
?>