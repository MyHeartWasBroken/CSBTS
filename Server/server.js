const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const sqllite = require('sqlite3').verbose();

// 配置中间件
app.use(express.json()); // 解析 JSON 请求体
app.use(cors());         // 允许跨域请求

//链接数据库
const db = new sqllite.Database('bugs.db', (err) => {
  if (err) {
    console.error('Error opening database ' + err.message);
  } else {
    console.log('Connected to the bugs database.');
    db.run('CREATE TABLE IF NOT EXISTS bugs (id INTEGER PRIMARY KEY, title TEXT, descrp TEXT)', (err) => {
      if (err) {
        console.error('Error creating table ' + err.message);
      }
    });
  }
});

//创建bug表
app.get('/api/create', (req, res) => {
  db.run('CREATE TABLE IF NOT EXISTS bugs (id INTEGER PRIMARY KEY, title TEXT, descrp TEXT)', (err) => {
    if (err) {
      console.error('Error creating table ' + err.message);
    }
  });
  res.send('Table bugs created');
});

// 用一个数组临时存储缺陷数据
let bugs = [
  
];

//获取bug列表
app.get('/api/bugs', (req, res) => {
    db.all('SELECT * FROM bugs', (err, rows) => {
      if (err) {
        console.error('Error getting bugs ' + err.message);
        res.status(500).send('Error getting bugs');
      } else {
        bugs = rows;
        res.json(bugs);
      }
    });
  });

//新增bug
app.post('/api/bugs', (req, res) => {
  const bug = req.body;
  db.run('INSERT INTO bugs (title, descrp) VALUES (?, ?)', [bug.title, bug.descrp], function (err) {
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
app.delete('/api/bugs/:id', function (req, res) {
  db.run('DELETE FROM bugs WHERE id = ?', req.params.id, function (err) {
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