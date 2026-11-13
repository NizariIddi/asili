<?php
// Database connection
$host = "127.0.0.1";
$dbname = "asili_udongo";
$user = "root";
$pass = "Nizari2412@@.!" ;

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "DB error: " . $e->getMessage() . "
";
    exit;
}

// Simple routing based on URI
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = strtok($uri, "?");

// Serve built React app for root
if ($uri === "/" || $uri === "") {
    $builtin_html = __DIR__ . "/dist/index.html";
    if (file_exists($builtin_html)) {
        echo file_get_contents($builtin_html);
        exit;
    }
}

// API: Products - GET list
if ($uri === "/api/products" && $_SERVER["REQUEST_METHOD"] === "GET") {
    $id = $_GET["id"] ?? "";
    if ($id) {
        try {
            $stmt = $pdo->prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category = c.name WHERE p.id = ?");
            $stmt->execute([$id]);
            $product = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($product) {
                echo json_encode(["success" => true, "product" => $product]);
            } else {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Product not found"]);
            }
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => "Database error"]);
        }
    } else {
        try {
            $stmt = $pdo->query("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category = c.name");
            echo json_encode(["success" => true, "products" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => "Database error"]);
        }
    }
    exit;
}

// API: Store Settings - GET only
if ($uri === "/api/store-settings" && $_SERVER["REQUEST_METHOD"] === "GET") {
    try {
        $stmt = $pdo->query("SELECT * FROM store_settings LIMIT 1");
        $setting = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "settings" => $setting ?: []]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Database error"]);
    }
    exit;
}

// API: Reviews - GET list and CREATE
if ($uri === "/api/reviews") {
    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        try {
            $stmt = $pdo->query("SELECT * FROM reviews ORDER BY created_at DESC");
            echo json_encode(["success" => true, "reviews" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => "Database error"]);
        }
    } else {
        $data = json_decode(file_get_contents("php://input"), true);
        if ($data) {
            try {
                $stmt = $pdo->prepare("INSERT INTO reviews (quote, name, place, detail) VALUES (?, ?, ?, ?)");
                $stmt->execute([$data["quote"] ?? "", $data["name"] ?? "", $data["place"] ?? "", $data["detail"] ?? ""]);
                echo json_encode(["success" => true, "review_id" => $pdo->lastInsertId()]);
            } catch (PDOException $e) {
                echo json_encode(["success" => false, "message" => "Database error"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "No data provided"]);
        }
    }
    exit;
}

// API: Escrow Commissions - GET list and CREATE
if ($uri === "/api/escrow-commissions") {
    $action = $_GET["action"] ?? "list";
    switch ($action) {
        case "list":
            try {
                $stmt = $pdo->query("SELECT * FROM escrow_commissions ORDER BY created_at DESC");
                echo json_encode(["success" => true, "commissions" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            } catch (PDOException $e) {
                echo json_encode(["success" => false, "message" => "Database error"]);
            }
            break;
        case "create":
            $data = json_decode(file_get_contents("php://input"), true);
            if ($data) {
                try {
                    $stmt = $pdo->prepare("INSERT INTO escrow_commissions (id, type_id, type_label, title, brief, size, style, deadline, budget, fee, artist, status, contact_name, contact_email, phone, updates) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    $stmt->execute([$data["id"] ?? uniqid(), $data["typeId"] ?? "", $data["typeLabel"] ?? "", $data["title"] ?? "", $data["brief"] ?? "", $data["size"] ?? "", $data["style"] ?? "", $data["deadline"] ?? date("Y-m-d", strtotime("+21 days")), $data["budget"] ?? 0, $data["fee"] ?? 0, $data["artist"] ?? "", $data["status"] ?? "inasubiri", $data["contactName"] ?? "", $data["contactEmail"] ?? "", $data["phone"] ?? "", json_encode($data["updates"] ?? [])]);
                    echo json_encode(["success" => true, "commission_id" => $stmt->lastInsertId()]);
                } catch (PDOException $e) {
                    echo json_encode(["success" => false, "message" => "Database error"]);
                }
            } else {
                echo json_encode(["success" => false, "message" => "No data provided"]);
            }
            break;
        default:
            http_response_code(404);
            echo "404 Not Found";
    }
    exit;
}

// 404 for unknown routes
http_response_code(404);
echo "404 Not Found";
