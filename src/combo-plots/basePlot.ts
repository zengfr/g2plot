import * as _ from '@antv/util';
import { getPlotType } from '../base/global';
import Layer from '../base/layer';
import Plot, { PlotConfig } from '../base/plot';
import ViewLayer from '../base/view-layer';
import '../index';

export interface ComboPlotConfig extends PlotConfig {
    layers: ViewLayer[]
}

export default class ComboPlot<T extends ComboPlotConfig = ComboPlotConfig> extends Plot<T> {

    protected isOverlapped: boolean;
    protected topLayer: Layer;
    protected backLayer: Layer;

    protected createLayers(props: T & { layers?: any }) {
        this.isOverlapped = this.detectOverlapping(props.layers);
        const overlapConfig = this.isOverlapped ? this.getOverlappedConfig() : {};
        if(this.isOverlapped){
            /** add top layer for legend & tooltip */
            this.topLayer = new Layer({
                canvas: this.getCanvas(),
                width: this.width,
                height: this.height
            });
        }

        if(props.layers.length>0){
            /** create layers */
            _.each(props.layers,(layerCfg)=>{
                const viewLayerCtr = getPlotType(layerCfg.type);
                const viewLayerProps: T = _.deepMix({}, layerCfg, {
                    canvas: this.getCanvas(),
                    x: layerCfg.x ? layerCfg.x : 0,
                    y: layerCfg.y ? layerCfg.y : 0,
                    width: layerCfg.width ? layerCfg.width : this.width,
                    height: layerCfg.height ? layerCfg.height : this.height,
                },overlapConfig);
                const viewLayer = new viewLayerCtr(viewLayerProps);
                this.addLayer(viewLayer);
            });
        }

        if(this.isOverlapped){
            /** add back layer for axis */
            this.backLayer = new Layer({
                canvas: this.getCanvas(),
                width: this.width,
                height: this.height
            });
        }
        
    }

    /** 判断图层是否叠加 */
    protected detectOverlapping(layers){
        /** 图层叠加的判定条件：
         *  layers没有设位置和宽高
         *  layers位置或宽高一致
         */
        let isOverlapped = true;
        let x = null;
        let y = null;
        let width = null;
        let height = null;

        _.each(layers,(layer)=>{
            if(_.has(layer,'x') && layer.x !== x){
                isOverlapped = false;
            }
            x = layer.x;
            if(_.has(layer,'y') && layer.y !== y){
                isOverlapped = false;
            }
            y = layer.y;
            if(_.has(layer,'width') && layer.width !== width){
                isOverlapped = false;
            }
            width = layer.width;
            if(_.has(layer,'height') && layer.height !== height){
                isOverlapped = false;
            }
            height = layer.height;
        });
        return isOverlapped;
    }


    /** 图层叠加时的layer config */
    protected getOverlappedConfig(){
        return {
            xAxis:{
                visible: false
            },
            yAxis:{
                visible: false
            }
        }
    }


}