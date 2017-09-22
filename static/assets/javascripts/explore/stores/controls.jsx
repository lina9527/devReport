import React from 'react';
import { formatSelectOptionsForRange, formatSelectOptions } from '../../modules/utils';
import * as v from '../validators';
import { ALL_COLOR_SCHEMES, spectrums } from '../../modules/colors';
import MetricOption from '../../components/MetricOption';
import ColumnOption from '../../components/ColumnOption';

const D3_FORMAT_DOCS = 'D3 format syntax: https://github.com/d3/d3-format';

// input choices & options
const D3_FORMAT_OPTIONS = [
  ['.3s', '.3s | 12.3k'],
  ['.3%', '.3% | 1234543.210%'],
  ['.4r', '.4r | 12350'],
  ['.3f', '.3f | 12345.432'],
  ['+,', '+, | +12,345.4321'],
  ['$,.2f', '$,.2f | $12,345.43'],
];

const ROW_LIMIT_OPTIONS = [10, 50, 100, 250, 500, 1000, 5000, 10000, 50000];

const SERIES_LIMITS = [0, 5, 10, 25, 50, 100, 500];

export const D3_TIME_FORMAT_OPTIONS = [
  ['smart_date', 'Adaptative formating'],
  ['%m/%d/%Y', '%m/%d/%Y | 01/14/2019'],
  ['%Y-%m-%d', '%Y-%m-%d | 2019-01-14'],
  ['%Y-%m-%d %H:%M:%S', '%Y-%m-%d %H:%M:%S | 2019-01-14 01:32:10'],
  ['%H:%M:%S', '%H:%M:%S | 01:32:10'],
];

const timeColumnOption = {
  verbose_name: 'Time',
  column_name: '__timestamp',
  description: (
    'A reference to the [Time] configuration, taking granularity into ' +
    'account'),
};

const groupByControl = {
  type: 'SelectControl',
  multi: true,
  label: '分组',
  default: [],
  includeTime: false,
  description: '一个或多个控件按组分组',
  optionRenderer: c => <ColumnOption column={c} />,
  valueRenderer: c => <ColumnOption column={c} />,
  valueKey: 'column_name',
  mapStateToProps: (state, control) => {
    const newState = {};
    if (state.datasource) {
      newState.options = state.datasource.columns.filter(c => c.groupby);
      if (control && control.includeTime) {
        newState.options.push(timeColumnOption);
      }
    }
    return newState;
  },
};

export const controls = {
  datasource: {
    type: 'DatasourceControl',
    label: '数据源',
    default: null,
    description: null,
    mapStateToProps: state => ({
      datasource: state.datasource,
    }),
  },

  viz_type: {
    type: 'VizTypeControl',
    label: '图表向导',
    default: 'table',
    description: '显示的图表类型',
  },

  metrics: {
    type: 'SelectControl',
    multi: true,
    label: '序列',
    validators: [v.nonEmpty],
    valueKey: 'metric_name',
    optionRenderer: m => <MetricOption metric={m} />,
    valueRenderer: m => <MetricOption metric={m} />,
    default: c => c.options && c.options.length > 0 ? [c.options[0].metric_name] : null,
    mapStateToProps: state => ({
      options: (state.datasource) ? state.datasource.metrics : [],
    }),
    description: '显示的一个或多个指标',
  },
  y_axis_bounds: {
    type: 'BoundsControl',
    label: 'Y 轴 界限',
    renderTrigger: true,
    default: [null, null],
    description: (
      'y轴的边界。当左空时，根据数据的最小/最大值动态定义边界。'+
	  '请注意，此功能只会扩展轴范围。它不会缩小数据的范围。'
    ),
  },
  order_by_cols: {
    type: 'SelectControl',
    multi: true,
    label: '分类',
    default: [],
    description: '显示的一个或多个指标',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.order_by_choices : [],
    }),
  },

  metric: {
    type: 'SelectControl',
    label: '度量',
    clearable: false,
    description: '选择度量',
    validators: [v.nonEmpty],
    optionRenderer: m => <MetricOption metric={m} />,
    valueRenderer: m => <MetricOption metric={m} />,
    default: c => c.options && c.options.length > 0 ? c.options[0].metric_name : null,
    valueKey: 'metric_name',
    mapStateToProps: state => ({
      options: (state.datasource) ? state.datasource.metrics : [],
    }),
  },

  metric_2: {
    type: 'SelectControl',
    label: '右轴度量',
    default: null,
    validators: [v.nonEmpty],
    clearable: true,
    description: '为右轴选择一个度量',
    valueKey: 'metric_name',
    optionRenderer: m => <MetricOption metric={m} />,
    valueRenderer: m => <MetricOption metric={m} />,
    mapStateToProps: state => ({
      options: (state.datasource) ? state.datasource.metrics : [],
    }),
  },

  stacked_style: {
    type: 'SelectControl',
    label: '堆积风格',
    choices: [
      ['stack', 'stack'],
      ['stream', 'stream'],
      ['expand', 'expand'],
    ],
    default: 'stack',
    description: '',
  },

  linear_color_scheme: {
    type: 'ColorSchemeControl',
    label: '线性颜色方案',
    choices: [
      ['fire', 'fire'],
      ['blue_white_yellow', 'blue/white/yellow'],
      ['white_black', 'white/black'],
      ['black_white', 'black/white'],
    ],
    default: 'blue_white_yellow',
    description: '',
    renderTrigger: true,
    schemes: spectrums,
    isLinear: true,
  },

  normalize_across: {
    type: 'SelectControl',
    label: '规范',
    choices: [
      ['heatmap', 'heatmap'],
      ['x', 'x'],
      ['y', 'y'],
    ],
    default: 'heatmap',
    description: '颜色将根据单元格与该标准的总和之比呈现',
  },

  horizon_color_scale: {
    type: 'SelectControl',
    label: '地平线的颜色表',
    choices: [
      ['series', 'series'],
      ['overall', 'overall'],
      ['change', 'change'],
    ],
    default: 'series',
    description: '定义颜色是如何归属',
  },

  canvas_image_rendering: {
    type: 'SelectControl',
    label: '透视图',
    choices: [
      ['pixelated', 'pixelated (Sharp)'],
      ['auto', 'auto (Smooth)'],
    ],
    default: 'pixelated',
    description: '图像渲染CSS属性的画布对象，定义了浏览器如何缩放图像',
  },

  xscale_interval: {
    type: 'SelectControl',
    label: 'X 刻度间隔',
    choices: formatSelectOptionsForRange(1, 50),
    default: '1',
    description: '步带刻度之间显示X规模当数',
  },

  yscale_interval: {
    type: 'SelectControl',
    label: 'Y 刻度间隔',
    choices: formatSelectOptionsForRange(1, 50),
    default: null,
    description: '步带刻度之间显示Y规模当数',
  },

  include_time: {
    type: 'CheckboxControl',
    label: '包含时间',
    description: '是否包含时间段中定义的时间粒度',
    default: false,
  },

  bar_stacked: {
    type: 'CheckboxControl',
    label: '堆叠条',
    renderTrigger: true,
    default: false,
    description: null,
  },

  pivot_margins: {
    type: 'CheckboxControl',
    label: '显示总计',
    renderTrigger: false,
    default: true,
    description: '显示总行/列',
  },

  show_markers: {
    type: 'CheckboxControl',
    label: '显示标记',
    renderTrigger: true,
    default: false,
    description: '在直线上显示数据点作为圆标记',
  },

  show_bar_value: {
    type: 'CheckboxControl',
    label: '柱形值',
    default: false,
    renderTrigger: true,
    description: '柱形在上面显示的值',
  },

  order_bars: {
    type: 'CheckboxControl',
    label: '柱形分类',
    default: false,
    description: '按x标签排序',
  },

  combine_metric: {
    type: 'CheckboxControl',
    label: '结合指标',
    default: false,
    description: '在每个列中并排显示度量，而不是为每个度量并排显示每个列',
  },

  show_controls: {
    type: 'CheckboxControl',
    label: '附加控制',
    renderTrigger: true,
    default: false,
    description: '是否显示额外控件。额外的控制，包括像mulitbar图表堆叠或并排制作.',
  },

  reduce_x_ticks: {
    type: 'CheckboxControl',
    label: '减少X轴',
    renderTrigger: true,
    default: false,
    description: '减少要渲染的x轴刻度数.' +
    '如果TRUE，X轴不会溢出，标签可能丢失.' +
    '如果FALSE，最小宽度将应用于列，宽度可能会溢出到一个水平滚动.',
  },

  include_series: {
    type: 'CheckboxControl',
    label: '包括系列',
    renderTrigger: true,
    default: false,
    description: '包括系列名为轴',
  },

  secondary_metric: {
    type: 'SelectControl',
    label: '颜色度量',
    default: null,
    description: '一个度量使用颜色',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.metrics_combo : [],
    }),
  },
  select_country: {
    type: 'SelectControl',
    label: '国家名称',
    default: 'France',
    choices: [
      'Belgium',
      'Brazil',
      'China',
      'Egypt',
      'France',
      'Germany',
      'Italy',
      'Morocco',
      'Netherlands',
      'Russia',
      'Singapore',
      'Spain',
      'Uk',
      'Ukraine',
      'Usa',
    ].map(s => [s, s]),
    description: '显示国家名称的超集',
  },
  country_fieldtype: {
    type: 'SelectControl',
    label: '国家字段类型',
    default: 'cca2',
    choices: [
      ['name', 'Full name'],
      ['cioc', 'code International Olympic Committee (cioc)'],
      ['cca2', 'code ISO 3166-1 alpha-2 (cca2)'],
      ['cca3', 'code ISO 3166-1 alpha-3 (cca3)'],
    ],
    description: '国家代码标准超集应该会在[国家]栏找到',
  },

  groupby: groupByControl,

  columns: Object.assign({}, groupByControl, {
    label: '纵队',
    description: '一个或多个控件以列为轴心',
  }),

  all_columns: {
    type: 'SelectControl',
    multi: true,
    label: '列',
    default: [],
    description: '要显示的列',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.all_cols : [],
    }),
  },

  all_columns_x: {
    type: 'SelectControl',
    label: 'X',
    default: null,
    description: '要显示的列',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.all_cols : [],
    }),
  },

  all_columns_y: {
    type: 'SelectControl',
    label: 'Y',
    default: null,
    description: '要显示的列',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.all_cols : [],
    }),
  },

  druid_time_origin: {
    type: 'SelectControl',
    freeForm: true,
    label: '起点',
    choices: [
      ['', 'default'],
      ['now', 'now'],
    ],
    default: null,
    description: '定义大量时间起源, ' +
    '接收自然的日期如：`now`, `sunday` ,`1970-01-01`',
  },

  bottom_margin: {
    type: 'SelectControl',
    freeForm: true,
    label: '底部边距',
    choices: formatSelectOptions(['auto', 50, 75, 100, 125, 150, 200]),
    default: 'auto',
    renderTrigger: true,
    description: '底部边距，以像素为单位，为轴标签提供更多空间',
  },

  left_margin: {
    type: 'SelectControl',
    freeForm: true,
    label: '左边距',
    choices: formatSelectOptions(['auto', 50, 75, 100, 125, 150, 200]),
    default: 'auto',
    renderTrigger: true,
    description: '左边距，以像素为单位，为轴标签提供更多空间',
  },

  granularity: {
    type: 'SelectControl',
    freeForm: true,
    label: '时间粒度',
    default: 'one day',
    choices: formatSelectOptions([
      'all',
      '5 seconds',
      '30 seconds',
      '1 minute',
      '5 minutes',
      '1 hour',
      '6 hour',
      '1 day',
      '7 days',
      'week',
      'week_starting_sunday',
      'week_ending_saturday',
      'month',
    ]),
    description: '可视化时间粒度，你可以使用的自然语言如： `10 seconds`, ' +
    '`1 day` , `56 weeks`',
  },

  domain_granularity: {
    type: 'SelectControl',
    label: '域',
    default: 'month',
    choices: formatSelectOptions(['hour', 'day', 'week', 'month', 'year']),
    description: '块分组领域的时间单位',
  },

  subdomain_granularity: {
    type: 'SelectControl',
    label: '子域',
    default: 'day',
    choices: formatSelectOptions(['min', 'hour', 'day', 'week', 'month']),
    description: '每个块的时间单位. 应该是比主粒度更小的单元，应大于或等于时间',
  },

  link_length: {
    type: 'SelectControl',
    freeForm: true,
    label: '链接长度',
    default: '200',
    choices: formatSelectOptions(['10', '25', '50', '75', '100', '150', '200', '250']),
    description: '力量布局中的链接长度',
  },

  charge: {
    type: 'SelectControl',
    freeForm: true,
    label: '电荷',
    default: '-500',
    choices: formatSelectOptions([
      '-50',
      '-75',
      '-100',
      '-150',
      '-200',
      '-250',
      '-500',
      '-1000',
      '-2500',
      '-5000',
    ]),
    description: '力布局中的电荷',
  },

  granularity_sqla: {
    type: 'SelectControl',
    label: '时间列',
    default: control =>
      control.choices && control.choices.length > 0 ? control.choices[0][0] : null,
    description: '可视化的时间列。'+
				'注意，你可以定义任意表达式返回datetime列或表。'+
				'还要注意，下面的筛选器适用于此列或表达式',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.granularity_sqla : [],
    }),
  },

  time_grain_sqla: {
    type: 'SelectControl',
    label: '时间颗粒',
    default: control => control.choices && control.choices.length ? control.choices[0][0] : null,
    description: '可视化的时间粒度。'+
				'这将应用一个日期转换来更改您的时间列，并定义一个新的时间粒度。'+
				'这里的选项是在超级集中的源代码中基于每个数据库引擎的基础上定义的。',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.time_grain_sqla : null,
    }),
  },

  resample_rule: {
    type: 'SelectControl',
    freeForm: true,
    label: '重复取样规则',
    default: null,
    choices: formatSelectOptions(['', '1T', '1H', '1D', '7D', '1M', '1AS']),
    description: 'Pandas 重复取样规则',
  },

  resample_how: {
    type: 'SelectControl',
    freeForm: true,
    label: '重复取样方式',
    default: null,
    choices: formatSelectOptions(['', 'mean', 'sum', 'median']),
    description: 'Pandas 重复取样方式',
  },

  resample_fillmethod: {
    type: 'SelectControl',
    freeForm: true,
    label: '重复取样填充方法',
    default: null,
    choices: formatSelectOptions(['', 'ffill', 'bfill']),
    description: 'Pandas 重复取样填充方法',
  },

  since: {
    type: 'SelectControl',
    freeForm: true,
    label: '开始',
    default: '7 days ago',
    choices: formatSelectOptions([
      '1 hour ago',
      '12 hours ago',
      '1 day ago',
      '7 days ago',
      '28 days ago',
      '90 days ago',
      '1 year ago',
      '100 year ago',
    ]),
    description: '时间根据过滤器. 这支持自由格式如：`1 day ago`, `28 days` , `3 years`',
  },

  until: {
    type: 'SelectControl',
    freeForm: true,
    label: '结束',
    default: 'now',
    choices: formatSelectOptions([
      'now',
      '1 day ago',
      '7 days ago',
      '28 days ago',
      '90 days ago',
      '1 year ago',
    ]),
  },

  max_bubble_size: {
    type: 'SelectControl',
    freeForm: true,
    label: '最大气泡大小',
    default: '25',
    choices: formatSelectOptions(['5', '10', '15', '25', '50', '75', '100']),
  },

  whisker_options: {
    type: 'SelectControl',
    freeForm: true,
    label: 'Whisker/异常选择',
    default: 'Tukey',
    description: '决定Whisker和异常值是如何计算的。',
    choices: formatSelectOptions([
      'Tukey',
      'Min/max (no outliers)',
      '2/98 percentiles',
      '9/91 percentiles',
    ]),
  },

  treemap_ratio: {
    type: 'TextControl',
    label: '比例',
    isFloat: true,
    default: 0.5 * (1 + Math.sqrt(5)),  // d3 default, golden ratio
    description: 'Target aspect ratio for treemap tiles.',
  },

  number_format: {
    type: 'SelectControl',
    freeForm: true,
    label: '数字格式',
    renderTrigger: true,
    default: '.3s',
    choices: D3_FORMAT_OPTIONS,
    description: D3_FORMAT_DOCS,
  },

  row_limit: {
    type: 'SelectControl',
    freeForm: true,
    label: '行限制',
    default: null,
    choices: formatSelectOptions(ROW_LIMIT_OPTIONS),
  },

  limit: {
    type: 'SelectControl',
    freeForm: true,
    label: '列的极限',
    choices: formatSelectOptions(SERIES_LIMITS),
    default: 50,
    description: '限制显示的时间序列的数目',
  },

  timeseries_limit_metric: {
    type: 'SelectControl',
    label: '排序',
    default: null,
    description: '规定使用列的顶级序列',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.metrics_combo : [],
    }),
  },

  rolling_type: {
    type: 'SelectControl',
    label: '波动的',
    default: 'None',
    choices: formatSelectOptions(['None', 'mean', 'sum', 'std', 'cumsum']),
    description: '定义要应用的滚动窗口函数，与[周期]文本框一起工作',
  },

  rolling_periods: {
    type: 'TextControl',
    label: '时期',
    isInt: true,
    description: '定义滚动窗口函数的大小，与选定的时间粒度相关',
  },

  series: {
    type: 'SelectControl',
    label: '系列',
    default: null,
    description: '定义实体的分组。'+
			'每个系列在图表上显示为一个特定的颜色，并且有一个图例切换。',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.gb_cols : [],
    }),
  },

  entity: {
    type: 'SelectControl',
    label: '实体',
    default: null,
    validators: [v.nonEmpty],
    description: '定义要在图表上绘制的元素',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.gb_cols : [],
    }),
  },

  x: {
    type: 'SelectControl',
    label: 'X 轴',
    description: '分配给x轴的度量',
    default: null,
    validators: [v.nonEmpty],
    optionRenderer: m => <MetricOption metric={m} />,
    valueRenderer: m => <MetricOption metric={m} />,
    valueKey: 'metric_name',
    mapStateToProps: state => ({
      options: (state.datasource) ? state.datasource.metrics : [],
    }),
  },

  y: {
    type: 'SelectControl',
    label: 'Y 轴',
    default: null,
    validators: [v.nonEmpty],
    description: '分配给Y轴的度量',
    optionRenderer: m => <MetricOption metric={m} />,
    valueRenderer: m => <MetricOption metric={m} />,
    valueKey: 'metric_name',
    mapStateToProps: state => ({
      options: (state.datasource) ? state.datasource.metrics : [],
    }),
  },

  size: {
    type: 'SelectControl',
    label: '气泡的大小',
    default: null,
    validators: [v.nonEmpty],
    optionRenderer: m => <MetricOption metric={m} />,
    valueRenderer: m => <MetricOption metric={m} />,
    valueKey: 'metric_name',
    mapStateToProps: state => ({
      options: (state.datasource) ? state.datasource.metrics : [],
    }),
  },

  url: {
    type: 'TextControl',
    label: 'URL',
    description: 'The URL, this control is templated, so you can integrate ' +
    '{{ width }} and/or {{ height }} in your URL string.',
    default: 'https://www.youtube.com/embed/AdSZJzb-aX8',
  },

  x_axis_label: {
    type: 'TextControl',
    label: 'X 轴标签',
    renderTrigger: true,
    default: '',
  },

  y_axis_label: {
    type: 'TextControl',
    label: 'Y 轴标签',
    renderTrigger: true,
    default: '',
  },

  where: {
    type: 'TextControl',
    label: '自定义的WHERE子句',
    default: '',
    description: '此框中的文本包含在查询的WHERE子句中，作为一个和其他标准。'+
				'可以包含复杂表达式、括号和后端支持的任何其他内容',
  },

  having: {
    type: 'TextControl',
    label: '自定义HAVING子句',
    default: '',
    description: '此框中的文本包含在查询的HAVING子句中，作为一个和其他标准。'+
				'可以包含复杂表达式、括号和后端支持的任何其他内容',
  },

  compare_lag: {
    type: 'TextControl',
    label: '比较落后时期',
    isInt: true,
    description: '基于粒度，要比较的时间段数',
  },

  compare_suffix: {
    type: 'TextControl',
    label: '比较后缀',
    description: '应用百分比显示后的后缀',
  },

  table_timestamp_format: {
    type: 'SelectControl',
    freeForm: true,
    label: '表格式的时间戳',
    default: '%Y-%m-%d %H:%M:%S',
    validators: [v.nonEmpty],
    clearable: false,
    choices: D3_TIME_FORMAT_OPTIONS,
    description: '时间戳格式',
  },

  series_height: {
    type: 'SelectControl',
    freeForm: true,
    label: '系列高度',
    default: '25',
    choices: formatSelectOptions(['10', '25', '40', '50', '75', '100', '150', '200']),
    description: '各系列像素高度',
  },

  page_length: {
    type: 'SelectControl',
    freeForm: true,
    label: '页面长度',
    default: 0,
    choices: formatSelectOptions([0, 10, 25, 40, 50, 75, 100, 150, 200]),
    description: '每页上的行数，0表示没有分页',
  },

  x_axis_format: {
    type: 'SelectControl',
    freeForm: true,
    label: 'X 轴格式',
    renderTrigger: true,
    default: '.3s',
    choices: D3_FORMAT_OPTIONS,
    description: D3_FORMAT_DOCS,
  },

  x_axis_time_format: {
    type: 'SelectControl',
    freeForm: true,
    label: 'X 轴格式',
    renderTrigger: true,
    default: 'smart_date',
    choices: D3_TIME_FORMAT_OPTIONS,
    description: D3_FORMAT_DOCS,
  },

  y_axis_format: {
    type: 'SelectControl',
    freeForm: true,
    label: 'Y 轴格式',
    renderTrigger: true,
    default: '.3s',
    choices: D3_FORMAT_OPTIONS,
    description: D3_FORMAT_DOCS,
  },

  y_axis_2_format: {
    type: 'SelectControl',
    freeForm: true,
    label: '右轴格式',
    default: '.3s',
    choices: D3_FORMAT_OPTIONS,
    description: D3_FORMAT_DOCS,
  },

  markup_type: {
    type: 'SelectControl',
    label: '标记类型',
    clearable: false,
    choices: formatSelectOptions(['markdown', 'html']),
    default: 'markdown',
    validators: [v.nonEmpty],
    description: '选择您喜欢的标记语言',
  },

  rotation: {
    type: 'SelectControl',
    label: '旋转',
    choices: formatSelectOptions(['random', 'flat', 'square']),
    default: 'random',
    description: '应用于云词的旋转',
  },

  line_interpolation: {
    type: 'SelectControl',
    label: '线形样式',
    renderTrigger: true,
    choices: formatSelectOptions(['linear', 'basis', 'cardinal',
      'monotone', 'step-before', 'step-after']),
    default: 'linear',
    description: '定义的行值于d3.js',
  },

  pie_label_type: {
    type: 'SelectControl',
    label: '标记类型',
    default: 'key',
    choices: [
      ['key', 'Category Name'],
      ['value', 'Value'],
      ['percent', 'Percentage'],
    ],
    description: '标签上应该显示什么？',
  },

  code: {
    type: 'TextAreaControl',
    label: '代码',
    description: '把你的代码放在这里',
    mapStateToProps: state => ({
      language: state.controls && state.controls.markup_type ? state.controls.markup_type.value : 'markdown',
    }),
    default: '',
  },

  pandas_aggfunc: {
    type: 'SelectControl',
    label: '聚合函数',
    clearable: false,
    choices: formatSelectOptions([
      'sum',
      'mean',
      'min',
      'max',
      'median',
      'stdev',
      'var',
    ]),
    default: 'sum',
    description: '计算总行和列时应用聚合函数',
  },

  size_from: {
    type: 'TextControl',
    isInt: true,
    label: '最小值字体大小',
    default: '20',
    description: '列表中最小值的字体大小',
  },

  size_to: {
    type: 'TextControl',
    isInt: true,
    label: '最大值字体大小',
    default: '150',
    description: '列表中最大值的字体大小',
  },

  instant_filtering: {
    type: 'CheckboxControl',
    label: '即时过滤',
    renderTrigger: true,
    default: true,
    description: (
      '是否在更改时应用筛选器，或等待用户单击“Apply”按钮。'
    ),
  },

  show_brush: {
    type: 'CheckboxControl',
    label: '范围过滤器',
    renderTrigger: true,
    default: false,
    description: '是否显示时间范围交互选择器',
  },

  date_filter: {
    type: 'CheckboxControl',
    label: '日期过滤器',
    default: false,
    description: '是否包含时间过滤器',
  },

  show_datatable: {
    type: 'CheckboxControl',
    label: '数据表',
    default: false,
    description: '是否显示交互数据表',
  },

  include_search: {
    type: 'CheckboxControl',
    label: '搜索框',
    renderTrigger: true,
    default: false,
    description: '是否包含客户端搜索框',
  },

  table_filter: {
    type: 'CheckboxControl',
    label: '表过滤器',
    default: false,
    description: '是否应用表单元格筛选器',
  },

  show_bubbles: {
    type: 'CheckboxControl',
    label: '显示气泡',
    default: false,
    renderTrigger: true,
    description: '是否在国家顶部显示气泡',
  },

  show_legend: {
    type: 'CheckboxControl',
    label: '图列',
    renderTrigger: true,
    default: true,
    description: '是否显示图例（切换）',
  },

  x_axis_showminmax: {
    type: 'CheckboxControl',
    label: 'X 界限',
    renderTrigger: true,
    default: true,
    description: '是否显示X轴的最小值和最大值',
  },

  y_axis_showminmax: {
    type: 'CheckboxControl',
    label: 'Y 界限',
    renderTrigger: true,
    default: true,
    description: '是否显示Y轴的最小值和最大值',
  },

  rich_tooltip: {
    type: 'CheckboxControl',
    label: '丰富的工具提示',
    renderTrigger: true,
    default: true,
    description: '丰富的工具提示显示了所有时间序列的列表',
  },

  y_log_scale: {
    type: 'CheckboxControl',
    label: 'Y 图列规模',
    default: false,
    renderTrigger: true,
    description: '使用Y轴的刻度规模',
  },

  x_log_scale: {
    type: 'CheckboxControl',
    label: 'X 图列规模',
    default: false,
    renderTrigger: true,
    description: '使用X轴的刻度规模',
  },

  donut: {
    type: 'CheckboxControl',
    label: '圆环图',
    default: false,
    renderTrigger: true,
    description: '你要圆环图还是饼图？',
  },

  labels_outside: {
    type: 'CheckboxControl',
    label: 'Put 标签外',
    default: true,
    renderTrigger: true,
    description: '把标签放在圆图外面？',
  },

  contribution: {
    type: 'CheckboxControl',
    label: '贡献',
    default: false,
    description: '计算总的贡献',
  },

  num_period_compare: {
    type: 'TextControl',
    label: '周期比',
    default: '',
    isInt: true,
    description: '[整数]要比较的周期数，这与选定的粒度相关',
  },

  period_ratio_type: {
    type: 'SelectControl',
    label: '时间比例式',
    default: 'growth',
    choices: formatSelectOptions(['factor', 'growth', 'value']),
    description: '`factor` means (new/previous), `growth` is ' +
    '((new/previous) - 1), `value` is (new-previous)',
  },

  time_compare: {
    type: 'TextControl',
    label: '时间移位',
    default: null,
    description: 'Overlay a timeseries from a ' +
    'relative time period. Expects relative time delta ' +
    'in natural language (example:  24 hours, 7 days, ' +
    '56 weeks, 365 days)',
  },

  subheader: {
    type: 'TextControl',
    label: '子标题',
    description: '你的大数字下是否显示文本',
  },

  mapbox_label: {
    type: 'SelectControl',
    multi: true,
    label: '标签',
    default: [],
    description: '`如果使用一个组，则计数是计数（*）.' +
    '数值列将与聚合的聚合.' +
    '非数值列将用于标记点.' +
    '留空以得到每个集群中的点数.',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.all_cols : [],
    }),
  },

  mapbox_style: {
    type: 'SelectControl',
    label: '地图风格',
    choices: [
      ['mapbox://styles/mapbox/streets-v9', 'Streets'],
      ['mapbox://styles/mapbox/dark-v9', 'Dark'],
      ['mapbox://styles/mapbox/light-v9', 'Light'],
      ['mapbox://styles/mapbox/satellite-streets-v9', 'Satellite Streets'],
      ['mapbox://styles/mapbox/satellite-v9', 'Satellite'],
      ['mapbox://styles/mapbox/outdoors-v9', 'Outdoors'],
    ],
    default: 'mapbox://styles/mapbox/streets-v9',
    description: '基本图层样式',
  },

  clustering_radius: {
    type: 'SelectControl',
    freeForm: true,
    label: '聚类半径',
    default: '60',
    choices: formatSelectOptions([
      '0',
      '20',
      '40',
      '60',
      '80',
      '100',
      '200',
      '500',
      '1000',
    ]),
    description: '半径（以像素为单位），该算法用于定义一个集群'+
				'选择0关闭集群，但要注意大量的点（> 1000）会导致延迟.',
  },

  point_radius: {
    type: 'SelectControl',
    label: '点半径',
    default: 'Auto',
    description: '点半径，要么是一个数值列，要么是“自动”，它根据最大的簇对点进行缩放',
    mapStateToProps: state => ({
      choices: [].concat([['Auto', 'Auto']], state.datasource.all_cols),
    }),
  },

  point_radius_unit: {
    type: 'SelectControl',
    label: '点半径的单位',
    default: 'Pixels',
    choices: formatSelectOptions(['Pixels', 'Miles', 'Kilometers']),
    description: '指定点半径的度量单位',
  },

  global_opacity: {
    type: 'TextControl',
    label: '不透明度',
    default: 1,
    isFloat: true,
    description: '所有集群、点和标签的不透明性。0到1之间。',
  },

  viewport_zoom: {
    type: 'TextControl',
    label: '变焦',
    isFloat: true,
    default: 11,
    description: '地图的变焦级别',
    places: 8,
  },

  viewport_latitude: {
    type: 'TextControl',
    label: '默认的纬度',
    default: 37.772123,
    isFloat: true,
    description: '默认视口纬度',
    places: 8,
  },

  viewport_longitude: {
    type: 'TextControl',
    label: '默认的经度',
    default: -122.405293,
    isFloat: true,
    description: '默认视口经度',
    places: 8,
  },

  render_while_dragging: {
    type: 'CheckboxControl',
    label: '生活渲染',
    default: true,
    description: '当视点被改变时，点和簇将更新',
  },

  mapbox_color: {
    type: 'SelectControl',
    freeForm: true,
    label: 'RGB颜色',
    default: 'rgb(0, 122, 135)',
    choices: [
      ['rgb(0, 139, 139)', 'Dark Cyan'],
      ['rgb(128, 0, 128)', 'Purple'],
      ['rgb(255, 215, 0)', 'Gold'],
      ['rgb(69, 69, 69)', 'Dim Gray'],
      ['rgb(220, 20, 60)', 'Crimson'],
      ['rgb(34, 139, 34)', 'Forest Green'],
    ],
    description: 'RGB中的点和簇的颜色',
  },

  ranges: {
    type: 'TextControl',
    label: '范围',
    default: '',
    description: '用阴影突出显示的范围',
  },

  range_labels: {
    type: 'TextControl',
    label: '范围标签',
    default: '',
    description: '类标签',
  },

  markers: {
    type: 'TextControl',
    label: '标记',
    default: '',
    description: '用三角形标记的值列表',
  },

  marker_labels: {
    type: 'TextControl',
    label: '标记标签',
    default: '',
    description: '标记的标签',
  },

  marker_lines: {
    type: 'TextControl',
    label: '标记线',
    default: '',
    description: '用线标记的值列表',
  },

  marker_line_labels: {
    type: 'TextControl',
    label: '标记线标签',
    default: '',
    description: '标记线的标签',
  },

  filters: {
    type: 'FilterControl',
    label: '',
    default: [],
    description: '',
    mapStateToProps: state => ({
      datasource: state.datasource,
    }),
  },

  having_filters: {
    type: 'FilterControl',
    label: '',
    default: [],
    description: '',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.metrics_combo
        .concat(state.datasource.filterable_cols) : [],
      datasource: state.datasource,
    }),
  },

  slice_id: {
    type: 'HiddenControl',
    label: '图表ID',
    hidden: true,
    description: '活动图表的ID',
  },

  cache_timeout: {
    type: 'HiddenControl',
    label: '缓存超时（秒）',
    hidden: true,
    description: '在到期缓存之前的秒数。',
  },

  order_by_entity: {
    type: 'CheckboxControl',
    label: '按实体ID排序',
    description: '重要！如果表没有按实体id排序，则选择此选项，否则不能保证每个实体的所有事件都返回。',
    default: true,
  },

  min_leaf_node_event_count: {
    type: 'SelectControl',
    freeForm: false,
    label: '最小页节点事件计数',
    default: 1,
    choices: formatSelectOptionsForRange(1, 10),
    description: '表示少于这一数量事件的叶节点将最初隐藏在可视化中。',
  },

  color_scheme: {
    type: 'ColorSchemeControl',
    label: '配色方案',
    default: 'bnbColors',
    renderTrigger: true,
    choices: Object.keys(ALL_COLOR_SCHEMES).map(s => ([s, s])),
    description: '绘制图表的颜色方案',
    schemes: ALL_COLOR_SCHEMES,
  },
};
export default controls;
