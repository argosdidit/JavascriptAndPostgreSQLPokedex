// commandSQL01.js
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runSQL() {
  try {
    await client.connect();
    console.log("DB接続成功");

    // --- TblType ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS TblType(
        TypeId INTEGER NOT NULL,
        Type VARCHAR(10) NOT NULL,
        PathType VARCHAR(50) NOT NULL,
        PRIMARY KEY (TypeId)
      );
    `);

    await client.query(`
      INSERT INTO TblType(TypeId, Type, PathType)
      VALUES
      (1, 'ノーマル', 'image/type/01.png'),
      (2, 'ほのお', 'image/type/02.png'),
      (3, 'みず', 'image/type/03.png'),
      (4, 'くさ', 'image/type/04.png'),
      (5, 'でんき', 'image/type/05.png'),
      (6, 'こおり', 'image/type/06.png'),
      (7, 'かくとう', 'image/type/07.png'),
      (8, 'どく', 'image/type/08.png'),
      (9, 'じめん', 'image/type/09.png'),
      (10, 'ひこう', 'image/type/10.png'),
      (11, 'エスパー', 'image/type/11.png'),
      (12, 'むし', 'image/type/12.png'),
      (13, 'いわ', 'image/type/13.png'),
      (14, 'ゴースト', 'image/type/14.png'),
      (15, 'ドラゴン', 'image/type/15.png'),
      (16, 'あく', 'image/type/16.png'),
      (17, 'はがね', 'image/type/17.png'),
      (18, 'フェアリー', 'image/type/18.png')
      ON CONFLICT (TypeId) DO NOTHING;
    `);

    // --- TblRegion ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS TblRegion(
        RegionId INTEGER NOT NULL,
        Region VARCHAR(10) NOT NULL,
        PRIMARY KEY (RegionId)
      );
    `);

    await client.query(`
      INSERT INTO TblRegion(RegionId, Region)
      VALUES
      (1, 'カントー地方'),
      (2, 'ジョウト地方'),
      (3, 'ホウエン地方'),
      (4, 'シンオウ地方'),
      (5, 'イッシュ地方'),
      (6, 'カロス地方'),
      (7, 'アローラ地方'),
      (8, 'ガラル地方'),
      (9, 'ヒスイ地方'),
      (10, 'パルデア地方')
      ON CONFLICT (RegionId) DO NOTHING;
    `);

    // --- TblGen ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS TblGen(
        GenId INTEGER NOT NULL,
        Gen VARCHAR(10) NOT NULL,
        PRIMARY KEY (GenId)
      );
    `);

    await client.query(`
      INSERT INTO TblGen(GenId, Gen)
      VALUES
      (1, '第1世代'),
      (2, '第2世代'),
      (3, '第3世代'),
      (4, '第4世代'),
      (5, '第5世代'),
      (6, '第6世代'),
      (7, '第7世代'),
      (8, '第8世代'),
      (9, '第9世代'),
      (10, '第10世代')
      ON CONFLICT (GenId) DO NOTHING;
    `);

    // --- TblPokedex ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS TblPokedex(
        PokeId INTEGER NOT NULL,
        Name VARCHAR(10) NOT NULL,
        Type1Id INTEGER,
        Type2Id INTEGER,
        RegionId INTEGER,
        GenId INTEGER,
        PRIMARY KEY (PokeId),
        FOREIGN KEY (Type1Id) REFERENCES TblType(TypeId),
        FOREIGN KEY (Type2Id) REFERENCES TblType(TypeId),
        FOREIGN KEY (RegionId) REFERENCES TblRegion(RegionId),
        FOREIGN KEY (GenId) REFERENCES TblGen(GenId)
      );
    `);

    console.log("すべてのテーブル作成 & 初期データ挿入が完了しました！");
  } catch (err) {
    console.error("SQL実行エラー:", err);
  } finally {
    await client.end();
    console.log("DB接続終了");
  }
}

runSQL();
