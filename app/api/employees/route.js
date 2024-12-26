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

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, position, department, salary } = req.body;

    // 入力値の検証
    if (!name || !position || !department || !salary) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // SQLクエリを実行
      const query = `
        INSERT INTO employees (name, position, department, salary)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `;
      const values = [name, position, department, salary];

      const result = await pool.query(query, values);

      res.status(201).json({
        message: 'Employee added successfully',
        employeeId: result.rows[0].id,
      });
    } catch (err) {
      console.error('Database Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // POST以外のリクエストに対応しない
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
