/*
  name: header
  desc: 头部导航
  author: 俞雅菲
  version：v1.0
*/
import React from 'react';
import ReactDOM from 'react-dom';
import './../commonCss/index.less';
import ajax from './../ajax/ajax.js';
import './index.less';
import { message } from 'antd';
export default class Header extends React.Component {
    constructor(props) {
        super();
        this.state = {
          username : ""
        }
        this.handout = this.handout.bind(this);
    }
    componentWillMount(){
      let self = this;
      ajax({
        url:'/platform/home/GetLoginUserInfo.json',
        type:"POST",
        success:(data)=>{
          if(data.success){
            if(data.content.nickNameCn){
              self.setState({
                username: data.content.lastName+"("+data.content.nickNameCn+")"
              });
            }else{
              self.setState({
                username: data.content.lastName
              });
            }
          }else{
            window.location.href=data.content;
          }
        },
        error:()=>{}
      });
    }
    handout(){
      ajax({
        url:'/platform/home/Eixt.json',
        type:"POST",
        data:{type:1},
        success:(data)=>{
          if(data.success){
            window.location.href=data.content;
          }else{
            message.info(data.errors);
          }
        },
        error:()=>{}
      });
    }
    render() {
      let self = this;
      let user = self.state.username;
      let selectedItem = self.props.selectedItem; //设置导航栏选中状态
        return (
          <div className="y-header">
            <div className="y-container">
              <a href="/platform/index.htm" className="y-logo"></a>

                {
                  selectedItem == 'home' ? <ul className="y-nav"><li className="active"><a href="/platform/index.htm">首页</a></li> <li><a href="/platform/pageconfig/myAwards.htm?type=0">我的奖项</a></li></ul>
                : selectedItem == 'myawards' ? <ul className="y-nav"><li><a href="/platform/index.htm">首页</a></li> <li className="active"><a href="/platform/pageconfig/myAwards.htm?type=0">我的奖项</a></li></ul>
              : <ul className="y-nav"><li><a href="/platform/index.htm">首页</a></li> <li><a href="/platform/pageconfig/myAwards.htm?type=0">我的奖项</a></li> </ul>
                }
              <span className="loginUser handout" onClick={(e)=>self.handout()}>退出</span> <span className="loginUser" href="">{user}</span>
            </div>
          </div>
        )
    }
}
