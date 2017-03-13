/*
  name: index
  desc: 新增编辑
  author: 曾安
  version：v1.0
*/
import "./../../components/common/seller-menu/menu.js";
import RuleConfig from "./../../components/common/deportRuleConfig/view.js";
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
        <RuleConfig />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("right-box")
);