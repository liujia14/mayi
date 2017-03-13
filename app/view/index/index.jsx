/*
  name: front-nomination-creat
  desc: 前台页面我要提名入口
  author: 刘佳
  data: 2.9
*/
import React from 'react';
import ReactDOM from 'react-dom';
import Nomination from './../../components/common/departTree/view'; 
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ['KB','21'],
    };

  }
  change(v){
    this.setState({
      value: v,
    })
  }
  render() {
    return (
      <div style={{width:"800px"}} >
        <Nomination  multiple onChange={this.change.bind(this)} value={this.state.value} />
      </div>
    );
  }
}


ReactDOM.render(<Home />, document.getElementById("content"));
