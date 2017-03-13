/*
    name: view
    desc: 部门规则配置-蚂蚁金服
    author: 曾安
    version：v1.0
*/
import "./view.less";
import React from "react";
import ReactDOM from "react-dom";
import { Form, Input, Button, message, InputNumber, Row, Col, Select, Table, Popconfirm, Modal } from "antd";
import EditModal from "./edit.js";
import reqwest from 'reqwest';

const FormItem = Form.Item;
const Option = Select.Option;
//规则配置页面
let App =React.createClass({
    getInitialState() {
        var self = this;
        return {
            data: [],
            addVisible: false,
            record: '',
            editVisible: false,
            loading: false,
            pagination: {
            },
            dataOptions: [],
            departCode: '',
            deportId: '',
            departName: '',
            currentPage: 1,
            loading: false,
        };
    },
    //新增弹框
    showAddModal(){
        var self = this;
        this.props.form.resetFields();
        this.setState({
            addVisible: true
        });
        $.ajax({
            type : "post",
            async : true,
            data: {
                buNo: 'ALIPY',
            },
            url : '/background/department/GetDepartments.json',
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
    //提交规则
    addOk(){
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var deport = this.state.departName;
                var priority = values.priority;
                var departCode = this.state.departCode;
                this.state.pagination.current = 1;
                this.addFetch({
                    departCode: departCode,
                    departName: deport,
                    priority : priority,
                    company : 1,
                    pagination: this.state.pagination,
                });
            }
        });
    },
    //新增提交
    addFetch(params = {}){
        reqwest({
            url: '/background/department/ AddDeptmentPriority.json',
            method: 'post',
            data: {
                ...params,
            },
            type: 'json',
        }).then(data => {
            if (data.success == true) {
                this.setState({
                    addVisible: false,
                    loading: false
                });
                message.success("新增成功");
                this.fetch();
            } else if (data.success == false){
                message.error(data.errors);
            }
        });
    },
    //新增取消
    addCancel(){
        this.setState({
            addVisible: false,
        });
    },
    //修改弹框
    editModal(record){
        this.setState({
            editVisible: true,
            record: record,
            deportId: record.id
        });

    },
    //修改弹框提交
    editOk(){
        this.refs.modelform.validateFields((err, values) => {
            var self = this;
            if (!err) {
                $.ajax({
                    type: "post",
                    async: true,
                    url: "/background/department/ UpdateDeptPriority.json",
                    data: {
                        id: this.state.deportId,
                        priority: values.priority
                    },
                    success: (data) => {
                        if (data.success===true){
                            this.state.pagination.current = 1;
                            self.setState({
                                editVisible: false,
                                pagination: this.state.pagination,
                            });
                            message.success("修改成功");
                            self.fetch();
                        } else {
                            message.error(data.errors);
                        }
                    },
                    error: function(error){
                        message.error(error);
                    }
                });
            }
        });
    },
    //修改弹框取消弹框
    editCancel(){
        this.state.pagination.current = 1;
        this.setState({
            editVisible: false,
            pagination: this.state.pagination,
        });
        this.fetch();
    },
    //删除
    delete(record){
      var self = this;
      $.ajax({
            type : "post",
            async : true,
            url : '/background/department/RemoveDepart.json',
            data : {
                id : record.id
            },
            success : (data) => {

                if (data.success===true){
                    this.state.pagination.current = 1;
                    self.setState({
                        loading: false,
                        pagination : this.state.pagination,
                    });
                    message.success('删除成功');
                    self.fetch();
                } else {
                    message.success('删除失败');
                }
            },
            error: function (error) {
                message.warning(error);
            },
        });
    },
    //取消删除
    cancelDelete(e) {
    },
    componentDidMount(){
        var self = this;
        self.fetch();
    },
    //页面加载发起请求
    fetch(params = {}){
        var self = this;
        this.setState({
            loading: true
        });
        reqwest({
            url: '/background/department/QueryDepartmentByPage.json',
            method: 'post',
            data: {
                limit: 10,
                company: 1,
                currentPage: this.state.currentPage,
                ...params,
            },
            type: 'json',
        }).then((data) => {
            const pagination = self.state.pagination;
            pagination.total = data.content.total;
            if (data.success===true){
                self.setState({
                    loading: false,
                    data: data.content.result,
                    pagination,
                });
            } else {
                message.error(data.errors);
            }
        });

    },
    handleChange(value) {
        this.setState({
            departCode: value.key,
            departName: value.label
        });
    },
    checkPrice(rule, value, callback) {
        if (value.number > 0 && value.number < 100) {
            callback();
            return;
        }
        callback('序号为大于0且小于100的正整数');
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
    handleTableChange(pagination, filters, sorter) {
        const pager = this.state.pagination;
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        console.log(pagination.current);
        this.fetch({
            currentPage: pagination.current,
        });
    },
    render() {
        var self = this;
        const columns = [{
            title: '公司',
            dataIndex: 'company',
            width: '20%',
            render: text => {
                if (text==1) {
                    return (
                        <span>蚂蚁金服</span>
                    )
                }
            },
        }, {
            title: '部门',
            width: '20%',
            dataIndex: 'departName',
        }, {
            title: '序号',
            width: '20%',
            dataIndex: 'priority',
            render : (a,b) => {
                return (
                    <span>{b.priority || "-"}</span>
                );
            },
        }, {
            title: '更新时间',
            width: '20%',
            dataIndex: 'gmtModify',
        }, {
            title: '操作',
            width: '20%',
            dataIndex: '',
            key: 'x',
            render: (record) => {
                return(
                    <span>
                        <a href="#" onClick={() => self.editModal(record)}>编辑</a>
                        &nbsp;&nbsp;
                        <Popconfirm title="确定要删除吗？" onConfirm={() =>self.delete(record)} onCancel={() =>self.cancelDelete(record)} okText="删除" cancelText="取消">
                            <a>删除</a>
                        </Popconfirm>
                    </span>
                )
            }
        }];
        const formItemLayout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div className="header">
                    <button className="btn" onClick={() => self.showAddModal()}>新增规则</button>
                </div>
                <div className="container">
                    <Table
                        columns={columns}
                        dataSource={this.state.data}
                        pagination={this.state.pagination}
                        rowKey={record => record.id}
                        onChange={this.handleTableChange}
                        loading={this.state.loading}
                    />
                </div>
                <Modal title="新增规则" visible={this.state.addVisible}
                  onOk={this.addOk} onCancel={this.addCancel} okText="提交规则" width="400px"
                >
                    <Form  inline>
                        <Row style={{ marginBottom: 24, marginTop: 15 }}>
                            <Col span={24}>
                                <FormItem
                                    label="部门"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('deport', {
                                        rules: [{ required: true, message: '请选择部门!' }],
                                    })(
                                        <Select
                                            style={{ width: 200 }}
                                            placeholder="请选择"
                                            onChange={this.handleChange}
                                            labelInValue={true}
                                        >
                                            {
                                                this.state.dataOptions.map((item, index) => {
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
                        <Row style={{ marginBottom: 20 }}>
                            <Col span={24}>
                                <FormItem
                                    label="序号"
                                    labelCol={{ span: 10 }}
                                    wrapperCol={{ span: 14 }}
                                >
                                    {getFieldDecorator('priority', {
                                    })(
                                        <InputNumber onChange={this.onTextChange} min={1} max={99} style={{ width: 200 }}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <Modal
                    title="编辑"
                    visible={this.state.editVisible}
                    onOk={this.editOk}
                    onCancel={this.editCancel}
                    width="400px"
                >
                    {
                        self.state.editVisible ?
                        <EditModal ref="modelform" record={this.state.record}/>
                        :null
                    }
                </Modal>
            </div>
        )
    }
});
App = Form.create()(App);
module.exports = App;