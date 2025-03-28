<?php
// Set headers for JSON response
header('Content-Type: application/json');

// Database connection parameters
$servername = "localhost";
$user = "root";  // Typically 'root' for local development
$password = "";      // Typically empty for local development
$dbname = "travigo";

// Response array
$response = [
    'success' => false,
    'message' => '',
    'userData' => null
];

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Invalid request method';
    echo json_encode($response);
    exit;
}

// Get login credentials
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';
$remember = isset($_POST['remember']) ? true : false;

// Basic server-side validation
if (empty($username) || empty($password)) {
    $response['message'] = 'Username and password are required';
    echo json_encode($response);
    exit;
}

try {
    // Create database connection
    $conn = new mysqli($servername, $user, "", $dbname);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Prepare and execute the SQL statement to fetch user data
    $stmt = $conn->prepare("SELECT username, name, email, password, street, city, zip FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        // User not found
        $response['message'] = 'User does not exist';
        echo json_encode($response);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    // Fetch user data
    $user = $result->fetch_assoc();
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    // Verify password
    if ($hashed_password == $user['password'] ) {
        // Incorrect password
        $response['message'] = 'Invalid  password';
        echo json_encode($response);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    // Authentication successful
    // Remove password from user data before sending to client
    unset($user['password']);
    
    // Set session variables (if using PHP sessions)
    session_start();
    $_SESSION['username'] = $user['username'];
    $_SESSION['logged_in'] = true;
    
    // Set response
    $response['success'] = true;
    $response['message'] = 'Login successful';
    $response['userData'] = $user;
    
    // Close statement and connection
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    $response['message'] = 'Server error: ' . $e->getMessage();
}

// Return JSON response
echo json_encode($response);
?>