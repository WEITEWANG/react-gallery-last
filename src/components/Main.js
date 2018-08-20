require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

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
// 定义imgFigure组件用于存放图片信息
class ImgFigure extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    console.log(this);
    return (
      <figure className="img-figure">
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
      //   {
      //   pos:{
      //     left:0,
      //     top:0
      //   },
      //   rotate:0,
      //   isInverse:false,
      //   isCenter:false
      // }
    ]
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
      imgsArrangeTopArr.forEach(val=>{
        val={
          pos:{
            left:getRangeRandom(vPosRangeX[0],vPosRangeX[1]),
            top:getRangeDomRandom(vPosRangeTopY[0],vPosRangeTopY[1])
          },
          rotate:get30DegRange(),
          isCenter:false
        }
      });
      // 布局两侧
      for(let i=0;i<imgsArrangeArr.length;i++){
        let hPosRangeLORX;
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
          rotate:get30DegRange(),
          isCenter:false
        }
      }
      // 填充上侧区域
      if(imgsArrageTopArr && imgsArrangeTopArr[0]){
        imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
      }
      // 田中中心位置区域图片位置信息
      imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0])
      // 更新状态信息
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });
    }
      
  render() {
    let imgFigures=[],controllerUnits=[];
    imgsData.forEach((val,index)=>{
      imgFigures.push(<ImgFigure key={index} data={val}/>);
    });
    return (
      <section className="stage">
        <section className="img-sec">{imgFigures}</section>
        <nav className="controller-units">{controllerUnits}</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
