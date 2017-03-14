/*
    name: view
    desc: 提名团队/个人管理
    author: 曾安
    version：v1.0
*/
import "./view.less";
import React from "react";
import ReactDOM from "react-dom";
import { Form, Icon, Input, Button, message, Breadcrumb, Row, Col, Select, Table, Modal, Popconfirm } from "antd";
import EditModal from "./edit.js";
import reqwest from 'reqwest';
import Bread from "./../breadNavi/view";
import ajax from "./../ajax/ajax.js";

const FormItem = Form.Item;
const Option = Select.Option;

let PersonlManage =React.createClass({
	getInitialState() {
      	var self = this;
      	return {
        	visible: false,
			record: '',
			data: [],
			pagination: {

            },
            dataOptions: [],
            deportOwnerOptions: [],
            deptNo: '',
            currentPage: 1,
            tableLoading : false,
            prizeCode: '',
            searchNomineeName:'',
            searchDeptNo:'',
            searchWinStatus:'',
            searchNomineeType:'',
            searchPrizeCodeStr:'',
      	};
    },
	//修改弹框
	editModal(record){
		var nomineeCode = record.nomineeCode;
		this.setState({
	        record : record
	    });
	    window.location.href="/platform/pageconfig/personlManagementEdit.htm?nomineeCode="+nomineeCode;

	},
	//确认修改
	editOk(e) {
        //基本信息表单值
        this.refs.modelform.validateFields((error,val) => {
            if (error) {
                return;
            };
            val.prizeCode=prizeCode;
            var prizeCodeStr = null;
            if(prizeCode){
                var start = prizeCode.indexOf(",")+1;
                var lens = prizeCode.length;
                prizeCodeStr = prizeCode.substring(start,lens);
            }else{
                prizeCodeStr = "";
            }
            val.prizeCode = prizeCodeStr;
            var arr = val.teamList.map((v) => {
                return (JSON.parse(v));
            });
            val.teamList = JSON.stringify(arr);
            this.setState({loading:true});
            ajax({
                url:"/platform/nominate/saveNominate.json",
                data:val,
                success:(data) => {
                    if (data.success===true) {
                        message.success("创建成功");
                        setTimeout(() => {window.location.href=`/platform/pageconfig/messageBoard.htm?nomineeCode=${data.nomineeCode}`},1500);
                    }else{
                        message.error("创建失败，请稍后重试");
                    };
                    this.setState({
                        loading:false,
                    })
                },
                error: () => {
                    this.setState({loading:false})
                }
            })
        }
      )
    },
    //取消弹框关闭
    editCancel(e) {
        console.log('点击了取消');
        this.setState({
            visible: false,
        });
    },
    //删除
    delete(record){
    	var self = this;
      	ajax({
            type : "post",
            async : true,
            url : '/platform/nominate/RemoveNominate.json',
            data : {
            	nomineeCode: record.nomineeCode,
                prize: 1
            },
            success : function(data){
                if (data.success===true){
                    message.success('删除成功');
                    self.fetch({
                        departmentCode: self.state.searchDeptNo,
                        nomineeName: self.state.searchNomineeName,
                        nomineeType: self.state.searchNomineeType,
                        winStatus: self.state.searchWinStatus,
                        prizeCode: self.state.searchPrizeCodeStr,
                        currentPage: 1,
                    });
                } else {
                    message.error(data.errors);
                }
            },
            error: function (error) {
                message.success('删除失败');
            },
        });
    },
    //取消删除
    cancelDelete(e) {
        //message.error('Click on No');
    },
    componentDidMount(){
    	//首页数据
    	this.fetch();
    	//提名奖项
    	this.getAwardsData();
    	//所属部门数据
    	this.getOwnerData();
    },
    getOwnerData(){
    	var self = this;
    	ajax({
            type : "post",
            async : true,
            url : '/background/department/GetDepartments.json',
            success : function(data){

                if (data.success===true){
                    self.setState({
                        deportOwnerOptions: data.content,
                    });
                } else {

                }
            },
            error: function (error) {
                message.error(error);
            },
        });
    },
    getAwardsData(){
    	var self = this;
    	ajax({
            type : "post",
            async : true,
            url : '/platform/prize/QueryAllPrize.json',
            success : function(data){
                if (data.success===true){
                    self.setState({
                        dataOptions: data.content,
                    });
                } else {

                }
            },
            error: function (error) {
                message.error(error);
            },
        });
    },
    //搜索
    handleSearching(e){
    	var self = this;
    	e.preventDefault();
        var prizeCode = this.state.prizeCode;
        var prizeCodeStr = null;
        if(prizeCode){
            var start = prizeCode.indexOf(",")+1;
            var lens = prizeCode.length;
            prizeCodeStr = prizeCode.substring(start,lens);
        }else{
            prizeCodeStr = "";
        }
        var deptNo = this.state.deptNo;
	    this.props.form.validateFields((err, values) => {
	      if (!err) {
	        console.log(values.nomineeName,deptNo,values.winStatus,values.nomineeType,prizeCodeStr);
            self.setState({
                searchNomineeName:values.nomineeName,
                searchDeptNo:deptNo,
                searchWinStatus:values.winStatus,
                searchNomineeType:values.nomineeType,
                searchPrizeCodeStr:prizeCodeStr,
            });
	        self.fetch({
	        	nomineeName: values.nomineeName,
	        	departmentCode: deptNo,
	        	winStatus: values.winStatus,
	        	nomineeType: values.nomineeType,
	        	prizeCode: prizeCodeStr,
                currentPage: 1,
	        },() => {
                this.state.pagination.current = 1;
                this.setState({
                    pagination : this.state.pagination,
                });
            });
	      }
	    });
    },
    handleTableChange(pagination, filters, sorter) {
        const pager = this.state.pagination;
        pager.current = pagination.current;
        var deptNo = this.state.deptNo;
        var prizeCode = this.state.prizeCode;
        var prizeCodeStr = null;
        if(prizeCode){
            var start = prizeCode.indexOf(",")+1;
            var lens = prizeCode.length;
            prizeCodeStr = prizeCode.substring(start,lens);
        }else{
            prizeCodeStr = "";
        }
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.setState({
                pagination: pager,
                currentPage : pagination.current,
            });
            this.fetch({
                currentPage: pagination.current,
                nomineeName: values.nomineeName,
                departmentCode: deptNo,
                winStatus: values.winStatus,
                nomineeType: values.nomineeType,
                prizeCode: prizeCodeStr,
            });
          }
        });
    },
    fetch(params = {},callback){
    	var self = this;
        this.setState({
            tableLoading : true,
        });
        reqwest({
            url: '/platform/nominate/QueryAllNominateInfo.json',
            method: 'post',
            data: {
                ...params,
            	limit: 10,
            },
            type: 'json',
        }).then(data => {
            if (data.success == true) {
                const pagination = self.state.pagination;
                pagination.total = data.content.total;
                pagination.current = data.content.currentPage;
                self.setState({
                	data: data.content.result,
                    tableLoading: false,
                    currentPage:data.content.currentPage,
                    pagination,
                });
                callback && callback();
            } else if (data.success == false){
                message.error(data.errors);
            }
        });
    },
    //奖项列表下拉
    handleChange(value) {
        this.setState({
            prizeCode: value.key,
            prizeName: value.label
        });
    },
    //所属部门列表下拉
    OwnerSelectChange(value) {
        this.setState({
            deptNo: value.key,
            deptName: value.label
        });
    },
    resetForm(){
    	this.props.form.resetFields();
        this.setState({
            deptNo : "",
            prizeCode : "",
        });
        this.fetch();
    },
	render(){
		const { getFieldDecorator } = this.props.form;
	    const formItemLayout = {
	      	labelCol: { span: 6 },
	      	wrapperCol: { span: 18 },
	    };
	    var self = this;
	    const columns = [{
		  	title: '角色',
		  	dataIndex: 'nomineeType',
		  	width: '5%',
		  	render: text => {
		  			if (text == "1") {
		  				return(<span>个人</span>)

		  			}else if (text == "2") {
		  				return(<span>团队</span>)
		  			}
		  	},
		}, {
		  	title: '团队/个人名称',
		  	dataIndex: 'nomineeName',
		  	width: '10%',
		}, {
		  	title: '提名奖项',
		  	dataIndex: 'prizeName',
		  	width: '15%',
		}, {
		  	title: '所属部门',
		  	dataIndex: 'departmentName',
		  	width: '15%',
            render: text => {
                return(
                    <span title={text} className="des-label">{text}</span>
                )
            },
		}, {
		  	title: '提名理由',
		  	dataIndex: 'nominatedReason',
		  	width: '15%',
            render: text => {
                return(
                    <span title={text} className="des-label">{text}</span>
                )
            },
		}, {
		  	title: '团队成员',
		  	dataIndex: 'apTeamMembersNameList',
		  	width: '10%',
            render: text => {
                return(
                    <span title={text} className="des-label">{text}</span>
                )
            },
		}, {
		  	title: '团队/个人形象',
		  	dataIndex: 'url',
		  	width: '10%',
		  	render: (text, row, index) => {
			    console.log(row.url);
			    return (
			    	 <img src={row.url} alt="pic" className="img-bg"/>
			    )
			},
		}, {
		  	title: '点赞数',
		  	dataIndex: 'likeSum',
		  	width: '6%',
		}, {
		  	title: '是否获奖',
		  	dataIndex: 'winStatus',
		  	width: '6%',
		  	render: text => {
		  			if (text == "1") {
		  				return(<span>获奖</span>)
		  			}else if (text == "0") {
		  				return(<span>未获奖</span>)
		  			}
		  	},
		}, {
			title: '操作',
			dataIndex: '',
			key: 'x',
			render: (record) => {
				return(
					<span>
						<a href="#" onClick={() => self.editModal(record)}>修改</a>
						&nbsp;&nbsp;
						<Popconfirm title="确定要删除吗？" onConfirm={() =>self.delete(record)} onCancel={() =>self.cancelDelete(record)} okText="删除" cancelText="取消">
			                <a>删除</a>
			            </Popconfirm>
					</span>
				)
			}
		}];
		return(
			<div className="main">
				<Bread breadList={[{text : "提名团队/个人管理",link : ""}]} />
				<div className="header">
					<Form horizontal onSubmit={this.handleSearching}>
						<Row>
					      	<Col span={8}>
					            <FormItem {...formItemLayout} label="角色">
						            {getFieldDecorator('nomineeType')(
						                <Select placeholder="请选择" style={{ width: "240px" }}>
							                <Option value={1}>个人</Option>
							                <Option value={2}>团队</Option>
						                </Select>
						            )}
						        </FormItem>
					      	</Col>
					      	<Col span={8}>
								<FormItem {...formItemLayout} label="团队/个人名称">
						            {getFieldDecorator('nomineeName')(
						                <Input style={{ width: "240px" }} placeholder="请输入关键字"/>
						            )}
						        </FormItem>
					      	</Col>
					      	<Col span={8}>
								<FormItem {...formItemLayout} label="所属部门">
						            {getFieldDecorator('departmentName')(
                                        <Select
                                            style={{ width: "240px" }}
                                            placeholder="请选择"
                                            onChange={this.OwnerSelectChange}
                                            labelInValue={true}
                                        >
                                            {
                                                this.state.deportOwnerOptions.map((item, index) => {
                                                    return (
                                                        <Option
                                                            key={item.deptName}
                                                            value={item.deptNo}
                                                        >
                                                            {item.deptName}
                                                        </Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )}
						        </FormItem>
					      	</Col>
					    </Row>
					    <Row>
					    	<Col span={8}>
								<FormItem {...formItemLayout} label="提名奖项">
						            {getFieldDecorator('prizeCode')(
                                        <Select
                                            style={{ width: "240px" }}
                                            placeholder="请选择"
                                            onChange={this.handleChange}
                                            labelInValue={true}
                                            showSearch={true}
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {
                                                this.state.dataOptions.map((item, index) => {
                                                    return (
                                                        <Option
                                                            title={item.prizeName}
                                                            value={item.prizeName + "," + item.prizeCode}
                                                        >
                                                            {item.prizeName}
                                                        </Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )}
						        </FormItem>
					      	</Col>
					      	<Col span={8}>
								<FormItem {...formItemLayout} label="是否获奖">
						            {getFieldDecorator('winStatus')(
						                <Select placeholder="请选择" style={{ width: "240px" }}>
							                <Option value={0}>未获奖</Option>
							                <Option value={1}>获奖</Option>
						                </Select>
						            )}
						        </FormItem>
					      	</Col>
					      	<Col span={8}>
						      	<FormItem style={{ textAlign: 'center' }}>
					            	<Button  type="primary" htmlType="submit" style={{ marginRight: '10px' }}>查询</Button>
					            	<Button  type="default" onClick={this.resetForm}>重置</Button>
					            </FormItem>
					      	</Col>
					    </Row>
					</Form>
				</div>
				<div className="container">
					<Table loading={this.state.tableLoading} rowKey={record => record.id} columns={columns} dataSource={this.state.data} pagination={this.state.pagination} onChange={this.handleTableChange}/>
					<Modal
						title="修改"
						visible={this.state.visible}
		            	onOk={this.editOk}
		            	onCancel={this.editCancel}
		          		width="800px"
		          	>
			          	{
				            self.state.visible ?
				            <EditModal ref="modelform" record={self.state.record}/>
				            :null
			          	}
			        </Modal>
				</div>
			</div>
		);
	}
});
PersonlManage = Form.create()(PersonlManage);
module.exports = PersonlManage;
