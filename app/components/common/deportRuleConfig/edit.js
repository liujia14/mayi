/*
    name: view
    desc: 部门规则配置-修改弹框组件
    author: 曾安
    version：v1.0
*/
import "./view.less";
import React from "react";
import ReactDOM from "react-dom";
import { Form, Input, Button, message, Row, Col, InputNumber } from "antd";

const FormItem = Form.Item;
class EditApp extends React.Component {

    constructor(props) {
        super(props);
        var data = this.props.record;
        console.log(this.props.record.departCode);
    }
    checkPrice(rule, value, callback) {
        if (value.number > 0 && value.number < 100) {
            callback();
            return;
        }
        callback('序号为大于0且小于100的正整数');
    }
    onTextChange(value){
        console.log('changed', value);
        if(!value){
            return;
        }
        if( value <= 0 ){
            message.error("排序请输入大于0且小于100的正整数！");
            return;
        } else if(value > 99){
            message.error("排序请输入大于0且小于100的正整数！");
            return;
        }
    }
	render(){
		var self = this;

	    const { getFieldDecorator } = this.props.form;
	    const formItemLayout = {
	      	labelCol: { span: 10 },
	      	wrapperCol: { span: 14 },
	    };
		return (
			<div>
				<Form inline>
                    <Row style={{ marginBottom: 24, marginTop: 15 }}>
                        <Col span={24}>
                            <FormItem
                                label="部门"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('departName', {
                                    initialValue: this.props.record.departName,
                                    rules: [{ required: true }],
                                })(
                                    <Input style={{ width: 200 }} disabled/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ marginBottom: 20 }}>

                            <FormItem
                                label="序号"
                                labelCol={{ span: 10 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {getFieldDecorator('priority', {
                                    initialValue: this.props.record.priority
                                })(
                                    <InputNumber onChange={this.onTextChange} min={1} max={99} style={{ width: 200 }}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
			</div>
		);
	}
}
EditApp = Form.create()(EditApp);
module.exports = EditApp;