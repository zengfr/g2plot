import { Legend } from '@antv/component';
import * as _ from '@antv/util';
import ViewLayer,{ViewLayerConfig} from '../../base/view-layer';

export function getLegendData(viewLayer: ViewLayer,props){
    const legendItems = [];
    const view = viewLayer.view;
    const geometry = view.get('elements')[0];
    const colorAttr = geometry.getAttr('color'); // color和shape决定cat legend的生成，暂时先不考虑shape 
    const markerCfg:any  = {
        isInCircle: geometry.isInCircle(),
        color:colorAttr.values[0]
      }; 
    const marker = geometry.get('shapeFactory').getMarkerStyle(geometry.get('type'),markerCfg);
    /** 处理default不生成图例的场景 */
    if(colorAttr.scales.length === 0){
        legendItems.push({
            value:props.name,
            checked: true,
            marker
        });
    }
    /** 正常生成图例 */

    return legendItems;
}

export function mergeLegendData(items){
    return items;
}

export function createLegend(items,container,width,canvas){
    const legendCfg = {
        type:'category-legend',
        items,
        maxSize: width,
        container:canvas,
        group:container,
        textStyle: {
            fill: '#8C8C8C',
            fontSize: 12,
            textAlign: 'start',
            textBaseline: 'middle',
            lineHeight: 20,
        },  // 图例项目文本样式
        titleDistance: 10,// 标题和图例项的间距
        autoWrap: true, // 图例项是否自动换行
        itemWidth: 50, // 图例项目宽度
        wordSpacing:10, // 图例项文本同 marker 之间的间距
        itemMarginBottom: 0, // 图例项之间的底部间距
        backgroundPadding: 0,// 背景内边距
        maxLength: width// 图例的最大高度或者宽度
    };
    const legend = new Legend.CanvasCategory(legendCfg);
    legend.draw();
}