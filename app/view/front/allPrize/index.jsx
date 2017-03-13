/*
  name: front-nomination-creat
  desc: 前台页面支付宝大数据
  author: 刘佳
  data: 2.12
*/
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.less';
import ajax from './../../../components/common/ajax/ajax';
import HeadCom from './../../../components/common/header/index.js'; // 头部导航栏
import Footer from './../../../components/common/footer/index.js'; // 底部公用组件
import ListItem from './../../../components/common/listItem/index'; // ListItem组件列表单个
import ListLeft from './../../../components/common/listleft/index'; // List列表左侧组件
import Bread from './../../../components/common/breadNavi/view'; // 面包屑组件
import { message } from 'antd';
import './style.less';
/*import imgSrc   from './../../../images/banner.png'; 
import imgData1 from './../../../images/pic-01.png';
import imgData2 from './../../../images/pic-02.png';
import imgData3 from './../../../images/pic-03.png';
import imgData4 from './../../../images/pic-04.png';
import antImg01 from './../../../images/ant-01.png'; //蚂蚁图片1
import antImg02 from './../../../images/ant-02.png'; //蚂蚁图片2
import antImg03 from './../../../images/ant-03.png'; //蚂蚁图片3
import prizeImg from './../../../images/prize.png'; //奖牌*/
function getUrlParam(key,last){
    // 获取参数
    var url = window.location.search;
    // 正则筛选地址栏
    var reg = new RegExp("(^|&)"+ key +"=([^&]*)(&|$)");
    last && (reg = new RegExp("(^|&)"+ key +"=(.*$)"));
    // 匹配目标参数
    var result = url.substr(1).match(reg);
    //返回参数值 decodeURIComponent()乱吗解析
    return result ? decodeURIComponent(result[2]) : null;
}
var pages=1,
  //判断是否还有数据
    flage=true,
    //判断ajax是否返回
    ajaxOut=true,
    departmentCode=getUrlParam("departCode"),
    firstDepartName=getUrlParam("firstDepartName"),
    departName=getUrlParam("departName",true);
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datas:[
      ],
    };
  }

  componentDidMount() {
    
    this.fetchData();
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }
  componentWillMount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }
  handleScroll(e) { //执行滚动事件
    if($(window).scrollTop() >= $(document).height() - $(window).height()){
      if (flage) {
        pages++; 
        this.fetchData();
      }else{
        message.error('没有更多了')
      }
    }
  }
  fetchData(){
    
    const datas=this.state.datas;
    var self = this;
    if (!ajaxOut) { return; }else{ajaxOut = false;};
    
    ajax({
      url:"/platform/prize/QueryDepartMentPrize.json",
      data:{
        currentPage: pages,
        limit: 5,
        departmentCode : departmentCode || '',
      },
      async: false,
      success: (data) => {
        console.log(pages);  
        if (data.success === true && data.content.result.length > 0) {
          datas.push.apply(datas,data.content.result);
          if (data.content.result.length < 5 || data.content.total <= datas.length) {
            flage = false;
          }
          self.setState({datas});
        }
        ajaxOut = true;
      }
    })
    /*datas.push(
        {
          listLeft:{
            nominateImg:antImg01,
            nominateName:"蚂蚁骑兵",
            nominateDec:"奖项内涵文案奖项内涵文案，奖项内涵文案，奖项内涵文案奖项内涵文案奖项内涵文案，奖项内涵文案奖项内涵文案奖项内涵文案。",
            nominateDep:"支付宝、口碑",
            nominateTime:'2017-1-4 - 2017-12-8'
          },
          lists : [
            {
              itemCode:1,
              itemImg: imgData1,
              itemTitle:'支付宝-芝麻信用-商家服务部-技术二部',
              itemAgree:2546,
              itemComment:542,
              isWin:1
            },
            {
              itemCode:2,
              itemImg: imgData2,
              itemTitle:'蚂蚁金服-秘密团队',
              itemAgree:2512,
              itemComment:321,
              isWin:1
            },
            {
              itemCode:3,
              itemImg: imgData3,
              itemTitle:'浙江网商银行',
              itemAgree:2412,
              itemComment:45,
              isWin:0
            },
            {
              itemCode:4,
              itemImg: imgData4,
              itemTitle:'博彦科技ODC',
              itemAgree:1312,
              itemComment:231,
              isWin:0
            }
          ],
          listTotal:8,
          year:2013
        })
    this.setState({datas})*/
  }
  render() {
    let year=30000;
    let datas = this.state.datas;
    console.log(datas)
    return (
      <div>
        <HeadCom></HeadCom>
        <div className="oddDiff">
        <div className="content">
          <Bread breadList={[{text : "首页",link : "/platform/index.htm"},{text : firstDepartName},{ text : departName,link : "javascript:();"}]} />
          <div className="header-logo">{departName}</div>
        </div>
        {
          datas.length > 0 ?
          datas.map((item,index)=>{
            let links = "/platform/pageconfig/awardsDetail.htm?prizeCode="+item.prizeCode;
            let yearArr=[],listClass='y-list';
            if (item.year < year) {
              year=item.year;
              yearArr.push(<div key={year} className="prize-year-line"><b></b><span>{year}年度奖项</span><b></b></div>)
            }
            if (item.listTotal==0) {
              listClass='y-list y-list-show';
            }
              return(
                <div key={index}>
                  {yearArr}
                  <div className="y-list">
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
                            <ListItem listData={item.nominees}></ListItem>
                              {item.total > 4 ? <div className="listFooter"><a href={links}>查看更多团队/个人</a></div> : null}
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
          }) : 
          <div className="showNull">
            <span>该部门暂无奖项，敬请期待！</span>
          </div>
        }
        </div>
        <div className="y-container" ><Footer/></div>
      </div>
    );
  }
}


ReactDOM.render(<Home />, document.getElementById("content"));
