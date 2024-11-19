<?php

$host = "mysql11.unoeuro.com";
$username = "nikolajhoeegjensen_com";
$password = "txgE5krbcnA3D64myFaw";
$database = "nikolajhoeegjensen_com_db";

$mysqli = new mysqli($host, $username, $password, $database);

if ($mysqli->connect_error) {
    die('Connect Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error);
}
