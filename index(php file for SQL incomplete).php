<?php
// PHP Data Objects(PDO) Sample Code:
try {
    $conn = new PDO("sqlsrv:server = tcp:securesharess.database.windows.net,1433; Database = Authentication", "secureshare", "Vijayalaxmi@0897");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch (PDOException $e) {
    print("Error connecting to SQL Server.");
    die(print_r($e));
}

// SQL Server Extension Sample Code:
$connectionInfo = array("UID" => "secureshare", "pwd" => "Vijayalaxmi@0897", "Database" => "Authentication", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:securesharess.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);
?>