import "./view.less";
import React from "react";
import ReactDOM from "react-dom";
import { Form, Input, Button, message, Row, Col, Upload, Icon } from "antd";

const FormItem = Form.Item;
let EditApp =React.createClass({
    getInitialState() {
        var self = this;
        return {
            fileUrl: this.props.record.url,
            fileCode: '',
        };
    },
    componentDidMount(){
        
    },
    componentWillReceiveProps(nextProps){
        console.log(nextProps);
        this.setState({
            fileUrl:nextProps.record.url,
            fileCode:nextProps.record.fileCode
        })
    },
	render(){
		var self = this;
	    const { getFieldDecorator } = this.props.form;
	    const formItemLayout = {
	      	labelCol: { span: 10 },
	      	wrapperCol: { span: 14 },
	    };
		return (
			<div>
				<Form  inline>
                    <Row style={{ marginBottom: 24 }}>
                        <Col span={24}>
                            <FormItem
                                label="banner名称"
                                labelCol={{ span: 9 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {getFieldDecorator('bannerName', {
                                    initialValue: this.props.record.bannerName,
                                    rules: [{ required: true, message: '请输入banner名称!' }],
                                })(
                                    <Input style={{ width: 200 }} maxLength={30}/>
                                )} 
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem
                                label="点击链接"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {getFieldDecorator('bannerUrl', {
                                    initialValue: this.props.record.bannerUrl
                                })(
                                    <Input style={{ width: 200 }} maxLength={128}/>
                                )} 
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 24 }}>
                        <Col span={24}>
                            <FormItem
                                label="banner图片"
                                labelCol={{ span: 9 }}
                                wrapperCol={{ span: 11 }}
                            >
                                
                                {getFieldDecorator('url', {
                                    initialValue: this.props.record.url,
                                    rules: [{ required: true, message: '请上传图片!' }],
                                })(
                                    <Upload   
                                        showUploadList={false}
                                        action="/platform/attachment/Upload.json"
                                        beforeUpload={this.props.beforeUpload}
                                        onChange={this.props.handleUpload}
                                    >
                                        {
                                          this.state.fileUrl ?
                                            <img src={this.state.fileUrl} role="presentation" className="avatar" /> :
                                            <Icon type="plus" className="avatar-uploader-trigger" style={{width:'96px',height:'96px'}}/>
                                        }
                                    </Upload>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
			</div>	
		);
	}
});
EditApp = Form.create()(EditApp);
module.exports = EditApp;