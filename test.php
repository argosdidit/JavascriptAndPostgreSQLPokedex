<?php
// PostgreSQL用の接続情報
$host = '127.0.0.1';
$dbname = 'pokedb';
$user = 'postgres';
$pass = 'postgres';

try {
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $pass);
    echo "接続成功！";
} catch (PDOException $e) {
    echo "接続エラー: " . $e->getMessage();
}
