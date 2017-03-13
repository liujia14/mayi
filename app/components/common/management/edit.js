import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, message ,Cascader,Upload,Icon } from 'antd';
import ManageBrand from "./../manageBrand/view";
import ajax from './../ajax/ajax';
import DepartTree from "./../departTree/view";

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
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
var timeout,currentValue;
var isSearch = true;

class SellerEdit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nominaType:false,
            loading:false,
            tuanduichengyuanoption:[],
            data:{
              apTeamMembers:[],
              addressCodes: '',
              companyDesc: "",
              companyName: "",
              companyPhone: "",
              contactMailbox: "",
              contactPerson: "",
              contactPhone: "",
              companyDetailAddress: "",
              managementBrand: null,
              merchantLevel: "2",
              merchantName: "",
              phone: "",
            },
            merchantAttachUrls:'',
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
          url:"/platform/nominate/nominateList.json",
          async:false,
          data:{
            nomineeCode : getUrlParam('nomineeCode'),
          },
          success:(data) => {
              if (data.success) {
                this.setState({
                  isWo : "提名编辑",
                  data : data.content,
                  prizeName : data.content.prizeName,
                  prizeType : data.content.prizeType,
                  tuanduichengyuanoption : data.content.apTeamMembers,
                });
              }else{
                message.error(data.message)
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
        message.error('请上传正确的图片格式!');
      }
      const isLt3M = file.size / 1024 / 1024 < 5;
      if (!isLt3M) {
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
          url:"platform/nominate/FuzzyQueryUser.json",
          data:{searchKey:v},
          success:(data) => {
              if (data.success && currentValue === v) {
                self.setState({tuanduichengyuanoption:data.content});
              }
          }
        })
      }
      setTimeout(() => {isSearch=true},1000);
    }
    //团队个人变化
    onChange(e){
      let nominaType=e.target.value=='1' ? true : false;
      this.setState({
        nominaType:nominaType
      });
      this.props.form.resetFields();
    }
    //团队成员选择变化
    selectChange(v,a){
      ajax({
        url:"/platform/nominate/QueryMemberNominated.json",
        async:false,
        data:{memberName:v},
        success:(data) => {
          if (data.success&&data.content.length>0) {
            let teamList=data.content.join(",");
            message.error('用户'+a.props.children+'已经在'+teamList+'中添加了',3);
          }
        }
      })
    }
    blurTdch(a){
      this.setState({
        tuanduichengyuanoption : [],
      });
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
        var children = this.state.tuanduichengyuanoption.map( (d,k) => {
          return (
            <Option key={k} value={JSON.stringify({memberCode:d.memberCode,name:d.name})}>
              {d.name}
            </Option>
          )
        });
        // 获取回显的团队成员
        var arr = [];
        if(this.state.data.apTeamMembers){
          arr = this.state.data.apTeamMembers.map((v) => {
            return (
              JSON.stringify({memberCode : v.memberCode,name : v.name})
            )
          });
        }
        return (
          <div className="body">
            
            <div className="body-header">{this.state.isWo}</div>
            <Form horizontal className="SellerEdit">
                <FormItem
                    className="nomina-type"
                    label="提名角色"
                    {...formItemLayout}
                    required>
                  {getFieldDecorator('nomineeType', {
                    initialValue:this.state.data.nomineeType ? this.state.data.nomineeType : "2",
                    valuePropName:"defaultValue",
                    rules: [{ required: true, message: '请选择商家级别!' }],
                  })(
                    <RadioGroup  onChange={this.onChange.bind(this)} >
                      <Radio value="2">团队</Radio>
                      <Radio  value="1">个人</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem
                    label="奖项类型"
                    {...formItemLayout}
                    >
                    <span style={{lineHeight:"35px",}}>{prizeType == "1" ? "公司" : "个人"}</span>
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
                          this.state.data.url ?
                            <img src={this.state.data.url} role="presentation" className="avatar" /> :
                            <Icon type="plus" className="avatar-uploader-trigger" style={{width:'96px',height:'96px'}}/>
                        }
                      </Upload>
                  </FormItem>

                  <FormItem
                      id="control-input"
                      label="姓名"
                      {...formItemLayout}
                      required>
                      {getFieldDecorator('nomineeName',{
                        initialValue:this.state.data.nomineeName,
                        rules:[{type:'string',required:true,message:'请填写公司名称'},
                              {message: '最多输入30字!' ,max:30},]
                      })(
                          <Input  id="control-input" placeholder="请输入..."/>
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
                        this.state.data.url ?
                          <img src={this.state.data.url} role="presentation" className="avatar" /> :
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
                          <Input  id="control-input" placeholder="请输入..."/>
                      )}
                  </FormItem>
                </div>
                }


                <FormItem
                  {...formItemLayout}
                  label="归属部门"
                  required>
                  {getFieldDecorator('departmentCode',{
                    initialValue:this.state.data.departmentCode,
                    rules:[{required:true,message:'请选择归属部门'},
                          ]
                  })(
                    <DepartTree  placeholder="请选择" />
                  )}
                </FormItem>

                <FormItem
                    id="control-textarea"
                    label="提名理由"
                    {...formItemLayout}
                    required>
                  {getFieldDecorator('nomineeReason', {
                    initialValue: this.state.data.nominatedReason,
                    rules: [{ type: 'string', required: true, message: '请输入提名理由!' },
                    { max:300, message: '最多输入300字!' },],
                  })(
                    <Input  type="textarea" id="control-textarea" rows="4"  />
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
                            allowClear
                            multiple
                            onBlur={this.blurTdch.bind(this)}
                            onSelect={this.selectChange.bind(this)}
                            onSearch={this.getValueFromEvent.bind(this)}
                          >
                            {children}
                          </Select>
                      )}
                  </FormItem>
                }
            </Form>
          </div>
        )
    }
}

export default  SellerEdit = Form.create()( SellerEdit)