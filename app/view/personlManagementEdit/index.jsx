/*
  name: index
  desc: 提名团队修改
  author: 曾安
  version：v1.0
*/
import "./../../components/common/seller-menu/menu.js";
import Management from "./../../components/common/management/personManagementEdit.js";
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.less';

class App extends React.Component {
  render() {
    return (
      <div> 
        <Management />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("right-box")
);