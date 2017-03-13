

import "./view.less";
import React from "react";
import ReactDOM from "react-dom";
import {Input,Button,Icon,Col} from "antd";

class ManageBrand extends React.Component{
	constructor(){
		super();
		this.state = {
			value : "",
			brandList : []
		}
	}
	change(e){
		var t = e.target;
		this.setState({
			value : t.value.trim()
		});
	}
	ok(e){
		this.trigger();
	}
	trigger(){
		if(this.props.onClick && (!this.props.onClick(this.state.brandList))){
			return;
		}
		var type = true;
		this.state.brandList.forEach((e) => {
			if(e === this.state.value){
				type = false;
			}
		});
		this.state.value && type && this.state.brandList.push(this.state.value);
		this.setState({
			brandList : this.state.brandList,
			value:'',
		},() => {
			this.props.onChange(this.state.brandList,this);
		});
	}
	delete(e,k){
		this.state.brandList.splice(k,1);
		this.setState({
			brandList : this.state.brandList
		},() => {
			this.props.onChange(this.state.brandList,this);
		});
	}
	enter(e){
		if(e.keyCode === 13){
			this.trigger();
		}
	}
	componentDidMount(){
		this.setState({
  		brandList : this.props.brandList
  	});
	}
  render(){
  	this.props.onChange(this.state.brandList,this);
    return(
      <div className="manageBrandBox">
      	<Col span="18">
      	<Input placeholder='请输入' maxLength="10" onKeyUp={(e) => {this.enter(e)}} onChange={(e) => {this.change(e)}} value={this.state.value} />
      	</Col>
      	<Col span="6">
      	<Button onClick={(e) => {this.ok(e)}} type="primary">添加</Button>
      	</Col>
      	{
      		this.state.brandList.map((v,k) =>{
      			return(
      				<Button className="deleteBtn" onClick={(e) => {this.delete(e,k)}} key={k}>{v}
    						<Icon className="J_delete delete" type="close" />
      				</Button>
    				)
      		})
      	}
      </div>
    );
  }
}

module.exports = ManageBrand;
