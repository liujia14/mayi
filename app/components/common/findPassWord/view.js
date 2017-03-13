import "./view.less";
import React from "react";
import ReactDOM from "react-dom";
import { Form, Input, Checkbox, Button , message } from 'antd';
import ajax from "./../ajax/ajax";
import getUrl from "./../getUrl/getUrlData";
const FormItem = Form.Item;



const FindPassWord = Form.create()(React.createClass({
  getInitialState() {
    return {
      passwordDirty: false,
      disabled : false
    };
  },
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        ajax({
        	url : "/mmbg/account/modifyPwd",
          data : {
            mobilePhone : getUrl("phone"),
            loginPwd : values.password
          },
          success : (data) => {
            if(data.success){
              message.success(data.message);
              this.setState({
                disabled : true
              });
              window.location.href="/mmbg/login/login.htm";
            }else{
              message.error(data.message);
            }
          }
        });
      }
    });
  },
  handlePasswordBlur(e) {
    const value = e.target.value;
    this.setState({ passwordDirty: this.state.passwordDirty || !!value });
  },
  // 再次输入密码
  checkPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码输入不一致');
    } else {
      callback();
    }
  },
  // 输入密码
  checkConfirm(rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.passwordDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    if(value && value.length < 6){
    	callback("密码不能少于6位");
    }else{
    	callback();
    }
  },
  change(e){
  	var t = e.target;
  	t.value = t.value.trim();
  },
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 16,
        offset: 8,
      },
    };
    return (
      <div className="box">
      	<Form horizontal onSubmit={this.handleSubmit}>
	        <FormItem
	          {...formItemLayout}
	          label="密码"
	        >
	          {getFieldDecorator('password', {
	            rules: [{
	              required: true, message: '请输入密码',
	            }, {
	              validator: this.checkConfirm,
	            }],
	          })(
	            <Input onBlur={(e) => {this.handlePasswordBlur(e)}} onChange={(e) => {this.change(e)}} style={{width: "470px"}} type="password" />
	          )}
	        </FormItem>
	        <FormItem
	          {...formItemLayout}
	          label="确认密码"
	        >
	          {getFieldDecorator('confirm', {
	            rules: [{
	              required: true, message: '请再次输入密码',
	            }, {
	              validator: this.checkPassword,
	            }],
	          })(
	            <Input onChange={(e) => {this.change(e)}} style={{width: "470px"}} type="password" />
	          )}
	        </FormItem>
	        <FormItem {...tailFormItemLayout}>
	          <Button disabled={this.state.disabled} className="next" type="primary" htmlType="submit" size="large">确定</Button>
	        </FormItem>
	      </Form>
      </div>
    );
  },
}));
module.exports = FindPassWord;
