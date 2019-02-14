//여기 페이지는 서버를 구동중이므로 재시작을 해야만 적용됨. 즉, 동적인 것은 이 안에서 구현하면 됨.
//server.js에서는 http를 가져왔지만, 여기선 express를 불러옴. express는 필요한 것만 모아놓았음.
//express 4버전부터는 ;를 안넣어도 됨.
const express = require('express'); //함수 원형.
//console.log(express); //console은 어디서봐야 할까? 실행창에서.. 하지만 이미 실행중이므로 이 멍령어를 넣어도 바로 안보임.
//위의 로그를 통해서 express의 함수원형을 볼 수 있음. 안에 다양한 application이 있음.

const bodyParser = require('body-parser'); //post방식의 body처리를 도와줌.
const fs = require('fs');//file system을 쓸수있도록 해줌.
const app = express(); //함수 원형을 넣어서 실행 시킴(()는 실행을 의미). 그안에 get이라든지 listen이라든지가 있음.
const port = 3000;

//express에 static(정적인) public 폴더를 root로 사용하겠다는 의미.
//정적 폴더로서 root폴더 하나를 선택할 수 있고 선택한 폴더가 web root가 된다.
app.locals.pretty = true;
app.use('/', express.static('public')); //public 폴더(디렉토리가) root가 된다는 의미. 즉, web으로 접근하는 사람들은 public아래의 내용만 알 수 있음.
app.use('/assets', express.static('assets')); //이곳도 절대경로로 접속할 수 있도록 함. root이지만 static으로 선언했기 때문에 사용자도 접근이 가능하다.
app.use(bodyParser.urlencoded({extended:true})); //html에 url로 들어온다는 뜻.
app.use(bodyParser.json()); //json으로 들어온다는 뜻.
app.set('view engine', 'pug'); //pug 사용을 위해.. 이건 set으로 설정. 템플릿으로 작성한 것을 쉽게 노드에서 접속할 수 있게 해줌
app.set('views', './views'); //root로 부터의 디렉토리가 검색됨. public이 root이므로 ./로 지정. (__dirname+'/views'로도 가능.)

/**
//정적페이지를 만들어 보자..
app.get('/page', (req,res) => {
    //console.log(req.query);
    //http://localhost:3000/page?id=3&user=jylee 처음 찍으면 { id: '3', user: 'jylee' }가 화면에 출력됨.

    //화면에 main, page1~3을 클릭하면 req에 0~3을 요청하게됨.
    var id = req.query.id;
    //각 페이지를 선택하면 아이디와 일치하는 아래 4개의 배열 숫자에 해당되는 값을 화면에 출력.
    var pageTitles = ["MAIN","PAGE1","PAGE2","PAGE3"];
    var html = `
    <ul>
      <li style="padding:1rem;list-style:none;float:left;width:20%;"><a href="/page?id=0">Main</a></li>
      <li style="padding:1rem;list-style:none;float:left;width:20%;"><a href="/page?id=1">Page1</a></li>
      <li style="padding:1rem;list-style:none;float:left;width:20%;"><a href="/page?id=2">Page2</a></li>
      <li style="padding:1rem;list-style:none;float:left;width:20%;"><a href="/page?id=3">Page3</a></li>      
      <li style="clear:both;list-style:none"></li>
    </ul>
    <div style="text-align:center;">
      <h1>${pageTitles[id]}</h1>
    </div>`;
    res.send(html);
});
**/

//semantic을 해보자. 정적페이지에 대하여 semantic으로 만들어 보기.
//http://localhost:3000/page?id=3&user=jylee 이게 http://localhost:3000/page/3/jylee 이런식으로 보이는 것.
//나중에 아래에 해당하는 것만 따로 빼서 module로 만들고, view단을 세분화한게 react다.
//router 단.. 오직 get만이 경로 정보를 사용함. 그러므로 post에서 경로를 넣어도 아무 문제가 없음. 헷갈리지말자..
app.get('/book', getQuery);
app.get('/book/:id', getQuery);
app.get('/book/:id/:mode', getQuery);
//query가 어려우므로 params를 이용하여 쉽게 해주는 방법이 있음.
//body-parser WAS개념. 미들웨어.
//npm install body-parser 프로젝트 사용될 놈이므로 -g 옵션을 안줌.
//우리가 설치한 모든 pkg는 package.json에 모드 들어 있음.
app.post('/book/create', postQuery); //post에 대한 내용.(저장)

function postQuery(req, res) {
    //title,content에 data가 전달됨.
    //get에서는 ?id방식의 query 또는 param로 받아왔지만. post는 body에서 받아음.(즉 편지지)
    //원래는 var title = req.body.title가 안됨. body-parser가 존재하기 때문에 가능함 이게 없으면 error발생하게 됨.
    var tit = req.body.title;
    var content = req.body.content;
    var str = "";
    //console.log(title + content);
    //res.send(title + " / " + content);    
    fs.readFile('./data/book.json','utf-8',function(err, data){
        if(err) res.status(500).send("Internal Error");
        var datas = JSON.parse(data);
        datas.books.push({
            tit, //tit으로 하는 것은 ES6 문법. var tit = req.body.title 가 있으므로..
            id: datas.books[datas.books.length -1].id + 1, //data가 숫자이므로 마지막 숫자에 +1을해서 id를 부여하는 것.
            content //ES6 문법. var content = req.body.content 가 있으므로..
        }); //datas에 books는 []배열임.
        str = JSON.stringify(datas);
        fs.writeFile('./data/book.json', str, (err) => {
            if(err) res.status(500).send("Internal Error");
            else{
                //res.send('저장 성공');
                //redirect개념이 아님. response로 처리.
                //저장시킨 data가 있으므로 다시 도서목록으로 가려면
                var pugData = {pages: datas.books};
                pugData.title = "도서 목록";
                res.render('li', pugData);
            }
        });
    });
}

function getQuery(req, res) {
    //var id = req.query.id;
    //var id = req.query.mode;
    var params = req.params; //0,1,2 이런게 param
    var datas = null;
    //console.log(params);
    //var pageTitles = ["MAIN","PAGE1","PAGE2","PAGE3"];
    //파일을 읽고 캐릭터셋을 지정하고 error처리를 어떻게 할지에 대하여 function을 만들어 준다.
    fs.readFile('./data/book.json','utf-8',function(err, data){
        //200은 정상 답변, 400은 error 등.. 상태와 응답을 동시에 보내줌. 브라우저로..
        //if문을 감싸지않아도되며, if에 해당하지 않으면 그 다음줄이 출력된다.
        if(err) res.status(500).send("Internal Error");
        var datas = JSON.parse(data); //data가 json형태이므로 한방에 처리가능. json을 js object로 변경해줌.
        //var booksTxt = JSON.stringify(books);//js object를 json으로 만드는 것.
        //console.log(data); //json문자열
        //console.log(books); //js object
        //console.log(booksTxt); //js object를 다시 json으로..
        //res.render('nav', {
        //title: "도서목록",
        //pages: datas.books
        //});
        var pugData = {pages: datas.books};
        if(typeof params.id !== 'undefined'){ //문자형으로 변경해줌 typeof로..
            if(params.id == 'new'){
                pugData.title = "신규 글 작성";
                res.render('wr', pugData);
                /**
                //입력양식 페이지.
                res.render('wr', {
                    //title:"글쓰기",
                    title:"신규글 작성",
                    pages: datas.books
                }); //view단을 render해줌. template는 wr을 씀. (wr.pug)
                **/
            }
            else {
                pugData.title = "도서 목록";
                res.render('li', pugData);
                /**
                res.render('li', {
                    //title:"글쓰기",
                    title:"도서목록",
                    pages: datas.books
                });
                **/
                /** server단에서 값을 강제로 보내는 부분에 대한 테스트 code
                res.render('nav', { //nav.pug
                    title: "도서목록",
                    pages: [
                        {id:0, tit:"홍길동전"},
                        {id:1, tit:"구운몽"},
                        {id:2, tit:"태백산맥"},
                        {id:3, tit:"토끼와거북이"}
                    ]
                }); //객체가 들어감.
                **/
            }
        }
        else {
            res.send('');
        }
    });    
}

/**
app.get('/book/science',(req, res) => { //json객쳐의 형태임 내부에선..
    var html = `<h1>과학 카테고리입니다!!</h1>`;
    res.send(html);
});
**/

app.get('/info',(req, res) => { // /info로 연결할 때의 page
    //동적으로 만드는 것.
    var now = new Date();
    var html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Information</title>
    </head>
    <body>
        <h1>Information Page</h1>
        <h2>${now}</h2>
    </body>
    </html>`;
    res.send(html); //client가 나한테 요청을 했을 때(get으로) 응답을 보내는 것을 의미.
});

//RESTful -- 현재 브라우저는 get만 지원.
//app.get('/', (req, res) => res.send('Hello World JeYeol Lee! :)'));
////app.post('/',(req, res) => res.send('Hello World!~~~'));
////app.put('/',(req, res) => res.send('Hello World!~~~'));
////app.delete('/',(req, res) => res.send('Hello World!~~~'));

//() => console.log(`Example app listening on port ${port}!`) 이게 콜백함수임.
//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
//서버 구동(한줄로 끝)
app.listen(port, () => console.log(`http://localhost:${port}`));
//매번 이 페이지의 정보를 변경하기 위해서 서버를 리스타트하는 것이 번거롭기 때문에 supervisor를 설치해서 사용함.
//npm install -g supervisor
//supervisor app.js
//단, 개발서버에서만 사용합시다..
