<?php
require_once __DIR__ . "/loadenv.php" ; // load the env function from file

$dotenv = loadenv('.env'); // load the .env file from path

echo $dotenv['DB_HOST'];  //example of how to access variables from .env file