import { ConnectionPool, config } from 'mssql';

const dbConfig: config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'DESKTOP-5OGFFKR',
  database: process.env.DB_NAME || 'bookstore',
  options: {
    encrypt: true, // สำหรับ Azure SQL
    trustServerCertificate: true // สำหรับ development เท่านั้น
  }
};

const pool = new ConnectionPool(dbConfig);
export default pool;