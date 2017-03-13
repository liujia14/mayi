/*
  name: front-nomination-creat
  desc: 前台页面我要提名入口
  author: 刘佳
  data: 2.9
*/
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.less';
import './style.less';
import HeadCom from './../../../components/common/header/index.js'; // 头部导航栏
import Footer from './../../../components/common/footer/index.js'; // 底部公用组件
import Nomination from './../../../components/front/front-nomination-creat/index.jsx'; // 我要提名主逻辑
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <div>
        <HeadCom></HeadCom>
        <Nomination/>
        <div className="y-container" ><Footer/></div>
      </div>
    );
  }
}


ReactDOM.render(<Home />, document.getElementById("content"));
