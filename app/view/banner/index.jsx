/*
  name: index
  desc: 轮播图管理
  author: 曾安
  version：v1.0
*/
import "./../../components/common/seller-menu/menu.js";
import Banner from "./../../components/common/bannerManage/view.js";
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.less';
class App extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div>
        <Banner />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("right-box")
);