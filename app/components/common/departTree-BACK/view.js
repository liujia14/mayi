import React from 'react';
import ReactDOM from 'react-dom';
import {Cascader} from "antd";
import ajax from "./../ajax/ajax";

var newValue=[];
class Tree extends React.Component{
	constructor(props){
		super(props);
		newValue=props.value ? props.value.split(",") : props.defaultValue ? props.defaultValue.split(",") : [];
		this.state = {
			tree : [{
  value: 'zhejiang',
  label: 'Zhejiang',
  children: [{
    value: 'hangzhou',
    label: 'Hangzhou',
    children: [{
      value: 'xihu',
      label: 'West Lake',
    }],
  }],
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  children: [{
    value: 'nanjing',
    label: 'Nanjing',
    children: [{
      value: 'zhonghuamen',
      label: 'Zhong Hua Men',
	    children: [{
	      value: 'xihu',
	      label: 'West Lake',
			    children: [{
			      value: 'xihu',
			      label: 'West Lake',
					    children: [{
					      value: 'xihu',
					      label: 'West Lake',
					    }],
			    }],
	    }],
    }],
  }],
}],
			value : newValue,
		}
		console.log(this.state.value)
	}
	componentWillMount(){
		ajax({
			url : "",
			success : (data) => {
				this.setState({
					tree : data.result,
				});
			}
		});
	}
	componentWillReceiveProps(nextProps){
		if (!nextProps.value){
			this.setState({
				value:[],
			})
		}else {
			this.setState({
				value:nextProps.value.split(","),
			})
		}
	}
	cityChange(a,b){
    var props=this.props;
    props.onChange(a.join(","));
		this.setState({
			value : a,
		});
	}
	displayRender(label){
		return label[label.length - 1];
	}
	render(){
		return(
			<Cascader
				placeholder={this.props.placeholder}
				style={this.props.style}
				size={this.props.size || 'large'}
				options={this.state.tree}
				value={this.state.value}
				onChange={(a,b) => {this.cityChange(a,b)}} 
				displayRender={this.displayRender.bind(this)}
				changeOnSelect
				/>
				
		)
	}
}
module.exports = Tree