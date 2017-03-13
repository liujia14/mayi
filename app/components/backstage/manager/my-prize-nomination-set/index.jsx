/*
  name: 奖项设置提名主逻辑页
  desc: 我的奖项列表页
  author: 刘佳
  date:2.10
  version：v1.0

*/
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ajax from './../../../common/ajax/ajax.js';
import './../../../common/commonCss/table.less';
import './index.less';
import {Row, Col , Popconfirm ,Form,DatePicker, Input, Select ,Button,Table,message,Modal } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Bread from "./../../../common/breadNavi/view";
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
        },true);
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
        },true);
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


//原获奖数据集合
var selectedRowKeys=[];
//已获取数据页数集合
var pages=[];
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
          selectedRowKeys: [],
          loading: false,
          handleDelete: false
        };
        this.onSelectChange = this.onSelectChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.fetch = this.fetch.bind(this);
    }
    //列表渲染 params = {} 传页数  refresh  是否重新渲染全部数据
    fetch(params = {},refresh) { //商品数据渲染
      var self = this;
      //重新渲染全部数据  
      if (refresh) {
        pages = [];
        selectedRowKeys = [];
        this.setState({
          selectedRowKeys: [],
        })
      };
      var currentPage = params.currentPage;
      self.setState({ loading: true });
      ajax({
        url : "/platform/nominate/QueryNominateByPrizeCode.json",
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
          console.log(data);
          if(data.success === true){
            const pagination = this.state.pagination;
            pagination.total = data.content.total;
            pagination.current = data.content.currentPage;
            pagination.pageSize = 10;
            pagination.showQuickJumper = true;
            var dataList = data.content.result;
            //当前选择的获奖 code
            var rowSelection=this.state.selectedRowKeys || [];
            //本身就获奖的code
            selectedRowKeys = selectedRowKeys;
            //如果当前页是新数据
            if (pages.indexOf(currentPage) < 0) {
              //把当前页数暂存在pages
              pages.push(currentPage);
              dataList.map((v) => { 
                  if (v.winStatus==1) {
                    (rowSelection.indexOf(v.nomineeCode)<0) && rowSelection.push(v.nomineeCode);
                    (selectedRowKeys.indexOf(v.nomineeCode)<0) && selectedRowKeys.push(v.nomineeCode);
                  }
                }
              );
            }
            this.setState({
              loading: false,
              data: dataList,
              selectedRowKeys: rowSelection,
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
    componentWillMount(){
      ajax({
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
      },true);
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
    onSelectChange(selectedRowKeys) {
      //
      this.setState({ selectedRowKeys });
    }
    handleDelete(){  // 设置奖项确定按钮
      var self = this;
        //var rowSelection = this.state.selectedRowKeys.toString();
        //循环初始获奖数据  和当前获奖数据对比  获取取消获奖的数据
        let nomineeCodeDis = [],nomineeCode = [];
        selectedRowKeys.map((v) => {
          //如果当前数据没有查到  说明取消获奖了
          (this.state.selectedRowKeys.indexOf(v) < 0) && nomineeCodeDis.push(v)
        });
        this.state.selectedRowKeys.map((v) => {
          //如果老没有查到  说明设置获奖了
          (selectedRowKeys.indexOf(v) < 0) && nomineeCode.push(v)
        });
        nomineeCodeDis = nomineeCodeDis.toString();
        nomineeCode = nomineeCode.toString();
        //var allCode = this.state.allCode.toString();
        confirm({   //确认
        title: '确定要设置获奖吗？',
        onOk() {
          // 发起ajax批量设置 传入新选择的nomineeCode  和取消的nomineeCodeDis
          self.setState({handleDelete:true});
          ajax({
            url:'/background/winner/SetWinner.json',
            data:{
              'nomineeCodeDis': nomineeCodeDis,
              'nomineeCode': nomineeCode,
              'prizeCode': prizeCode,
            },
            success:function(data){
              if(data.success === true){
              /*  //后台打标签  不能动
                ajax({
                  url:'/background/winner/AddTag.json',
                  data:{
                    'nomineeCodeDis': nomineeCodeDis,
                    'nomineeCode': nomineeCode,
                    'prizeCode': prizeCode,
                  }
                });*/
                message.success("设置获奖成功");
                self.fetch({
                  'currentPage' : 1
                },true);
              }else{
                message.error(data.errors);
              }
              self.setState({handleDelete:false});
            },
            error:function(){
              self.setState({handleDelete:false});
            }
          });
        },
        onCancel() {}
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
      const { loading, selectedRowKeys } = this.state;
      const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
      };
      return (
        <div>
          {
            prizeType == '3' ? 
          <Bread breadList={[{text : "我创建的奖项",link : "/platform/admin.htm"},{text : prizeName},{text : "设置获奖",link : "javascript:();"}]} /> : 
          <Bread breadList={[{text : "我管理的奖项",link : "/platform/admin.htm"},{text : prizeName},{text : "设置获奖",link : "javascript:();"}]} />
          }
          <div>
            <div className="pd20">
              <FormWrap fetch={self.fetch.bind(this)} state={this.state}/>
              <Form horizontal className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
                <Row gutter={16}>
                  <Col sm={6} xs={6}>
                    <Button disabled={this.state.handleDelete}  type="primary" onClick={() =>this.handleDelete(selectedRowKeys)}>确定</Button>
                    <a className="btn" href="javascript:history.go(-1)" style={{margin:"10px",}}>取消</a>
                  </Col>
                </Row>
              </Form>
              <div className="table-fixed">
                <Table
                  columns={columns}
                  rowKey={record => record.nomineeCode}
                  rowSelection={rowSelection}
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
