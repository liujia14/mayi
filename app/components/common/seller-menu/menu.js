
import React from 'react';
import ReactDOM from 'react-dom';
import './menu.less';
import './../commonCss/index.less';
import login from "./../../../images/logo.png";
// 获取url数据
import getUrlData from "./../getUrl/getUrlData.js";
import ajax from './../ajax/ajax.js';


// true - 管理员 否则 是用户
var manager = null;
ajax({
  url: '/background/department/checkAdmin.json',
  cache: false,
  async:false,
  success: (data) => {manager = data.content ? data.content.isAdmin : manager;}
})


var munuList = [
  {
    name : "我创建的奖项",
    url : "/platform/admin.htm",
    code : "1",
    children : [],
  },
];

var munuList2 = [
  {
    name : "我管理的奖项",
    url : "/platform/admin.htm",
    code : "2",
    children : [],
  },
  {
    name : "提名团队/个人管理",
    url : "/platform/pageconfig/personlManagement.htm",
    code : "3",
    children : [],
  },
  {
    name : "部门规则配置",
    url : "/platform/pageconfig/ruleConfig.htm",
    code : "4",
    children : [],
  },
  {
    name : "banner管理",
    url : "/platform/pageconfig/banner.htm",
    code : "5",
    children : [],
  }
];


// 引入Antd的导航组件
import { Menu, Icon, Switch,message } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
class Sider extends React.Component {
    constructor(props) {
        super();
        this.state = {
            childrenId : getUrlData("childrenId"),
            //munuList : '[{"code":"1","children":[{"code":"11","name":"我管理的獎項","url":""}],"name":"獎項管理","logo":"pay-circle-o","url":""},{"code":"2","children":[{"code":"21","name":"商品管理","url":""}],"name":"提名團隊/個人管理","logo":"laptop","url":""}]',
            munuList : JSON.stringify(manager ? munuList2 : munuList),
            username : "游客",
            messageNum : 0,
            src:''
        }
    }
    componentWillMount(){
      let self = this;
      ajax({
        url:'/platform/home/GetLoginUserInfo.json',
        type:"POST",
        success:(data)=>{
          if(data.success === true){
            let username = data.content.nickNameCn? data.content.lastName+"("+data.content.nickNameCn+")" : data.content.lastName;
            self.setState({
              username: username
            });
          }else{
            message.info(data.errors);
          }
        },
        error:()=>{}
      });
    }
    handleClick(e) {
      this.setState({
          current: e.key
      });
    }
    signOut(item){
        ajax({
          url:"/platform/home/Eixt.json?type=2",
          success:(data) => {
            if (data.success===true) {
              window.location.href=data.content;
            }
          },
        })
    }
    componentDidMount(){
      // 根据当前页面匹配 父目录 高亮
      var getLocation = function(pathname){
        // 高亮下标
        var cs = null;
        if(pathname.indexOf("admin") !== -1){
          cs = 0;
        }else if(pathname.indexOf("prizeNominationDetail") !== -1){
          cs = 0;
        }else if(pathname.indexOf("prizeNominationSet") !== -1){
          cs = 0;
        }else if(pathname.indexOf("handleAdd") !== -1){
          cs = 0;
        }else if(pathname.indexOf("handleEdit") !== -1){
          cs = 0;
        }else if(pathname.indexOf("banner") !== -1){
          cs = 3;
        }else if(pathname.indexOf("ruleConfig") !== -1){
          cs = 2;
        }else if(pathname.indexOf("personlManagement") !== -1){
          cs = 1;
        }

        $("#leftMenu .ant-menu-submenu-inline").eq(cs).attr("style","background-color:#3bacdd").find(".menuText").attr("style","color:#fff");
      };
      getLocation(location.pathname);
    }
    render() {
        var parentId = JSON.parse(this.state.munuList || "[]").map(v => v.code);
        var munuList = JSON.parse(this.state.munuList || "[]");
        return (
            <div>
                <div id="leftMenu">
                    <div
                    style={{
                      width:"100%",
                      height:'80px',
                      lineHeight:'80px',
                      backgroundColor:"#111",
                      fontSize:'18px',
                      color:"#fff",
                    }}>
                      <img src={login} width='200' height='50' style={{margin:'5px'}} />
                    </div>
                    <Menu theme="dark"
                        id="menuBox"
                        onClick={(e) => {this.handleClick(e)}}
                        style={{ width: "210px",marginTop:"40px" }}
                        defaultOpenKeys={parentId}
                        selectedKeys={[this.state.childrenId ? this.state.childrenId : ""]}
                        mode="inline"
                    >
                        {
                        	munuList.map(function(v){
                        		return(
                        			<SubMenu key={v.code} title={<span><a className="menuText" href={v.url}>{v.name}</a></span>}>
                            			{
                            				v.children.map(function(v2){
                            					return(
                            						<Menu.Item key={v2.code}><a href={`${v2.url}?childrenId=${v2.code}`}>{v2.name}</a></Menu.Item>
                          						)
                            				})
                            			}
                        			</SubMenu>
                      			)
                        	})
                        }
                    </Menu>
                </div>
                <div id="rightWrap">
                  <div className="top-header">
                    <div className="header-list login-out" onClick={this.signOut}><Icon type="logout" /> 退出系统</div>
                    <div className="header-list">|</div>
                    <div className="header-list">{ this.state.username }</div>
                  </div>
                    <div id="right-box">

                    </div>
                </div>
            </div>
        )
    }
}
ReactDOM.render(
  <Sider />
,$("#content")[0]);
