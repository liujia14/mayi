
import React from 'react';
import ReactDOM from 'react-dom';
import './menu.less';
import './../commonCss/index.less';
import login from "./../../../images/logo.png";
// 获取url数据
import getUrlData from "./../getUrl/getUrlData.js";



// 引入Antd的导航组件
import { Menu, Icon, Switch,message } from 'antd'
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
class Sider extends React.Component {
    constructor(props) {
        super();
        this.state = {
            childrenId : getUrlData("childrenId"),
            munuList : null,
            username : "管理员",
            messageNum : 0,
            src:''
        }
    }
    componentWillMount(){
      $.ajax({
        type : "get",
        // async:false,
        url : "/index/getLeftItems",
        success : (data) => {
          this.setState({
              munuList : data
          });
        },
        error : function(data){
          message.error("数据请求失败，请稍后重试");
        }
      });
      $.ajax({
        type : "POST",
        url : "/ombg/login/getLoginName",
        success : (data) => {
          if (data.success===true) {
            this.setState({
                username : data.loginName
            });
          }
        },
        error : function(data){
          message.error("数据请求失败，请稍后重试");
        }
      });
    }
    handleClick(e) {
      this.setState({
          current: e.key
      });
    }
    signOut(item){
      if (item.key==21) {
        $.ajax({
          url:"/ombg/login/loginOut.htm",
          success:(data) => {
            window.location.href="/ombg/login/login.htm"
          },
          error:(data) => {
            window.location.href="/ombg/login/login.htm"
          }
        })
      }
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
                      height:'60px',
                      lineHeight:'60px',
                      backgroundColor:"#1B71FF",
                      fontSize:'18px',
                      color:"#fff",
                    }}>
                      <img src={login} width='50' height='50' style={{margin:'5px'}} />
                      <span style={{display:'inline-block',verticalAlign:'top'}}>后台管理系统</span>
                    </div>
                    <Menu theme="dark"
                        onClick={(e) => {this.handleClick(e)}}
                        style={{ width: 185 }}
                        defaultOpenKeys={parentId}
                        selectedKeys={[this.state.childrenId ? this.state.childrenId : ""]}
                        mode="inline"
                    >
                        {
                        	munuList.map(function(v){
                        		return(
                        			<SubMenu key={v.code} title={<span><Icon type="mail" /><span>{v.name}</span></span>}>
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
                    <Menu onClick={this.signOut} mode="horizontal" style={{ height:60,borderBottom:'1px solid #bbb', }}>
                        <SubMenu key='2' title={<span><Icon type="user" />{ this.state.username }</span>}>
                            <MenuItem key="21" >退出</MenuItem>
                        </SubMenu>
                        <SubMenu key='1' title={
                          <span>
                            <Icon type="notification"/>消息
                            <span style={{
                              color:'#fff',
                              backgroundColor:"#FF6D59",
                              textAlign:'center',
                              padding:'0 4px',
                            }}>{this.state.messageNum}</span>
                          </span>
                        }>
                            <MenuItem key="11" >消息。。。</MenuItem>
                        </SubMenu>
                    </Menu>
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
