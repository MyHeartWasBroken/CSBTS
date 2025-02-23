const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');

// 配置中间件
app.use(express.json()); // 解析 JSON 请求体
app.use(cors());         // 允许跨域请求

// 用一个数组临时存储缺陷数据
let bugs = [
  { id: 1, title: '登录按钮失效', descrp: '新建' },
  { id: 2, title: '页面加载缓慢', descrp: '处理中' },
];

//获取bug列表
app.get('/api/bugs', (req, res) => {
    res.json(bugs);
  });

//新增bug
app.post('/api/bugs',(req,res)=>{
  const newBug = {
    id:bugs.length + 1,
    title: req.body.title,
    descrp: req.body.descrp || '新建'   //当前默认为新建的bug
  };
  bugs.push(newBug);
  res.json(bugs)
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});