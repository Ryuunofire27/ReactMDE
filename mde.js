import React, { Component } from 'react';
import ReactMarkable from 'react-remarkable';

const options = {
  html: true,
  xhtmlOut: true,
  breaks: false,
};

class MDE extends Component{
  constructor(props){
    super(props);

    this.state = {
      selectStart: 0,
      selectEnd: 0,
      textarea: null,
      showValue: '',
      listOl: null,
      listUl: null
    };

    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.handleHeader = this.handleHeader.bind(this);
    this.handleToolbar = this.handleToolbar.bind(this);
    this.handleInline = this.handleInline.bind(this);
    this.handleList = this.handleList.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount(){
    this.setState({textarea: this.refs.textarea, listOl: this.refs.listol, listUl: this.refs.listul});
  }

  handleToolbar(e){
    switch(e.target.classList[1]){
      case 'fa-bold': this.handleInline("**"); break;
      case 'fa-italic': this.handleInline("_"); break;
      case 'fa-header': this.handleHeader(); break;
      case 'fa-list-ol': this.handleList(1); break;
      case 'fa-list-ul': this.handleList(2); break;
      case 'fa-link': break;
      case 'fa-file-image-o': break;
    }
    this.onChange();
  }

  onChange(e){
    this.setState({
      showValue: this.state.textarea.value
        .replace(/-ol.-/g, "1. ")
        .replace(/-ul.-/g, "- ")
        .replace(/\n\n/g,"\n\n<br/>\n\n")
        .replace(/\n/g, "\n\n")
        .replace(/\n\n\n\n<br\/>\n\n\n\n/g, "\n\n<br/>\n\n")
    });
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

  handleHeader(){
    const ta = this.state.textarea;
    const value = ta.value;
    const start = this.state.selectStart;
    const end = this.state.selectEnd;
    let sub1 = value.substring(0, end);
    let sub2 = value.substring(end);
    const index = sub1.lastIndexOf("\n") != -1 ? sub1.lastIndexOf("\n") + 1 : 0;
    sub1 = value.substring(0, index);
    sub2 = value.substring(index);
    sub2 = (sub2.search("######") != -1 ? sub2.substring(7) : (sub2.search("#") != -1 ? '#' + sub2 : '# ' + sub2));
    ta.value = sub1 + sub2;
  }

  handleList(type){
    const ta = this.state.textarea;
    const value = ta.value;
    const className = "pressed";
    const el = type === 1 ? this.state.listOl : this.state.listUl;
    if(el.classList.contains(className)){
      el.classList.remove(className);
    }else{
      el.classList.add(className);
      if(el === this.state.listOl){
        this.state.listUl.classList.remove(className);
      }else{
        this.state.listOl.classList.remove(className);
      }      
    } 
  }

  onSelect(e){
    this.setState({
      selectStart: e.target.selectionStart,
      selectEnd: e.target.selectionEnd
    });
  }

  onKeyDown(e){
    if(e.key === "Enter"){
      const el = this.state.listOl.classList.contains("pressed") ? this.state.listOl : this.state.listUl.classList.contains("pressed") ? this.state.listUl : undefined;
      if(el){
        e.preventDefault();
        const end = this.state.selectEnd;
        const ta = this.state.textarea;
        const val = ta.value;
        let add = el === this.state.listOl ? "-ol.- " : "-ul.- ";
        const normalSpaces = 6;
        let spaces = add.length + 1;
        let sub1 = val.substring(0, end);
        let sub2 = val.substring(end);
        const subBreak1 = sub1.substring(sub1.substring(0, sub1.lastIndexOf("\n")).lastIndexOf("\n"), sub1.lastIndexOf("\n") + 1);
        const subBreak2 = sub1.substring(sub1.lastIndexOf("\n") + 1);
        if(subBreak2.indexOf("    ") != -1){
          const break2Arr = subBreak2.split(subBreak2.search("-ol.- ") != -1 ? "-ol.- " : "-ul.- ");
          add = break2Arr[0] + add;
          spaces += break2Arr[0].length;
        }
        if((subBreak2.search("-ol.- ") != -1 || subBreak2.search("-ul.- ") != -1) && subBreak2.search(add) == -1){
          add = "    " + add;
          spaces += 4;
        }
        ta.value = sub1 + "\n" + add + sub2;
        ta.selectionEnd = end + spaces;
      }
    }
    if(e.key === "Tab"){
      e.preventDefault();
      const end = this.state.selectEnd;
      const ta = this.state.textarea;
      const val = ta.value;
      let sub1 = val.substring(0, end);
      let sub2 = val.substring(end);
      ta.value = sub1 + "  " + sub2;
    }
  }

  render(){
    return (
      <div id="mde">
        <div id="toolbar" onClick={this.handleToolbar}>
          <i className="fa fa-bold" aria-hidden="true"></i>
          <i className="fa fa-italic" aria-hidden="true"></i>
          <i className="fa fa-header" aria-hidden="true"></i>
          <i className="fa fa-list-ol" aria-hidden="true" ref="listol"></i>
          <i className="fa fa-list-ul" aria-hidden="true" ref="listul"></i>
          <i className="fa fa-link" aria-hidden="true"></i>
          <i className="fa fa-file-image-o" aria-hidden="true"></i>
        </div>
        <textarea className="editor-area" autoFocus onChange={this.onChange} onSelect={this.onSelect} onKeyDown = {this.onKeyDown} ref="textarea"/>
        <div className="show-container" ref="showcontainer">
          <ReactMarkable source={this.state.showValue} options={options}/>
        </div>
      </div>
    );
  }
}

export default MDE;