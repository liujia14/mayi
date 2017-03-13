import React from 'react';
import ReactDOM from 'react-dom';
import { Breadcrumb } from 'antd';
import "./view.less"

class Bread extends React.Component{
	render(){
		return(
			<div className="bread">
				<Breadcrumb separator="/">
					{
						this.props.breadList.length == 1 ?
						this.props.breadList.map((v,k) => {
							return(
								<Breadcrumb.Item className="only-bread" key={k}><a href='javascript:;'>{v.text}</a></Breadcrumb.Item>
							)
						}) :
						this.props.breadList.map((v,k) => {
							return(
								v.link ? <Breadcrumb.Item  key={k}><a href={v.link}>{v.text}</a></Breadcrumb.Item> : <Breadcrumb.Item  key={k} style={{color:"rgba(0,0,0,.65)"}}>{v.text}</Breadcrumb.Item>
							)
						})
					}
			  </Breadcrumb>
			</div>
		)
	}
}
module.exports = Bread;
