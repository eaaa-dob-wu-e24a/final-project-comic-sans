<?php

function loadenv($path) {
    $config = []; // start with empy array
    if (file_exists($path)) { // check if file exists
        foreach (explode("\n", file_get_contents($path)) as $line) { // split into new lines
            list($key, $value) = explode('=', trim($line)); // split into key value pairs using "=" as separator
            if (!empty($key) && !empty($value)) { // make sure key or value are not empty
                $config[$key] = $value; // add the key/value pair to the array
            }
        }
    } else {
        throw new Exception("File not found: $path"); // if the file isn't at the path, complain
    }

    return $config;
}