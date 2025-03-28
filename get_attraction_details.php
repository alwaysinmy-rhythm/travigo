<?php
// This file handles AJAX requests for attraction details

// Set the appropriate content type for a JSON response
header('Content-Type: application/json');

// Get the XID from the query string
$xid = isset($_GET['xid']) ? $_GET['xid'] : '';

if (empty($xid)) {
    echo json_encode(['error' => 'No XID provided']);
    exit;
}

// API Key (in a real application, this should be stored securely)
$apiKey = "5ae2e3f221c38a28845f05b6aae87712eb7920f523b7cc7ab07e88c3";  // Replace with your actual API key

// Make request to OpenTripMap API
$detailsUrl = "https://api.opentripmap.com/0.1/en/places/xid/{$xid}?apikey={$apiKey}";

// Set a context with timeout to avoid hanging requests
$context = stream_context_create([
    'http' => [
        'timeout' => 10,  // 10 seconds timeout
        'ignore_errors' => true  // Don't throw an exception on HTTP error codes
    ]
]);

try {
    $response = @file_get_contents($detailsUrl, false, $context);
    
    // Check if there was an HTTP error
    if ($response === false) {
        throw new Exception('Failed to fetch data from the API');
    }
    
    // Parse the response
    $details = json_decode($response, true);
    
    // Check if the response is valid JSON
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON response from API');
    }
    
    // Check if the response contains error information
    if (isset($details['error'])) {
        throw new Exception($details['error']);
    }
    
    // Return the data as JSON
    echo $response;
    
} catch (Exception $e) {
    http_response_code(500);  // Internal server error
    echo json_encode([
        'error' => 'Error fetching data',
        'message' => $e->getMessage()
    ]);
}
?>