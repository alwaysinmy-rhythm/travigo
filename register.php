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
    'message' => ''
];

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Invalid request method';
    echo json_encode($response);
    exit;
}

// Get form data
$username = $_POST['username'] ?? '';
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$street = $_POST['street'] ?? '';
$city = $_POST['city'] ?? '';
$zip = $_POST['zip'] ?? '';

// Basic server-side validation
if (empty($username) || empty($name) || empty($email) || empty($password) || empty($street) || empty($city) || empty($zip)) {
    $response['message'] = 'All fields are required';
    echo json_encode($response);
    exit;
}

// Email validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response['message'] = 'Invalid email format';
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

    // Check if username already exists
    $stmt = $conn->prepare("SELECT username FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $response['message'] = 'Username already exists. Please choose another one.';
        echo json_encode($response);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    // Check if email already exists
    $stmt = $conn->prepare("SELECT email FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $response['message'] = 'Email already registered. Please use another email or try logging in.';
        echo json_encode($response);
        $stmt->close();
        $conn->close();
        exit;
    }

    // Hash password for security
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Prepare and execute the SQL statement to insert user data
    $stmt = $conn->prepare("INSERT INTO users (username, name, email, password, street, city, zip, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param("sssssss", $username, $name, $email, $hashed_password, $street, $city, $zip);
    
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Account created successfully!';
    } else {
        throw new Exception("Error: " . $stmt->error);
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    $response['message'] = 'Server error: ' . $e->getMessage();
}

// Return JSON response
echo json_encode($response);
?>