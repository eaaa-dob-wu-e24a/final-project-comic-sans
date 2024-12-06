<?php
require_once __DIR__ . "/../../../database/dbconn.php";

header("Access-Control-Allow-Origin: http://final-project-comic-sans-fork.vercel.app");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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
    http_response_code(200);
    exit;
}

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

// Check if file was uploaded
if (!isset($_FILES['profilePhoto'])) {
    http_response_code(400);
    showError("No file uploaded.");
    exit;
}

$targetDir = __DIR__ . '/../../../uploads/';
if (!file_exists($targetDir)) {
    if (!mkdir($targetDir, 0755, true)) {
        http_response_code(500);
        showError("Failed to create target directory.");
        exit;
    }
}

$file = $_FILES['profilePhoto'];
$fileName = basename($file['name']);
$fileTmpPath = $file['tmp_name'];
$fileSize = $file['size'];
$fileType = $file['type'];
$fileError = $file['error'];

// Check for upload errors
if ($fileError !== UPLOAD_ERR_OK) {
    http_response_code(400);
    showError("File upload error code: $fileError");
    exit;
}

// Validate file type (e.g., allow only images)
$extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
$allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
if (!in_array($extension, $allowedTypes)) {
    http_response_code(400);
    showError("Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.");
    exit;
}

// Generate a unique file name based on user ID and current timestamp
$newFileName = 'profile_' . $user['id'] . '_' . time() . '.' . $extension;
$targetFilePath = $targetDir . $newFileName;

// Delete the old profile photo if it exists
$sql = "SELECT ImagePath FROM Eventually_User WHERE PK_ID = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $user['id']);
$stmt->execute();
$stmt->bind_result($oldImagePath);
$stmt->fetch();
$stmt->close();

if (!empty($oldImagePath)) {
    $oldImageFullPath = __DIR__ . '/../../..' . $oldImagePath;
    if (file_exists($oldImageFullPath)) {
        unlink($oldImageFullPath);
    }
}

// Move the file to the target directory
if (move_uploaded_file($fileTmpPath, $targetFilePath)) {
    // Update the user's ImagePath in the database
    $imagePath = '/uploads/' . $newFileName;

    $sql = "UPDATE Eventually_User SET ImagePath = ? WHERE PK_ID = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("si", $imagePath, $user['id']);

    if ($stmt->execute()) {
        // Update the session user data
        $_SESSION['user']['imagePath'] = $imagePath;

        http_response_code(200);
        echo json_encode(["message" => "Profile photo updated successfully.", "imagePath" => $imagePath]);
    } else {
        http_response_code(500);
        showError("Failed to update user's image path.");
    }
} else {
    http_response_code(500);
    showError("Failed to move uploaded file.");
}
