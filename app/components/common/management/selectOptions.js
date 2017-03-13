import { Select } from 'antd';
import React from "react";
import ReactDOM from "react-dom";
import querystring from 'querystring';
const Option = Select.Option;

let timeout;
let currentValue;

function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  function fake() {
    const str = querystring.encode({
      code: 'utf-8',
      q: value,
    });
    $.ajax({
          type : "post",
          async : true,
          url : '/platform/prize/QueryAllPrize.json',
          success : function(data){
            if (currentValue === value) {
              const result = data.content;
              const data = [];
              result.forEach((r) => {
                data.push({
                  value: r[0],
                  text: r[0],
                }); 
              });
            }
          },
          error: function (error) {
              message.error('失败');
          },
    });
    /*jsonp(`https://suggest.taobao.com/sug?${str}`)
      .then(response => response.json())
      .then((d) => {
        if (currentValue === value) {
          const result = d.result;
          const data = [];
          result.forEach((r) => {
            data.push({
              value: r[0],
              text: r[0],
            });
          });
          callback(data);
        }
      });*/
  }

  timeout = setTimeout(fake, 300);
}

class SearchInput extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
          data: [],
          value: '',
        }
  }
  handleChange (value){
    this.setState({ value });
    fetch(value, data => this.setState({ data }));
  }
  render() {
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
    return (
      <Select
        combobox
        value={this.state.value}
        placeholder={this.props.placeholder}
        notFoundContent=""
        style={this.props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onChange={this.handleChange.bind(this)}
      >
        {options}
      </Select>
    );
  }
}

export default  SearchInput;