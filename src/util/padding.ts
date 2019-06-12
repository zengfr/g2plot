import { View } from '@antv/g2';
import { Element, BBox } from '@antv/g';
import * as _ from '@antv/util';

interface DataPointType {
  [ k: string ]: any;
}

const DEFAULT_PADDING = [ 20, 20, 20, 20 ];

export default function getAutoPadding(view: View, components) {
  const viewRange = view.get('viewRange');
  const { width, height, minX, maxX, minY, maxY } = viewRange;
  /*const width = view.get('width');
  const height = view.get('height');
  const width = viewRange.width;
  const height = viewRange.height;*/
    /** 参与auto padding的components: axis annotation legend*/
  const components_bbox = [ view.get('panelRange') ];
  getAxis(view, components_bbox);
  let box = mergeBBox(components_bbox);
  getLegend(view, components_bbox, box);
  /**参与auto padding的自定义组件 */
  _.each(components, (obj) => {
    const component = obj as Element;
    const bbox = component.getBBox();
    components_bbox.push(bbox);
  });
  box = mergeBBox(components_bbox);
  const padding = [
    0 - (box.minY - minY) + DEFAULT_PADDING[0], // 上面超出的部分
    box.maxX - maxX + DEFAULT_PADDING[1], // 右边超出的部分
    box.maxY - maxY + DEFAULT_PADDING[2], // 下边超出的部分
    0 - box.minX + DEFAULT_PADDING[3],
  ];
  return padding;
}

function getAxis(view, bboxes) {
  const axes = view.get('axisController').axes;
  if (axes.length > 0) {
    _.each(axes, (a) => {
      const axis = a as DataPointType;
      const bbox = axis.get('group').getBBox();
      bboxes.push(bbox);
    });
  }
}

function getLegend(view, bboxes, box) {
  const legends = view.get('legendController').legends;
  if (legends.length > 0) {
    _.each(legends, (l) => {
      const  legend = l as DataPointType;
      adjustLegend(legend, view, box);
      const legendBBox = legend.get('container').getBBox();
      const legendMatrix = legend.get('container').attr('matrix');
      const left = legendMatrix[6];
      const top = legendMatrix[7];
      const bbox = new BBox(left, top, legendBBox.width, legendBBox.height);
      bboxes.push(bbox);
    });
  }
}

function mergeBBox(bboxes) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = - Infinity;
  _.each(bboxes, (bbox) => {
    const box = bbox as DataPointType;
    minX = Math.min(box.minX, minX);
    maxX = Math.max(box.maxX, maxX);
    minY = Math.min(box.minY, minY);
    maxY = Math.max(box.maxY, maxY);
  });
  /*if (Math.abs(minX) > width / 2) minX = 0;
  if (Math.abs(maxX) < width / 2) maxX = width;
  if (Math.abs(minY) > height / 2) minY = 0;
  if (Math.abs(maxY) < height / 2) maxY = height;*/
  return { minX, maxX, minY, maxY };
}

function adjustLegend(legend, view, box) {
  const position = legend.get('position').split('-');
  const container = legend.get('container');
  const bbox = container.getBBox();
  const { width, height, maxX, minX, maxY, minY } = view.get('viewRange');
  if (position[0] === 'right') container.move(width, minY);
  if (position[0] === 'left') container.move(box.minX - bbox.width, minY);
  if (position[0] === 'top') container.move(0, box.minY - bbox.height);
  if (position[0] === 'bottom') container.move(0, maxY);
}