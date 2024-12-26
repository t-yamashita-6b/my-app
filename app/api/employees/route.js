import { Pool } from 'pg';

// PostgreSQL接続プールを作成
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // 環境変数から接続情報を取得
});

export async function GET() {
  try {
    // データベースクエリの実行
    const result = await pool.query('SELECT * FROM employees');
    
    // データをJSON形式でレスポンスとして返す
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database query error:', error);
    
    // エラーレスポンス
    return new Response(JSON.stringify({ error: 'Failed to fetch employees data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

