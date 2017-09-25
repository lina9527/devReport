import { D3_TIME_FORMAT_OPTIONS } from './controls';
import * as v from '../validators';

export const sections = {
  druidTimeSeries: {
    label: '时间',
    expanded: true,
    description: '表单时间相关属性',
    controlSetRows: [
      ['granularity', 'druid_time_origin'],
      ['since', 'until'],
    ],
  },
  datasourceAndVizType: {
    label: '数据源 & 图表类型',
    expanded: true,
    controlSetRows: [
      ['datasource'],
      ['viz_type'],
      ['slice_id', 'cache_timeout'],
    ],
  },
  colorScheme: {
    label: '色彩搭配',
    controlSetRows: [
      ['color_scheme'],
    ],
  },
  sqlaTimeSeries: {
    label: '时间',
    description: '表单时间相关属性',
    expanded: true,
    controlSetRows: [
      ['granularity_sqla', 'time_grain_sqla'],
      ['since', 'until'],
    ],
  },
  sqlClause: {
    label: 'SQL',
    controlSetRows: [
      ['where'],
      ['having'],
    ],
    description: '这部分包含你需要SQL条件',
  },
  NVD3TimeSeries: [
    {
      label: '查询',
      expanded: true,
      controlSetRows: [
        ['metrics'],
        ['groupby'],
        ['limit', 'timeseries_limit_metric'],
      ],
    },
    {
      label: '高级分析',
      description: '本节包含允许对查询结果进行高级分析处理的选项',
      controlSetRows: [
        ['rolling_type', 'rolling_periods'],
        ['time_compare'],
        ['num_period_compare', 'period_ratio_type'],
        ['resample_how', 'resample_rule'],
        ['resample_fillmethod'],
      ],
    },
  ],
  filters: [
    {
      label: '过滤器',
      expanded: true,
      controlSetRows: [['filters']],
    },
    {
      label: '过滤器结果',
      expanded: true,
      description: '在聚合后应用的筛选器,将值控制留空，以过滤空字符串或空值',
      controlSetRows: [['having_filters']],
    },
  ],
};

export const visTypes = {
  dist_bar: {
    label: '分布式 - 柱形图',
    showOnExplore: true,
    controlPanelSections: [
      {
        label: '查询',
        controlSetRows: [
          ['metrics'],
          ['groupby'],
          ['columns'],
          ['row_limit'],
        ],
      },
      {
        label: '图形选择',
        controlSetRows: [
          ['color_scheme'],
          ['show_legend', 'show_bar_value'],
          ['bar_stacked', 'order_bars'],
          ['y_axis_format', 'bottom_margin'],
          ['x_axis_label', 'y_axis_label'],
          ['reduce_x_ticks', 'contribution'],
          ['show_controls'],
        ],
      },
    ],
    controlOverrides: {
      groupby: {
        label: '序列',
      },
      columns: {
        label: '统计分析',
        description: '定义每个序列是如何被分组',
      },
    },
  },

  pie: {
    label: '标准饼图',
    showOnExplore: true,
    controlPanelSections: [
      {
        label: '查询',
        expanded: true,
        controlSetRows: [
          ['metrics', 'groupby'],
          ['limit'],
        ],
      },
      {
        label: '图形选择',
        controlSetRows: [
          ['pie_label_type'],
          ['donut', 'show_legend'],
          ['labels_outside'],
          ['color_scheme'],
        ],
      },
    ],
  },

  line: {
    label: '时间序列 - 线形图',
    showOnExplore: true,
    requiresTime: true,
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: '图形选择',
        controlSetRows: [
          ['color_scheme'],
          ['show_brush', 'show_legend'],
          ['rich_tooltip', 'show_markers'],
          ['line_interpolation', 'contribution'],
        ],
      },
      {
        label: 'X 轴',
        controlSetRows: [
          ['x_axis_label', 'bottom_margin'],
          ['x_axis_showminmax', 'x_axis_format'],
        ],
      },
      {
        label: 'Y 轴',
        controlSetRows: [
          ['y_axis_label', 'left_margin'],
          ['y_axis_showminmax', 'y_log_scale'],
          ['y_axis_format', 'y_axis_bounds'],
        ],
      },
      sections.NVD3TimeSeries[1],
    ],
    controlOverrides: {
      x_axis_format: {
        choices: D3_TIME_FORMAT_OPTIONS,
        default: 'smart_date',
      },
    },
  },

  dual_line: {
    label: '双轴 - 线形图',
    requiresTime: true,
    controlPanelSections: [
      {
        label: '图形选择',
        controlSetRows: [
          ['color_scheme'],
          ['x_axis_format'],
        ],
      },
      {
        label: 'Y 轴 1',
        controlSetRows: [
          ['metric', 'y_axis_format'],
        ],
      },
      {
        label: 'Y 轴 2',
        controlSetRows: [
          ['metric_2', 'y_axis_2_format'],
        ],
      },
    ],
    controlOverrides: {
      metric: {
        label: '左轴度量',
        description: '选择一个度量为左轴',
      },
      y_axis_format: {
        label: '左轴形式',
      },
      x_axis_format: {
        choices: D3_TIME_FORMAT_OPTIONS,
        default: 'smart_date',
      },
    },
  },

  bar: {
    label: '时间序列 - 柱形图',
    showOnExplore: true,
    requiresTime: true,
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: '图形选择',
        controlSetRows: [
          ['color_scheme'],
          ['show_brush', 'show_legend', 'show_bar_value'],
          ['rich_tooltip', 'contribution'],
          ['line_interpolation', 'bar_stacked'],
          ['bottom_margin', 'show_controls'],
        ],
      },
      {
        label: '轴',
        controlSetRows: [
          ['x_axis_format', 'y_axis_format'],
          ['x_axis_showminmax', 'reduce_x_ticks'],
          ['x_axis_label', 'y_axis_label'],
          ['y_axis_bounds', 'y_log_scale'],
        ],
      },
      sections.NVD3TimeSeries[1],
    ],
    controlOverrides: {
      x_axis_format: {
        choices: D3_TIME_FORMAT_OPTIONS,
        default: 'smart_date',
      },
    },
  },

  compare: {
    label: '时间序列 - 百分比变化',
    requiresTime: true,
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: '图形选择',
        controlSetRows: [
          ['color_scheme'],
          ['x_axis_format', 'y_axis_format'],
        ],
      },
      sections.NVD3TimeSeries[1],
    ],
    controlOverrides: {
      x_axis_format: {
        choices: D3_TIME_FORMAT_OPTIONS,
        default: 'smart_date',
      },
    },
  },

  area: {
    label: '时间序列 - 堆叠图',
    requiresTime: true,
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: '图形选择',
        controlSetRows: [
          ['show_brush', 'show_legend'],
          ['line_interpolation', 'stacked_style'],
          ['color_scheme'],
          ['rich_tooltip', 'contribution'],
          ['show_controls', null],
        ],
      },
      {
        label: '轴',
        controlSetRows: [
          ['x_axis_format', 'x_axis_showminmax'],
          ['y_axis_format', 'y_axis_bounds'],
          ['y_log_scale', null],
        ],
      },
      sections.NVD3TimeSeries[1],
    ],
    controlOverrides: {
      x_axis_format: {
        default: 'smart_date',
        choices: D3_TIME_FORMAT_OPTIONS,
      },
      color_scheme: {
        renderTrigger: false,
      },
    },
  },

  table: {
    label: '表格视图',
    controlPanelSections: [
      {
        label: '分组',
        description: '如果你想要一个结果集，使用这个部件',
        controlSetRows: [
          ['groupby', 'metrics'],
          ['include_time'],
        ],
      },
      {
        label: '不分组',
        description: '如果你想要一个原子集，使用这个部件',
        controlSetRows: [
          ['all_columns'],
          ['order_by_cols'],
        ],
      },
      {
        label: '选项',
        controlSetRows: [
          ['table_timestamp_format'],
          ['row_limit', 'page_length'],
          ['include_search', 'table_filter'],
        ],
      },
    ],
    controlOverrides: {
      metrics: {
        validators: [],
      },
      time_grain_sqla: {
        default: null,
      },
    },
  },

  markup: {
    label: '标记图',
    controlPanelSections: [
      {
        label: '代码',
        controlSetRows: [
          ['markup_type'],
          ['code'],
        ],
      },
    ],
  },

  pivot_table: {
    label: '数据透视表',
    controlPanelSections: [
      {
        label: '查询',
        expanded: true,
        controlSetRows: [
          ['groupby', 'columns'],
          ['metrics'],
        ],
      },
      {
        label: '透视选项',
        controlSetRows: [
          ['pandas_aggfunc', 'pivot_margins'],
          ['number_format', 'combine_metric'],
        ],
      },
    ],
    controlOverrides: {
      groupby: { includeTime: true },
      columns: { includeTime: true },
    },
  },

  separator: {
    label: '分离器',
    controlPanelSections: [
      {
        label: '代码',
        controlSetRows: [
          ['markup_type'],
          ['code'],
        ],
      },
    ],
    controlOverrides: {
      code: {
        default: '####Section Title\n' +
        'A paragraph describing the section' +
        'of the dashboard, right before the separator line ' +
        '\n\n' +
        '---------------',
      },
    },
  },

  word_cloud: {
    label: '词云',
    controlPanelSections: [
      {
        label: '结果',
        expanded: true,
        controlSetRows: [
          ['series', 'metric', 'limit'],
        ],
      },
      {
        label: '选项',
        controlSetRows: [
          ['size_from', 'size_to'],
          ['rotation'],
          ['color_scheme'],
        ],
      },
    ],
  },

  treemap: {
    label: '矩阵树图',
    controlPanelSections: [
      {
        label: '结果',
        expanded: true,
        controlSetRows: [
          ['metrics'],
          ['groupby'],
        ],
      },
      {
        label: '图形选择',
        controlSetRows: [
          ['color_scheme'],
          ['treemap_ratio'],
          ['number_format'],
        ],
      },
    ],
    controlOverrides: {
      color_scheme: {
        renderTrigger: false,
      },
    },
  },

  cal_heatmap: {
    label: '日历热图',
    requiresTime: true,
    controlPanelSections: [
      {
        label: '查询',
        expanded: true,
        controlSetRows: [
          ['metric'],
        ],
      },
      {
        label: '选项',
        controlSetRows: [
          ['domain_granularity'],
          ['subdomain_granularity'],
        ],
      },
    ],
  },

  box_plot: {
    label: '箱线图',
    controlPanelSections: [
      {
        label: '查询',
        expanded: true,
        controlSetRows: [
          ['metrics'],
          ['groupby', 'limit'],
        ],
      },
      {
        label: '图形选择',
        controlSetRows: [
          ['color_scheme'],
          ['whisker_options'],
        ],
      },
    ],
  },

  bubble: {
    label: '气泡图',
    controlPanelSections: [
      {
        label: '查询',
        expanded: true,
        controlSetRows: [
          ['series', 'entity'],
          ['size', 'limit'],
        ],
      },
      {
        label: '图形选择',
        controlSetRows: [
          ['color_scheme'],
          ['show_legend', null],
        ],
      },
      {
        label: '气泡',
        controlSetRows: [
          ['size', 'max_bubble_size'],
        ],
      },
      {
        label: 'X 轴',
        controlSetRows: [
          ['x_axis_label', 'left_margin'],
          ['x', 'x_axis_format'],
          ['x_log_scale', 'x_axis_showminmax'],
        ],
      },
      {
        label: 'Y 轴',
        controlSetRows: [
          ['y_axis_label', 'bottom_margin'],
          ['y', 'y_axis_format'],
          ['y_log_scale', 'y_axis_showminmax'],
        ],
      },
    ],
    controlOverrides: {
      x_axis_format: {
        default: '.3s',
      },
      color_scheme: {
        renderTrigger: false,
      },
    },
  },

  bullet: {
    label: '公告图',
    requiresTime: false,
    controlPanelSections: [
      {
        label: '查询',
        expanded: true,
        controlSetRows: [
          ['metric'],
        ],
      },
      {
        label: '图形选择',
        controlSetRows: [
          ['metric'],
          ['ranges', 'range_labels'],
          ['markers', 'marker_labels'],
          ['marker_lines', 'marker_line_labels'],
        ],
      },
    ],
  },

  big_number: {
    label: '大数字和趋势线',
    controlPanelSections: [
      {
        label: '查询',
        expanded: true,
        controlSetRows: [
          ['metric'],
        ],
      },
      {
        label: '图形选择',
        controlSetRows: [
          ['compare_lag', 'compare_suffix'],
          ['y_axis_format', null],
        ],
      },
    ],
    controlOverrides: {
      y_axis_format: {
        label: '数字格式',
      },
    },
  },

  big_number_total: {
    label: '大数字',
    controlPanelSections: [
      {
        label: '查询',
        expanded: true,
        controlSetRows: [
          ['metric'],
        ],
      },
      {
        label: '图形选择',
        controlSetRows: [
          ['subheader'],
          ['y_axis_format'],
        ],
      },
    ],
    controlOverrides: {
      y_axis_format: {
        label: '数字格式',
      },
    },
  },

  histogram: {
    label: '柱状图',
    controlPanelSections: [
      {
        label: '查询',
        expanded: true,
        controlSetRows: [
          ['all_columns_x'],
          ['row_limit'],
        ],
      },
      {
        label: '图形选择',
        controlSetRows: [
          ['color_scheme'],
          ['link_length'],
        ],
      },
    ],
    controlOverrides: {
      all_columns_x: {
        label: '数值纵列',
        description: '选择要绘制柱状图的数字列',
      },
      link_length: {
        label: '垃圾箱',
        description: '选择柱形图的丢弃个数',
        default: 5,
      },
    },
  },

  sunburst: {
    label: '旭日图',
    controlPanelSections: [
      {
        label: '查询',
        expanded: true,
        controlSetRows: [
          ['groupby'],
          ['metric', 'secondary_metric'],
          ['row_limit'],
        ],
      },
      {
        label: '图形选择',
        controlSetRows: [
          ['color_scheme'],
        ],
      },
    ],
    controlOverrides: {
      metric: {
        label: '主要指标',
        description: '主要指标是用来定义弧段的大小',
      },
      secondary_metric: {
        label: '次要指标',
        description: '次要度量用来定义颜色与主度量的比值。如果两个指标匹配，颜色映射水平组',
      },
      groupby: {
        label: '层次级别',
        description: '定义层次结构的级别',
      },
    },
  },

  sankey: {
    label: '桑基图',
    controlPanelSections: [
      {
        label: '查询',
        expanded: true,
        controlSetRows: [
          ['groupby'],
          ['metric'],
          ['row_limit'],
        ],
      },
      {
        label: '图形选择',
        controlSetRows: [
          ['color_scheme'],
        ],
      },
    ],
    controlOverrides: {
      groupby: {
        label: '源 / 目标',
        description: '选择一个源和一个目标',
      },
    },
  },

  directed_force: {
    label: '力导向图',
    controlPanelSections: [
      {
        label: '查询',
        expanded: true,
        controlSetRows: [
          ['groupby'],
          ['metric'],
          ['row_limit'],
        ],
      },
      {
        label: '选项',
        controlSetRows: [
          ['link_length'],
          ['charge'],
        ],
      },
    ],
    controlOverrides: {
      groupby: {
        label: '源 / 目标',
        description: '选择一个源和一个目标',
      },
    },
  },
  chord: {
    label: '弦图',
    controlPanelSections: [
      {
        label: '查询',
        expanded: true,
        controlSetRows: [
          ['groupby', 'columns'],
          ['metric', 'row_limit'],
        ],
      },
      {
        label: '图形选择',
        controlSetRows: [
          ['y_axis_format', null],
          ['color_scheme'],
        ],
      },
    ],
    controlOverrides: {
      y_axis_format: {
        label: '数字格式',
        description: '选择数字格式',
      },
      groupby: {
        label: '源',
        multi: false,
        validators: [v.nonEmpty],
        description: '选择源',
      },
      columns: {
        label: '目标',
        multi: false,
        validators: [v.nonEmpty],
        description: '选择目标',
      },
    },
  },
  country_map: {
    label: '城市地图',
    controlPanelSections: [
      {
        label: '查询',
        expanded: true,
        controlSetRows: [
          ['entity'],
          ['metric'],
        ],
      },
      {
        label: '选项',
        controlSetRows: [
          ['select_country'],
          ['linear_color_scheme'],
        ],
      },
    ],
    controlOverrides: {
      entity: {
        label: 'ISO 3166-1	代码区域/省/部',
        description: "It's ISO 3166-1 of your region/province/department in your table. (see documentation for list of ISO 3166-1)",
      },
      metric: {
        label: '度量',
        description: '显示底部标题的度量',
      },
      linear_color_scheme: {
        renderTrigger: false,
      },
    },
  },
  world_map: {
    label: '世界地图',
    controlPanelSections: [
      {
        label: '查询',
        expanded: true,
        controlSetRows: [
          ['entity'],
          ['country_fieldtype'],
          ['metric'],
        ],
      },
      {
        label: '泡影',
        controlSetRows: [
          ['show_bubbles'],
          ['secondary_metric'],
          ['max_bubble_size'],
        ],
      },
    ],
    controlOverrides: {
      entity: {
        label: '城市控制',
        description: '3字母国家代码',
      },
      metric: {
        label: '度量颜色',
        description: '定义国家颜色的度量',
      },
      secondary_metric: {
        label: '泡影尺寸',
        description: '定义泡影大小的度量',
      },
    },
  },

  filter_box: {
    label: '过滤盒',
    controlPanelSections: [
      {
        label: '查询',
        expanded: true,
        controlSetRows: [
          ['groupby'],
          ['metric'],
        ],
      },
      {
        label: '选项',
        controlSetRows: [
          ['date_filter', 'instant_filtering'],
        ],
      },
    ],
    controlOverrides: {
      groupby: {
        label: '过滤器控制',
        description: (
          '过滤的控件。注意，过滤检查这个列表显示'
        ),
        mapStateToProps: state => ({
          options: (state.datasource) ? state.datasource.columns.filter(c => c.filterable) : [],
        }),
      },
    },
  },

  iframe: {
    label: 'iFrame',
    controlPanelSections: [
      {
        label: 'Options',
        controlSetRows: [
          ['url'],
        ],
      },
    ],
  },

  para: {
    label: '平行坐标',
    controlPanelSections: [
      {
        label: '查询',
        expanded: true,
        controlSetRows: [
          ['series'],
          ['metrics'],
          ['secondary_metric'],
          ['limit'],
        ],
      },
      {
        label: '选项',
        controlSetRows: [
          ['show_datatable', 'include_series'],
        ],
      },
    ],
  },

  heatmap: {
    label: '热点图',
    controlPanelSections: [
      {
        label: '轴与度量',
        controlSetRows: [
          ['all_columns_x'],
          ['all_columns_y'],
          ['metric'],
        ],
      },
      {
        label: '热图选项',
        controlSetRows: [
          ['linear_color_scheme'],
          ['xscale_interval', 'yscale_interval'],
          ['canvas_image_rendering'],
          ['normalize_across'],
        ],
      },
    ],
    controlOverrides: {
      all_columns_x: {
        validators: [v.nonEmpty],
      },
      all_columns_y: {
        validators: [v.nonEmpty],
      },
    },
  },

  horizon: {
    label: '地平线图',
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: '图形选择',
        controlSetRows: [
          ['series_height', 'horizon_color_scale'],
        ],
      },
    ],
  },

  mapbox: {
    label: '地图盒',
    controlPanelSections: [
      {
        label: '查询',
        expanded: true,
        controlSetRows: [
          ['all_columns_x', 'all_columns_y'],
          ['clustering_radius'],
          ['row_limit'],
          ['groupby'],
        ],
      },
      {
        label: '点',
        controlSetRows: [
          ['point_radius'],
          ['point_radius_unit'],
        ],
      },
      {
        label: '标签',
        controlSetRows: [
          ['mapbox_label'],
          ['pandas_aggfunc'],
        ],
      },
      {
        label: '视觉调整',
        controlSetRows: [
          ['render_while_dragging'],
          ['mapbox_style'],
          ['global_opacity'],
          ['mapbox_color'],
        ],
      },
      {
        label: '视窗',
        controlSetRows: [
          ['viewport_longitude'],
          ['viewport_latitude'],
          ['viewport_zoom'],
        ],
      },
    ],
    controlOverrides: {
      all_columns_x: {
        label: '经度',
        description: '包含经度数据的列',
      },
      all_columns_y: {
        label: '纬度',
        description: '包含纬度数据的列',
      },
      pandas_aggfunc: {
        label: '聚合器',
        description: '聚合函数应用于每个簇的单点产生的聚类标签.',
      },
      rich_tooltip: {
        label: '工具提示',
        description: '当悬停在描述标签的点和集群时，显示工具提示.',
      },
      groupby: {
        description: '一个或多个控件按组分组。如果分组，纬度和经度列必须在场.',
      },
    },
  },

  event_flow: {
    label: '事件流动图',
    requiresTime: true,
    controlPanelSections: [
      {
        label: '时间定义',
        controlSetRows: [
          ['entity'],
          ['all_columns_x'],
          ['row_limit'],
          ['order_by_entity'],
          ['min_leaf_node_event_count'],
        ],
      },
      {
        label: '附加数据',
        controlSetRows: [
          ['all_columns'],
        ],
      },
    ],
    controlOverrides: {
      entity: {
        label: '控制本质ID的列',
        description: '例如，“用户id” 列',
      },
      all_columns_x: {
        label: '控制事件名称的列',
        validators: [v.nonEmpty],
        default: control => (
          control.choices && control.choices.length > 0 ?
            control.choices[0][0] : null
        ),
      },
      row_limit: {
        label: '时间数量限制',
        description: '要返回的事件的最大数量，相当于行数。',
      },
      all_columns: {
        label: '元数据',
        description: '选择任何列的元数据检验',
      },
    },
  },
};

export default visTypes;

export function sectionsToRender(vizType, datasourceType) {
  const viz = visTypes[vizType];
  return [].concat(
    sections.datasourceAndVizType,
    datasourceType === 'table' ? sections.sqlaTimeSeries : sections.druidTimeSeries,
    viz.controlPanelSections,
    datasourceType === 'table' ? sections.sqlClause : [],
    datasourceType === 'table' ? sections.filters[0] : sections.filters,
  );
}
