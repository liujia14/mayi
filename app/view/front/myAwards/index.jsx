/*
name: myAwards
desc: 我的奖项
author: 俞雅菲
version：v1.0
*/
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.less';
import './style.less';
import HeadCom from './../../../components/common/header/index.js'; // 头部导航栏
import Footer from './../../../components/common/footer/index.js'; // 底部公用组件
import ListItem from './../../../components/common/nominationItem/index'; // 提名组件列表单个
import ajax from './../../../components/common/ajax/ajax'; 

import { Menu , Select , message ,Button } from 'antd';
const SubMenu = Menu.SubMenu;
const Option = Select.Option;

let flag = true;
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'nomination',
      isLast:true,
      nomineeType:0,
      loading:false,
      currentPage:1,
      total:undefined,
      datas:[]
    };
    this.handleClick = this.handleClick.bind(this); //提名导航点击事件
    this.fetchData = this.fetchData.bind(this);  //获取数据
    this.fetchItems = this.fetchItems.bind(this); //获取更多数据
  }
  handleClick(e){
    this.setState({
      current: e.key,
    });
    if(e.key == 'nomination'){
      this.fetchData('0');
      this.setState({
        nomineeType: 0,
      });
    }else if(e.key == 'nominated'){
      this.fetchData('1');
      this.setState({
        nomineeType: 1,
      });
    }
  }
  componentDidMount() {
    let type = this.getUrl("type");
    if(type == '0'){ //我的提名
    this.setState({
      current:'nomination',
      nomineeType:0
    });
    }else if(type == '1'){ //我被提名
    this.setState({
      current:'nominated',
      nomineeType:1
    });
  }
  this.fetchData('0');
  }
  handleScroll(e) { //执行滚动事件
    let self = this;
    self.setState({
      loading : true
    })
    let isLast = self.state.isLast;
    let current = self.state.currentPage;
    let total = self.state.total;
      if(total > 4){
        if(isLast){ //判断是否还有数据
          var add = current + 1;
          self.fetchItems(add);
          setTimeout(() => {
            self.setState({ currentPage:add }); //请求一次 当前页数+1
          },200)

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
    let type = self.state.nomineeType;
    let dataLists = self.state.datas;
    ajax({
      url:'/platform/nominate/MyNominate.json',
      type:'post',
      data:{
        'currentPage':current,
        'limit':4,
        'type':type
      },
      success : (data) => {
        if(data.success){
          data.content.result.map((item,index)=>{
            dataLists.push(item);
          });
          self.setState({
            loading:false,
            datas:dataLists,
            isLast:data.content.last,
            total:data.content.total
          });
        }else{
          message.info(data.errors);
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

  fetchData(type){
    let self = this;
    self.setState({
      currentPage:1
    });
    ajax({
      url:'/platform/nominate/MyNominate.json',
      type:'post',
      data:{
        'currentPage':1,
        'limit':4,
        'type':type
      },
      success : (data) => {
        if(data.success){
          self.setState({
            datas:data.content.result,
            isLast:data.content.last,
            total:data.content.total
          });
        }else{
          message.info(data.errors)
        }

      },
      error : (data) => {}
    });
  }

  render() {
    let self = this;
    let datas = self.state.datas ? self.state.datas : [];
    let listLeft = self.state.listTop;
    let isMore = self.state.isLast;
    return (
      <div>
        <HeadCom selectedItem="myawards"></HeadCom>
        <div className="y-container">
          <Menu
            onClick={self.handleClick}
            selectedKeys={[self.state.current]}
            mode="horizontal"
            className="pt15"
            >
            <Menu.Item key="nomination">
              <i className="iconfont icon-cansaizhe"></i>我的提名
            </Menu.Item>
            <Menu.Item key="nominated">
              <i className="iconfont icon-huojiangjingli17"></i>我被提名
            </Menu.Item>
          </Menu>
          <div className="nomination-list">
            <ListItem listData={datas} nomineeType={self.state.current}></ListItem>
              {
                isMore ? <div className="addMore"> <Button  onClick={(ev)=>{self.handleScroll()}} loading={self.state.loading}>加载更多</Button></div> : null
              }
          </div>
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
