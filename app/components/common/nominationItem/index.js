/*
name: listItem
desc: 提名团队列表组件
author: 俞雅菲
version：v1.0
*/
import React from 'react';
import ReactDOM from 'react-dom';
import './../commonCss/index.less';
import ajax from './../ajax/ajax.js';
import './index.less';

import { message,Modal } from 'antd';
import QueueAnim from 'rc-queue-anim'; //淡入淡出动画
const confirm = Modal.confirm;

export default class Items extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      nomineeCode:undefined
    };
    this.doAgree = this.doAgree.bind(this);
    this.notAgree = this.notAgree.bind(this);
    this.recall = this.recall.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }
  doAgree(code,e){  //点赞
    let t = $(e.target);
    if(t.hasClass("icon-dianzan")){
      ajax({  //点赞接口 参数 nomineeCode  type->YES 是点赞 NO 是取消赞
        url:'/platform/nominate/LikeOperate.json',
        type:"POST",
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
            message.error(data.errors);
          }
        },
        error : (data) => {}
      });
    }else{
      ajax({  //点赞接口 参数 nomineeCode  type->YES 是点赞 NO 是取消赞
        url:'/platform/nominate/LikeOperate.json',
        type:"POST",
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
            message.error(data.errors);
          }
        },
        error : (data) => {}
      });
    }
  }

  notAgree(code,e){ //取消点赞
    let t = $(e.target);
    if(t.hasClass("icon-dianzan-copy")){
      ajax({  //点赞接口 参数 nomineeCode  type->YES 是点赞 NO 是取消赞
        url:'/platform/nominate/LikeOperate.json',
        type:"POST",
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
            message.error(data.errors);
          }
        },
        error : (data) => {}
      });
    }else{
      ajax({  //点赞接口 参数 nomineeCode  type->YES 是点赞 NO 是取消赞
        url:'/platform/nominate/LikeOperate.json',
        type:"POST",
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
            message.error(data.errors);
          }
        },
        error : (data) => {}
      });
    }
  }

  recall(ev,code){ //删除事件
    let self = this;
    this.setState({
      visible:true,
      nomineeCode:code
    });

    confirm({   //确认
      title: '你确定要删除吗',
      onOk() {
        self.handleOk();
      },
      onCancel() {
        self.handleCancel();
      }
    });
  }

  handleOk(){
    let self = this;
    let codes = self.state.nomineeCode;
    ajax({
      url:'/platform/nominate/RemoveNominate.json',
      type:"POST",
      data:{
        'nomineeCode': codes
      },
      success:(data) => {
        if(data.success){
          message.success("删除成功!3秒后刷新页面");
          self.setState({
            visible:false
          });
          setTimeout(function(){window.location.reload();},2000);
        }else{
          message.error(data.errors)
        }
      },
      error : (data) => {}
    });
  }
  handleCancel(){
    this.setState({
      visible:false
    });
  }

  render() {
    let self = this;
    let datas = this.props.listData;
    let nomineeType = this.props.nomineeType;
    let strTip;
    if(nomineeType == "nomination"){
      strTip = "";
    }else{
      strTip = "被";
    }
    return (
      <div className="clearFix">
        <QueueAnim>
          {
            datas.length > 0 ?
            datas.map((item,index)=>{
              if(item.nomineeType == 1){ //个人
                return(
                  <div className="nominationBox" key={index}>
                    <div className="nomi-caption">{strTip}提名信息</div>
                    <div className="item-leftimg">
                      <a href={"/platform/pageconfig/messageBoard.htm?nomineeCode="+item.nomineeCode}><img src={item.url} alt=""/></a>
                    </div>
                    <div className="item-component">
                      <div className="item-title"><a href={"/platform/pageconfig/messageBoard.htm?nomineeCode="+item.nomineeCode}>个人姓名：{item.nomineeName}</a></div>
                      <div className="item-department-b"><span>所属部门：</span><div className="item-inlb">{item.departmentName}</div></div>
                      <div className="item-type"><span>奖项类型：</span>{item.prizeType == 1 ? <div className="item-inlb">公司</div> : <div className="item-inlb">部门</div>}</div>
                      <div className="item-prize"><span>{strTip}提名奖项：</span><a className="aColor item-inlb" href={"/platform/pageconfig/awardsDetail.htm?prizeCode=" + item.prizeCode}>{item.prizeName}</a></div>
                      <div className="item-reason"><span>{strTip}提名理由：</span><div className="item-inlb">{item.nominatedReason}</div></div>

                      <div className="item-agree" >
                        <i className="iconfont icon-dianzan" ></i> <span className="agreeNum">{ item.likeSum }</span>
                      </div>
                      <div className="item-comment"><i className="iconfont icon-pinglun"></i> {item.messageSum}</div>
                      {
                        item.winStatus == 1 ? <div className="itemAwards"><i className="iconfont icon-huangguan"></i> 获奖</div> : null
                      }
                      {
                        item.type == '0' & (item.prizeStatus == 'normal') ? <div className="item-btngroup"><a className="ant-btn ant-btn-primary" href={"/platform/pageconfig/frontNominationEdit.htm?nomineeCode="+item.nomineeCode}>修改</a><a className="ant-btn ant-btn-primary" onClick={ (ev)=>self.recall(ev,item.nomineeCode) }>删除</a></div>  : null
                      }
                    </div>
                    {
                      item.prizeStatus == 'normal' ? <div className="limite-state ongoing">进行中</div> :
                      item.prizeStatus == 'end' ? <div className="limite-state">已结束</div> :
                      item.prizeStatus == 'delete' ?  <div className="limite-state">已删除</div> :
                      item.prizeStatus == 'before' ?  <div className="limite-state">未开始</div>  : null

                    }

                  </div>
                )
              }
              else if(item.nomineeType == 2){
                return(
                  <div className="nominationBox" key={index}>
                    <div className="nomi-caption">{strTip}提名信息</div>
                    <div className="item-leftimg">
                      <a href={"/platform/pageconfig/messageBoard.htm?nomineeCode="+item.nomineeCode}><img src={item.url} alt=""/></a>
                    </div>
                    <div className="item-component">
                      <div className="item-title"><a href={"/platform/pageconfig/messageBoard.htm?nomineeCode="+item.nomineeCode}>团队名称：{item.nomineeName}</a></div>
                      <div className="item-department-b"><span>所属部门：</span><div className="item-inlb">{item.departmentName}</div></div>
                      <div className="item-type"><span>奖项类型：</span>{item.prizeType == 1 ? <div className="item-inlb">公司</div> : <div className="item-inlb">部门</div>}</div>
                      <div className="item-prize"><span>{strTip}提名奖项：</span><a className="aColor item-inlb" href={"/platform/pageconfig/awardsDetail.htm?prizeCode="+item.prizeCode}>{item.prizeName}</a></div>
                      <div className="item-reason"><span>{strTip}提名理由：</span><div className="item-inlb">{item.nominatedReason}</div></div>
                      <div className="item-member"><span>团队名单：</span><div className="item-inlb">{ item.apTeamMembersNameList ? item.apTeamMembersNameList : <span>无</span> }</div>
                    </div>
                    <div className="item-agree" >
                      <i className="iconfont icon-dianzan" ></i> <span className="agreeNum">{ item.likeSum }</span>
                    </div>
                    <div className="item-comment"><i className="iconfont icon-pinglun"></i> {item.messageSum}</div>
                    {
                      item.winStatus == 1 ? <div className="itemAwards"><i className="iconfont icon-huangguan"></i> 获奖</div> : null
                    }
                    {
                      item.type == '0' & (item.prizeStatus == 'normal') ? <div className="item-btngroup"><a className="ant-btn ant-btn-primary" href={"/platform/pageconfig/frontNominationEdit.htm?nomineeCode="+item.nomineeCode}>修改</a><a className="ant-btn ant-btn-primary" onClick={ (ev)=>self.recall(ev,item.nomineeCode) }>删除</a></div> : null
                    }

                  </div>
                  {
                    item.prizeStatus == 'normal' ? <div className="limite-state ongoing">进行中</div> :
                    item.prizeStatus == 'end' ? <div className="limite-state">已结束</div> :
                    item.prizeStatus == 'delete' ?  <div className="limite-state">已删除</div> :
                    item.prizeStatus == 'before' ?  <div className="limite-state">未开始</div>  : null

                  }

                </div>
              )
            }

          })
          :  nomineeType == "nomination" ? <div className="empty"><img src="../../../../static/images/noData.png" alt="无数据"/> <div>你还没有参与提名，赶快行动，表达你的支持！</div></div>
        : <div className="empty"><img src="../../../../static/images/noData.png" alt="无数据"/> <div>小伙伴们的提名还在路上，先自荐一个？</div></div>
    }
  </QueueAnim>
</div>
)
}
}
