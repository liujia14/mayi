import React from 'react';
import ReactDOM from 'react-dom';
import ajax from "./../ajax/ajax";
import { TreeSelect } from 'antd';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
function generateTreeNodes(treeNode) {
  let arr = [];
  let key = treeNode.props.eventKey;
  let type = 2;
  if (key == 'KB' || key == "ALIPY") {type = 1};
  /*for (let i = 0; i < 3; i++) {
    arr.push({ name: `leaf ${key}-${i}`, key: `${key}-${i}`, value: `${key}-${i}`, label: `${key}-${i}` });
  }*/
  ajax({
  	url: '/background/department/GetSubDepartListByDeptNo.json',
  	type: 'POST',
    async: false,
  	data: {deptNo: key,type:type,},
  	success: data => {
      if (data.success===true) {
        arr = data.content.map( v => {
          return {
            label: v.shortName,
            key: v.deptNo,
            value: v.deptNo,
          }
        });
      }
  	}
  });
  return arr;
}

function setLeaf(treeData, curKey, level) {
  const loopLeaf = (data, lev) => {
    const l = lev - 1;
    data.forEach((item) => {
      if ((item.key.length > curKey.length) ? item.key.indexOf(curKey) !== 0 :
        curKey.indexOf(item.key) !== 0) {
        return;
      }
      if (item.children) {
        loopLeaf(item.children, l);
      } else if (l < 1) {
        item.isLeaf = true;
      }
    });
  };
  loopLeaf(treeData, level + 1);
}

function getNewTreeData(treeData, curKey, child, level) {
  const loop = (data) => {
    //if (level < 1 || curKey.length - 3 > level * 2) return;
    data.forEach((item) => {
    	
      if (item.key === curKey) {
  			
        if (item.children) {
        } else {
          item.children = child;
        }
      }else if(item.children){
      	loop(item.children);
      }
    });
  };
  loop(treeData);
  //setLeaf(treeData, curKey, level);
}
class Demo extends React.Component {
	constructor(props){
		super(props);
		let newValue=props.value ? props.value : [];
		this.state={
			value: newValue,
			treeData:[{
			  label: '蚂蚁',
			  value: 'ALIPY',
			  key: 'ALIPY',
			}, {
			  label: '口碑',
			  value: 'KB',
			  key: 'KB',
      }],
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
		let props=this.props,
		newValue=props.value ? props.value : props.defaultValue ? props.defaultValue : '';
		ajax({
			url : "",
			data: newValue,
			success : (data) => {
				if (data.success === true) {
					this.setState({
						treeData : data.content,
					});
				}
			}
		});
	}
  onChange(value) {
    console.log('onChange ', value, arguments);
    var props=this.props;
    props.onChange(value);
    this.setState({ value });
  }

  loadData(treeNode){
    return new Promise((resolve) => {
        const treeData = [...this.state.treeData];
        getNewTreeData(treeData, treeNode.props.eventKey, generateTreeNodes(treeNode), 2);
        this.setState({ treeData });
        resolve();
    });
  }
  render() {
    const tProps = {
      treeData: this.state.treeData,
      value: this.state.value,
      onChange: this.onChange.bind(this),
      loadData: this.loadData.bind(this),
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择',
      placeholder : "请选择",
      multiple: this.props.multiple || false,
      //treeCheckable: this.props.multiple || false,
      size : this.props.size || 'large',
      style: {
        width: '100%',
      },
      dropdownStyle: {
      	maxHeight: '350px',
      	overflow: 'auto',
      },
      style : this.props.style
    };
    return <TreeSelect {...tProps} />
  }
}
module.exports = Demo;