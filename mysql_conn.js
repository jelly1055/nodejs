var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'bookuser',
  password : '111111',
  database : 'bookuser'
});

//mysql에 필요한 것을 모듈화 하자..
//여기서 만들고 export에 담아서 가져다 쓰도록 합시다.
module.exports = { mysql, conn };