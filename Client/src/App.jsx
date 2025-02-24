import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Table,Button,Input,Select} from 'antd';
import Login from './Login';

const {option}= Select;

function App() {
  const [bugs, setBugs] = useState([]);
  const [title,setTitle] = useState('');
  const [descrp,setDescrp] = useState('新建');
  const [isLogin,setIsLogin] = useState(false);

  //获取缺陷列表
  useEffect(() => {
    axios.get('http://localhost:5000/api/bugs')
      .then(response => {
        setBugs(response.data);
      })
      .catch(error => {
        console.error('Error fetching bugs:', error);
      });
  }, []);

  //添加新缺陷
  const handleSubmit = () => {
    axios.post('http://localhost:5000/api/bugs', {
      title: title,
      descrp: descrp
    })
    .then(response => {
      setBugs([...bugs, response.data]); // 将新缺陷添加到列表
      setTitle(''); // 清空输入框
      setDescrp('新建'); // 重置状态
    })
    .catch(error => {
      console.error('Error adding bug:', error);
    });
  };
  //删除缺陷
const handleDelete = (id) => {
  axios.delete(`http://localhost:5000/api/bugs/${id}`)
    .then(() => {
      setBugs(bugs.filter(bug => bug.id !== id));//更新前端列表
    })
    .catch(error => {
      console.error('Error deleting bug:', error);
    });
};

// 定义表格列
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '状态',
    dataIndex: 'descrp',
    key: 'descrp'
  },
  {
    title:'操作',
    key:'action',
    render:(text,record)=>(
      <Button type='danger' onClick={()=>handleDelete(record.id)}>删除</Button>
    )
  }
];
  if  (!isLogin) {
    return <Login onLogin={setIsLogin} />;
  }

  return (
    <div>
      <h1>缺陷提交</h1>
      {/* 提交表单 */}
      <div style={{marginBottom: '20px'}}>
        <Input 
        value={title}
        onChange={(e)=> setTitle(e.target.value)}
        placeholder='请输入缺陷标题'
        style={{width: '200px', marginRight: '20px'}}
         />

        <Select value={descrp} onChange={(value)=> setDescrp(value)}>
          <Option value="新建">新建</Option>
          <Option value="处理中">处理中</Option>
          <Option value="已解决">已解决</Option>
        </Select>
        <Button type='primary' onClick={handleSubmit}>提交缺陷</Button>
      </div>
      {/* 缺陷表格 */}
      <Table dataSource={bugs} columns={columns} rowKey='id' />
    </div>
  );
} 

export default App;