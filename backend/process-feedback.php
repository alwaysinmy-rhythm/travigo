<?php
// Prevent any errors or warnings from being displayed in the output
ini_set('display_errors', 0);
error_reporting(0);

// Set headers to handle AJAX request
header('Content-Type: application/json');

// Response array
$response = [
    'success' => false,
    'message' => ''
];

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get and sanitize form data
        $name = isset($_POST['name']) ? htmlspecialchars(strip_tags(trim($_POST['name']))) : '';
        $email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
        $service = isset($_POST['service']) ? htmlspecialchars(strip_tags(trim($_POST['service']))) : '';
        $rating = isset($_POST['rating']) ? (int)$_POST['rating'] : 0;
        $feedback_text = isset($_POST['feedback']) ? htmlspecialchars(strip_tags(trim($_POST['feedback']))) : '';
        
        // Validate required fields
        if (empty($name) || empty($email) || empty($feedback_text)) {
            $response['message'] = 'Please fill in all required fields.';
            echo json_encode($response);
            exit;
        }
        
        // Validate email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $response['message'] = 'Please enter a valid email address.';
            echo json_encode($response);
            exit;
        }

        // Database connection configuration
        $db_host = 'localhost';
        $db_name = 'travigo'; // Change to your database name
        $db_user = 'root'; // Change to your database username
        $db_pass = 'your_password'; // Change to your database password
        $db_port = 3307;
        try {
            // Create connection
            $conn = new PDO("mysql:host=$db_host;port=$db_port;dbname=$db_name", $db_user, $db_pass);
            // Set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Prepare SQL statement to match your feedbacks table structure
            $stmt = $conn->prepare("INSERT INTO feedbacks (nam, email, service_used, rate, feedback) VALUES (:name, :email, :service, :rating, :feedback)");
            
            // Bind parameters
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':service', $service);
            $stmt->bindParam(':rating', $rating);
            $stmt->bindParam(':feedback', $feedback_text);
            
            // Execute the statement
            $stmt->execute();
            
            $response['success'] = true;
            $response['message'] = 'Thank you for your feedback! We appreciate your input.';
            
        } catch(PDOException $e) {
            // Log the error (to server error log, not to a file)
            error_log("Database Error: " . $e->getMessage());
            
            $response['success'] = false;
            $response['message'] = 'Sorry, there was an error saving your feedback. Please try again later.';
            
            // Uncomment this line for debugging
            // $response['debug'] = $e->getMessage();
        }
        
    } catch (Exception $e) {
        // Log the error to the server's error log
        error_log("Feedback Form Error: " . $e->getMessage());
        
        $response['success'] = false;
        $response['message'] = 'An unexpected error occurred. Please try again later.';
    }
} else {
    $response['message'] = 'Invalid request method.';
}

// Return JSON response
echo json_encode($response);
exit;
?>