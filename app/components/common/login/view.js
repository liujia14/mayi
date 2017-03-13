
import login from "./../../../images/loginBg.png";
import "./view.less";
import React from "react";
import ReactDOM from "react-dom";
import {Form, Icon, Input, Button,message} from "antd";
import ajax from "./../ajax/ajax.js";
const FormItem = Form.Item;
const formItemLayout = {
	labelCol: { span: 7 },
  wrapperCol: { span: 24 }
}

class Login extends React.Component{
	constructor(){
		super();
		this.state = {
			userName : "",
			passWord : "",
			userLog : null,
			passLog : null
		}
	}
	onUser(e){
		var val = $.trim(e.target.value);
		this.setState({
			userName : val,
			userLog : val ? null : "请输入用户名"
		});
	}
	onPwd(e){
		var val = $.trim(e.target.value);
		this.setState({
			passWord : val,
			passLog : val ? null : "请输入密码"
		});
	}
	onSubmit(){
		let use = this.state.userName.trim(),
				psd = this.state.passWord.trim();
		if(!use){
			this.setState({
				userLog : "请输入用户名"
			});
			return;
		}
		if(!psd){
			this.setState({
				passLog : "请输入密码"
			});
			return;
		}
		ajax({
			url : "/mmbg/account/checkLogin",
			data : {
				nickName : use,
				loginPwd : psd
			},
			success : (data) => {
				console.log(data);
				if(data.success){
					location.href = "/mmbg/merchant/sellerDetail.htm"
				}else{
					message.error(data.message);
				}
			},
			error(){

			}
		});
	}
	render(){
		var userType = this.state.userLog ? "error" : "success";
		var passType = this.state.passLog ? "error" : "success";
		return(
			<div className="C_login">
				<div className="title"><span>商家后台管理系统</span></div>
				<div style={{backgroundImage : `url(http://ar-staticresource.bj.bcebos.com/image/login.png)`}} className="loginBg">
					<div className="loginBox">
						<div className="boxTitle">账号登录</div>
						<Form className="login-form" onSubmit={(e) => {this.onSubmit(e)}}>
			        <FormItem {...formItemLayout} validateStatus={userType} help={this.state.userLog}>
		            <Input value={this.state.userName} onChange={(e) => {this.onUser(e)}} addonBefore={<Icon type="user" />} placeholder="手机号/昵称" />
			        </FormItem>
			        <FormItem {...formItemLayout} validateStatus={passType} help={this.state.passLog}>
		            <Input value={this.state.passWord} onChange={(e) => {this.onPwd(e)}} addonBefore={<Icon type="lock" />} type="password" placeholder="请输入密码" />
			        </FormItem>
			        <FormItem>
			          <Button style={{marginTop : "15px"}} onClick={() => {this.onSubmit()}} type="primary" className="login-form-button">
			            登录
			          </Button>
			        </FormItem>
			      </Form>
			      <div>
			      	<a href="/mmbg/login/findPhone.htm" className="floatLeft loginHref">忘记密码？</a>
			      	<a href="/mmbg/login/registerPhone.htm" className="floatRight loginHref">没有账户，注册一个</a>
			      </div>
					</div>
				</div>
			</div>
		);
	}
}
module.exports = Login;
