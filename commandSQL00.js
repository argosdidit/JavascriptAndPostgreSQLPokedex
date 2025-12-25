// commandSQL00.js
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function dropTables() {
  try {
    await client.connect();
    console.log("DB接続成功");

    // --- 依存関係のある順に削除 ---
    await client.query(`DROP VIEW IF EXISTS viewpokedex;`);
    console.log("viewpokedex 削除完了");

    await client.query(`DROP TABLE IF EXISTS tblimage;`);
    console.log("TblImage 削除完了");

    await client.query(`DROP TABLE IF EXISTS tblpokedex;`);
    console.log("TblPokedex 削除完了");

    await client.query(`DROP TABLE IF EXISTS tbltype;`);
    console.log("TblType 削除完了");

    await client.query(`DROP TABLE IF EXISTS tblregion;`);
    console.log("TblRegion 削除完了");

    await client.query(`DROP TABLE IF EXISTS Tblgen;`);
    console.log("TblGen 削除完了");

    console.log("すべてのテーブル・ビュー削除が完了しました！");
  } catch (err) {
    console.error("DROP 実行エラー:", err);
  } finally {
    await client.end();
    console.log("DB接続終了");
  }
}

dropTables();
