import React from 'react';
import ReactDOM from 'react-dom';
import Upload from 'rc-upload';

const props = {
  action: '/upload.do',
  multiple: true,
  onStart(file) {
    console.log('onStart', file, file.name);
  },
  onSuccess(ret) {
    console.log('onSuccess', ret);
  },
  onError(err) {
    console.log('onError', err);
  },
  beforeUpload(file, fileList) {
    console.log(file, fileList);
    return new Promise((resolve) => {
      console.log('start check');
      setTimeout(() => {
        console.log('check finshed');
        resolve(file);
      }, 3000);
    });
  },
};

const Test = React.createClass({
  render() {
    return (
      <div
        style={{
          width: 100,
          height: 100,
          background: 'yellow'
        }}
      >
        <div>
          <Upload {...props}><a>开始上传</a></Upload>
        </div>
      </div>
    );
  },
});

module.exports = Test;