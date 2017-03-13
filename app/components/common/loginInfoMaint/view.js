

import "./view.less";
import React from "react";
import ReactDOM from "react-dom";
import { Modal, Button ,Input,Form,Radio,message} from 'antd';
import Phone from "./../registerPhone/view";
import ajax from "./../ajax/ajax";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

// 修改密码 组件
var DeleteForm = Form.create()(React.createClass({
	getInitialState(){
		var state = {
			old : "",
			newOne : "",
			newTwo : "",
		};
		return state;
	},
	// 确认密码
	newChange(rule, value, callback){
		var form = this.props.form;
		var _new = form.getFieldValue("newOne");
		var _newTwo = form.getFieldValue("newTwo");
		if(value && value.length < 6){
			callback("密码不能小于6位");
			return;
		}
		if(value && (!/^(?![0-9]+$)[0-9A-Za-z^$#@!&%]{6,20}$/i.test(value))){
			callback("密码必须是6-20个英文字母、数字或者符号，不能是纯数字");
			return;
		}
		if(_new && _newTwo){
			if (_new !== _newTwo){
				callback("两次密码输入不一致");
			}else{
				callback();
				// 存在 溢出问题
				//form.validateFields(["newTwo","newOne"], { force: true });
				callback();
			}
		}else{
			callback();
		}
	},
	// 密码change
	editChange(e,type){
		var obj = {};
		var val = e.target.value;
		obj[type] = val;
		this.setState(obj);
	},
	render(){
		const { getFieldDecorator } = this.props.form;
		// this.props.form.validateFieldsAndScroll
		this.props.data(this);
		return(
			<Form horizontal>
				<FormItem
          {...formItemLayout}
          label="登录密码"
        >
          {getFieldDecorator('password', {
            rules: [{
            	message : "密码不能为空",
            	required : true
            }],
            initialValue : this.state.old
          })(
            <Input onChange={(e) => {this.editChange(e,"old")}} style={{width:"320px"}} type="password" placeholder="请输入" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="新密码"
        >
          {getFieldDecorator('newOne', {
            rules: [{
            	message : "密码不能为空",
            	required : true
            },{
            	validator : this.newChange
            }],
            initialValue : this.state.newOne
          })(
            <Input onChange={(e) => {this.editChange(e,"newOne")}} style={{width:"320px"}} type="password" placeholder="请输入" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="确认新密码"
        >
          {getFieldDecorator('newTwo', {
            rules: [{
            	message : "密码不能为空",
            	required : true
            },{
            	validator : this.newChange
            }],
            initialValue : this.state.newTwo
          })(
            <Input onChange={(e) => {this.editChange(e,"newTwo")}} style={{width:"320px"}} type="password" placeholder="请输入" />
          )}
        </FormItem>
			</Form>
		)
	}
}));



class LoginInfoMaint extends React.Component{
	componentDidMount(){
		ajax({
			url : "/mmbg/account/getOrdinaryAccount",
			success : (data) => {
				if(data.success){
					let {nickName,mobilePhone,agree} = data.result;
					this.setState({
						userName : nickName,
						phone : mobilePhone,
						note : agree,
						default : {
							userName : nickName,
							note : agree,
						}
					});
				}else{
					message.error(data.message);
				}
			}
		});
	}
	constructor(){
		super();
		this.state = {
			// 昵称
			userName : "zw",
			// 昵称是否显示
			userNameText : true,
			// 昵称修改 是否显示
			userNameEdit : false,
			// 短信推送
			note : "yes",
			// 短信推送 是否显示
			noteText : true,
			// 短信推送修改 是否显示
			noteEdit : false,
			// 弹出框 状态
			popType : {
				// 昵称浮层 弹出框
				passWordPop : false,
				// 修改手机 弹出框
				phonePop : false
			},
			phone : "13979332222",
			// 修改密码浮层 数据
			editPassWordData : null,
			// 修改手机号浮层 数据
			editPhone : null,
			// 默认的数据
			default : {
				userName : "zw",
				note : "yes",
			}
		}
	}
	// 昵称 change
	userNameChange(e){
		this.setState({
			userName : e.target.value
		});
	}
	// 点击 昵称 修改
	userNameEdit(e){
		this.setState({
			userNameText : false,
			userNameEdit : true
		});
	}
	// 修改名称 确定
	userNameOk(e){
		let userName = this.state.userName.trim();
		if(!userName){
			message.error("请输入昵称");
			return;
		}else if(userName.length < 3){
			message.error("不能小于三个字符");
			return;
		}
		ajax({
			url : "/mmbg/account/modifyOrdinaryByOrdinaryAccountCode",
			data : {
				nickName : userName,
			},
			success : (data) => {
				if(data.success){
					// 请求ajax 成功修改状态
					message.success(data.message);
					this.setState({
						userNameText : true,
						userNameEdit : false,
						userName : userName,
						default : {
							userName : userName,
						}
					});
				}else{
					message.error(data.message);
				}
			},
		});
	}
	// 修改名称 取消
	userNameClose(){
		this.setState({
			userNameText : true,
			userNameEdit : false,
			userName : this.state.default.userName
		});
	}
	// 点击 修改密码
	passWordEdit(e){
		this.setState({
			popType :{
				passWordPop : true
			}
		});
	}
	// 点击 修改浮层 确定
	passWordOk(){
		this.state.editPassWordData.props.form.validateFieldsAndScroll((err,values) => {
			if(!err){
				let {password,newOne} = values;
				password = password.trim();
				newOne = newOne.trim();
				if(!password){
					message.error("原密码不能为空");
					return;
				}
				if(!newOne){
					message.error("新密码不能为空");
				}
				ajax({
					url : "/mmbg/account/modifyPwdByMobilePhone",
					data : {
						pwd : password,
						loginPwd : newOne,
					},
					success :(data) => {
						if(data.success){
							message.success(data.message);
							this.resetPassWord();
						}else{
							message.error(data.message);
						}
					},
				});
			}
		});
	}
	// 点击 修改浮层 取消
	passWordClose(){
		this.resetPassWord();
	}
	// 重置 密码浮层 数据
	resetPassWord(){
		this.setState({
			popType : {
				passWordPop : false,
			}
		});
		// 重置 修改密码 浮层
		this.state.editPassWordData.props.form.resetFields();
		this.state.editPassWordData.setState({
			old : "",
			newOne : "",
			newTwo : ""
		});
	}
	// 点击 手机号修改
	phoneEdit(){
		this.setState({
			popType : {
				phonePop : true
			}
		});
	}
	// 修改手机 点击取消
	phoneClose(){
		this.resetPhone();
	}
	resetPhone(){
		this.setState({
			popType : {
				phonePop : false
			}
		});
		this.state.editPhone((err,{phone,code},t) => {
			t.setState({
				phone : "",
				code : "",
				phoneType : "success",
				codeType : "success",
				codeDisabled : false,
				codeText : "获取验证码",
				codeHelp : "",
				clearTimer : true,
				phoneHelp : ""
			});
		});
	}
	// 修改手机 点击确定
	phoneOk(){
		this.state.editPhone((err,{phone,code},t) => {
			phone = phone.trim();
			code = code.trim();
			if(!phone){
        //message.error("请输入手机号");
        t.setState({
          phoneHelp : "请输入手机号",
          phoneType : "error",
        });
        return;
      }else if(!t.state.isClick){
        //message.error("请获取验证码");
        t.setState({
          codeHelp : "请获取验证码",
          codeType : "error",
        });
        return;
      }else if(!code){
        //message.error("请输入验证码");
        t.setState({
          codeHelp : "请输入验证码",
          codeType : "error",
        });
        return;
      }else if(t.state.phoneType !== "success"){
        return;
      }else if(t.state.codeType !== "success"){
        return;
      }
      // 通过校验
      if(true){
      	ajax({
          url : "/mmbg/account/modifyOrdinaryByOrdinaryAccountCode",
          data : {
            mobilePhone : phone,
            identifyingCode : code
          },
          success : (data) => {
            if(data.success){
              message.success(data.message);
              this.setState({
              	phone : phone,
              });
            }else{
              message.error(data.message);
            }
            this.resetPhone();
          },
          error : (data) => {
            message.error("数据请求失败，请稍后重试");
          }
        });
      }
		});
	}
	// 点击短信 推送 修改
	noteEdit(e){
		this.setState({
			noteText : false,
			noteEdit : true
		});
	}
	// 短信推送 change
	noteChange(e){
		this.setState({
			note : e.target.value
		});
	}
	// 短信推送 确定
	noteOk(e){
		let val = this.state.note;
		console.log(val);
		// 请求ajax 成功修改状态
		ajax({
			url : "/mmbg/account/modifyOrdinaryByOrdinaryAccountCode",
			data : {
				agree : val,
			},
			success : (data) => {
				if(data.success){
					message.success(data.message);
					this.setState({
						noteText : true,
						noteEdit : false,
						note : val,
						default : {
							note : val,
						}
					});
				}else{
					message.error(data.message);
				}
			}
		});
	}
	// 短信推送 取消
	noteClose(e){
		this.setState({
			noteText : true,
			noteEdit : false,
			note : this.state.default.note
		});
	}
  render(){
  	var userNameText = this.state.userNameText ? "block" : "none";
  	var userNameEdit = this.state.userNameEdit ? "block" : "none";
  	var noteText = this.state.noteText ? "block" : "none";
  	var noteEdit = this.state.noteEdit ? "block" : "none";
    return(
      <div className="loginInfoMaint">
      	<div className="panel">
	      <div className="panel-header">登录信息维护
					{/*<a href="./sellerEdit.html" className="panel-header-btn btn">返回</a>*/}
		      </div>
		      <div className="panel-body pt30">

		          <div className="panel-row">
		            <label className="row-left">昵称：</label>
		            <div className="row-right">
		            	<span style={{display : userNameText}}>
		            		<span>{this.state.userName}</span>
		            		<a onClick={(e) => {this.userNameEdit(e)}} className="href">修改</a>
		            	</span>
		            	{/* 修改昵称部分 */}
		            	<span style={{display : userNameEdit}}>
		            		<Input maxLength="20" value={this.state.userName} onChange={(e) => {this.userNameChange(e)}} style={{width: "200px"}} />
			            	<Button onClick={(e) => {this.userNameOk(e)}} style={{marginRight:"10px"}} type="primary">确定</Button>
			            	<Button onClick={(e) => {this.userNameClose(e)}}>取消</Button>
		            	</span>
	            	</div>
		          </div>
		          <div className="panel-row">
		            <label className="row-left">密码：</label>
		            <div className="row-right">
		            	******
		            	<a onClick={(e) => {this.passWordEdit(e)}} className="href">修改</a>
	            	</div>
		          </div>
		          <div className="panel-row">
		            <label className="row-left">手机号+86：</label>
		            <div className="row-right">
		            	{this.state.phone}
		            	<a onClick={(e) => {this.phoneEdit(e)}} className="href">修改</a>
	            	</div>
		          </div>
		          <div className="panel-row">
		            <label className="row-left">同意推送短信推送：</label>
		            <div className="row-right">
		            	<span style={{display : noteText}}>
		            		{this.state.note === "yes" ? "是" : "否"}
		            		<a onClick={(e) => {this.noteEdit(e)}} className="href">修改</a>
		            	</span>
		            	{/* 修改 同意推送短信推送 */}
		            	<span style={{display : noteEdit}}>
		            		<RadioGroup value={this.state.note} onChange={(e) => {this.noteChange(e)}}>
							        <Radio value={"yes"}>是</Radio>
							        <Radio value={"no"}>否</Radio>
							      </RadioGroup>
							      <Button onClick={(e) => {this.noteOk(e)}} style={{marginRight:"10px"}} type="primary">确定</Button>
			            	<Button onClick={(e) => {this.noteClose(e)}}>取消</Button>
		            	</span>
	            	</div>
		          </div>
		       </div>
		    </div>

        <Modal onOk={() => {this.passWordOk()}} onCancel={() => {this.passWordClose()}}  title="修改密码" visible={this.state.popType.passWordPop}
        >
          <DeleteForm clear={true} data={(data) => {this.state.editPassWordData = data}} />
        </Modal>
        <Modal onOk={() => {this.phoneOk()}} onCancel={() => {this.phoneClose()}} title="修改手机号" visible={this.state.popType.phonePop}>
        	<Phone data={(data) => {this.state.editPhone = data}} />
        </Modal>
      </div>
    );
  }
}

module.exports = LoginInfoMaint;
