// commandSQL04.js
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

    // 既存ビューを安全に削除（任意）
    await client.query(`DROP VIEW IF EXISTS ViewPokeDex;`);

    // ビュー作成
    await client.query(`
      CREATE VIEW ViewPokeDex AS
      SELECT
        Pokedex.PokeId,
        Pokedex.PokeName,
        Type1.Type AS Type1,
        Type2.Type AS Type2,
        Region.Region AS Region,
        Gen.Gen AS Gen,
        Image.PathNormal AS PathNormal,
        Image.PathShiny AS PathShiny
      FROM
        TblDex AS Pokedex
      LEFT OUTER JOIN TblType AS Type1
        ON Pokedex.Type1Id = Type1.TypeId
      LEFT OUTER JOIN TblType AS Type2
        ON Pokedex.Type2Id = Type2.TypeId
      INNER JOIN TblRegion AS Region
        ON Pokedex.RegionId = Region.RegionId
      INNER JOIN TblGen AS Gen
        ON Pokedex.GenId = Gen.GenId
      INNER JOIN TblImage AS Image
        ON Pokedex.PokeId = Image.PokeId
      ORDER BY Pokedex.PokeId;
    `);

    console.log("ビュー ViewPokeDex の作成が完了しました！");
  } catch (err) {
    console.error("SQL実行エラー:", err);
  } finally {
    await client.end();
    console.log("DB接続終了");
  }
}

runSQL();
