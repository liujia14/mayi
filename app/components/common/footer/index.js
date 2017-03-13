/*
name: footer
desc: 底部公用模板
author: 俞雅菲
version：v1.0
*/
import React from 'react';
import ReactDOM from 'react-dom';
import './../commonCss/index.less';
import './index.less';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount(){

  }
  render() {
    let self = this;
    return (
      <div className="y-footer">
        蚂蚁金服版权所有
      </div>
    )
  }
}
