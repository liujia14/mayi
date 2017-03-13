/*
name: listleft
desc: 提名团队列表左侧组件
author: 俞雅菲
version：v1.0
*/
import React from 'react';
import ReactDOM from 'react-dom';
import './../commonCss/index.less';
import './index.less';
import { Button,message,Modal } from 'antd';

export default class Items extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleClick(code,link){
    $.ajax({
      url:'/platform/nominate/NominateAuthority.json',
      data:{prizeCode:code},
      type:'post',
      success:function(data){
        if(data.content){
          window.location.href = link;
        }else{
          Modal.warning({
            title: '啊哦~该奖项你不能提名哦，换个奖项试试吧：）',
            okText:"知道了",
            onOk() {},
          });
        }
      }
    });
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
    let datas = this.props.listLeft;

    let nominationlink = "/platform/pageconfig/frontNominationCreat.htm?prizeType="+datas.prizeType+"&prizeName="+datas.prizeName+"&prizeCode="+datas.prizeCode;

    let links;
    if(self.getUrl("prizeCode")){
      links = "javascript:;";
    }else{
      links = "/platform/pageconfig/awardsDetail.htm?prizeCode="+datas.prizeCode+"&prizeStatus="+datas.prizeStatus;
    }
    return (
      <div className="leftbox">
        <a href={links}><img className="nominateImg" src={datas.fileUrl} alt="pic"/></a>
        <div className="antCom Cl6">
          <div className="nominateName wd410"><a href={links}>{datas.prizeName}</a></div>
          <div className="nominateDec">{datas.content}</div>
          <div className="nominateDep">
            所属部门： <span>{datas.departmentName}</span>
        </div>
        <div className="nominateTime">
          有效期： <span>{datas.startDate} 至 {datas.endDate}</span>
      </div>
      {
        datas.prizeStatus == 'before' ? <Button type="disabled">暂未开始</Button>
      : datas.prizeStatus == 'end' ? <Button type="disabled">已结束</Button>
    : <a href="javascript:;"><Button type="primary" onClick={()=>{this.handleClick(datas.prizeCode,nominationlink)}}>我要提名</Button></a>
}

</div>
</div>
)
}
}
