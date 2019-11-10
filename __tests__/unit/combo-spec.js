import ComboPlot from '../../src/combo-plots/basePlot';

describe('Combo plot', () => {
  const canvasDiv = document.createElement('div');
  canvasDiv.style.width = '400px';
  canvasDiv.style.height = '400px';
  canvasDiv.style.left = '30px';
  canvasDiv.style.top = '30px';
  canvasDiv.id = 'canvas1';
  document.body.appendChild(canvasDiv);

  const uvData = [
    { time: '2019-03', value: 350 },
    { time: '2019-04', value: 900 },
    { time: '2019-05', value: 300 },
    { time: '2019-06', value: 450 },
    { time: '2019-07', value: 470 },
  ];

  const billData = [
    { time: '2019-03', value: 220 },
    { time: '2019-04', value: 300 },
    { time: '2019-05', value: 220 },
    { time: '2019-06', value: 100 },
    { time: '2019-07', value: 450 },
  ];

  const transformData = [
    { time: '2019-03', value: 800 },
    { time: '2019-04', value: 600 },
    { time: '2019-05', value: 400 },
    { time: '2019-06', value: 380 },
    { time: '2019-07', value: 220 },
  ];

  it('column + bubble + line', () => {
    const combo = new ComboPlot(canvasDiv, {
      width: 400,
      height: 400,
      layers: [
        {
          type: 'column',
          data: uvData,
          xField: 'time',
          yField: 'value',
        },
        {
          type: 'bubble',
          data: billData,
          xField: 'time',
          yField: 'value',
          pointSize: 10,
        },
        {
          type: 'line',
          data: transformData,
          xField: 'time',
          yField: 'value',
        },
      ],
    });
    combo.render();
  });
});