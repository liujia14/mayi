/*
  name: messageBoard
  desc: 留言板
  author: 曾安
  version：v1.0
*/
import "./view.less";
import React from "react";
import ReactDOM from "react-dom";
import { Form, Icon, Input, Button, message, Breadcrumb, Col, Row, Pagination, Modal } from "antd";
import reqwest from 'reqwest';
import QueueAnim from 'rc-queue-anim'; //淡入淡出动画
const FormItem = Form.Item;

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
var nomineeCode=getUrlParam('nomineeCode');
console.log(nomineeCode);
//留言板
class App extends React.Component {
    constructor(props) {
        super(props);
        this.doAgree = this.doAgree.bind(this);
        this.messaging = this.messaging.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.notAgree = this.notAgree.bind(this);
        this.isShowEdit = this.isShowEdit.bind(this);
        this.state = {
            visible: false,
            listData: [],
            messageSum: '',
            prizeType: '',
            apTeamMembers: '',
            messageDatas: [],
            nomineeCode: '',
            total: 0,
            currentPage : 1,
            // 留言板 loading
            lybLoading : false,
            isShowEditBtn : false,
        };
    }
    componentDidMount(){
  		var self = this;
  		self.fetch();
  		self.messageFetch();
      //判断是否显示编辑
      self.isShowEdit();
  	}
    isShowEdit(){
      var self = this;
      $.ajax({
          type : "post",
          async : true,
          url : '/platform/nominate/NominateAuthorityForEdit.json',
          data: {
            nomineeCode: nomineeCode
          },
          success : function(data){
              console.log(data.content);
              if (data.success===true){
                  self.setState({
                    isShowEditBtn: data.content
                  });
              } else {

              }
          },
          error: function (error) {
              message.error(error);
          },
      });
    }
  	fetch(){
  		var self = this;
  		reqwest({
              url: '/platform/nominate/nominateList.json',
              method: 'post',
              data: {
                nomineeCode: nomineeCode
              },
              type: 'json',
              cache:'no-cache',
          }).then(data => {
              if (data.success == true) {
                  self.setState({
                      listData: data.content,
                      messageSum: data.content.messageSum,
                      nomineeCode: data.content.nomineeCode,
                  });
                  var arr = [];
                  data.content.apTeamMembers.map((item, index)=>{
                  	arr.push(item.name);
                  });
                  var str = arr.join("、");
                  self.setState({
                  	apTeamMembers: str
                  });

              } else if (data.success == false){
                  message.error(data.errors);
              }
          });
  	}
  	messageFetch(){
  		var self = this;
  		$.ajax({
          type : "post",
          async : true,
          url : '/platform/message/MessageBoardList.json',
          data: {
            nomineeCode: nomineeCode,
            page: 1
          },
          success : function(data){

              if (data.success===true){
                  self.setState({
                    messageDatas: data.content.result,
                    total: data.content.total
                  });
              } else {

              }
          },
          error: function (error) {
              message.error(error);
          },
      });
  	}
  	onChange(pageNumber) {
  	  	var self = this;
  	  	var url="/platform/message/MessageBoardList.json";
    		$.ajax({
  	        type : "post",
  	        async : true,
  	        url : url,
            data : {
              nomineeCode: nomineeCode,
              page: pageNumber
            },
  	        success : (data)=>{

                if (data.success===true){
                    self.setState({
                      messageDatas: data.content.result,
                      currentPage : pageNumber,
                    });
                } else {

                }
  	        },
  	        error: function (error) {
  	            message.error(error);
  	        },
  	    });
  	}
    //点赞
    doAgree(code,e){
        let t = $(e.target);
        if(t.hasClass("icon-dianzan")){
        $.ajax({  //点赞接口 参数 nomineeCode  type->YES 是点赞 NO 是取消赞
          url:'/platform/nominate/LikeOperate.json',
          type:"POST",
          async:false,
          data:{
            'nomineeCode':code,
            'type':'YES'
          },
          success:(data)=>{
            if(data.success){
              t.removeClass("icon-dianzan")
                .addClass("icon-dianzan-copy")
                .siblings(".agreeNum").text( parseInt(t.siblings(".agreeNum").text())+1 );
            }else{
              message.info(data.errors);
            }
          },
          error : (data) => {}
        });
      }else{
        $.ajax({  //点赞接口 参数 nomineeCode  type->YES 是点赞 NO 是取消赞
          url:'/platform/nominate/LikeOperate.json',
          type:"POST",
          async:false,
          data:{
            'nomineeCode':code,
            'type':'NO'
          },
          success:(data)=>{
            if(data.success){
             t.removeClass("icon-dianzan-copy")
              .addClass("icon-dianzan")
              .siblings(".agreeNum").text( parseInt(t.siblings(".agreeNum").text())-1 );
            }else{
              message.info(data.errors);
            }
          },
          error : (data) => {}
        });
      }
    }
    //取消赞
    notAgree(code,e){
      let t = $(e.target);
      if(t.hasClass("icon-dianzan-copy")){
        $.ajax({  //点赞接口 参数 nomineeCode  type->YES 是点赞 NO 是取消赞
          url:'/platform/nominate/LikeOperate.json',
          type:"POST",
          async:false,
          data:{
            'nomineeCode':code,
            'type':'NO'
          },
          success:(data)=>{
            if(data.success){
             t.removeClass("icon-dianzan-copy")
              .addClass("icon-dianzan")
              .siblings(".agreeNum").text( parseInt(t.siblings(".agreeNum").text())-1 );
            }else{
              message.info(data.errors);
            }
          },
          error : (data) => {}
        });
      }else{
        $.ajax({  //点赞接口 参数 nomineeCode  type->YES 是点赞 NO 是取消赞
          url:'/platform/nominate/LikeOperate.json',
          type:"POST",
          async:false,
          data:{
            'nomineeCode':code,
            'type':'YES'
          },
          success:(data)=>{
            if(data.success){
              t.removeClass("icon-dianzan")
                .addClass("icon-dianzan-copy")
                .siblings(".agreeNum").text( parseInt(t.siblings(".agreeNum").text())+1 );
            }else{
              message.info(data.errors);
            }
          },
          error : (data) => {}
        });
      }
    }
    messaging(){
      this.props.form.resetFields();
    	this.setState({
          	visible: true
        });
    }
    handleOk(e) {
        var self = this;
        var nomineeCode = this.state.nomineeCode;
        var timeStamp = new Date().getTime();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            self.setState({
              lybLoading : true,
            });
            console.log(values);
            reqwest({
                url: '/platform/message/SaveMessageBoard.json',
                method: 'post',
                data: {
                  content: values.content,
                  nomineeCode: nomineeCode,
                  timeStamp: timeStamp,
                },
                type: 'json',
                cache:'reload',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            }).then(data => {
                if (data.success == true) {
                    if(data.content.result){
                      message.success('新增成功');
                      self.setState({
                        visible: false,
                        currentPage : 1
                      });
                      self.fetch();
                      self.messageFetch();
                      self.setState({
                        lybLoading : false,
                      });
                    }else if(data.content.result === false){
                        message.error("新增失败");
                        self.setState({
                          lybLoading : false
                        });
                    }
                } else if (data.success == false){
                    message.error(data.errors);
                    this.setState({
                      lybLoading : false,
                    });
                }
            });
          }
        });
    }
    handleCancel(e) {
        this.setState({
          	visible: false,
        });
    }
    goEdit(){
        var nomineeCode = this.state.nomineeCode;
        window.location.href="/platform/pageconfig/frontNominationEdit.htm?nomineeCode="+nomineeCode;
    }
    render(){
        let datas = this.state.listData;
        let messageData = this.state.messageData;
        var self = this;
        const pagination = {
          	total: this.state.messageDatas.total,
          	showSizeChanger: true,
          	onShowSizeChange: (current, pageSize) => {
          	},
          	onChange: (current) => {
          	},
        };
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        };
        const { getFieldDecorator } = this.props.form;
        var hrefUrl = "/platform/pageconfig/awardsDetail.htm?prizeCode="+this.state.listData.prizeCode;
        return(
          	<div>
          		<div className="bread">
              		<Breadcrumb>
                        <Breadcrumb.Item><a href="/platform/index.htm">首页</a></Breadcrumb.Item>
                        <Breadcrumb.Item><a href={hrefUrl}>{this.state.listData.prizeName}</a></Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.listData.nomineeName}</Breadcrumb.Item>
                    </Breadcrumb>
          		</div>
              {
                this.state.listData.length == 0 ?
                <div className="header">
                  <div className="title">
                    <h1 className="title-left">无</h1>
                    {
                      this.state.isShowEditBtn === false ?
                      null
                      :
                      <Button type="primary" className="title-right edit-btn" onClick={this.goEdit.bind(this)}>编辑</Button>
                    }
                  </div>
                  <div className="title-desc">
                      <Row>
                        <Col span={8}>
                            <div>
                                <img src={this.state.listData.url} alt="picture" className="img-bg"/>
                            </div>
                        </Col>
                        <Col span={16}>
                          <div>
                                <h2 className="title-h2">个人姓名: 无</h2>
                                <div className="content-des">

                                  <div className="span-margin">
                                      所属部门: <span>无</span>
                                  </div>
                                  <div className="span-margin">
                                      提名奖项: <span>无</span>
                                  </div>
                                  <div className="span-margin">
                                      奖项类型: <span>无</span>
                                  </div>
                                  <div className="span-margin">
                                      提名理由: <span>无</span>
                                  </div>
                                  <div className="span-margin">
                                      团队名单: <span>无</span>
                                  </div>
                                  <div className="itemCom">
                                      <div className="itemAgree" >
                                          <i className="iconfont icon-dianzan"></i> <span className="agreeNum">0</span>
                                      </div>
                                      <div className="itemComment"><i className="iconfont icon-pinglun"></i> <span>0</span></div>
                                  </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                  </div>
                </div>
                :
            		<div className="header">
            			<div className="title">
            				<h1 className="title-left">{this.state.listData.nomineeName}</h1>
                    {
                      this.state.isShowEditBtn === false ?
                      null
                      :
                      <Button type="primary" className="title-right edit-btn" onClick={this.goEdit.bind(this)}>编辑</Button>
                    }
            			</div>
            			<div className="title-desc">
              				<Row>
                      	<Col span={8}>
                            {
                                this.state.listData.nomineeType == 1 ?
                                  this.state.listData.url == "" ?
                                  <div>
                                      <img src="./../../../images/personal-bg.jpg" alt="picture" className="img-bg"/>
                                  </div>
                                  :
                                  <div>
                                      <img src={this.state.listData.url} alt="picture" className="img-bg"/>
                                  </div>
                                :
                                  this.state.listData.url == "" ?
                                  <div>
                                      <img src="./../../../images/teem-bg.jpg" alt="picture" className="img-bg"/>
                                  </div>
                                  :
                                  <div>
                                      <img src={this.state.listData.url} alt="picture" className="img-bg"/>
                                  </div>
                            }
                      	</Col>
                      	<Col span={16}>
                      		<div>
                                {
                                  this.state.listData.nomineeType == 1 ?
                                  <h2 className="title-h2">个人姓名:{this.state.listData.nomineeName}</h2>
                                  :
                                  <h2 className="title-h2">团队名称:{this.state.listData.nomineeName}</h2>
                                }
                                <div className="content-des">

                                  {	this.state.listData.prizeType == 1 ?
                                    <div>
                                      <div className="span-margin bottom-margin">
                                        所属部门:<div className="item-inlb">{this.state.listData.departmentName}</div>
                                      </div>
                                      <div className="span-margin">
                                        提名奖项:<div className="item-inlb">{this.state.listData.prizeName}</div>
                                      </div>
                                      <div className="span-margin">
                                          奖项类型:<span className="right-margin">公司</span>
                                      </div>
                                    </div>
                                    :
                                    <div>
                                      <div className="span-margin">
                                          提名奖项:<div className="item-inlb">{this.state.listData.prizeName}</div>
                                      </div>
                                      <div className="span-margin">
                                          奖项类型:<span className="right-margin">部门</span>
                                      </div>
                                    </div>
                                  }
                                  <div className="span-margin">
                                      提名理由:
                                      {
                                        this.state.listData.nominatedReason == "" ?
                                        <div className="item-inlb-fit">{this.state.listData.nominatedReason}</div>
                                        :
                                        <div className="show-all">{this.state.listData.nominatedReason}</div>
                                      }
                                  </div>
                                  {
                                    this.state.listData.nomineeType == 1 ? 
                                    null
                                    :
                                    this.state.apTeamMembers == "" ? 
                                      <div className="span-margin span-bottom">
                                          团队名单:<div className="item-inlb">无</div>
                                      </div>
                                      :
                                      <div className="span-margin">
                                          团队名单:<div className="item-inlb">{this.state.apTeamMembers}</div>
                                      </div>
                                  }
                                  <QueueAnim duration={300}>
                                    {
                                      <div className="itemCom">
                                        <div className="itemAgree" >
                                            {
                                              this.state.listData.like == false ?
                                              <div>
                                                <i className="iconfont icon-dianzan" onClick={ (ev)=>self.doAgree(this.state.listData.nomineeCode,ev) }></i> <span className="agreeNum">{this.state.listData.likeSum}</span>
                                              </div>
                                              :
                                              <div>
                                                <i className="iconfont icon-dianzan-copy" onClick={ (ev)=>self.notAgree(this.state.listData.nomineeCode,ev) }></i> <span className="agreeNum">{this.state.listData.likeSum}</span>
                                              </div>
                                            }
                                        </div>
                                        <div className="itemComment"><i className="iconfont icon-pinglun"></i> <span>{this.state.messageSum}</span></div>
                                          {
                                            this.state.listData.winStatus == 1 ? <div className="itemAwards"><i className="iconfont icon-huangguan"></i> 获奖</div> : null
                                          }
                                      </div>
                                    }
                                  </QueueAnim>
                                </div>
                            </div>
                      	</Col>
                    </Row>
            			</div>
            		</div>

              }
          		<div className="content">
          			<div className="content-title">
                        <h2 className="title-left">留言板</h2>
                        {
                          this.state.listData.length == 0 ? 
                          <Button type="primary" className="title-right" disabled>我要留言</Button>
                          :
          				        <Button type="primary" className="title-right" onClick={()=>self.messaging()}>我要留言</Button>
                        }
          				<Modal title="留言板" visible={this.state.visible}
                          	onOk={this.handleOk} onCancel={this.handleCancel}
                            confirmLoading={this.state.lybLoading}
                        >
                    <Form horizontal>
                      <FormItem {...formItemLayout} label="留言">
                          {getFieldDecorator('content', {
                              rules: [{ required: true, message: '请输入要留言的内容!' }],
                          })(
                              <Input type="textarea" placeholder="请留言" rows="3" className="area-width" maxLength={300}/>
                          )}
                      </FormItem>
                    </Form>
                  </Modal>
          			</div>
          			{
                  this.state.messageDatas.length == 0 ?
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 20 }}>
                      <img src="../../../../static/images/noData.png" className="no-message"/>
                    </div>
                    <span style={{ fontSize: 18 }}>还木有留言，来抢个沙发！</span>
                  </div>
                  :
          				this.state.messageDatas.map((item, index)=>{
          					return (
                  			<div className="content-message">
                  				<div className="content-message-list">
                  					<div className="content-message-list-image">
                  						<img src={item.url} alt="" className="content-message-list-image-bg"/>
                      				</div>
                      				<div className="content-message-list-main">
                      					<div className="content-message-list-title">
                      						<span style={{ marginRight: 10 }} className="title-name">{item.name}</span>
                      						<span className="title-time">{item.gmtCreate.substr(0,16)}</span>
                      					</div>
                      					<div className="content-message-list-des">
                      						<p className="title-content">{item.messageContent}</p>
                      					</div>
                      					<div className="line">
                      					</div>
                      				</div>
                  				</div>
                  			</div>
          					)
          				})
          			}
          		</div>
              {
                this.state.total > 8 ?
                <div className="content-pagination">
                    <Pagination defaultPageSize={8} current={this.state.currentPage} total={this.state.total} onChange={this.onChange}/>
                </div>
                :
                null
              }
          	</div>
        )
  	}
}
export default  App = Form.create()(App);