const mysql = require('mysql2/promise');

// connection 만들기 함수 정의
async function connect() {
    const connection = await mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1111',
    database:'board'    
    });
    return connection
};

module.exports = connect;