// db.js

const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: '127.0.0.1', 
     user:'root', 
     password: 'qwerty1234',
     database: 'sf221_project',
     connectionLimit: 20
});

pool.getConnection()
  .then(conn => {
    console.log('Connected to MariaDB!');
    conn.release(); // Release the connection back to the pool
  })
  .catch(err => {
    console.error('Error connecting to MariaDB:', err);
  });

module.exports = pool;
