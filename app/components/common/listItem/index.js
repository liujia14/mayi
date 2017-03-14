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

import QueueAnim from 'rc-queue-anim'; //淡入淡出动画
import { message } from 'antd';

export default class Items extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.doAgree = this.doAgree.bind(this);
    this.notAgree = this.notAgree.bind(this);
  }
  doAgree(code,e){
    let t = $(e.target);
    if(t.hasClass("icon-dianzan")){
      ajax({  //点赞接口 参数 nomineeCode  type->YES 是点赞 NO 是取消赞
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
      ajax({  //点赞接口 参数 nomineeCode  type->YES 是点赞 NO 是取消赞
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
  notAgree(code,e){
    let t = $(e.target);
    if(t.hasClass("icon-dianzan-copy")){
      ajax({  //点赞接口 参数 nomineeCode  type->YES 是点赞 NO 是取消赞
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
      ajax({  //点赞接口 参数 nomineeCode  type->YES 是点赞 NO 是取消赞
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

  getUrl( params = {} ){ //获取url上的参数
    function getUrlData(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return r[2];
      }
      return null;
    }
    return getUrlData(params);
  }

  render() {
    let self = this;
    let datas = this.props.listData;
    let listStatus;
    if(self.props.prizeStatus){
      listStatus = self.props.prizeStatus;
    }else{
      listStatus = self.getUrl("prizeStatus");
    }
    return (
      <div className="clearFix">
        <QueueAnim duration={300} interval={80} appear={false}>
          {
            datas.length > 0 ?
            datas.map((item,index)=>{
              return(
                <div className="itemBox" key={index} >
                  <a href={"/platform/pageconfig/messageBoard.htm?nomineeCode="+item.nomineeCode} className="itemImg">
                    <img src={item.url}  alt="picture"/>
                    {
                      item.winStatus == 1 ? <div className="winBox"></div> : null
                    }

                  </a>
                  <div className="itemCom">
                    <div className="itemTitle"><a href={"/platform/pageconfig/messageBoard.htm?nomineeCode="+item.nomineeCode}>{item.nomineeName}</a></div>
                    <div className="itemAgree" >
                      {
                        item.like === false ?
                        <div><i className="iconfont icon-dianzan" onClick={ (event)=>self.doAgree(item.nomineeCode,event) }></i><span className="agreeNum">{item.likeSum}</span></div>
                        :
                        <div><i className="iconfont icon-dianzan-copy" onClick={ (event)=>self.notAgree(item.nomineeCode,event) }></i><span className="agreeNum">{item.likeSum}</span></div>
                      }

                    </div>
                    <div className="itemComment"><i className="iconfont icon-pinglun"></i>{item.messageSum}</div>
                    {
                      item.winStatus == 1 ? <div className="itemAwards"><i className="iconfont icon-huangguan"></i> 获奖</div> : null
                    }

                  </div>
                </div>
              )
            })
            : listStatus == 'before' ? <div className="empty"><img src="../../../../static/images/notime.png" alt="图片"/> <div>提名暂未开始，小伙伴们先Hold住：）</div></div>
          : listStatus == 'nobody' ? <div className="empty"><img src="../../../../static/images/empty.png" alt="图片"/> <div>该部门没有同学/团队被提名此奖项，你来提一个？</div></div>
        : listStatus == 'end' ? <div className="empty"><img src="../../../../static/images/end.png" alt="图片"/> <div>很遗憾，奖项提名已截止</div></div>
      : listStatus == 'nobody_d' ? <div className="empty"><img src="../../../../static/images/noData.png" alt="图片"/> <div>该部门没有同学/团队被提名此奖项，你来提一个？</div></div>
    : <div className="empty"><img src="../../../../static/images/loading.gif" alt="图片"/> <div>正在加载中，请稍后...</div></div>
}
</QueueAnim>
</div>
)
}
}
