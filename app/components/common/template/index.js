/*
  name: template
  desc: 复制模板
  author: 俞雅菲
  version：v1.0
*/
import React from 'react';
import ReactDOM from 'react-dom';
import './../commonCss/index.less';
import './index.less';
export default class Template extends React.Component {
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
          <div className="y-contaiter">
            拷贝模板
          </div>
        )
    }
}
