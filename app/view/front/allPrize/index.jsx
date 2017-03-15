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
import { message,Spin ,Button  } from 'antd';
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
var departmentCode=getUrlParam("departCode"),
    firstDepartName=getUrlParam("firstDepartName"),
    departName=getUrlParam("departName",true);
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /*当前页数 默认从1开始*/
      currentPage: '1',
      /*ajax loading状态 默认有*/
      load: true,
      /*是否还有数据 默认无*/
      last: false,
      datas:[
      ],
    };
  }

  componentWillMount() {
    this.fetchData();
  }
  handleScroll() { //加载更多
    let currentPage = this.state.currentPage+1;
    this.setState({
      load: true,
    })
    this.fetchData(currentPage);
  }
  fetchData(current){//获取数据
    
    const datas=this.state.datas;
    var self = this;
    let currentPage = current || this.state.currentPage;
    ajax({
      url:"/platform/prize/QueryDepartMentPrize.json",
      data:{
        currentPage: currentPage,
        limit: 5, 
        departmentCode : departmentCode || '',
      },
      success: (data) => {
        if (data.success === true) {
          datas.push.apply(datas,data.content.result);
          self.setState({
            datas: datas,
            load: false,
            last: data.content.last,
            currentPage: data.content.currentPage,
          });
        }else{
          self.setState({
            load: false,
            
          })
        }
      }
    })
  }
  render() {
    let self = this;
    let year=30000;
    let datas = this.state.datas;
    console.log(datas)
    return (
      <div>
        <HeadCom></HeadCom>
        <Spin spinning = {this.state.load}>
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
          {
            this.state.last ? <div className="addMore"> <Button  onClick={(ev)=>{self.handleScroll()}} loading={self.state.load}>加载更多</Button></div> : null
          }
        </Spin>
        <div className="y-container" ><Footer/></div>
      </div>
    );
  }
}


ReactDOM.render(<Home />, document.getElementById("content"));
