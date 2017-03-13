import "./../../../../components/common/seller-menu/menu.js";
import TableCom from "./../../../../components/backstage/manager/my-prize-nomination-set/index.jsx";
import React, { Component, PropTypes } from 'react';
import ReactDOM from "react-dom";
import 'antd/dist/antd.less';
class GoodsManage extends React.Component {
  render() {
    return (
      <div className="he100">
          <TableCom />
      </div>
    );
  }
}
ReactDOM.render(
  <GoodsManage />,
  document.getElementById("right-box")
);
