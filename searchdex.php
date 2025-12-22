<?php
/* =========================================================
 * DB接続
 * ========================================================= */
$host   = '127.0.0.1';
$dbname = 'pokedb';
$user   = 'postgres';
$pass   = 'postgres';

try {
  $pdo = new PDO(
    "pgsql:host=$host;dbname=$dbname",
    $user,
    $pass,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
  );
} catch (PDOException $e) {
  exit('DB接続エラー: ' . $e->getMessage());
}

/* =========================================================
 * 初期データ取得（InitPage 相当）
 * ========================================================= */

// タイプ一覧
$types = $pdo->query("
  SELECT typeid, type, pathtype
  FROM tbltype
  ORDER BY typeid
")->fetchAll(PDO::FETCH_ASSOC);

// 地方一覧
$regions = $pdo->query("
  SELECT regionid, region
  FROM tblregion
  ORDER BY regionid
")->fetchAll(PDO::FETCH_ASSOC);

// 世代一覧
$gens = $pdo->query("
  SELECT genid, gen
  FROM tblgen
  ORDER BY genid
")->fetchAll(PDO::FETCH_ASSOC);

/* =========================================================
 * IsPostBack 相当
 * ========================================================= */
$isPost = ($_SERVER['REQUEST_METHOD'] === 'POST');

/* =========================================================
 * 検索条件取得（BtnSearch_Click 相当）
 * ========================================================= */
$selectedTypes  = [];
$selectedRegion = null;
$selectedGen    = null;

if ($isPost) {

  if (!empty($_POST['selected_types'])) {
    $selectedTypes = explode(',', $_POST['selected_types']);
  }

  if (!empty($_POST['region'])) {
    $selectedRegion = $_POST['region'];
  }

  if (!empty($_POST['gen'])) {
    $selectedGen = $_POST['gen'];
  }
}

/* =========================================================
 * CreateList 相当（検索SQL生成）
 * ========================================================= */
$where  = [];
$params = [];

// タイプ条件（Type1 or Type2）
if (!empty($selectedTypes)) {
  $in = implode(',', array_fill(0, count($selectedTypes), '?'));
  $where[] = "(type1 IN ($in) OR type2 IN ($in))";
  $params  = array_merge($params, $selectedTypes, $selectedTypes);
}

// 地方条件
if ($selectedRegion !== null) {
  $stmt = $pdo->prepare("SELECT region FROM tblregion WHERE regionid = ?");
  $stmt->execute([$selectedRegion]);
  $regionName = $stmt->fetchColumn();

  if ($regionName !== false) {
    $where[] = "region = ?";
    $params[] = $regionName;
  }
}

// 世代条件
if ($selectedGen !== null) {
  $stmt = $pdo->prepare("SELECT gen FROM tblgen WHERE genid = ?");
  $stmt->execute([$selectedGen]);
  $genName = $stmt->fetchColumn();

  if ($genName !== false) {
    $where[] = "gen = ?";
    $params[] = $genName;
  }
}

// SQL組み立て
$sql = "
  SELECT
    pokeid,
    name,
    type1,
    type2,
    region,
    gen,
    pathnormal
  FROM Viewpokedex
";

if ($where) {
  $sql .= " WHERE " . implode(' AND ', $where);
}

$sql .= " ORDER BY viewpokedex.pokeid";

// 実行
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$pokemonList = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>SearchDex</title>
<link rel="stylesheet" href="searchdex.css">
<script>
let selectedTypes = <?= json_encode($selectedTypes) ?>;

function toggleTypeSelection(img) {
  const typeId = img.dataset.typeid;

  if (selectedTypes.includes(typeId)) {
    selectedTypes = selectedTypes.filter(id => id !== typeId);
    img.classList.remove('selected');
  } else {
    selectedTypes.push(typeId);
    img.classList.add('selected');
  }

  document.getElementById('selected_types').value = selectedTypes.join(',');
}
</script>
</head>
<body>

<h1>SearchDex</h1>

<form method="post">

  <!-- hidden field（ASPX HiddenField 相当） -->
  <input type="hidden" name="selected_types" id="selected_types"
         value="<?= htmlspecialchars(implode(',', $selectedTypes)) ?>">

  <!-- タイプ画像テーブル（InitTypeTable 相当） -->
  <table class="TblSearchType">
    <?php
    $cols = 6;
    foreach ($types as $i => $type):
      if ($i % $cols === 0): ?><tr><?php endif; ?>
      <?php
        $isSelected = in_array($type['typeid'], $selectedTypes);
      ?>
      <td>
        <img
          src="<?= htmlspecialchars($type['pathtype']) ?>"
          class="type-icon <?= $isSelected ? 'selected' : '' ?>"
          data-typeid="<?= htmlspecialchars($type['typeid']) ?>"
          onclick="toggleTypeSelection(this)">
      </td>
      <?php if ($i % $cols === $cols - 1): ?></tr><?php endif; ?>
    <?php endforeach; ?>
  </table>

  <!-- 地方 -->
  <select name="region">
    <option value="">地方を選択してください</option>
    <?php foreach ($regions as $r): ?>
      <option value="<?= $r['regionid'] ?>"
        <?= ($selectedRegion == $r['regionid']) ? 'selected' : '' ?>>
        <?= htmlspecialchars($r['region']) ?>
      </option>
    <?php endforeach; ?>
  </select>

  <!-- 世代 -->
  <select name="gen">
    <option value="">世代を選択してください</option>
    <?php foreach ($gens as $g): ?>
      <option value="<?= $g['genid'] ?>"
        <?= ($selectedGen == $g['genid']) ? 'selected' : '' ?>>
        <?= htmlspecialchars($g['gen']) ?>
      </option>
    <?php endforeach; ?>
  </select>

  <button type="submit">検索</button>
</form>

<hr>

<!-- 検索結果（Repeater 相当） -->
<?php if (empty($pokemonList)): ?>
  <p style="color:red;">見つかりませんでした。他の条件で検索してください。</p>
<?php else: ?>
<table border="1">
  <tr>
    <th>画像</th>
    <th>No</th>
    <th>名前</th>
    <th>タイプ</th>
    <th>地方</th>
    <th>世代</th>
    <th>リンク</th>
  </tr>
  <?php foreach ($pokemonList as $pokeList): ?>
  <tr>
    <td><img src="<?= htmlspecialchars($pokeList['pathnormal']) ?>" width="50"></td>
    <td><?= htmlspecialchars($pokeList['pokeid']) ?></td>
    <td><?= htmlspecialchars($pokeList['name']) ?></td>
    <td>
      <?= htmlspecialchars($pokeList['type1']) ?>
      <?= $pokeList['type2'] ? '・' . htmlspecialchars($pokeList['type2']) : '' ?>
    </td>
    <td><?= htmlspecialchars($pokeList['region']) ?></td>
    <td><?= htmlspecialchars($pokeList['gen']) ?></td>
    <td>
      <a href="pokedex.php?no=<?= $pokeList['pokeid'] ?>">図鑑へ</a>
    </td>
  </tr>
  <?php endforeach; ?>
</table>
<?php endif; ?>

</body>
</html>
