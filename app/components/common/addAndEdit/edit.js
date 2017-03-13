/*
  name: add
  desc: 奖项编辑
  author: 曾安
  version：v1.0
*/
import UploadImage from "./upload.js";
import "./view.less";
import React from "react";
import ReactDOM from "react-dom";
import { Form, Input, Button, InputNumber, message, Breadcrumb, Row, Col, Select, Icon, Radio, DatePicker, TimePicker, Upload, Checkbox } from "antd";
import moment from 'moment';
import Bread from "./../breadNavi/view";
import DepartTree from "./../departTree/view";
import GetYears from "./../getYears/view";

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
function getUrlData(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return r[2];
    }
    return null;
}
var prizeCode = getUrlData("prizeCode");
const PriceInput = React.createClass({
	getInitialState() {
	    const value = this.props.value || {};
	    return {
	      	number: value.number || ''
	    };
	},
  	componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    	if ('value' in nextProps) {
      		const value = nextProps.value;
      		this.setState(value);
    	}
  	},
  	handleNumberChange(e) {
	    const number = parseInt(e.target.value || 0, 10);
	    if (isNaN(number)) {
	      	return;
	    }
	    if (!('value' in this.props)) {
	      	this.setState({ number });
	    }
	    this.triggerChange({ number });
  	},
	triggerChange(changedValue) {
	    // Should provide an event to pass value to Form.
	    const onChange = this.props.onChange;
	    if (onChange) {
	      	onChange(Object.assign({}, this.state, changedValue));
	    }
	},
	backTo(){
		console.log(1111111);
		window.location.href = "/platform/admin.htm";
	},
  	render() {
	    const { size } = this.props;
	    const state = this.state;
	    return (
	      	<span>
	        	<Input
		          	type="text"
		          	size={size}
		          	value={state.number}
		          	onChange={this.handleNumberChange}
		          	style={{ width: 283, marginRight: '3%' }}
	        	/>
	      	</span>
	    );
  	},
});
let AddNew =React.createClass({
	getInitialState() {
      	var self = this;
      	return {
        	merchantAttachUrls:'',
        	isDeport:false,
		    data: '',
		    dataTimepicker: [],
		    startDate: '',
		    endDate: '',
		    prizeType: '',
		    fileCode: '',
		    imgUrl: '',
		    isManager: false,
		    prizeCode: '',
      	};
    },
    componentDidMount(){
	    var self = this;
	    self.fetch();
	    var manager = true;
		$.ajax({
		  url: '/background/department/checkAdmin.json',
		  type: 'post',
		  async : true,
		  success: (data) => {
		  	if (data.success===true){
                manager = data.content.isAdmin;
			  	self.setState({
			  		isManager: manager
			  	});
            } else {

            }
		  },
		  error: (error) => {
            message.error(error);
          },
		});
	},
	fetch(params = {}){
        var self = this;
        $.ajax({
            type : "post",
            async : true,
            url : '/platform/prize/QueryPrizeInfoByCode.json',
            data : {
				prizeCode : prizeCode
            },
            success : function(data){
            	var dataArray = [];
                var startDate = data.content.startDate;
                var endDate = data.content.endDate;
                dataArray.push(startDate,endDate);
                if (data.success===true){
                    self.setState({
	                    data: data.content,
	                    dataTimepicker: dataArray,
	                    startDate: startDate,
	                    endDate: endDate,
	                    prizeType: data.content.prizeType,
	                    imgUrl: data.content.fileUrl,
	                    prizeCode: data.content.prizeCode,
	                });
                } else {

                }

            },
            error: function (error) {
                message.error(error);
            },
        });

	},
	handleSubmit(e) {
	    e.preventDefault();
	    this.props.form.validateFields((err, value) => {
	      	if (!err) {
	       		const values = {
			        'range-time-picker': [
			          value['range-time-picker'][0].format('YYYY-MM-DD HH:mm:ss'),
			          value['range-time-picker'][1].format('YYYY-MM-DD HH:mm:ss'),
			        ]
			    };
			    var prizeName = value['prizeName'];
			    var prizeType = value['prizeType'];
			    var content = value['content'];
			    var priority = value['priority'];
			    var yearTime = value['yearTime'];
			    var departmentCode = value['departmentCode'];
				var startDate = value['range-time-picker'][0].format('YYYY-MM-DD HH:mm:ss');
				var endDate = value['range-time-picker'][1].format('YYYY-MM-DD HH:mm:ss');
			    $.ajax({
		            type : "post",
		            async : true,
		            url : '/background/prize/SavePrizeInfo.json',
		            data : {
		            	prizeName : prizeName,
		            	prizeType : prizeType,
		            	content : content,
		            	year : yearTime,
		            	priority : priority,
		            	startDate: startDate,
		            	endDate : endDate,
		            	departmentCode : departmentCode,
		            	fileCode: this.state.fileCode,
		            	prizeCode: this.state.prizeCode
		            },
		            success : function(data){
		                if (data.success===true){
		                    message.success("修改成功");
		                    setTimeout(() => {window.location.href="/platform/admin.htm"},1500);
		                } else {
		                    message.error(data.errors);
		                }
		            },
		            error: function (error) {
		                message.error(error);
		            },
		        });
	      	}
	    });
	},
	//上传
    handleUpload(info){
      console.log(info);
      if (info.file.status === 'done') {
        this.setState({
          imgUrl:info.file.response.content.url,
          fileCode:info.file.response.content.code,
        })
      }
    },
    //验证
    beforeUpload(file) {
      const isJPG = (file.type === 'image/jpeg' ) || (file.type === 'image/png');
      if (!isJPG) {
        message.error('只支持jpg,jpeg,png格式！');
      }
      const isLt3M = file.size / 1024 / 1024 < 5;
      if (!isLt3M) {
        message.error('上传图片必须小于5M!');
      }
      return isJPG && isLt3M;
    },
    onChange(e) {
	    let isDeport=e.target.value=='2' ? true : false;
	    this.setState({
    		isDeport:isDeport,
    	});
	},
	checkPrice(rule, value, callback) {
	    if (value.number > 0 && value.number < 100) {
	      	callback();
	      	return;
	    }
	    callback('请输入大于0且小于100的正整数！');
	},
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
	},
	goBack(){
		window.location.href = "/platform/admin.htm";
	},
	render(){
		var self = this;
	    const { getFieldDecorator } = this.props.form;
	    const rangeConfig = {
	    	initialValue: [moment(this.state.startDate, dateFormat), moment(this.state.endDate, dateFormat)],
	      	rules: [{ type: 'array', required: true, message: '请选择奖项有效期!' }],
	    };
	    const formItemLayout = {
	      	labelCol: { span: 4 },
	      	wrapperCol: { span: 10 },
	    };
	    var years = new Date().getFullYear();
	    const plainOptions = ['支付宝', '蚂蚁金服'];
	    const options = [
		  	{ label: '支付宝', value: '1' },
		  	{ label: '蚂蚁金服', value: '2' }
		];
		return (
			<div>
				{
					this.state.isManager == true ?
					<Bread breadList={[{text : "我管理的奖项",link : "/platform/admin.htm"},{text : "修改奖项",link : "javascript:();"}]} />
					:
					<Bread breadList={[{text : "我创建的奖项",link : "/platform/admin.htm"},{text : "修改奖项",link : "javascript:();"}]} />
				}
				<div className="contentainer">
					<Form horizontal onSubmit={this.handleSubmit}>
						<Row>
					      	<Col className="gutter-row" span={12}>
					        	<FormItem
					                label="奖项形象"
					                {...formItemLayout}
					                style={{ lineHeight: 7 }}
					            >
			                      	{getFieldDecorator('url', {
	                                    initialValue: this.state.imgUrl,
	                                })(
							            <Upload
						                	showUploadList={false}
				                          	action="/platform/attachment/Upload.json"
				                            beforeUpload={this.beforeUpload}
				                            onChange={this.handleUpload}
				                        >
					                        {
						                      this.state.imgUrl ?
						                        <img src={this.state.imgUrl} role="presentation" className="avatar" /> :
						                        <Icon type="plus" className="avatar-uploader-trigger" style={{width:'96px',height:'96px'}}/>
						                    }
				                      	</Upload>
                                    )}
					            </FormItem>

					      	</Col>
					    </Row>
					    <Row>
					    	<Col className="gutter-row" span={12}>
					            {
					    			this.state.isManager == true ?
						        	<FormItem
						                label="奖项类型"
						                {...formItemLayout}
						                className="ver-middle"
						            >
						            {getFieldDecorator('prizeType', {
						            	initialValue: this.state.prizeType,
						                rules: [{ required: true, message: '请选择奖项类型!' }],
						            })(
						                <RadioGroup style={{display:"none"}} disabled={true} onChange={this.onChange}>
							                <Radio value={1} checked>公司</Radio>
							                <Radio value={2} >部门</Radio>
							            </RadioGroup>
						            )}
						            <span>{this.state.prizeType == 1 ? <span>公司</span>:<span>部门</span> }</span>
						            </FormItem>
						            :
						            <FormItem
						                label="奖项类型"
						                {...formItemLayout}
						                className="ver-middle"
						            >
						            {getFieldDecorator('prizeType', {
						            	initialValue: this.state.prizeType,
						                rules: [{ required: true, message: '请选择奖项类型!' }],
						            })(
						                <RadioGroup style={{display:"none"}} disabled={true} onChange={this.onChange}>
							                <Radio value={2}>部门</Radio>
							            </RadioGroup>
						            )}
						            <span>{this.state.prizeType == 1 ? <span>公司</span>:<span>部门</span> }</span>
						            </FormItem>
					    		}
					      	</Col>
					    </Row>
					    <Row>
					    	<Col className="gutter-row" span={12}>
					        	<FormItem
					                label="奖项名称"
					                {...formItemLayout}
					            >
						            {getFieldDecorator('prizeName', {
						            	initialValue: this.state.data.prizeName,
						                rules: [{ required: true, message: '请输入奖项名称!' }],
						            })(
						                <Input maxLength="50" placeholder = "请输入" style={{width:300}}/>
						            )}
					            </FormItem>
					      	</Col>
					    </Row>
					    <Row>
					    	<Col className="gutter-row" span={12}>
					        	<FormItem
					                label="奖项年度"
					                {...formItemLayout}
					            >
						            {getFieldDecorator('yearTime', {
						            	initialValue: this.state.data.year,
						                rules: [{ required: true, message: '请选择奖项年度!' }],
						            })(
					                	<GetYears style={{width:300}}/>
						                /*<Select placeholder="请选择" style={{width:300}}>
						                	<Option value={years-2}>{years-2}</Option>
							                <Option value={years-1}>{years-1}</Option>
						                  	<Option value={years}>{years}</Option>
						                  	<Option value={years+1}>{years+1}</Option>
						                </Select>*/
						            )}
					            </FormItem>
					      	</Col>
					    </Row>
					    {
					    	this.state.isDeport == false ?
					    	<div>
						    	<Row>
							    	<Col className="gutter-row" span={12}>
								    	<FormItem
							                label="排序"
							                labelCol={{ span: 4 }}
									        wrapperCol={{ span: 14 }}
							            >
								            {getFieldDecorator('priority', {
								            	initialValue: this.state.data.priority,
								            })(
								                <InputNumber placeholder = "请输入" min={1} max={99} onChange={this.onTextChange} style={{ width: 300 }}/>
								            )}
							            </FormItem>
							      	</Col>
							    </Row>
					    	</div>
						    : null
					    }
					    <Row>
					    	<Col className="gutter-row" span={12}>
					    	{
					    		this.state.isDeport == false ?
					    		<FormItem
					                label="归属部门"
					                {...formItemLayout}
					            >
						            {getFieldDecorator('departmentCode', {
						            	initialValue: this.state.data.departmentCode,
						                rules: [{ required: true, message: '请选择归属部门!' }],
						            })(
						                <Select placeholder="请选择" style={{width:300}}>
							                <Option value="ALIPY" key="ALIPY">蚂蚁金服</Option>
						                  	<Option value="KB" key="ALIPY">口碑</Option>
						                  	<Option value="ALIPY,KB" key="ALIPY,KB">蚂蚁金服、口碑</Option>
						                </Select>
						            )}
					            </FormItem> :
					            <FormItem
					              label="归属部门"
					              {...formItemLayout}
					              required
					            >
					                {getFieldDecorator('departmentCode', {
						                rules: [{ required: true, message: '请选择归属部门!' }],
						            })(
					                  <DepartTree style={{width:300}}/>
					                )}
					            </FormItem>
					    	}
					        	
					      	</Col>
					    </Row>
					    <Row>
					    	<Col className="gutter-row" span={12}>
					        	<FormItem
					                label="奖项有效期"
					                {...formItemLayout}
					            >
						            {getFieldDecorator('range-time-picker', rangeConfig)(

							            <RangePicker showTime format={dateFormat} style={{ width: 300 }}/>
							        )}
					            </FormItem>
					      	</Col>
					    </Row>
					    <Row>
					    	<Col className="gutter-row" span={12}>
					        	<FormItem
					                label="奖项内涵"
					                {...formItemLayout}
					            >
						            {getFieldDecorator('content', {
						            	initialValue: this.state.data.content,
						                rules: [{ required: true, message: '请输入奖项内涵!' }],
						            })(
						                <Input placeholder = "请输入" type="textarea" rows="3" maxLength="1024"/>
						            )}
					            </FormItem>
					      	</Col>
					    </Row>
					    <Row>
				            <FormItem wrapperCol={{ span: 24 }} style={{ marginTop: 20, marginLeft: '10%' }}>
				              	<Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>提交奖项</Button>
				              	<Button type="primary" size="large" onClick={this.goBack}>取消</Button>
				            </FormItem>
				        </Row>
					</Form>
				</div>
			</div>
		);
	}
});
AddNew = Form.create()(AddNew);
module.exports = AddNew;