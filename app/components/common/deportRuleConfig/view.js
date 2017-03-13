import "./view.less";
import React from "react";
import ReactDOM from "react-dom";
import { Form, Icon, Input, Button, message, Row, Col, Select, Breadcrumb, Tabs } from "antd";
import Alipay from "./alipay.js";
import Koubei from "./koubei.js";
import Bread from "./../breadNavi/view";

const TabPane = Tabs.TabPane;
function callback(key) {
  console.log(key);
}
//规则配置页面
let App =React.createClass({
  render() {
    return (
        <div className="main">
            <div className="bread">
                <Bread breadList={[{text : "部门规则配置",link : ""}]} />
            </div>
            <div className="container">
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="蚂蚁金服" key="1"><Alipay /></TabPane>
                    <TabPane tab="口碑" key="2"><Koubei /></TabPane>
                </Tabs>
            </div>
      </div>
    )
  }
});
App = Form.create()(App);
module.exports = App;