
import React, { Component } from 'react';

export default class SliderItem extends Component {
  constructor(props) {
    super(props);
    this.openUrl = this.openUrl.bind(this);
  }
  openUrl(itemUrl){
    console.log(itemUrl);
    if (itemUrl == "javascript:;") {
      return;
    }else{ 
      window.open(itemUrl)
    }
  }
// {/* <img src={item.src} alt={item.alt} /> */}
  render() {
    let { count, item } = this.props;
    let width = 100 / count + '%';
    return (
      <li className="slider-item" style={{width: width}}>
        <a onClick={ ()=>this.openUrl(item.bannerUrl) }><img src={item.url} alt={item.bannerName} /></a>
      </li>
    );
  }
}
