import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [bugs, setBugs] = useState([]);
  const [title,setTitle] = useState('');
  const [descrp,setDescrp] = useState('新建')

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

  return (
    <div>
      <h1>缺陷提交</h1>
      {/* 提交表单 */}
      <div>
        <input 
        type="text"
        value={title}
        onChange={(e)=> setTitle(e.target.value)}
        placeholder='请输入缺陷标题'
         />

        <select value={descrp} onChange={(e)=> setDescrp(e.target.value)}>
          <option value="新建">新建</option>
          <option value="处理中">处理中</option>
          <option value="已解决">已解决</option>
        </select>
        <button onClick={handleSubmit}>提交缺陷</button>
      </div>
      <h2>缺陷列表</h2>
      <ul>
        {bugs.map(bug=>(
          <li key={bug.id}>{bug.title}{bug.descrp}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;