import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import MD from 'markdown-it';
const md = MD({
  html: false,
  xhtmlOut: true,
  breaks: true,
});

class MDE extends Component{
  constructor(){
    super();

    this.state = {
      selectStart: 0,
      selectEnd: 0,
      textarea: null,
      startLines: [],
      showValue: 'hola como **estais** \n\n\n\nhadsad',
      resultarea: null,
      result: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.handleToolbar = this.handleToolbar.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleInline = this.handleInline.bind(this);
    //this.agregarStartLines = this.agregarStartLines.bind(this);
  }

  componentDidMount(){
    this.setState({textarea: this.refs.textarea, resultarea: this.refs.resultarea});
  }

  handleToolbar(e){
    switch(e.target.classList[1]){
      case 'fa-bold': this.handleInline("**"); break;
      case 'fa-italic': this.handleInline("_"); break;
      case 'fa-strikethrough': break;
      case 'fa-underline': break;
      case 'fa-header': this.changeValue('#'); break;
      case 'fa-list-ol': break;
      case 'fa-list-ul': break;
    }
    this.onChange();
  }

  onChange(e){
    this.setState({
      showValue: this.state.textarea.value.replace(/\n/g, "\n\n<br>"),
      result: md.render(this.state.textarea.value.replace(/\n/g, "\n"))
    });
    console.log({value: this.state.showValue});
  }

  handleInline(mark){
    const ta = this.state.textarea;
    const value = ta.value;
    let sub1 = '';
    let sub2 = '';
    let sub3 = '';
    if(this.state.selectEnd != this.state.selectStart){
      sub1 = value.substring(0, this.state.selectStart);
      sub2 = value.substring(this.state.selectStart, this.state.selectEnd);
      sub3 = value.substring(this.state.selectEnd);
      const subArr = sub2.split(mark);
      sub2 = (subArr.length > 1 ? (subArr[0] === "" ? subArr[1] : subArr[0]) : mark + sub2 + mark);
      ta.value = sub1 + sub2  + sub3;
      this.setState({
        selectEnd: 0,
        selectStart: 0
      })
    }
  }

  changeValue(strAgregado){
    const ta = this.state.textarea;
    const value = ta.value;
    const start = this.state.selectStart;
    const end = this.state.selectEnd;
    //console.log({value});
    let sub1 = value.substring(0, end);
    let sub2 = value.substring(end);
    const index = sub1.lastIndexOf("\n") != -1 ? sub1.lastIndexOf("\n") + 1 : 0;
    sub1 = value.substring(0, index);
    sub2 = value.substring(index);
    if(sub2.search("######") != -1){
      sub2 = sub2.substring(7);
    }else if(sub2.search("#") != -1){
      sub2 = '#' + sub2;
    }else{
      sub2 = '# ' + sub2;
    }
    console.log({value: (sub1 + sub2).replace(/\n/g, "\n<br>\n\n") })
    ta.value = sub1 + sub2;
  }

  onSelect(e){
    const value = e.target.value;
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    this.setState({
      selectStart: start,
      selectEnd: end
    });
    const time = setInterval(()=>{
      console.log(end)
      clearTimeout(time);
    }, 0.5);
    time;
  }

  onKeyDown(e){

  }

  /*onKeyDown(e){
    const ta = this.state.textarea;
    const value = ta.value;
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    let sub1 = '';
    let sub2 = '';
    let sub3 = '';
    if(e.key === 'Enter' || e.keyCode === 13){
      sub1 = value.substring(0, end);
      sub2 = value.substring(end);
      if(sub1.substring(end-1, end).search("\n") != -1){
        sub1 = value.substring(0,end-1);
      }
      ta.value = sub1 + sub2;
      let found = false;
      this.state.startLines.map((s) => s == this.state.selectEnd || s == this.state.selectEnd - 1 ? found = true : found = false);
      if(!found){
        this.state.startLines.push(this.state.selectEnd);
      }
      //console.log(this.state.startLines)
    }else if(e.key === 'Backspace' || e.keyCode === 8){
      if(this.state.startLines.indexOf(this.state.selectEnd) != -1){
        this.state.startLines.pop(this.state.selectEnd);
      }
    }else if((e.key >= "a" && e.key <= "z") || (e.key >= "0" && e.key <= "9")){
      this.agregarStartLines(this.state.selectEnd);
    }
  }*/

  /*agregarStartLines(posicion, aumento = 1){
    console.log(this.state.selectEnd)
    this.setState({
      startLines: this.state.startLines.map((v) => v > posicion - 1 ? v + aumento : v)
    });
    const time = setInterval(()=>{
      console.log(this.state.startLines);
      clearTimeout(time);
    }, 0.5);
    time;
  }*/

  render(){
    //<ReactMarkdown source={this.state.showValue} escapeHtml={false}/>
    return (
      <div id="mde">
        <div id="toolbar" onClick={this.handleToolbar}>
          <i className="fa fa-bold" aria-hidden="true"></i>
          <i className="fa fa-italic" aria-hidden="true"></i>
          <i className="fa fa-header" aria-hidden="true"></i>
          <i className="fa fa-list-ol" aria-hidden="true"></i>
          <i className="fa fa-list-ul" aria-hidden="true"></i>
          <i className="fa fa-link" aria-hidden="true"></i>
          <i className="fa fa-file-image-o" aria-hidden="true"></i>
        </div>
        <textarea className="editor-area" autoFocus onChange={this.onChange} onSelect={this.onSelect} onKeyDown={this.onKeyDown} ref="textarea"/>
        <div ref="resultarea">
          {this.state.result}
        </div>
      </div>
    );
  }
}

export default MDE;