<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
session_start();

// Unset all session variables
$_SESSION = [];

echo json_encode(['status' => 'logout', 'message' => 'Logout successful']);
