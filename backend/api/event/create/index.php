<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
require_once __DIR__ . "/../../../database/dbconn.php";

session_start();

// Initialize $pdo with a PDO instance
try {
    $pdo = new PDO('mysql:host=your_host;dbname=your_db', 'your_username', 'your_password');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $e->getMessage()]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode incoming JSON request
    $_POST = json_decode(file_get_contents('php://input'), true);

    // Debug incoming POST data
    file_put_contents('debug_log.txt', "POST Data: " . print_r($_POST, true), FILE_APPEND);

    // Check if JSON decoding was successful
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON"]);
        exit;
    }

    // Extract the fields from the JSON
    $title = $_POST['title'] ?? null;
    $description = $_POST['description'] ?? null;
    $location = $_POST['location'] ?? null;
    $ownerUserId = $_POST['ownerUserId'] ?? null;
    $joinCode = $_POST['joinCode'] ?? null;
    $userName = $_POST['userName'] ?? null;
    $finalDate = $_POST['finalDate'] ?? null;

    // Validate required fields
    if (!$title || !$description || !$ownerUserId || !$joinCode) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }

    // Validate finalDate format if provided
    if ($finalDate && !strtotime($finalDate)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid date format"]);
        exit;
    }

    try {
        // Prepare the SQL query for inserting the event
        $stmt = $pdo->prepare("INSERT INTO Eventually_Event (
            `Title`, 
            `Description`, 
            `Location`, 
            `FK_Owner_UserID`, 
            `JoinCode`, 
            `UserName`, 
            `FinalDate`
        ) VALUES (
            :title, 
            :description, 
            :location, 
            :ownerUserId, 
            :joinCode, 
            :userName, 
            :finalDate
        )");

        // Bind the parameters to the SQL query
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':location', $location);
        $stmt->bindParam(':ownerUserId', $ownerUserId);
        $stmt->bindParam(':joinCode', $joinCode);
        $stmt->bindParam(':userName', $userName);
        $stmt->bindParam(':finalDate', $finalDate);

        // Log SQL query and parameters for debugging
        file_put_contents('debug_sql.txt', "SQL Query: " . $stmt->queryString . "\n", FILE_APPEND);
        file_put_contents('debug_sql.txt', "Parameters: " . print_r([
            ':title' => $title,
            ':description' => $description,
            ':location' => $location,
            ':ownerUserId' => $ownerUserId,
            ':joinCode' => $joinCode,
            ':userName' => $userName,
            ':finalDate' => $finalDate,
        ], true), FILE_APPEND);

        // Execute the SQL query
        $stmt->execute();

        // Check if the query affected any rows
        $rowCount = $stmt->rowCount();
        if ($rowCount > 0) {
            http_response_code(201);
            echo json_encode(["message" => "Event created successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Event not inserted"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    // Handle unsupported request methods
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>
