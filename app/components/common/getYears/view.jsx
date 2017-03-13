import React from 'react';
import ReactDOM from 'react-dom';
import ajax from "./../ajax/ajax";
import { Select } from 'antd';
const Option = Select.Option;

class Demo extends React.Component {
	constructor(props){
		super(props);
		let newValue=props.value ? props.value : [];
		this.state={
			value: newValue,
		}
	}
  componentWillReceiveProps(nextProps){
    if (!nextProps.value){
      this.setState({
        value:[],
      })
    }else {
      this.setState({
        value:nextProps.value,
      })
    }
  }
	componentWillMount(){
    let self = this;
    //获取当前时间
    var nowTime = new Date();
    var nowYear = nowTime.getFullYear();
    //获取当前奖项最大年份
    ajax({
      url : '/background/prize/GetMaxYear.json',
      success : function(data){
        if (data.success === true) {
          let maxYear = parseInt(data.content) || nowYear,
            allData = [];
          for (let i =  maxYear; i >= 2015; i--) {
            allData.push(maxYear.toString());
            maxYear--;
          }
          self.setState({
            allData : allData,
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
    let allData = this.state.allData;
    return(
      <Select 
        value = {this.state.value}
        onChange = {this.onChange.bind(this)}
        size={this.props.size || 'large'}
        placeholder = "请选择"
        style = {this.props.style}
      >
        {
          !allData ? [] : allData.map(item => {
            return(
              <Option key={item} value={item}>{item}</Option>
            )
          })
        }
      </Select>
    ) 
  }
}
module.exports = Demo;