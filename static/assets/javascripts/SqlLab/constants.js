export const STATE_BSSTYLE_MAP = {
  failed: 'danger',
  pending: 'info',
  fetching: 'info',
  running: 'warning',
  stopped: 'danger',
  success: 'success',
};

export const STATUS_OPTIONS = [
  'success',
  'failed',
  'running',
  'pending',
];

export const TIME_OPTIONS = [
  'now',
  '1 hour ago',
  '1 day ago',
  '7 days ago',
  '28 days ago',
  '90 days ago',
  '1 year ago',
];

export const VISUALIZE_VALIDATION_ERRORS = {
  REQUIRE_CHART_TYPE: '选择一个图表类型',
  REQUIRE_TIME: '要使用这个图表类型，您至少需要一个标记为日期的列',
  REQUIRE_DIMENSION: '要使用这个图表类型，至少需要一个维度',
  REQUIRE_AGGREGATION_FUNCTION: '要使用这个图表类型，至少需要一个聚合函数',
};
