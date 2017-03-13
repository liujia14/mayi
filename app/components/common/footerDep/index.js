/*
name: footerDep
desc: 首页底部部门展示组件
author: 俞雅菲
version：v1.0
*/
import React from 'react';
import ReactDOM from 'react-dom';
import './../commonCss/index.less';
import './index.less';

import QueueAnim from 'rc-queue-anim'; //淡入淡出动画

export default class FooterDep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount(){

  }
  render() {
    let self = this;
    var departData = this.props.departData;
    return (
      <div className="footerD">
        {
          departData.length > 0 ?
          departData.map((item,index)=>{
            let reqStr;
            if(index == 0){
              reqStr = "蚂蚁金服部门奖项";
            }else{
              reqStr = "口碑部门奖项";
            }
            if(item.depts.length > 0){
              return(
                <div key={index} className="departItem">
                  <div className="departImg"></div>
                  <div className="departLists">
                    <QueueAnim type={['right', 'left']}>
                      {
                        item.depts.length > 0 ?
                        item.depts.map((list,index)=>{
                          let link = "/platform/pageconfig/allPrize.htm?departCode="+list.departCode+"&firstDepartName=" + reqStr +"&departName=" + list.departName;
                          return(
                            <a href={link} key={index}><div className="y-items">{list.departName}</div></a>
                          );
                        })
                        : null
                      }
                    </QueueAnim>
                  </div>
                </div>
              );
            }else{
              return null;
            }
          })
          : null
        }
      </div>
    );
  }
}
