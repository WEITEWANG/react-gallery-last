require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
// 将json转换为可以识别出的图片
let imgsData=require('../data/imgData.json');
// console.log(imgsData);
// 遍历imgsData数据
function imgFigure(imgsArray){
  imgsArray.forEach(val => {
    let imgSingleData=val;
    imgSingleData.imgURL=require('../images/'+val.fileName);
  });
  return imgsArray;
}
imgsData=imgFigure(imgsData);
// 获取随机数用于改变图片的随机位置
var getRangeRandom=(low,high)=>Math.floor(Math.random()*(high-low)+low);
// 图片倾斜的角度(+-30度之间)
var get30DegRandom=()=>{
  return ((Math.random()>0.5?'':'-')+Math.floor(Math.random()*30)+'deg');
}
// 定义imgFigure组件用于存放图片信息
class ImgFigure extends React.Component{
  constructor(props){
    super(props);
    this.handleClick=this.handleClick.bind(this);
  }
  // 添加点击事件
  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }
  render(){
    // console.log(this);
    let styleObj={};
    if(this.props.arrange.pos){
      styleObj=this.props.arrange.pos;
    }
    if(this.props.arrange.isCenter){
        styleObj.zIndex='111';
    }
    if(this.props.arrange.rotate){
      (['MozTransform','MsTransform','WebkitTransform','transform']).forEach(val=>{
        styleObj[val]='rotate('+this.props.arrange.rotate+')';
      });
    }
    let imgFigureName='img-figure';
    imgFigureName+=this.props.arrange.isInverse?' is-inverse':'';
    return (
      <figure className={imgFigureName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imgURL} alt={this.props.data.desc} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back">
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
    );
  }
}
// 定义ControllerUnits组件
class ControllerUnits extends React.Component{
  constructor(props){
    super(props);
    this.handleClick=this.handleClick.bind(this);
  }
  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }
  render(){
    let controllerUnitsName='controller-unit';
    if(this.props.arrange.isCenter){
      controllerUnitsName+=' is-center';
    }
    if(this.props.arrange.isInverse){
      controllerUnitsName+=' is-inverse';
    }
    return (
      <span className={controllerUnitsName} onClick={this.handleClick}></span>
    );
  }
}
class AppComponent extends React.Component {
  constructor(props){
    super(props);
    this.Constant={
      centerPos:{
        left:0,
        top:0
      },
      // 水平方向位置信息
      hPosRange:{
        leftSecX:[0,0],
        rightSecX:[0,0],
        topY:[0,0]
      },
      // 竖直方向位置信息
      vPosRange:{
        x:[0,0],
        topY:[0,0]
      }
    }
    // state中存放图片的基本状态信息，图片位置，倾斜角度，是否居中，是否翻转，状态值会变化
    this.state={
      imgsArrangeArr:[
        {
      //   pos:{
      //     left:0,
      //     top:0
      //   },
      //   rotate:0,
      //   isInverse:false,
      //   isCenter:false
      }
    ]
    }
  }
  // 图片翻转
  inverse(index){
    return ()=>{
      let imgsArrangeArr=this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });
    }
  }
  // 居中图片
  center(index){
    return ()=>{
      this.rerrange(index);
    }
  }
//  图片居中，其余随机在水平竖直方向显示
/*@param centerIndex指定居中哪个图片 */
rerrange(centerIndex){
  // 获取imgsArrangeArr中各图片的位置信息
  let imgsArrangeArr=this.state.imgsArrangeArr,
      Constant=this.Constant,
      centerPos=Constant.centerPos,
      hPosRange=Constant.hPosRange,
      hPosRangeLeftSecX=hPosRange.leftSecX,
      hPosRangeRightSecX=hPosRange.rightSecX,
      hPosRangeTopY=hPosRange.topY,
      vPosRange=Constant.vPosRange,
      vPosRangeX=vPosRange.x,
      vPosRangeTopY=vPosRange.topY,
      // 存储图片上方对应的图片状态信息
      imgsArrangeTopArr=[],
      // 存储图片上方的图片数量(0或1)
      imgTopNum=Math.floor(Math.random()*2),
      // 标记图片是从数组图片中哪个位置取出的
      topImgSpliceIndex=0,
      // 声明数组对象存放中心图片位置信息
      imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);
      // 中心图片的位置信息
      imgsArrangeCenterArr[0]={
        pos:centerPos,
        rotate:0,
        isCenter:true
      }
      // 布局上方（垂直方向图片位置信息）
      topImgSpliceIndex=Math.floor(Math.random()*(imgsArrangeArr.length-imgTopNum));
      imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,imgTopNum);
      imgsArrangeTopArr.forEach(index=>{
        imgsArrangeTopArr[index]={
          pos:{
            left:getRangeRandom(vPosRangeX[0],vPosRangeX[1]),
            top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1])
          },
          rotate:get30DegRandom(),
          isCenter:false
        }
      });
      // 布局两侧
      for(let i=0;i<imgsArrangeArr.length;i++){
        let hPosRangeLORX=null;
        if(i<imgsArrangeArr.length/2){
          hPosRangeLORX=hPosRangeLeftSecX;
        }else{
          hPosRangeLORX=hPosRangeRightSecX;
        }
        imgsArrangeArr[i]={
          pos:{
            left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]),
            top:getRangeRandom(hPosRangeTopY[0],hPosRangeTopY[1])
          },
          rotate:get30DegRandom(),
          isCenter:false
        }
      }
      // 填充上侧区域
      if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
        imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
      }
      // 填充中心位置区域图片位置信息
      imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0])
      // 更新状态信息
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });
    }
    
    //当dom结构渲染出来之后，获取stage区域内的高度，以及图片组件的宽高
    componentDidMount(){
      let stageDOM=ReactDOM.findDOMNode(this.refs.stage),
      // 获取stage的宽高
          stageWdith=stageDOM.scrollWidth,
          stageHeight=stageDOM.scrollHeight,
          halfStageWidth=stageWdith/2,
          halfStageHeight=stageHeight/2,
          // 获取图片组件的宽高
          imgFigDOM=ReactDOM.findDOMNode(this.refs.imgFigure0),
          // 获取图片组件的宽高
          imgFigWidth=imgFigDOM.scrollWidth,
          imgFigHeight=imgFigDOM.scrollHeight,
          halfImgFigWidth=imgFigWidth/2,
          halfImgHeight=imgFigHeight/2;
          //中心图片位置坐标
          this.Constant.centerPos={
            left:halfStageWidth-halfImgFigWidth,
            top:halfStageHeight-halfImgHeight
          }
          // 两侧图片位置
          this.Constant.hPosRange.leftSecX[0]=-halfImgFigWidth;
          this.Constant.hPosRange.leftSecX[1]=halfStageWidth-halfImgFigWidth*3;
          this.Constant.hPosRange.rightSecX[0]=halfStageWidth+halfImgFigWidth;
          this.Constant.hPosRange.rightSecX[1]=stageWdith-halfImgFigWidth;
          this.Constant.hPosRange.topY[0]=-halfImgHeight;
          this.Constant.hPosRange.topY[1]=stageHeight-halfImgHeight;
          // 计算上侧图片排布的取值范围
          this.Constant.vPosRange.x[0]=halfStageWidth-imgFigWidth;
          this.Constant.vPosRange.x[1]=halfImgFigWidth;
          this.Constant.vPosRange.topY[0]=-halfImgHeight;
          this.Constant.vPosRange.topY[1]=halfStageHeight-halfImgHeight*3;
          this.rerrange(0);
    }
  render() {
    let imgFigures=[],controllerUnits=[];
    imgsData.forEach((val,index)=>{
      // console.log(index);
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index]={
          pos:{
            left:0,
            top:0
          },
          rotate:0,
          isCenter:false,
          isInverse:false
        }
      }
      imgFigures.push(<ImgFigure key={index} data={val} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} inverse={this.inverse(index)}/>);
      controllerUnits.push(<ControllerUnits key={index} arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} inverse={this.inverse(index)}/>);
    });
 
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">{imgFigures}</section>
        <nav className="controller-units">{controllerUnits}</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
