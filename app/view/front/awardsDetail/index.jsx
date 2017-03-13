/*
name: awardsDetail
desc: 奖项详情页
author: 俞雅菲
version：v1.0
*/
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.less';
import './style.less';
import HeadCom from './../../../components/common/header/index.js'; // 头部导航栏
import BreadNavi from './../../../components/common/breadNavi/view.js'; // 面包屑
import Footer from './../../../components/common/footer/index.js'; // 底部公用组件
import ListItem from './../../../components/common/listItem/index'; // ListItem组件列表单个
import ListLeft from './../../../components/common/listleft/index'; // List列表左侧组件

import { Select , message , Button } from 'antd';
const Option = Select.Option;
let departmentCode;

let flag = true;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage:1,
      listTop:{},
      loading:false,
      datas:{
        lists : [],
        isMore: false,
        listTotal:undefined,
        prizeStatus:'normal'
      },
      department:[],
    };
    this.fetchData = this.fetchData.bind(this);
    this.fetchItems = this.fetchItems.bind(this);
    this.doFilter = this.doFilter.bind(this);
  }
  componentDidMount() {
    let self = this;
    // $('body,html').animate({ scrollTop: 0 }, 100);
    let prizeCode = self.getUrl("prizeCode");
    $.ajax({ //获取奖项信息
      url:'/platform/prize/QueryPrizeInfoByCode.json',
      type:'POST',
      data:{
        'prizeCode':prizeCode,
      },
      success : (data) => {
        if(data.success){
          self.setState({
            listTop:data.content
          });
        }else{
          message.info(data.errors);
        }
      },
      error : (data) => {}
    });
    self.fetchData();
    $.ajax({ //获取部门
      url:'/background/department/QueryAllDepart.json',
      type:'POST',
      success : (data) => {
        if(data.success){
          self.setState({
            department:data.content
          });
        }else{
          message.info(data.errors);
        }
      },
      error : (data) => {}
    });
    // window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll(e) { //执行滚动事件
    let self = this;
    let isMore = self.state.datas.isMore;
    let current = self.state.currentPage;
    let total = self.state.datas.listTotal;
    self.setState({
      loading : true
    })
   if(total > 12){
     if(isMore){ //判断是否还有数据
       var add = current+1;
       self.fetchItems(add);
       setTimeout(() => {
         self.setState({ currentPage:add }); //请求一次 当前页数+1
       },500)
     }else{
       if(flag){
         message.info("没有更多了");
       }
       flag = false;
     }
   }
  }

  fetchItems(current){  //获取更多数据
    let self = this;
    let prizeCode = self.getUrl("prizeCode");
    let dataLists = self.state.datas.lists;
    $.ajax({ //获取更多提名团队信息 传值 currentPage
      url:'/platform/nominate/QueryNominateByPage.json',
      type:'POST',
      data:{
        'prizeCode':prizeCode,
        'currentPage':current,
        'limit':12,
        'departmentCode':departmentCode
      },
      success : (data) => {
        if(data.success){
          data.content.page.result.map((item,index)=>{
            dataLists.push(item);
          });
          self.setState({
            loading:false,
            datas:{
              lists : dataLists,
              isMore: data.content.page.last,
              listTotal: data.content.page.total,
              prizeStatus:data.content.prizeStatus

            }
          });
        }else{
          message.info("请求失败");
        }
      },
      error : (data) => {}
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

  fetchData(){
    let self = this;
    let prizeCode = self.getUrl("prizeCode");
    $.ajax({ //获取提名团队信息
      url:'/platform/nominate/QueryNominateByPage.json',
      type:'POST',
      data:{
        'prizeCode':prizeCode,
        'limit':12,
        'currentPage':1,
        'departmentCode':departmentCode
      },
      success : (data) => {
        if(data.success){
          self.setState({
            datas:{
              lists : data.content.page.result,
              isMore: data.content.page.last,
              listTotal: data.content.page.total,
              prizeStatus:data.content.prizeStatus
            }
          });
        }else{
          message.info("请求失败");
        }
      },
      error : (data) => {}
    });
  }

  doFilter(value){
    departmentCode = value;
    this.fetchData();
    this.setState({
      'currentPage':1
    })
  }
  render() {
    let self = this;
    let datas = this.state.datas;
    let listLeft = this.state.listTop;
    let isMore = self.state.datas.isMore;
    // 部门下拉框
    let department = this.state.department;
    let prizeStatus = self.state.datas.prizeStatus;
    return (
      <div>
        <HeadCom></HeadCom>
        <div className="y-container">
          <div className="ptb30">
            <BreadNavi breadList={[{text : "首页",link:'/platform/index.htm'},{text : listLeft.prizeName}]} />
          </div>
          <ListLeft listLeft={listLeft}></ListLeft>
          <div className="y-lists">
            <div className="y-por">
              <div className="y-h1">提名团队/个人</div>
              <div className="search-box">
                <label htmlFor="">部门筛选：</label>
                <Select onChange={self.doFilter} allowClear>
                  {
                    department.map((item,index)=>{
                      return (<Option key={item.departCode}>{item.departName}</Option>)
                    })
                  }
                </Select>
              </div>
            </div>
            {
              datas.prizeStatus == 'normal' ?
              <div>
                <ListItem listData={datas.lists} prizeStatus={prizeStatus}></ListItem>
              </div>
              : datas.prizeStatus == 'before' ?
              <div className="empty"><img src="../../../../static/images/notime.png" alt="图片"/> <div>提名暂未开始，小伙伴们先Hold住：）</div></div>
              :
              datas.prizeStatus == 'nobody' ?
              <div className="empty"><img src="../../../../static/images/empty.png" alt="图片"/> <div>来做第一个提名的人吧！</div></div>
              :
              datas.prizeStatus == 'end' ?
              <div>
                <ListItem listData={datas.lists} prizeStatus={prizeStatus}></ListItem>
              </div>
              : datas.prizeStatus == 'nobody_d' ?
              <div className="empty"><img src="../../../../static/images/noData.png" alt="图片"/> <div>该部门没有同学/团队被提名此奖项，你来提一个？</div></div>
              : <div className="empty"><img src="../../../../static/images/loading.gif" alt="图片"/> <div>正在加载中，请稍后。。。</div></div>
          }
        </div>
        {
          isMore ? <div className="addMore"> <Button  onClick={(ev)=>{self.handleScroll()}} loading={self.state.loading}>加载更多</Button></div> : null
        }
      </div>
      <div className="footer">
        <div className="y-container">
          <Footer></Footer>
        </div>
      </div>
    </div>
  );
}
}

const app = document.createElement('div');
document.body.appendChild(app);
ReactDOM.render(<Home />, app);
