<?php
require_once __DIR__ . "/../../../database/dbconn.php";
header("Access-Control-Allow-Origin: http://final-project-comic-sans-fork.vercel.app");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

session_start();
$user = $_SESSION['user'];

function showError($msgString)
{
    $msg = ["Error" => $msgString];
    header('Content-Type: application/json');
    echo json_encode($msg, JSON_PRETTY_PRINT);
}

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://final-project-comic-sans-fork.vercel.app");
    header("Access-Control-Allow-Methods: PATCH, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(200);
    exit;
}

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    http_response_code(405);
    showError("Invalid request method.");
    exit;
}

// Ensure user is authenticated
if (!isset($user['id'])) {
    http_response_code(401);
    showError("User not authenticated.");
    exit;
}

// Get the request body
$request = file_get_contents('php://input');
$input = json_decode($request, true);

// Get the user ID from session
$userID = $user['id'];

// Get the current user info from the database
$sql = "SELECT * FROM Eventually_User WHERE PK_ID = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $userID);
$stmt->execute();
$result = $stmt->get_result();
$currentUser = $result->fetch_assoc();

// Check if user exists
if (!$currentUser) {
    http_response_code(404);
    showError("User not found.");
    exit;
}

// If no Name/Email is provided, set them to be the old ones
$newName = isset($input['Name']) ? $input['Name'] : $currentUser['Name'];
$newEmail = isset($input['Email']) ? $input['Email'] : $currentUser['Email'];
$newImagePath = isset($input['ImagePath']) ? $input['ImagePath'] : $currentUser['ImagePath'];

// Validate inputs
if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    showError("Invalid email format.");
    exit;
}

// Check if the new email is already taken by another user
if ($newEmail !== $currentUser['Email']) {
    $emailCheckSql = "SELECT PK_ID FROM Eventually_User WHERE Email = ? AND PK_ID != ?";
    $emailStmt = $mysqli->prepare($emailCheckSql);
    $emailStmt->bind_param("si", $newEmail, $userID);
    $emailStmt->execute();
    $emailStmt->store_result();

    if ($emailStmt->num_rows > 0) {
        http_response_code(409);
        showError("Email is already in use by another account.");
        exit;
    }
    $emailStmt->close();
}

// Password handling
if (isset($input['currentPassword']) && isset($input['newPassword'])) {
    $currentPassword = $input['currentPassword'];
    $newPassword = $input['newPassword'];

    // Verify the current password
    if (!password_verify($currentPassword, $currentUser['Password'])) {
        http_response_code(403);
        showError("Current password is incorrect.");
        exit;
    }

    // Hash the new password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
} else {
    // Keep the old password
    $hashedPassword = $currentUser['Password'];
}

// Prepare the update query with placeholders
$updateSql = "UPDATE Eventually_User SET Name = ?, Email = ?, Password = ?, ImagePath = ? WHERE PK_ID = ?";
$updateStmt = $mysqli->prepare($updateSql);
$updateStmt->bind_param("ssssi", $newName, $newEmail, $hashedPassword, $newImagePath, $userID);

if ($updateStmt->execute()) {
    http_response_code(200);
    echo json_encode(["message" => "User details updated successfully."]);
} else {
    http_response_code(500);
    showError("Failed to update user details.");
    exit;
}

$updateStmt->close();
$mysqli->close();
