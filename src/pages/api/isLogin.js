export default function isLogin(req, res){
  console.log("req : " + req);
  res.statusCode = 200;
  
  
  //res.status(200).json({ message: 'Hello from Next.js!' })
  
  if (req.method === 'POST') {
    // POST 요청 처리
    res.status(200).json({ message: 'Hello from Next.js!' });
  } else {
    // 다른 HTTP 메서드 처리
    res.json({ name: req.cookies.a_name });
    
  }
};