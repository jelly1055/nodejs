var db = require('./mysql_conn'); //내가 만든 모듈이 담길..
var mysql = db.mysql;
var conn = db.conn;

conn.connect(); //db 연결 끝..

var sql = "INSERT INTO books SET title=?, content=?, filename=? "; //sql test
var params = ['나루토','나는 위대한 호카케가 될거라니깐!','naruto.jpg']; //params test
conn.query(sql, params, (err, rows, field) => {
    if(err) {
        console.log(err);
    }
    else {
        console.log(rows);
    }
});