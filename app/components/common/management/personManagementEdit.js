/*
    name: view
    desc: 提名团队/个人管理-修改
    author: 曾安
    version：v1.0
*/
import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Select, Checkbox, Col, Radio, Button, Modal, message ,Upload,Icon } from 'antd';
import ManageBrand from "./../../common/manageBrand/view";
import ajax from './../../common/ajax/ajax';
import './index.less';
import Bread from "./../../common/breadNavi/view";
import DepartTree from "./../../common/undepartTree/view";

function getUrlParam(key){
    // 获取参数
    var url = window.location.search;
    // 正则筛选地址栏
    var reg = new RegExp("(^|&)"+ key +"=([^&]*)(&|$)");
    // 匹配目标参数
    var result = url.substr(1).match(reg);
    //返回参数值 decodeURIComponent()乱吗解析
    return result ? decodeURIComponent(result[2]) : null;
}
var prizeCode=getUrlParam('prizeCode');
var prizeType=getUrlParam('prizeType')||'未知';
var prizeName=getUrlParam('prizeName')||'未知';
// 保存 旧团队成员
var oldList = null;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
var timeout,currentValue;
var isSearch = true;

class SellerEdit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            prizeCode:prizeCode,
            nominaType:false,
            loading:false,
            tuanduichengyuanoption:[],
            data:{
              //模糊搜索成员
              apTeamMembers:[],
              //名称
              nomineeName: '',
              //提名理由
              nominatedReason: "",
              //depattmentCode
              departmentCode: '',
            },
            // 奖项类型
            prizeType : null,
            // 提名奖项
            prizeName : null,
            // 我要提名 还是 修改文案
            isWo : null,
        }
    }
    //获取数据
    componentWillMount(){
      // 如果是 新增
      if(location.pathname.indexOf("Creat") !== -1){
        this.setState({
          prizeType : getUrlParam('prizeType'),
          prizeName : getUrlParam('prizeName'),
          isWo : "我要提名",
        });
      }else{
        ajax({
          url:"/platform/nominate/nominateListForEdit.json",
          async:false,
          data:{
            nomineeCode : getUrlParam('nomineeCode'),
          },
          success:(data) => {
              if (data.success === true) {
                prizeName = data.content.prizeName;
                prizeType = data.content.prizeType;
                this.setState({
                  isWo : "提名编辑",
                  url: data.content.url,
                  data : data.content,
                  prizeName : data.content.prizeName,
                  prizeType : data.content.prizeType,
                  tuanduichengyuanoption : data.content.apTeamMembers,
                  fileCode : data.content.fileCode,
                  prizeCode : data.content.prizeCode,
                  nominaType : data.content.nomineeType == '1' ? true : false,
                });
                prizeCode = data.content.prizeCode;
                oldList = data.content.apTeamMembers;
              }else{
                message.error(data.errors)
              }
          },
          error:() => {
            message.error('商家基本信息数据获取失败')
          }
        })
      }
    }

    //上传
    handleUpload(info){
      if (info.file.status === 'done') {
        this.setState({
          url:info.file.response.content.url,
          fileCode:info.file.response.content.code,
        })
      }
    }
    //验证
    beforeUpload(file) {
      const isJPG = (file.type === 'image/jpeg' ) || (file.type === 'image/png');
      if (!isJPG) {
        message.error('只支持jpg,jpeg,png格式！');
      }
      const isLt3M = file.size / 1024 / 1024 < 5;
      if (!isLt3M&&isJPG) {
        message.error('上传图片必须小于5M!');
      }
      return isJPG && isLt3M;
    }
    //团队成员输入时搜索
    getValueFromEvent(v){
      //如果是选择的不搜索
      if (typeof v === 'object') {
        return;
      };
      var self=this;
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      };
      currentValue=v;
      /*timeout = setTimeout(fake, 800);*/
      if(!isSearch){return}
      isSearch = false;
      fake();
      function fake(){
        ajax({
          url:"/platform/nominate/FuzzyQueryUser.json",
          data:{searchKey:v},
          success:(data) => {
              if (data.success && currentValue === v) {
                self.setState({tuanduichengyuanoption:data.content});
              }
          }
        })
      }
      setTimeout(() => {isSearch=true});
    }
    //提交
    handleSubmit(){
      //基本信息表单值
      this.props.form.validateFieldsAndScroll(
        (error,val) => {
          console.log(val);
          if (error) {
            return;
          };
          val.prizeCode=prizeCode;
          val.fileCode = this.state.fileCode;
          val.nomineeName = !val.nomineeName ? JSON.parse(val.nomineeName2).name :val.nomineeName; 
          val.teamList = val.teamList || val.nomineeName2;
          val.departmentCode = !val.departmentCode ? '' : val.departmentCode.toString();
         /* console.log(val.departmentCode.join(","))
          if (val.departmentCode) {
            let arrr = val.departmentCode.map((v) => {
              return v;
            });
            val.departmentCode = JSON.stringify(arrr);
          }*/
          (val.nomineeName2) && (val.teamList = [val.nomineeName2]);
          var arr = val.teamList.map((v) => {
            return (JSON.parse(v));
          });
          val.teamList = JSON.stringify(arr);
          this.setState({loading:true});
          // 如果是 新增
          if(location.pathname.indexOf("Creat") !== -1){
            ajax({
              url:"/platform/nominate/saveNominate.json",
              data:val,
              success:(data) => {
                if (data.success===true) {
                  message.success("创建成功");
                  setTimeout(() => {window.location.href=`/platform/pageconfig/messageBoard.htm?nomineeCode=${data.content}`},1500);
                }else{
                  message.error(data.errors);
                };
                this.setState({
                  loading:false,
                })
              },
              error: () => {
                this.setState({loading:false})
              }
            })
          // 修改
          }else{
            val.teamListNewJson = val.teamList || val.nomineeName2;
            /*var oldData = val.teamListNewJson.map((v) => {
              return (JSON.parse(v));
            });*/
            val.teamListOldJson = JSON.stringify(oldList);
            val.nomineeCode = getUrlParam('nomineeCode');
            ajax({
              url : "/platform/nominate/updateNominate.json",
              data : val,
              success : (data) => {
                if (data.success===true) {
                  message.success("修改成功");
                  setTimeout(() => {window.location.href=`/platform/pageconfig/personlManagement.htm`},1500);
                }else{
                  message.error(data.errors);
                };
                this.setState({
                  loading:false,
                })
              }
            });
          }
        }
      )

    }
    //角色变化
    onChange(e){
      let nominaType=e.target.value=='1' ? true : false;
      this.setState({
        url: null,
        code: null,
        nominaType: nominaType,
        tuanduichengyuanoption : [],
        data:{
              //模糊搜索成员
              apTeamMembers:[],
              //名称
              nomineeName: '',
              //提名理由
              nominatedReason: "",
              //所属部门
              departmentCode: [],
            },
      });
      this.props.form.resetFields();
    }
    //团队成员选择变化
    selectChange(v,a){
      v = JSON.parse(v);
      let name = v.name,
          memberCode = v.memberCode;
      ajax({
        url:"/platform/nominate/QueryMemberNominated.json",
        async:false,
        data:{memberCode:memberCode,prizeCode:prizeCode,memberName:name,nomineeCode : getUrlParam('nomineeCode')},
        success:(data) => {
          if (data.success===true && (data.content.length>0)) {
            let teamList = data.content.split(",");
            if (teamList.length>0) {
              Modal.warning({
                content: (
                  <div style={{lineHeight:"25px"}}>
                    {
                      teamList.map(v=><p key={v}>{v}</p>)
                    }
                  </div>
                )
              })
            }
          }
        }
      })
    }

    blurTdch(a){
      this.setState({
        tuanduichengyuanoption : [],
      });
    }
    //取消返回
    cancelBtn(){
      history.go(-1)
    }
    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        }

        const success = function () {
            message.success('操作成功!');
        }
        console.log(this.state.tuanduichengyuanoption);
        console.log(this.state.data.apTeamMembers);
        var children = this.state.tuanduichengyuanoption.map( (d,k) => {
          return (
            <Option key={k} value={JSON.stringify({memberCode:d.memberCode,name:d.name})}>
              {d.name}
            </Option>
          )
        });

        // 获取回显的团队成员
        var arr = [];
        this.state.data.apTeamMembers.map((d) => {
              arr.push(JSON.stringify({memberCode:d.memberCode,name:d.name}));
        });
        //console.log(typeof arr[0]);
        return (
          <div className="body">
            <Bread breadList={[{text : "提名团队/个人管理",link : "/platform/pageconfig/personlManagement.htm"},{text : this.state.isWo,link : "javascript:();"}]} />
            <Form horizontal className="SellerEdit">
                {
                  this.state.data.nomineeType ? 
                <FormItem
                    className="nomina-type"
                    label="提名角色"
                    {...formItemLayout}
                    >
                    <span style={{lineHeight:"35px",}}>{this.state.data.nomineeType == "1" ? "个人" : "团队"}</span>
                </FormItem> : 
                <FormItem
                    className="nomina-type"
                    label="提名角色"
                    {...formItemLayout}
                    required>
                  {getFieldDecorator('nomineeType', {
                    initialValue:this.state.data.nomineeType ? this.state.data.nomineeType + "" : "2",
                    valuePropName:"defaultValue",
                    rules: [{ required: true, message: '请选择商家级别!' }],
                  })(
                    <RadioGroup  onChange={this.onChange.bind(this)} >
                      <Radio value="2">团队</Radio>
                      <Radio  value="1">个人</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                }
                <FormItem
                    label="奖项类型"
                    {...formItemLayout}
                    >
                    <span style={{lineHeight:"35px",}}>{prizeType == "1" ? "公司" : "部门"}</span>
                </FormItem>
                <FormItem
                    label="提名奖项"
                    {...formItemLayout}
                    >
                    <span style={{lineHeight:"35px",}}>{this.state.prizeName}</span>
                </FormItem>
                {
                this.state.nominaType==true ?
                <div>
                  <FormItem
                    {...formItemLayout}
                    label="个人形象"
                    extra=""
                  >
                      <Upload   showUploadList={false}
                          action="/platform/attachment/Upload.json"
                            beforeUpload={this.beforeUpload}
                              onChange={this.handleUpload.bind(this)}
                              >
                        {
                          this.state.url ?
                            <img src={this.state.url} role="presentation" className="avatar" /> :
                            <Icon type="plus" className="avatar-uploader-trigger" style={{width:'96px',height:'96px'}}/>

                        }
                      </Upload>
                  </FormItem>

                  <FormItem
                      id="control-input"
                      label="姓名"
                      {...formItemLayout}
                      required>
                      {getFieldDecorator('nomineeName2',{
                        initialValue: arr,
                        valuePropName:"defaultValue",
                        rules:[{required:true,message:'请填写姓名'},
                              ]
                      })(
                          <Select
                            notFoundContent=''
                            allowClear
                            showSearch
                            onBlur={this.blurTdch.bind(this)}
                            onSelect={this.selectChange.bind(this)}
                            onSearch={this.getValueFromEvent.bind(this)}
                            filterOption={false}
                            placeholder="请输入"
                          >
                            {children}
                          </Select>
                      )}
                  </FormItem>
                </div>
                 :
                <div>
                <FormItem
                  {...formItemLayout}
                  label="团队形象"
                  extra=""
                >
                    <Upload   showUploadList={false}
                        action="/platform/attachment/Upload.json"
                          beforeUpload={this.beforeUpload}
                            onChange={this.handleUpload.bind(this)}
                            >
                      {
                        this.state.url ?
                          <img src={this.state.url} role="presentation" className="avatar" /> :
                          <Icon type="plus" className="avatar-uploader-trigger" style={{width:'96px',height:'96px'}}/>
                      }
                    </Upload>
                </FormItem>
                  <FormItem
                      id="control-input"
                      label="团队名称"
                      {...formItemLayout}
                      required>
                      {getFieldDecorator('nomineeName',{
                        initialValue:this.state.data.nomineeName,
                        rules:[{type:'string',required:true,message:'请填写团队名称'},
                              {message: '最多输入30字!' ,max:30},]
                      })(
                          <Input  placeholder="请输入..."/>
                      )}
                  </FormItem>
                </div>
                }


                { prizeType == "1" ?
                  <FormItem
                    {...formItemLayout}
                    label="归属部门"
                    required>
                    {getFieldDecorator('departmentCode',{
                      initialValue:this.state.data.departmentCode,
                      rules:[{required:true,message:'请选择归属部门'},
                            ]
                    })(
                      <DepartTree multiple={!this.state.nominaType} placeholder="请选择" />
                    )}
                  </FormItem>
                  : ''
                }

                <FormItem
                    id="control-textarea"
                    label="提名理由"
                    {...formItemLayout}
                    required>
                  {getFieldDecorator('nomineeReason', {
                    initialValue: this.state.data.nominatedReason,
                    rules: [{ type: 'string', required: true, message: '请输入提名理由!' },
                    { max:1024, message: '最多输入1024字!' },],
                  })(
                    <Input  type="textarea" id="control-textarea" rows="4" placeholder="请输入，不超过1024个字" />
                  )}
                </FormItem>

                {
                this.state.nominaType==true ? '' :
                  <FormItem
                      id="control-input"
                      label="团队成员"
                      {...formItemLayout}
                      required>
                      {getFieldDecorator('teamList',{
                        initialValue: arr,
                        valuePropName:"defaultValue",
                        rules:[{required:true,message:'请填写团队成员'},
                              ]
                      })(
                          <Select
                            notFoundContent=''
                            allowClear
                            multiple
                            onBlur={this.blurTdch.bind(this)}
                            onSelect={this.selectChange.bind(this)}
                            onSearch={this.getValueFromEvent.bind(this)}
                            placeholder="请输入"

                          >
                            {children}
                          </Select>
                      )}
                  </FormItem>
                }

                <FormItem wrapperCol={{ span: 12, offset: 6 }} style={{ marginTop: 24 }}>
                    <Button type="primary" disabled={this.state.loading} htmlType="submit" onClick={this.handleSubmit.bind(this)}>提交</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button type="ghost" onClick={this.cancelBtn} >取消</Button>
                </FormItem>
            </Form>
          </div>
        )
    }
}

export default  SellerEdit = Form.create()( SellerEdit)