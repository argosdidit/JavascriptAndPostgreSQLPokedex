<?php
//!!!!!!!!!!!!大文字小文字注意!!!!!!!!!!!!
// PostgreSQL接続情報
$host = '127.0.0.1';
$dbname = 'pokedb';
$user = 'postgres';
$pass = 'postgres';

try {
  $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $pass);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // パラメータ取得
  $pokeId = isset($_GET['id']) ? (int)$_GET['id'] : 1;
  $whichImage = isset($_GET['which']) && $_GET['which'] === 'shiny' ? 'shiny' : 'normal';

  // 対象ポケモンの詳細取得
  $sqlGetPokeTarget = "
    SELECT
    Pokedex.PokeId,
    Pokedex.Name,
    Type1.Type AS Type1,
    Type2.Type AS Type2,
    Region.Region AS Region,
    Gen.Gen AS Gen,
    Image.PathNormal AS PathNormal,
    Image.PathShiny AS PathShiny
    FROM TblPokedex AS Pokedex
    LEFT OUTER JOIN TblType AS Type1 ON Pokedex.Type1Id = Type1.TypeId
    LEFT OUTER JOIN TblType AS Type2 ON Pokedex.Type2Id = Type2.TypeId
    INNER JOIN TblRegion AS Region ON Pokedex.RegionId = Region.RegionId
    INNER JOIN TblGen AS Gen ON Pokedex.GenId = Gen.GenId
    INNER JOIN TblImage AS Image ON Pokedex.PokeId = Image.PokeId
    WHERE Pokedex.PokeId = :pokeid
    LIMIT 1
  ";
  $stmtGetPokeTarget = $pdo->prepare($sqlGetPokeTarget);
  $stmtGetPokeTarget->bindValue(':pokeid', $pokeId, PDO::PARAM_INT);
  $stmtGetPokeTarget->execute();
  $GetPokeTarget = $stmtGetPokeTarget->fetch(PDO::FETCH_ASSOC);

  // 一覧用の画像取得（通常＋色違い両方）
  $sqlGetPokeList =
  "
  SELECT
  PokeId,
  PathNormal,
  PathShiny
  FROM
  TblImage
  ORDER BY PokeId
  ";
  $stmtGetPokeList = $pdo->query($sqlGetPokeList);
  $GetPokeList = $stmtGetPokeList->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
  echo "接続エラー: " . $e->getMessage();
  exit;
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>ポケモン図鑑</title>
  <link rel="stylesheet" href="pokedex.css">
</head>
<body>
  <div class="pokedex">
    <?php if ($GetPokeTarget): ?>
      <?php
        $imgPath = ($whichImage === 'shiny') ? $GetPokeTarget['pathshiny'] : $GetPokeTarget['pathnormal'];
      ?>
      <img src="<?= htmlspecialchars($imgPath) ?>" alt="<?= htmlspecialchars($GetPokeTarget['name']) ?>">
      <div class="info">
        <h2>#<?= htmlspecialchars($GetPokeTarget['pokeid']) ?> <?= htmlspecialchars($GetPokeTarget['name']) ?></h2>
        <div>
          <span class="type"><?= htmlspecialchars($GetPokeTarget['type1']) ?></span>
          <?php if (!empty($GetPokeTarget['type2'])): ?>
            <span class="type"><?= htmlspecialchars($GetPokeTarget['type2']) ?></span>
          <?php endif; ?>
        </div>
        <p>地方：<?= htmlspecialchars($GetPokeTarget['region']) ?></p>
        <p>世代：<?= htmlspecialchars($GetPokeTarget['gen']) ?></p>
      </div>
    <?php else: ?>
      <p>ポケモンが見つかりませんでした。</p>
    <?php endif; ?>

    <div class="nav-buttons">
      <a href="?id=<?= max(1, $pokeId - 1) ?>&which=<?= $whichImage ?>">«</a>
      <?php
        $toggleImage = ($whichImage === 'shiny') ? 'normal' : 'shiny';
        $toggleLabel = ($whichImage === 'shiny') ? '通常' : '色違い';
      ?>
      <a href="?id=<?= $pokeId ?>&which=<?= $toggleImage ?>" class="toggle-button"><?= $toggleLabel ?>に切り替え</a>
      <a href="?id=<?= $pokeId + 1 ?>&which=<?= $whichImage ?>">»</a>
    </div>
  </div>

  <div class="thumbnail-bar">
    <?php foreach ($GetPokeList as $poke): ?>
      <?php
        $thumbPath = ($whichImage === 'shiny') ? $poke['pathshiny'] : $poke['pathnormal'];
      ?>
      <a href="?id=<?= $poke['pokeid'] ?>&which=<?= $whichImage ?>">
        <img
          src="<?= htmlspecialchars($thumbPath) ?>"
          alt="No.<?= $poke['pokeid'] ?>"
          class="thumbnail <?= ($poke['pokeid'] == $pokeId) ? 'active' : '' ?>"
        >
      </a>
    <?php endforeach; ?>
  </div>
</body>
</html>
<!--http://localhost:8000/pokedex.phpで実行
