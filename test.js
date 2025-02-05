// // Get the client
// import mysql from 'mysql2/promise';

// // Create the connection to database
// const connection = await mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '1111',
//   database: 'board',
// });

// // A simple SELECT query
// try {
//   const [results, fields] = await connection.query('INSERT INTO board.post (title, writer, password, content, hits, createdDt) VALUES(1, 1, 1, 1, 0, null);');

//   console.log(results); // results contains rows returned by server
//   console.log(fields); // fields contains extra meta data about results, if available
// } catch (err) {
//   console.log(err);
// }

// // Using placeholders
// try {
//   const [results] = await connection.query(
//     'SELECT * FROM post'
//   );

//   console.log(results);
// } catch (err) {
//   console.log(err);
// }


// const mysql = require('mysql2/promise');

// (async () => {
//   try {
//     // MySQL 연결 설정
//     const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: '1111',
//       database: 'board',
//     });

//     console.log('MySQL 연결 성공');

//     // 쿼리 실행
//     const [rows, fields] = await connection.execute('SELECT * FROM post;');
//     console.log('쿼리 결과:', rows);

//     // 연결 종료
//     await connection.end();
//   } catch (err) {
//     console.error('MySQL 연결 또는 쿼리 실행 오류:', err);
//   }
// })();

// console.log(new Date(new Date().toISOString()).toLocaleDateString('ko-KR', { 
//   year: 'numeric', month: '2-digit', day: '2-digit', 
//   hour: '2-digit', minute: '2-digit', second: '2-digit' 
//   }
// ));

// console.log(new Date().toLocaleDateString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
// console.log(new Date().toLocaleTimeString('ko-KR', { 
//   hour: '2-digit', 
//   minute: '2-digit', 
//   hour12:false }));

// console.log(new Date().toDateString());

const axios = require('axios');

for (let i = 0; i < 100; i++) {
  // localhost:3000/post에 100회의 post요청을 보내는 코드
  axios.post('http://localhost:3000/write', {
    title: `${i}번째 게시글`,
    writer: 'test',
    password: 'test',
    content: 'test',
  });
}