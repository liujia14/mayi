/*
  name: view
  desc: 轮播图管理
  author: 曾安
  version：v1.0
*/
import "./view.less";
import React from "react";
import ReactDOM from "react-dom";
import { Form, Input, Button, message, Row, Col, Select, Table, Icon, Popconfirm, Modal, Breadcrumb, Carousel, Upload } from "antd";
import Banner from './../Banner/banner'; // banner组件
import imgSrc  from './../../../images/slider.png'; //banner图片
import reqwest from 'reqwest';
import Bread from "./../../common/breadNavi/view";
import "./../commonCss/table.less";

const FormItem = Form.Item;
//规则配置页面
let App =React.createClass({

	  getInitialState() {
        var self = this;
        return {
            merchantAttachUrls:'',
            addVisible: false,//新增弹框是否可见
            record: '',
            editVisible: false,//编辑弹框是否可见
            editURL: '',
            imgData:[], //轮播图数据源
            leftData: [],//未使用列表数据源
            rightData: [],//使用列表数据源
            leftUrl: '',
            fileCode: '',//图片上传code码
            leftList: [],//左侧列表选中
            rightList: [],//右侧列表选中
            fileUrl: '',//上传图片链接地址
            leftIds: '',//左侧轮播图拼接字符串
            rightIds: '',//右侧轮播图拼接字符串
            selectedRowKeys: [],
            rightSelectedRowKeys: [],
            editBannerUrl: '',//编辑弹框链接
            editBannerName: '',//编辑弹框图片名称
        };
    },
    //新增弹框
    showAddModal(){
        this.props.form.resetFields();
        this.setState({
            fileUrl: '',
            addVisible: true,
        });
    },
    //新增
    addOk(e){
        var self = this;
        console.log(this);
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if( (values.bannerUrl) && (!/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(values.bannerUrl)) ){
                  message.error("链接输入有误");
                  return;
                }
                $.ajax({
                      type : "post",
                      async : true,
                      url : '/background/banner/SaveBannerInfo.json',
                      data : {
                        bannerName: values.bannerName,
                        bannerUrl: values.bannerUrl,
                        fileCode: self.state.fileCode
                      },
                      success : function(data){
                        if (data.success == true) {
                          message.success('新增成功');
                          self.props.form.resetFields();
                          self.setState({
                              addVisible: false,
                              editURL: '',
                          });
                          self.leftFetch();
                        } else {
                          message.error(data.errors);
                        }
                      },
                      error: function (error) {
                          message.error('新增失败');
                      },
                });
            }
        });
    },
    //新增取消
    addCancel(){
        this.props.form.resetFields();
        this.setState({
            addVisible: false,
            editURL: '',
        });
    },
    //修改弹框
    editModal(record){
        var self = this;
        if (record.bannerUrl == "javascript:;") {
          self.setState({
            editBannerUrl: '',
          });
        } else {
          self.setState({
            editBannerUrl: record.bannerUrl,
          });
        }
        //弹框弹出，数据回显
        this.setState({
            editVisible: true,
            record: record,
            editURL: record.url,
            fileCode: record.fileCode,
            editBannerName: record.bannerName,
        });
    },
    //编辑提交
    editOk(e){
        var self = this;
        //表单校验
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if( (values.bannerUrl) && (!/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(values.bannerUrl)) ){
                  message.error("链接输入有误");
                  return;
                }
                $.ajax({
                      type : "post",
                      async : true,
                      url : '/background/banner/UpdateBannerInfo.json',
                      data : {
                        id: this.state.record.id,
                        bannerName: values.bannerName,
                        bannerUrl: values.bannerUrl,
                        fileCode: this.state.fileCode
                      },
                      success : function(data){
                          if (data.success===true){
                              message.success('修改成功');
                              self.setState({
                                  editVisible: false,
                                  record: '',
                                  editBannerUrl: '',
                                  editBannerName: '',
                                  editURL: '',
                              });
                              self.props.form.resetFields();
                              self.leftFetch();
                          } else {
                              message.error(data.errors);
                          }

                      },
                      error: function (error) {
                          message.error('修改失败');
                      },
                });
            }
        });
    },
    //取消编辑
    editCancel(){
        this.setState({
            editVisible: false,
            record: '',
            editBannerUrl: '',
            editBannerName: '',
            editURL: '',
        });
        this.props.form.resetFields();
    },
    //删除
    delete(record){
      	var self = this;
        $.ajax({
              type : "post",
              async : true,
              url : '/background/banner/DelBannerInfo.json',
              data : {
                id: record.id
              },
              success : function(data){
                  if (data.success===true){
                      message.success('删除成功');
                      self.leftFetch();
                  } else {
                      message.error(data.errors);
                  }

              },
              error: function (error) {
                  message.error('删除失败');
              },
        });
    },
    //取消删除
    cancelDelete(e) {
    },
    //图片上传
    handleUpload(info){
      if (info.file.status === 'done') {
        this.setState({
          fileUrl:info.file.response.content.url,
          fileCode:info.file.response.content.code,
          editURL:info.file.response.content.url
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
    //页面加载渲染数据
    componentDidMount(){
        //未使用的banner
        this.leftFetch();
        //使用的banner
        this.rightFetch();
    },
    //未使用的banner数据
    leftFetch(){
        var self = this;
        reqwest({
              url: '/background/banner/BannerUnUsedList.json',
              method: 'post',
              type: 'json',
          }).then(data => {
              if (data.success == true) {
                  self.setState({
                      leftData: data.content.result,
                  });
              } else if (data.success == false){
                  message.error(data.errors);
              }
          });
    },
    //使用中的banner数据
    rightFetch(){
        var self = this;
        reqwest({
              url: '/background/banner/BannerUsedList.json',
              method: 'post',
              type: 'json',
          }).then(data => {
              if (data.success == true) {
                  self.setState({
                      rightData: data.content.result,
                  });
              } else if (data.success == false){
                  message.error(data.errors);
              }
          });
    },
    //右移
    rightMove(){
        var self = this;
        if (this.state.leftList.length == 0) {
            message.warning('请选择要移动的列表');
        }else{
            reqwest({
                  url: '/background/banner/BannerOperate.json',
                  method: 'post',
                  data: {
                    type: 'RIGHT',
                    ids: this.state.leftIds
                  },
              }).then(data => {
                  if (data.success == true) {
                      self.leftFetch();
                      self.rightFetch();
                      setTimeout(() => {
                        self.setState({
                          leftIds: '',
                          rightIds: '',
                          rightList : [],
                          leftList: [],
                          rightSelectedRowKeys : [],
                          selectedRowKeys: [],
                        })
                      },100);
                  } else if (data.success == false){
                      message.error(data.errors);
                      self.setState({
                        leftIds: '',
                        rightIds: '',
                        rightList : [],
                        leftList: [],
                        rightSelectedRowKeys : [],
                        selectedRowKeys: [],
                      });
                  }
              });
        }
    },
    //左移
    leftMove(){
        var self = this;
        if (this.state.rightList.length == 0) {
            message.warning('请选择要移动的列表');
        }else{
            reqwest({
                url: '/background/banner/BannerOperate.json',
                method: 'post',
                data: {
                  type: 'LEFT',
                  ids: this.state.rightIds,
                },
            }).then(data => {
                if (data.success == true) {
                    self.leftFetch();
                    self.rightFetch();
                    setTimeout(() => {
                        self.setState({
                          leftIds: '',
                          rightIds: '',
                          rightList : [],
                          leftList: [],
                          rightSelectedRowKeys : [],
                          selectedRowKeys: [],
                        })
                      },100);
                } else if (data.success == false){
                    message.error(data.errors);
                    self.setState({
                      leftIds: '',
                      rightIds: '',
                      rightList : [],
                      leftList: [],
                      rightSelectedRowKeys : [],
                      selectedRowKeys: [],
                    });
                }
            });
        }
    },
    //上移
    upMove(row, index){
        var self = this;
        var selectItem = index;
        var upSelectItem = index-1;
        var selectItemData = this.state.rightData[selectItem].id;
        var upSelectItemData = this.state.rightData[upSelectItem].id;
        var itemString = selectItemData+','+upSelectItemData;
        reqwest({
              url: '/background/banner/BannerOperate.json',
              method: 'post',
              type: 'json',
              data: {
                type: 'UP',
                ids: itemString
              },
          }).then(data => {
              if (data.success == true) {
                  self.rightFetch();
              } else if (data.success == false){
                  message.error(data.errors);
              }
          });
    },
    //置顶
    topMove(record){
        var self = this;
        reqwest({
            url: '/background/banner/BannerOperate.json',
            method: 'post',
            type: 'json',
            data: {
              type: 'TOP',
              ids: record.id
            },
        }).then(data => {
            if (data.success == true) {
                self.rightFetch();
            } else if (data.success == false){
                message.error(data.errors);
            }
        });
    },
    render() {
    	var self = this;
      //未使用的banner表格
      const columns = [
        {
            title: 'banner名称',
            dataIndex: 'bannerName',
            width: '35%',
            render : (a,b) => {
              return (
                <span title={b.bannerName} className="diandian">{b.bannerName}</span>
              );
            }
        }, 
        {
            title: '点击链接',
            dataIndex: 'bannerUrl',
            width: '35%',
            render: (text, row, index) => {
              if (row.bannerUrl == "javascript:;") {
                return (
                  <span>-</span>
                );
              } else {
                return (
                    <span title={text} className="diandian">{text}</span>
                  );
              }
            },
        }, 
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            render: (record) => {
                return(
                    <span>
                        <a href="#" onClick={() => self.editModal(record)}>编辑</a>
                        <span className="ant-divider" />
                        <Popconfirm title="确定要删除吗？" onConfirm={() =>self.delete(record)} onCancel={() =>self.cancelDelete(record)} okText="删除" cancelText="取消">
                            <a>删除</a>
                        </Popconfirm>
                    </span>
                )
            }
        }
      ];
      //使用中的banner表格
      const columnsRight = [ 
        {
            title: '序号',
            dataIndex: 'id',
            width: '10%',
            render: (text, row, index) => {
                return(
                    <span>
                        {index+1}
                    </span>
                )
            }
        },
        {
            title: 'banner名称',
            dataIndex: 'bannerName',
            width: '30%',
            render : (a,b) => {
              return (
                <span title={b.bannerName} className="diandian">{b.bannerName}</span>
              );
            }
        }, 
        {
            title: '点击链接',
            dataIndex: 'bannerUrl',
            width: '30%',
            render: (text, row, index) => {
              if (row.bannerUrl == "javascript:;") {
                return (
                  <span>-</span>
                );
              } else {
                return (
                    <span title={text} className="diandian">{text}</span>
                  );
              }
            },
        }, 
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            render: (text, row, index) => {
              if (index==0) {
                  return (
                    <span></span>
                  )
              }else{

                  return(

                      <span>
                          <a href="#" onClick={() => self.upMove(row, index)}>上移</a>
                          <span className="ant-divider" />
                          <a onClick={() => self.topMove(row)}>置顶</a>
                      </span>
                  )
              }
            }
        }
      ];
      const formItemLayout = {
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
      };
      const { getFieldDecorator } = this.props.form;
      //轮播图片
      let IMAGE_DATA = this.state.rightData;
      // rowSelection object indicates the need for row selection
      //左边列表多选
      const { rightSelectedRowKeys, selectedRowKeys } = this.state;
      const rowSelection = {
          selectedRowKeys:selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows,record) => {
              // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
              this.setState({ 
                selectedRowKeys: selectedRowKeys,
              });
          },
          onSelect: (record, selected, selectedRows) => {
              if(selected){
                this.state.leftList.push(record.id);
              }else{
                // 取消勾选
                var pos;
                this.state.leftList.forEach((value, index, arr) => {
                  if(value === record.id){
                    pos = index;
                  }
                });
                this.state.leftList.splice(pos, 1);
              };
              var leftIds = this.state.leftList.join(",");
              //console.log(leftIds);
              this.setState({
                leftIds: leftIds
              });

          },
          onSelectAll: (selected, selectedRows, changeRows) => {
              //console.log(selected, selectedRows, changeRows);
              if (selected) {
                this.state.leftList = [];

                selectedRows.map((items, index)=>{
                  this.state.leftList.push(items.id);
                });
                var leftIds = this.state.leftList.join(",");
                this.setState({
                  leftIds: leftIds
                });
                //console.log(leftIds);
              }else{
                this.setState({
                  leftIds: '',
                  leftList: [],
                });
              }
          },
          getCheckboxProps: record => ({
              disabled: record.name === 'Disabled User',    // Column configuration not to be checked
          }),
      };
      const rightRowSelection = {
          selectedRowKeys:rightSelectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
              /*var rightList = `${selectedRowKeys}`;
              this.setState({
                  rightList: rightList,
                  rightSelectedRows: selectedRows,
              });*/
              this.setState({
                rightSelectedRowKeys: selectedRowKeys,
              });

              console.log(this.state.rightSelectedRowKeys)
          },
          onSelect: (record, selected, selectedRows) => {
              if(selected){
                this.state.rightList.push(record.id);
              }else{
                // 取消勾选
                var pos;
                this.state.rightList.forEach((value, index, arr) => {
                  if(value === record.id){
                    pos = index;
                  }
                });
                this.state.rightList.splice(pos, 1);
              };
              var rightIds = this.state.rightList.join(",");
              //console.log(rightIds);
              this.setState({
                rightIds: rightIds,
              });
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
              //console.log(selected, selectedRows, changeRows);
              if (selected) {
                this.state.rightList = [];

                selectedRows.map((items, index)=>{
                  this.state.rightList.push(items.id);
                });
                var rightIds = this.state.rightList.join(",");
                this.setState({
                  rightIds: rightIds
                });
                //console.log(rightIds);
              }else{
                this.setState({
                  rightIds: '',
                  rightList: [],
                });
              }
          },
          getCheckboxProps: record => ({
              disabled: record.name === 'Disabled User',    // Column configuration not to be checked
          }),
      };
      //rowSelection.selectedRowKeys = this.state.leftList;
      //rightRowSelection.selectedRowKeys = this.state.rightList;
      return (
          <div className="main" id="lunbo">
          	<div className="bread">
                  <Bread breadList={[{text : "banner管理",link : ""}]} />
              </div>
            <div className="container">
            	<div className="header">
            		<button className="btn" onClick={() => self.showAddModal()}>新增banner</button>
                      <div className="y-banner">
                        {
                          IMAGE_DATA.length > 0 ?
                            <Banner
                                items={IMAGE_DATA}
                                speed={1.2}
                                delay={2.1}
                                pause={true}
                                autoplay={true}
                                dots={true}
                                arrows={true}
                            />
                          :
                          <img src="../../../../static/images/banner.png" className="back-no-image"/>
                        }
                      </div>
                </div>
                <div className="content">
                    <Col span={24}>
                      <Col span={12}>
                          <span style={{ fontWeight: 'bold' }}>未使用的banner</span>
                          <Table
                              rowKey={record => record.id}
                              columns={columns}
                              dataSource={this.state.leftData}
                              pagination={false}
                              rowSelection={rowSelection}
                              className="table-fixed"
                              style={{ overflowY: 'auto', height: 400, marginBottom: 20, marginTop: 10 }}
                          />
                      </Col>
                      <Col span={2}>
                          <div className="btn-move">
                              <Row style={{ marginBottom: 20 }}><Button value="default" onClick={() => self.rightMove()}>&gt;</Button></Row>
                              <Row><Button value="default" onClick={() => self.leftMove()}>&lt;</Button></Row>
                          </div>
                      </Col>
                      <Col span={10}>
                          <span style={{ fontWeight: 'bold' }}>使用中的banner</span>
                          <Table
                              className="table-fixed"
                              rowKey={record => record.id}
                              columns={columnsRight}
                              dataSource={this.state.rightData}
                              pagination={false}
                              rowSelection={rightRowSelection}
                              style={{ overflowY: 'auto', height: 400, marginBottom: 20, marginTop: 10 }}
                          />
                      </Col>
                    </Col>

                </div>
                <Modal title="新增banner" visible={this.state.addVisible}
                  onOk={this.addOk} onCancel={this.addCancel} okText="提交banner" width="400px"
                >
                    <Form  inline ref="addForm">
                        <Row style={{ marginBottom: 24 }}>
                            <Col span={24}>
                                <FormItem
                                    label="banner名称"
                                    labelCol={{ span: 9 }}
                                      wrapperCol={{ span: 14 }}
                                >
                                    {getFieldDecorator('bannerName', {
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
                                      {getFieldDecorator('bannerUrl')(
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
                                          rules: [{ required: true, message: '请上传图片!' }],
                                      })(
                                          <Upload
                                              showUploadList={false}
                                              action="/platform/attachment/Upload.json"
                                              beforeUpload={this.beforeUpload}
                                              onChange={this.handleUpload}
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
                </Modal>
                <Modal
                    title="编辑"
                    visible={this.state.editVisible}
                    onOk={this.editOk}
                    onCancel={this.editCancel}
                    width="400px"
                >
                    <Form inline>
                      <Row style={{ marginBottom: 24 }}>
                          <Col span={24}>
                              <FormItem
                                  label="banner名称"
                                  labelCol={{ span: 9 }}
                                  wrapperCol={{ span: 14 }}
                              >
                                  {getFieldDecorator('bannerName', {
                                      initialValue: this.state.editBannerName,
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
                                      initialValue: this.state.editBannerUrl
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
                                      initialValue: this.state.editURL,
                                      rules: [{ required: true, message: '请上传图片!' }],
                                  })(
                                      <Upload   
                                          showUploadList={false}
                                          action="/platform/attachment/Upload.json"
                                          beforeUpload={this.beforeUpload}
                                          onChange={this.handleUpload}
                                      >
                                          {
                                            this.state.editURL ?
                                              <img src={this.state.editURL} role="presentation" className="avatar" /> :
                                              <Icon type="plus" className="avatar-uploader-trigger" style={{width:'96px',height:'96px'}}/>
                                          }
                                      </Upload>
                                  )}
                              </FormItem>
                          </Col>
                      </Row>
                  </Form>
                </Modal>
            </div>
          </div>
      )
    }
});
App = Form.create()(App);
module.exports = App;