<?php
// Database configuration
$db_host = 'localhost';
$db_port = '3306';
$db_name = 'taste_namibia';
$db_user = 'root';
$db_pass = '';

// Set content type to JSON
header('Content-Type: application/json');

// Create database connection
try {
    $pdo = new PDO("mysql:host=$db_host;port=$db_port;dbname=$db_name", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

try {
    // Get query parameters
    $search = $_GET['search'] ?? '';
    $category = $_GET['category'] ?? 'all';
    $limit = intval($_GET['limit'] ?? 50);
    $offset = intval($_GET['offset'] ?? 0);
    
    // Build SQL query
    $sql = "SELECT * FROM recipes WHERE 1=1";
    $params = [];
    
    // Add search filter
    if (!empty($search)) {
        $sql .= " AND (name LIKE ? OR description LIKE ? OR ingredients LIKE ?)";
        $search_term = "%$search%";
        $params[] = $search_term;
        $params[] = $search_term;
        $params[] = $search_term;
    }
    
    // Add category filter
    if ($category !== 'all') {
        $sql .= " AND category = ?";
        $params[] = $category;
    }
    
    // Add ordering and pagination
    $sql .= " ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
    
    // Execute query
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Process recipes (decode JSON fields)
    foreach ($recipes as &$recipe) {
        $recipe['ingredients'] = json_decode($recipe['ingredients'], true) ?: [];
        $recipe['instructions'] = json_decode($recipe['instructions'], true) ?: [];
        $recipe['id'] = intval($recipe['id']);
        $recipe['prep_time'] = intval($recipe['prep_time']);
        $recipe['cook_time'] = intval($recipe['cook_time']);
        $recipe['servings'] = intval($recipe['servings']);
    }
    
    // Get total count for pagination
    $count_sql = "SELECT COUNT(*) FROM recipes WHERE 1=1";
    $count_params = [];
    
    if (!empty($search)) {
        $count_sql .= " AND (name LIKE ? OR description LIKE ? OR ingredients LIKE ?)";
        $search_term = "%$search%";
        $count_params[] = $search_term;
        $count_params[] = $search_term;
        $count_params[] = $search_term;
    }
    
    if ($category !== 'all') {
        $count_sql .= " AND category = ?";
        $count_params[] = $category;
    }
    
    $count_stmt = $pdo->prepare($count_sql);
    $count_stmt->execute($count_params);
    $total_count = $count_stmt->fetchColumn();
      
    // Return response
    echo json_encode([
        'success' => true,
        'recipes' => $recipes,
        'total_count' => intval($total_count),
        'current_page' => floor($offset / $limit) + 1,
        'total_pages' => ceil($total_count / $limit)
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
exit; 