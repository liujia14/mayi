import React from 'react';
import ReactDOM from 'react-dom';
import ajax from "./../ajax/ajax";
import { Select } from 'antd';
const Option = Select.Option;

class Demo extends React.Component {
	constructor(props){
		super(props);
    let newValue= props.value ? props.value : [];
    if (typeof newValue == 'string') {
      newValue = newValue.split(",")
    };
		/*let newValue = !props.value ? '' : props.value;
    if (props.multiple) {
      newValue = !props.value ? [] : props.value.split(",")
    }*/
		this.state={
			value: newValue,
		}
	}
  componentWillReceiveProps(nextProps){
    let value = nextProps.value;
    if (!value){
      this.setState({
        value:[],
      })
    }else {
      if (typeof value == 'string') {
        value = value.split(",")
      };
      this.setState({
        value: value,
      })
    }
  }
	componentWillMount(){
    let self = this;
    //获取一级部门树下拉
    ajax({
      type : "post",
      async : true,
      url : '/background/department/GetDepartments.json',
      success : function(data){
        if (data.success === true) {
          self.setState({
            dataOptions : data.content,
          })
        }
      }
    });
	}
  onChange(value) {
    var props=this.props;
    props.onChange(value);
    this.setState({ value });
  }

  render() {
    let dataOptions = this.state.dataOptions;
    return(
      <Select 
        value = {this.state.value}
        onChange = {this.onChange.bind(this)}
        multiple = {this.props.multiple || false}
        size={this.props.size || 'large'}
        placeholder = {this.props.placeholder || "请选择"}
      >
        {
          !dataOptions ? [] : dataOptions.map(item => {
            return(
              <Option key={item.deptNo} value={item.deptNo}>{item.deptName}</Option>
            )
          })
        }
      </Select>
    ) 
  }
}
module.exports = Demo;