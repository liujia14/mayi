/*
  name: my-prize
  desc: 我的奖项列表页
  author: 刘佳
  date:2.8
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
//时间格式化moment
import moment from 'moment';
import Bread from "./../../../common/breadNavi/view";
import DepartTree from "./../../../common/undepartTree/view";
import GetYears from "./../../../common/getYears/view";
const confirm = Modal.confirm;
//获取当前时间
var nowTime = new Date();
var nowYear = nowTime.getFullYear();

var allData=[],dataOptions;
  //获取部门下拉参数
  (function getDepartments(){
    var self = this;
    ajax({
      type : "post",
      async : true,
      url : '/background/department/GetDepartments.json',
      success : function(data){
        dataOptions= data.content;
      }
    });
  })();
  //获取最大年份
  (function getMaxYear(){
    ajax({
      type : "post",
      async : true,
      url : '/background/prize/GetMaxYear.json',
      success : function(data){
        let maxYear = parseInt(data.content) || nowYear;
        for (let i =  maxYear; i >= 2015; i--) {
          allData.push(maxYear);
          maxYear--;
        }
      }
    });
  })();

var prizeName,depart,startDate,endDate,year,status;
// 表单搜索 搜索条件：
let FormWrap =React.createClass({
  handleSearch(e){ //搜索已填数据
    var self = this;
    e.preventDefault();
    this.props.form.validateFields( (err,values) => {
        prizeName = values.prizeName;
        depart = values.depart;
        startDate =  values.startDate? moment(values.startDate).format('YYYY-MM-DD HH:mm:ss') : null;
        endDate =  values.endDate ? moment(values.endDate).format('YYYY-MM-DD HH:mm:ss') : null;
        year =  values.year;
        status =  values.status;
        const pager = this.props.state.pagination;
        pager.current = 1;
        self.props.fetch({
          'currentPage': 1
        });
    });
  },
  reset(e){ //搜索参数清空
    this.props.form.resetFields();
    var self = this;
    e.preventDefault();
    this.props.form.validateFields( (err,values) => {
        prizeName = values.prizeName;
        depart = values.depart;
        startDate =  values.startDate;
        endDate =  values.endDate;
        year =  values.year;
        status =  values.status;
        const pager = this.props.state.pagination;
        pager.current = 1;
        self.props.fetch({
          'currentPage': 1
        });
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
          <Col sm={6}>
            <FormItem
              label="奖项名称 "
              {...formItemLayout}
            >
            {getFieldDecorator('prizeName')(
              <Input placeholder="请输入关键字" />
            )}
            </FormItem>
          </Col>
          <Col sm={7}>
            <FormItem
                label="所属部门"
                {...formItemLayout}
            >
                {getFieldDecorator('depart', {
                    
                })(
                  <DepartTree/>
                    /*<Select 
                        placeholder="请选择"
                    >
                        {
                            !dataOptions ? [] : dataOptions.map((item) => {
                                return (
                                    <Option 
                                        key={item.buName}
                                        value={item.buNo}
                                    >
                                        {item.buName}
                                    </Option>
                                )
                            }) 
                        }
                    </Select>*/
                )} 
            </FormItem>
          </Col>
          <Col sm={5}>
            <FormItem
              label="有效期"
              labelCol={{span:6}}
            >
            {getFieldDecorator('startDate')(

              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="开始时间"
                showTime
              />
            )}
            <span> - </span>
            </FormItem>
          </Col>

          <Col sm={4}>
            <FormItem>
            {getFieldDecorator('endDate')(

              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="结束时间"
                showTime
              />
            )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={6} className="tl">
          <Col sm={6}>
            <FormItem
              label="状态 "
              {...formItemLayout}
            >
              {getFieldDecorator('status')(
                <Select placeholder="请选择">
                 <Option value="1">未开始</Option>
                 <Option value="2">进行中</Option>
                 <Option value="3">已结束</Option>
                 <Option value="4">已删除</Option>
                 <Option value="5">审批中</Option>
                 <Option value="6">已驳回</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={7}>
            <FormItem
              label="奖项年度"
              {...formItemLayout}
            >
              {getFieldDecorator('year')(
                <GetYears/>
                /*<Select 
                  placeholder="请选择" 
                  dropdownClassName="year-select-box"
                >
                  {
                    allData.map( year => {
                      let v=year.toString();
                      return(
                        <Option key={v} value={v}>{v}</Option>
                      )
                    })
                  }
                </Select>*/
              )}
            </FormItem>
          </Col>
          <Col sm={6} style={{marginLeft:"57px",}}>
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
          modalData:{
            prizeCode:"",
            prizeName:"",
            year:"",
            priority:"",
            departmentName:"",
            startDate:"",
            endDate:"",
            content:"",
            fileCode:"",
            status:"",
          },
          data:[{
            prizeCode:"",
            prizeName:"",
            year:"",
            priority:"",
            departmentName:"",
            startDate:"",
            endDate:"",
            content:"",
            fileCode:"",
            status:"",
          }],
          pagination: {},
          loading: false,
          searchValue:''
        };
        this.fetch = this.fetch.bind(this);
    }
    fetch(params = {}) { //商品数据渲染
      var self = this;
      var start = params.start;
      // 发起ajax请求数据
      self.setState({ loading: true });
      $.ajax({
        url : "/background/prize/QueryPrizeByPage.json",
        type : "POST",
        data:{
          'limit': 10,
          'prizeName':prizeName,
          'year':year,
          'departmentCode':depart,
          'startDate':startDate,
          'endDate':endDate,
          'status':status,
          'prizeType': 1,
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
    componentWillMount() {
      var self = this;
      // 调用ajax数据渲染
      self.fetch({
        'currentPage' : 1
      });
    }
    delet(id,status){ //删除奖项
      var self = this;
      confirm({   //确认删除
        title: '你确定要删除吗？',
        onOk() {
          $.ajax({
            url:'/background/prize/DeletePrizeInfo.json',
            type:'POST',
            data:{
              'prizeType':1,
              'prizeCode':id
            },
            success:function(data){
              if(data.content === true){
                console.log(data)
                message.success("删除成功");
                self.refresh(self.state.pagination.current);
              }else{
                message.error(data.errors);
              }
            },
            error:function(){
                message.error('删除失败，请稍后再试');
            }
          });
        },
        onCancel() {}
      });
      
    }
    linkToModal(record){
      console.log(record);
      this.setState({
        visible:true,
        modalData:record
      })

    }
    linkToEdit(code,categoryCode){ //修改奖项
      window.location.href="/platform/pageconfig/handleEdit.htm?prizeCode="+code;
    }
    linkToSet(code,categoryCode){ //设置奖项
      window.location.href="/platform/pageconfig/prizeNominationSet.htm?prizeCode="+code;
    }
    linkToDetail(code,categoryCode){ //查看提名
      window.location.href="/platform/pageconfig/prizeNominationDetail.htm?prizeCode="+code;
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
    visibleFalse(){
      this.setState({
        visible:false
      })
    }
    render() {
      var self = this;
      // 表格列的配置描述
      const columns = [{
          title: '奖项名称',
          dataIndex: 'prizeName',
          width: '10%',
          render:(commodityTitle,record)=>{
            var code = record.prizeCode.toString();
            var linkUrl = "/platform/pageconfig/prizeNominationDetail.htm?prizeCode="+code;
            return(
              <a title={record.prizeName} onClick={() =>self.linkToModal(record)}>{record.prizeName}</a>
            )
          }
        }, {
          title: '奖项年度',
          dataIndex: 'year',
          width: '7%',
        }, {
          title: '序号',
          dataIndex: 'priority',
          width: '5%',
          render:(priority)=>{
            if(priority){
              return(
                <span>{priority}</span>
              )
            }else{
              return(<span> - </span>)
            }
          }
        }, {
          title: '所属部门',
          dataIndex: 'departmentName',
          width: '8%',
          render: departmentName => {
            return(
              <span title={departmentName} >{departmentName}</span>
            )
          }
        },
         {
          title: '有效期',
          width: '20%',
          render: record =>{
            /*let startDate = moment(record.startDate).format('YYYY-MM-DD HH:mm:ss'),
                endDate = moment(record.endDate).format('YYYY-MM-DD HH:mm:ss');*/
            return(
              <span  title={record.startDate+'至'+record.endDate}>{record.startDate+'至'+record.endDate}</span>
            )
          }
        },
         {
          title: '奖项内涵',
          dataIndex: 'content',
          width: '20%',
          render:(content)=>{
            return(
              <span  title={content}>{content}</span>
            )
          }
        }, 
         {
          title: '奖项形象',
          dataIndex: 'fileCode',
          width: '80px',
          render:(fileCode)=>{
            return(
              <img className="small-image" src={fileCode} />
            )
          }
        },{
          title: '状态',
          dataIndex: 'status',
          width: '7%',
          render:(status)=>{
            if(status == '1'){
              return(
                <span>未开始</span>
              )
            }else if(status == '2'){
              return(
                <span>进行中</span>
              )
            }else if(status == '3'){
              return(
                <span>已结束</span>
              )
            }else if(status == '4'){
              return(
                <span>已删除</span>
              )
            }else if(status == '5'){
              return(
                <span>审批中</span>
              )
            }else if(status == '6'){
              return(
                <span>已驳回</span>
              )
            }
          }
        }, {
          title: '操作',
          width: '25%',
          render: record => {
              let code = record.prizeCode;
              let status = record.status;
              let categoryCode = record.prizeCode;
              if(status === '1' || status === '6'){
                return(
                <span>
                  <a className="play-btn"  onClick={() =>self.linkToModal(record)}>详情</a>
                  <a className="play-btn"  onClick={() =>self.linkToEdit(code,categoryCode)}>修改</a>
                  <a className="play-btn ant-dropdown-link"  onClick={() =>self.delet(code,'2')} >删除</a>
                  
                </span>)
              }else if(status === '5' ){
                return(
                <span>
                  <a className="play-btn"  onClick={() =>self.linkToModal(record)}>详情</a>
                </span>)
              }else if(status === '2' ){
                return(
                <span>
                  <a className="play-btn"  onClick={() =>self.linkToModal(record)}>详情</a>
                  <a className="play-btn"  onClick={() =>self.linkToDetail(code,categoryCode)}>查看提名</a>
                  <a className="play-btn"  onClick={() =>self.linkToEdit(code,categoryCode)}>修改</a>
                  <a className="play-btn ant-dropdown-link"  onClick={() =>self.delet(code,'2')} >删除</a>
                </span>)
              }else if(status === '3' ){
                return(
                <span>
                  <a className="play-btn"  onClick={() =>self.linkToModal(record)}>详情</a>
                  <a className="play-btn"  onClick={() =>self.linkToSet(code,categoryCode)}>设置奖项</a>
                  <a className="play-btn"  onClick={() =>self.linkToDetail(code,categoryCode)}>查看提名</a>
                  <a className="play-btn"  onClick={() =>self.linkToEdit(code,categoryCode)}>修改</a>
                  <a className="play-btn ant-dropdown-link"  onClick={() =>self.delet(code,'2')} >删除</a>
                </span>)
              }else if(status === '4'){
                return(
                <span>
                  <a className="play-btn"  onClick={() =>self.linkToModal(record)}>详情</a>
                  <a className="play-btn"  onClick={() =>self.linkToDetail(code,categoryCode)}>查看提名</a>
                </span>)
              }

          }
        }];
      const { loading } = this.state;
      return (
        <div>
          <Bread breadList={[{text : "我管理的奖项",link : ""}]} />
          <div>
            <div className="nav-box">
              <div className="nav-box-list company">公司级</div>
              <div className="nav-box-list department"><a href="/platform/pageconfig/systemPrizeDepartment.htm">部门级</a></div>
            </div>
            <div className="pd20">
              <FormWrap fetch={self.fetch.bind(this)} state={this.state}/>
              <a className="btn" href="/platform/pageconfig/handleAdd.htm" style={{margin:"10px 0",}}>新建奖项</a>
              <div className="table-fixed">
                <Table
                  columns={columns}
                  rowKey={record => record.prizeCode}
                  dataSource={self.state.data}
                  pagination={self.state.pagination}
                  loading={this.state.loading}
                  onChange={this.handleTableChange.bind(this)}
                />
              </div>
            </div>
          </div>
          <Modal title="详情" visible={this.state.visible}
            onOk={this.visibleFalse.bind(this)} onCancel={this.visibleFalse.bind(this)}
            footer = "" 
          > 
            <div className="panel-row">
              <label className="row-left">奖项名称：</label>
              <div className="row-right">{this.state.modalData.prizeName ? this.state.modalData.prizeName : '无'}</div>
            </div>
            <div className="panel-row">
              <label className="row-left">类型：</label>
              <div className="row-right">公司</div>
            </div>
            <div className="panel-row">
              <label className="row-left">奖项年度：</label>
              <div className="row-right">{this.state.modalData.year ? this.state.modalData.year : '无'}</div>
            </div>
            <div className="panel-row">
              <label className="row-left">序号：</label>
              <div className="row-right">{this.state.modalData.priority ? this.state.modalData.priority : '无'}</div>
            </div>
            <div className="panel-row">
              <label className="row-left">所属部门：</label>
              <div className="row-right">{this.state.modalData.departmentName ? this.state.modalData.departmentName : '无'}</div>
            </div>
            <div className="panel-row">
              <label className="row-left">有效期：</label>
              <div className="row-right">{this.state.modalData.startDate && this.state.modalData.endDate ? <span>{this.state.modalData.startDate}至{this.state.modalData.endDate}</span> : '无'}</div>
            </div>
            <div className="panel-row">
              <label className="row-left">奖项内涵：</label>
              <div className="row-right">{this.state.modalData.content ? this.state.modalData.content : '无'}</div>
            </div>
            <div className="panel-row">
              <label className="row-left">奖项形象：</label>
              <div className="row-right">{this.state.modalData.fileCode ? <img src={this.state.modalData.fileCode}/>  : '无'}</div>
            </div>
            <div className="panel-row">
              <label className="row-left">状态：</label>
              <div className="row-right">{
                this.state.modalData.status==1 ? <span>未开始</span> : 
                this.state.modalData.status==2 ? <span>进行中</span> : 
                this.state.modalData.status==3 ? <span>已结束</span> : 
                this.state.modalData.status==4 ? <span>已删除</span> : 
                this.state.modalData.status==5 ? <span>审批中</span> : 
                this.state.modalData.status==6 ? <span>已驳回</span> :
                '无'
              }
              </div>
            </div>
            <div className="panel-row">
              <label className="row-left">创建时间：</label>
              <div className="row-right">{this.state.modalData.gmtCreate ? this.state.modalData.gmtCreate : '无'}</div>
            </div>
          </Modal>
        </div>
      );
    }
}
