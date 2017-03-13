
import "./view.less";
import React from "react";
import ReactDOM from "react-dom";
import 'antd/dist/antd.css';



class LoginTitle extends React.Component{
	constructor(){
		super();

	}
	render(){
		return(
			<div className="loginTitle">
				<div className="left">
					<a>商家后台管理系统</a>
					<span>{this.props.loginTitle}</span>
				</div>
				<div className="right">
					<span>已有账户</span>
					<a href="/mmbg/login/login.htm">前去登录</a>
				</div>
			</div>
		);
	}
}
module.exports = LoginTitle;
