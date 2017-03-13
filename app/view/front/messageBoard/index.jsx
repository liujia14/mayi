/*
  name: index
  desc: 提名详情、留言板
  author: 曾安
  version：v1.0
*/
import MessageBoard from "./../../../components/common/message/view.js";
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.less';
import './index.less';
import HeadCom from './../../../components/common/header/index.js'; // 头部导航栏
import Footer from './../../../components/common/footer/index.js'; // 底部公用组件


class Home extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div>
        <HeadCom selectedItem="home"></HeadCom>
        <div className="container">
            <MessageBoard />
        </div>
        <div className="footer">
          <div className="y-container">
            <Footer></Footer>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Home />,
  document.getElementById("content")
);