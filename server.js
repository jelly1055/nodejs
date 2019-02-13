//터미널 환경 cli에서 처리.
//require가 import와 동일하다고 생각할 수 있음. http라는 모듈을 가지고 오겠다는 의미. ES6문법.
const http = require('http');
const hostname = '127.0.0.1';
const port = 3300;
//처음 3000번 포트로 실행중이므로 port를 변경하기 위해서는 기존 port를 죽이고 다시 node server를 실행해야 한다.

//=>는 function과 같은 의미. req로 주고 res로 받는다.
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  //plain text로 header를 생성.
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

//listen이라는 객체를 만들고 요청이 있으면 받아서 처리해줌.(callback)
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});