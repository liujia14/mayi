/*
  name: my-prize
  desc: 我的奖项列表页
  author: 刘佳
  date:2.10
  version：v1.0

*/
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import './../../../common/ajax/ajax.js';
import './../../../common/commonCss/table.less';
import './index.less';
import {Row, Col , Popconfirm ,Form,DatePicker, Input, Select ,Button,Table,message,Modal } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Bread from "./../../../common/breadNavi/view";

//部门
import DepartTree from "./../../../common/undepartTree/view";
const confirm = Modal.confirm;

function getUrlParam(key){
    // 获取参数
    var url = window.location.search;
    // 正则筛选地址栏
    var reg = new RegExp("(^|&)"+ key +"=([^&]*)(&|$)");
    // 匹配目标参数
    var result = url.substr(1).match(reg);
    //返回参数值 decodeURIComponent()乱吗解析
    return result ? decodeURIComponent(result[2]) : null;
}
var juese,depart,name,state,prizeCode=getUrlParam('prizeCode'),prizeName=getUrlParam("prizeName"),prizeType="3";
// 表单搜索 搜索条件：商品ID 商品名称 商品状态
let FormWrap =React.createClass({
  handleSearch(e){ //搜索已填数据
    var self = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
        juese = values.juese;
        depart = values.depart;
        name =  values.name;
        state =  values.state;
        const pager = this.props.state.pagination;
        pager.current = 1;
        self.props.fetch({
          'currentPage':'1'
        });
      }
    });
  },
  reset(e){ //搜索参数清空
    this.props.form.resetFields();
    var self = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
        juese = values.juese;
        depart = values.depart;
        name =  values.name;
        state =  values.state;
        const pager = this.props.state.pagination;
        pager.current = 1;
        self.props.fetch({
          'currentPage':'1'
        });
      }
    });
  },
  getValueFromEvent(v){
    console.log(v)
  },
  render(){
    var self = this;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol:{ span: 6 },
      wrapperCol:{ span: 18 },
    };
    return(
      <Form horizontal onSubmit={this.handleSearch}>
        <Row gutter={6} className="tl">
          <Col sm={7}>
            <FormItem
              label="角色"
              {...formItemLayout}
            >
            {getFieldDecorator('juese')(
                <Select placeholder="请选择">
                 <Option value="1">个人</Option>
                 <Option value="2">团队</Option>
                </Select>
            )}
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem
              label="所属部门"
              {...formItemLayout}
            >
              {getFieldDecorator('depart',{
              })(
                <DepartTree  placeholder="请选择" />
              )}
            </FormItem>
          </Col>
          <Col sm={9}>
            <FormItem
              label="团队/个人名称"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
            {getFieldDecorator('name')(
              <Input placeholder="请输入关键字" />
            )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={6} className="tl">
          <Col sm={7}>
            <FormItem
              label="是否获奖"
              {...formItemLayout}
            >
              {getFieldDecorator('state')(
                <Select placeholder="请选择">
                 <Option value="1">获奖</Option>
                 <Option value="0">未获奖</Option>
                </Select>
              )}
            </FormItem>
          </Col>

          <Col sm={6} style={{marginLeft:"100px",}}>
            <FormItem >
              <Button className="mr10" type="primary" htmlType="submit">查询</Button>
              <Button  type="default" onClick={this.reset}>重置</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
});
FormWrap = Form.create()(FormWrap);

// 表格组件
export default class TableCom extends React.Component {
    constructor(props) {
        super(props);
        this.state={
          data:[{
            nomineeCode:"",
            nomineeType:"",
            nomineeName:"",
            prizeCode:"",
            creatorCode:"",
            departmentCode:"",
            nominatedReason:"",
            fileCode:"",
            winStatus:"",
            likeSum: 0,
            messageSum:"",
            isDeleted:"",
            gmtCreate:"",
            gmtModify:"",
            gmtCreator:"",
            gmtModifier:"",
            prizeName:"",
            departmentName:"",
            apTeamMembers:[],
            apTeamMembersNameList:'',
            url:"",
          }],
          pagination: {},
          loading: false,
        };
        this.fetch = this.fetch.bind(this);
    }
    fetch(params = {}) { //商品数据渲染
      var self = this;
      var currentPage = params.currentPage;
      // 发起ajax请求数据
      self.setState({ loading: true });
      $.ajax({
        url : "/platform/nominate/QueryNominateByPrizeCode.json",
        type : "post",
        data:{
          'prizeCode': prizeCode,
          'limit': 10,
          'nomineeType':juese||'',
          'departmentCode':depart||'',
          'nomineeName':name||'',
          'winStatus':state||'',
          ...params,
        },
        success : (data) => {
          console.log(data)
          if(data.success === true){
            const pagination = this.state.pagination;
            pagination.total = data.content.total;
            pagination.current = data.content.currentPage;
            pagination.pageSize = 10;
            pagination.showQuickJumper = true;
            var dataList = data.content.result;
            this.setState({
              loading: false,
              data: dataList,
              pagination,
            });
          }else{
            const pagination = this.state.pagination;
            pagination.total = 0;
            pagination.pageSize = 10;
            message.error(data.errors);
            this.setState({
              loading: false,
              data: [],
              pagination
            });
          }
        },
        error : function(data){
          message.error("数据请求失败，请稍后重试");
        }
      });
    }
    refresh(currentPage){ //刷新商品数据
      this.fetch({
        'currentPage' : currentPage||1
      });
    }
    componentWillMount(){
      $.ajax({
        url: '/background/department/checkAdmin.json',
        async: false,
        success: (data) => {prizeType = !data.content ? '3' :data.content.isAdmin ? '1' : '3'}
      })
    }
    componentDidMount() {
      var self = this;
      // 调用ajax数据渲染
      self.fetch({
        'currentPage' : 1
      });
    }
    handleTableChange(pagination, filters, sorter) {
      var self = this;
      const pager = this.state.pagination;
      pager.current = pagination.current;
      this.setState({
        pagination: pager,
      });
      this.fetch({
        currentPage: pagination.current
      });
    }
    render() {
      var self = this;
      // 表格列的配置描述
      const columns = [{
          title: '角色',
          dataIndex: 'nomineeType',
          width: '5%',
          render:(nomineeType)=>{
            if(nomineeType == '1'){
              return(
                <span>个人</span>
              )
            }else if(nomineeType == '2'){
              return(
                <span>团队</span>
              )
            }
          }
        }, {
          title: '团队/个人名称',
          dataIndex: 'nomineeName',
          width: '10%',
          render:(nomineeName)=>{
            return(
              <span  title={nomineeName}>{nomineeName}</span>
            )
          }
        }, {
          title: '提名奖项',
          dataIndex: 'prizeName',
          width: '10%',
          render:(prizeName)=>{
            return(
              <span  title={prizeName}>{prizeName}</span>
            )
          }
        }, {
          title: '所属部门',
          dataIndex: 'departmentName',
          width: '13%',
          render:(departmentName)=>{
            return(
              <span  title={departmentName}>{departmentName}</span>
            )
          }
        },
         {
          title: '提名理由',
          dataIndex: 'nominatedReason',
          width: '20%',
          render:(nominatedReason)=>{
            return(
              <span  title={nominatedReason}>{nominatedReason}</span>
            )
          }
        },
         {
          title: '团队成员',
          dataIndex: 'apTeamMembersNameList',
          width: '20%',
          render:(apTeamMembersNameList)=>{
            return(
              <span  title={apTeamMembersNameList}>{apTeamMembersNameList}</span>
            )
          }
        },
         {
          title: '团队/个人形象',
          dataIndex: 'url',
          width: '100px',
          render:(url)=>{
            return(
              <img className="small-image" src={url} />
            )
          }
        }, {
          title: '点赞数',
          width: '7%',
          dataIndex:'likeSum'
        },{
          title: '是否获奖',
          dataIndex: 'winStatus',
          width: '8%',
          render:(winStatus)=>{
            if(winStatus == '1'){
              return(
                <span>获奖</span>
              )
            }else if(winStatus == '0'){
              return(
                <span>未获奖</span>
              )
            }
          }
        }];
      const { loading } = this.state;
      return (
        <div>
          {
            prizeType == '3' ? 
          <Bread breadList={[{text : "我创建的奖项",link : "/platform/admin.htm"},{text : prizeName},{text : "查看提名",link : "javascript:();"}]} /> : 
          <Bread breadList={[{text : "我管理的奖项",link : "/platform/admin.htm"},{text : prizeName},{text : "查看提名",link : "javascript:();"}]} />
          }
          <div>
            <div className="pd20">
              <FormWrap fetch={self.fetch.bind(this)} state={this.state}/>
              <div className="table-fixed">
                <Table
                  columns={columns}
                  rowKey={record => record.nomineeCode}
                  dataSource={self.state.data}
                  pagination={self.state.pagination}
                  loading={this.state.loading}
                  onChange={this.handleTableChange.bind(this)}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
}
