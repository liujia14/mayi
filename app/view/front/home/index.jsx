/*
name: home
desc: 首页
author: 俞雅菲
version：v1.0
*/
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.less';
import 'slick-carousel/slick/slick.less';
import './style.less';
import HeadCom from './../../../components/common/header/index.js'; // 头部导航栏
import Footer from './../../../components/common/footer/index.js'; // 底部公用组件
import Slider from 'react-slick'; // banner组件
import ListItem from './../../../components/common/listItem/index'; // ListItem组件列表单个
import ListLeft from './../../../components/common/listleft/index'; // List列表左侧组件
import FooterDep from './../../../components/common/footerDep/index'; // 底部部门展示组件
import ajax from './../../../components/common/ajax/ajax'; 

import { Button , message , Carousel} from 'antd';

let Morecontents = [];
let settings,imgTpl,IMAGE_DATA ;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgData:[], //轮播图数据源
      departData:[],
      flag : false,
    };
    this.moreDepartData = this.moreDepartData.bind(this);
    this.fetchBanner = this.fetchBanner.bind(this);
  }

  fetchBanner(){ //获取轮播图数据
    let self = this;
    ajax({
      url:'/platform/home/GetBanners.json',
      type:'POST',
      async:false,
      success : (data) => {
        if(data.success){
          self.setState({
            imgData : data.content
          });
        }else{
          message.error("获取数据失败");
        }
      },
      error : (data) => {}
    });
  }

  fetchData(){ //获取列表数据
    let self = this;
    ajax({
      url:'/platform/home/GetCompPrizeList.json',
      type:'POST',
      success : (data) => {
        if(data.success){
          if(data.content){
            self.setState({
              datas : data.content
            });
          }else{
            self.setState({
              datas : []
            });
          }
          self.getDepartData();//调用部门接口
        }else{
          message.error(data.errors);
        }
      },
      error : (data) => {}
    });
  }

  getDepartData(){ //获取部门数据 clone方法->深度拷贝
    let self = this;
    function clone(source)
    {
      var result;
      (source instanceof Array) ? (result = []) : (result = {});

      for (var key in source) {
        result[key] = (typeof source[key]==='object') ? clone(source[key]) : source[key];
      }
      return result;
    }
    ajax({
      url:'/platform/home/GetTopDeptList.json',
      type:'POST',
      success : (data) => {
        if(data.success){
          let contents = data.content;
          Morecontents = clone(contents);
          contents.map((item,index)=>{
            if(item.count > 10){
              item.depts = item.depts.slice(0,10);
              self.setState({ flag:true }); // 部门展示组件更多判断逻辑 如果flag为true，则显示查看更多
            }
          });
          self.setState({
            departData : contents
          });
        }else{
          message.error(data.errors);
        }
      },
      error : (data) => {}
    });
  }

  moreDepartData(){ //部门展示全部
    this.setState({
      departData : Morecontents,
      flag : false
    });
  }

  componentWillMount(){
    this.fetchBanner(); //调用轮播图接口

    this.fetchData(); //调用奖项类表接口
  }
  componentDidMount(){
  }

  componentDidUpdate(){
    let self = this;
    let timer = setTimeout(() =>{
      // self.slider.slickNext()
    },3000)
    clearTimeout(timer);
  }
  render() {
    let self = this;

    let datas = this.state.datas;
    let departData = this.state.departData;
    let flag = self.state.flag;
    IMAGE_DATA = this.state.imgData;
    imgTpl = (IMAGE_DATA || []).map((item, index) => {
      return (
        <div key={index} >
          {item.bannerUrl == 'javascript:;' ? <span><div style={{ 'background-image' : 'url('+item.url+')' }}></div></span> : <a href={item.bannerUrl}><div style={{ 'background-image' : 'url('+item.url+')' }}></div></a>}
        </div>
      );
    });
    if (!IMAGE_DATA.length) imgTpl = <div></div>;
      if(IMAGE_DATA.length > 1){
        settings = { dots: true,
                     infinite: true,
                     slidesToShow: 1,
                     slidesToScroll: 1,
                     autoplay:true,
                     autoplaySpeed:3000,
                     arrows:false,
                     adaptiveHeight: true
                   }
      }else{
        settings = { dots:false }
      }

      return (
        <div>
          <HeadCom selectedItem="home"></HeadCom>
          <div className="y-banner">
            <Slider {...settings} ref={c => this.slider = c } >
              {imgTpl}
            </Slider>
          </div>
          <div className="oddDiff">
            {
              !datas ?
              <div className="y-container">
                <div className="y-wait">
                  <div><img src="../../../../static/images/loading3.gif" alt="loading"/><span>页面君正在拼命加载，请稍后...</span></div>
                </div>
              </div> :
              datas.length > 0 ?
              datas.map((item,index)=>{
                let links = "/platform/pageconfig/awardsDetail.htm?prizeCode="+item.prizeCode;
                return(
                  <div className="y-list" key={index}>
                    <div className="y-container">
                      <div className="listItems">
                        <div className="listFl">
                          <ListLeft listLeft={item.listLeft}></ListLeft>
                        </div>
                        <div className="listFr">
                          <div className="listTitle">提名团队/个人</div>
                          {
                            item.prizeStatus == 'before' ?
                            <div className="empty"><img src="../../../../static/images/notime.png" alt="图片"/> <div>提名暂未开始，小伙伴们先Hold住：）</div></div>
                            :
                            item.prizeStatus == 'nobody' ?
                            <div className="empty"><img src="../../../../static/images/empty.png" alt="图片"/> <div>来做第一个提名的人吧！</div></div>
                            :
                            <div>
                              <ListItem listData={item.nominees} prizeStatus={item.prizeStatus}></ListItem>
                              {item.total > 4 ? <div className="listFooter"><a href={links}>查看更多团队/个人</a></div> : null}
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }) : datas.length == 0 ?
              <div className="y-container">
                <div className="y-wait">
                  <div><img src="../../../../static/images/noData.png" alt="picture"/><span>暂无奖项，小伙伴们先Hold住：）</span></div>
                </div>
              </div>
              :
              null

            }
          </div>
          <div className="footerDepartment">
            <div className="y-container">
              <p className="y-center"><i className="iconfont icon-i"></i> 部门奖项板块暂未开放，敬请期待！</p>
              <FooterDep departData={departData}></FooterDep>
              {
                flag == true ? <div className="more" onClick={()=>{self.moreDepartData()} }><Button type="ghost">更多部门奖项</Button></div> : null
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
