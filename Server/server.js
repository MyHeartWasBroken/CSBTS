const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const sqllite = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');

// 配置中间件
app.use(express.json()); // 解析 JSON 请求体
app.use(cors());         // 允许跨域请求

//JWT密钥（生产环境应使用环境变量）
const JWT_SECRET = 'chensheng'

//链接数据库
const db = new sqllite.Database('bugs.db', (err) => {
  if (err) {
    console.error('无法打开数据库 ' + err.message);
  } else {
    console.log('已经连接到数据库');
    db.run('CREATE TABLE IF NOT EXISTS bugs (id INTEGER PRIMARY KEY, title TEXT, descrp TEXT)', (err) => {
      if (err) {
        console.error('无法连接到数据库' + err.message);
      }
    });
  }
});

//创建用户表
db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL)', (err) => {
  if (err) {
    console.error('无法创建用户表 ' + err.message);
  }
});

//创建bug表
db.run(
  'CREATE TABLE IF NOT EXISTS bugs (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, descrp TEXT NOT NULL, userId INTEGER, FOREIGN KEY (userId) REFERENCES users(id))',
  (err) => {
    if (err) {
      console.error('无法创建bug表 ' + err.message);
    }
  }
);

//中间件：验证JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader ? authHeader.split(' ')[1] : null;
  if (!token) return res.status(401).json({ error: '没有接受到token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'token验证失败' });
    req.user = user;
    next();
  });
};

//用户注册
app.post('/api/register', async(req, res) => {
  const { username, password } = req.body;
  try {
    const hashdPassword = await bcrypt.hash(password, 10);//加密密码
    db.run('INSERT INTO users (username,password) VALUES(?,?)', [username, hashdPassword], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(400).send('用户名已存在');
        }
        console.error('注册失败 ' + err.message);
        res.status(500).send('注册失败');
      } else {
        res.send('注册成功');
      }
    });
  } catch (error) {
    res.status(500).send('注册失败');
  }
  });

// 用户登录
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?',[username],async(err,user)=>{
    if(err){
      console.error('登录错误 '+err.message);
      res.status(500).send('登录错误');
    }else if(!user){
      res.status(400).send('用户不存在');
    }else{
      const isPasswordValid = await bcrypt.compare(password,user.password);
      if(!isPasswordValid){
        res.status(400).send('密码错误');
      }else{
        const token = jwt.sign({id:user.id,username:user.username},JWT_SECRET,{expiresIn:'1h'});//生成token,有效期1小时
        res.send(token);
      }
    }
  }
);
});

// //创建bug表
// app.get('/api/create', (req, res) => {
//   db.run('CREATE TABLE IF NOT EXISTS bugs (id INTEGER PRIMARY KEY, title TEXT, descrp TEXT)', (err) => {
//     if (err) {
//       console.error('创建表格错误 ' + err.message);
//     }
//   });
//   res.send('创建Bug成功');
// });

// 用一个数组临时存储缺陷数据
let bugs = [
  
];

//获取bug列表
app.get('/api/bugs', verifyToken, (req, res) => {
  db.all('SELECT * FROM bugs WHERE userId = ?', [req.user.id], (err, rows) => {
    if (err) {
      console.error('获取缺陷错误 ' + err.message);
      res.status(500).send('获取缺陷错误');
    } else {
      res.json(rows);
    }
  });
});

//新增bug
app.post('/api/bugs', verifyToken, (req, res) => {
  const bug = req.body;
  db.run('INSERT INTO bugs (title, descrp, userId) VALUES (?, ?, ?)', [bug.title, bug.descrp, req.user.id], function (err) {
    if (err) {
      console.error('新增缺陷错误' + err.message);
      res.status(500).send('新增缺陷错误');
    } else {
      bug.id = this.lastID;
      res.json(bug);
    }
  });
});

// 删除bug
app.delete('/api/bugs/:id', verifyToken, function (req, res) {
  db.run('DELETE FROM bugs WHERE id = ? AND userId = ?', [req.params.id, req.user.id], function (err) {
    if (err) {
      console.error('删除缺陷错误 ' + err.message);
      res.status(500).send('删除缺陷错误');
      return;
    } 
    if (this.changes === 0) {
      res.status(404).send('未找到该缺陷');
    } else {
      res.send('删除成功');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});