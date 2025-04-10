<?php
/**
 * Replace trip details for a user
 * First deletes all existing entries with matching username and tripname
 * Then inserts the new entries
 */
function replaceTripDetails() {
    // Database connection parameters
    $host = "localhost";
    $db_username = "root";
    $password = "";
    $database = "travigo";

    // Create connection
    $conn = new mysqli($host, $db_username, "", $database, 3307);

    // Initialize response array
    $response = [
        'status' => 'success',
        'message' => '',
        'deleted' => 0,
        'inserted' => 0,
        'errors' => []
    ];

    // Check connection
    if ($conn->connect_error) {
        $response = [
            'status' => 'error',
            'message' => 'Connection failed: ' . $conn->connect_error
        ];
        echo json_encode($response);
        exit();
    }

    // Get JSON data from the request
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    // Check if data was properly decoded
    if (json_last_error() !== JSON_ERROR_NONE) {
        $response = [
            'status' => 'error',
            'message' => 'Invalid JSON: ' . json_last_error_msg()
        ];
        echo json_encode($response);
        exit();
    }

    // Extract the username and tripname
    $username = isset($data['usernamae']) ? $conn->real_escape_string($data['usernamae']) : ''; // Note the typo 'usernamae'
    $tripname = isset($data['tripName']) ? $conn->real_escape_string($data['tripName']) : '';
    $days = isset($data['days']) ? $data['days'] : [];

    // Check if required fields are present
    if (empty($username) || empty($tripname)) {
        $response = [
            'status' => 'error',
            'message' => 'Username and trip name are required'
        ];
        echo json_encode($response);
        exit();
    }

    // Start transaction
    $conn->begin_transaction();

    try {
        // Delete existing entries with the same username and tripname
        $delete_sql = "DELETE FROM Itineraries WHERE username = '$username' AND tripname = '$tripname'";
        $delete_result = $conn->query($delete_sql);
        
        if ($delete_result === FALSE) {
            throw new Exception("Error deleting existing entries: " . $conn->error);
        }
        
        $deleted_count = $conn->affected_rows;
        $response['deleted'] = $deleted_count;
        
        // Process new entries
        $inserted_count = 0;
        
        foreach ($days as $day_index => $day_data) {
            $day_title = isset($day_data['title']) ? $conn->real_escape_string($day_data['title']) : 'Day ' . ($day_index + 1);
            $activities = isset($day_data['activities']) ? $day_data['activities'] : [];
            
            if (empty($activities)) {
                continue;
            }
            
            foreach ($activities as $activity) {
                $time = isset($activity['time']) ? $conn->real_escape_string($activity['time']) : '';
                $place_name = isset($activity['placeName']) ? $conn->real_escape_string($activity['placeName']) : '';
                $place_type = isset($activity['placeType']) ? $conn->real_escape_string($activity['placeType']) : '';
                
                // Skip activities with missing data
                if (empty($time) || empty($place_name) || empty($place_type)) {
                    $response['errors'][] = "Skipped activity in $day_title due to missing data";
                    continue;
                }
                
                // SQL query to insert data
                $insert_sql = "INSERT INTO Itineraries (username, tripname, day, time, place_name, place_type) 
                        VALUES ('$username', '$tripname', '$day_title', '$time', '$place_name', '$place_type')";
                
                // Execute query
                $insert_result = $conn->query($insert_sql);
                
                if ($insert_result === FALSE) {
                    throw new Exception("Error inserting activity: " . $conn->error);
                }
                
                $inserted_count++;
            }
        }
        
        $response['inserted'] = $inserted_count;
        
        // If we got here, commit the transaction
        $conn->commit();
        
        $response['status'] = 'success';
        $response['message'] = "Successfully replaced trip details. Deleted $deleted_count existing entries and inserted $inserted_count new activities.";
        
    } catch (Exception $e) {
        // An error occurred, rollback the transaction
        $conn->rollback();
        
        $response['status'] = 'error';
        $response['message'] = $e->getMessage();
    }

    // Return response as JSON
    header('Content-Type: application/json');
    echo json_encode($response);

    // Close connection
    $conn->close();
}

// Execute the function
replaceTripDetails();
?>