"""Views used by the SqlAlchemy connector"""
import logging

from past.builtins import basestring

from flask import Markup, flash, redirect
from flask_appbuilder import CompactCRUDMixin, expose
from flask_appbuilder.models.sqla.interface import SQLAInterface
import sqlalchemy as sa

from flask_babel import lazy_gettext as _
from flask_babel import gettext as __

from superset import appbuilder, db, utils, security, sm
from superset.utils import has_access
from superset.connectors.base.views import DatasourceModelView
from superset.views.base import (
    SupersetModelView, ListWidgetWithCheckboxes, DeleteMixin, DatasourceFilter,
    get_datasource_exist_error_mgs,
)

from . import models


class TableColumnInlineView(CompactCRUDMixin, SupersetModelView):  # noqa
    datamodel = SQLAInterface(models.TableColumn)

    list_title = _('List Columns')
    show_title = _('Show Column')
    add_title = _('Add Column')
    edit_title = _('Edit Column')

    can_delete = False
    list_widget = ListWidgetWithCheckboxes
    edit_columns = [
        'column_name', 'verbose_name', 'description',
        'type', 'groupby', 'filterable',
        'table', 'count_distinct', 'sum', 'min', 'max', 'expression',
        'is_dttm', 'python_date_format', 'database_expression']
    add_columns = edit_columns
    list_columns = [
        'column_name', 'verbose_name', 'type', 'groupby', 'filterable', 'count_distinct',
        'sum', 'min', 'max', 'is_dttm']
    page_size = 500
    description_columns = {
        'is_dttm': _(
            "Whether to make this column available as a "
            "[Time Granularity] option, column has to be DATETIME or "
            "DATETIME-like"),
        'filterable': _(
            "Whether this column is exposed in the `Filters` section "
            "of the explore view."),
        'type': _(
            "由数据库推断的数据类型。在某些情况下，可能需要手动输入表达式定义列的类型。在大多数情况下，用户不需要更改此。"),
        'expression': utils.markdown(
            "一个有效的SQL表达式作为底层的后端支持. "
            "列如: `substr(name, 1, 1)`", True),
        'python_date_format': utils.markdown(Markup(
            "时间戳格式的模式, 使用 "
            "<a href='https://docs.python.org/2/library/"
            "datetime.html#strftime-strptime-behavior'>"
            "Python的日期字符串模式</a> "
            "如果时间以纪元格式存储, 把 `epoch_s` 或 `epoch_ms`. 移除 `Database Expression` "
            "如果时间戳存储在字符串或整数（纪元）类型中，则为空。"), True),
        'database_expression': utils.markdown(
            "数据库表达式需要datetime内部常量数据库日期/时间戳类型根据DBAPI."
            "表达应遵循的模式 %Y-%m-%d %H:%M:%S, 基于不同DBAPI. "
            "字符串应该是一个Python字符串格式化 \n"
            "`Oracle中示例: TO_DATE('{}', 'YYYY-MM-DD HH24:MI:SS')`. "
            "SuperSet采用基于DB URI的默认表达式.", True),
    }
    label_columns = {
        'column_name': _("Column"),
        'verbose_name': _("Verbose Name"),
        'description': _("Description"),
        'groupby': _("Groupable"),
        'filterable': _("Filterable"),
        'table': _("Table"),
        'count_distinct': _("Count Distinct"),
        'sum': _("Sum"),
        'min': _("Min"),
        'max': _("Max"),
        'expression': _("Expression"),
        'is_dttm': _("Is temporal"),
        'python_date_format': _("Datetime Format"),
        'database_expression': _("Database Expression"),
        'type': _('Type'),
    }
appbuilder.add_view_no_menu(TableColumnInlineView)


class SqlMetricInlineView(CompactCRUDMixin, SupersetModelView):  # noqa
    datamodel = SQLAInterface(models.SqlMetric)

    list_title = _('List Metrics')
    show_title = _('Show Metric')
    add_title = _('Add Metric')
    edit_title = _('Edit Metric')

    list_columns = ['metric_name', 'verbose_name', 'metric_type']
    edit_columns = [
        'metric_name', 'description', 'verbose_name', 'metric_type',
        'expression', 'table', 'd3format', 'is_restricted']
    description_columns = {
        'expression': utils.markdown(
            "一个有效的SQL表达式作为底层的后端支持. "
            "列如: `count(DISTINCT userid)`", True),
        'is_restricted': _("访问此度量是否受限于某些角色。只有具有权限的角色XXX的度量访问（这个度量的名称）才允许访问此度量"),
        'd3format': utils.markdown(
            "D3格式字符串定义 [here]"
            "(https://github.com/d3/d3-format/blob/master/README.md#format). "
            "例如，默认的格式应用于表可视化并允许不同的度量使用不同的格式", True
        ),
    }
    add_columns = edit_columns
    page_size = 500
    label_columns = {
        'metric_name': _("Metric"),
        'description': _("Description"),
        'verbose_name': _("Verbose Name"),
        'metric_type': _("Type"),
        'expression': _("SQL Expression"),
        'table': _("Table"),
        'd3format': _("D3 Format"),
        'is_restricted': _('Is Restricted')
    }

    def post_add(self, metric):
        if metric.is_restricted:
            security.merge_perm(sm, 'metric_access', metric.get_perm())

    def post_update(self, metric):
        if metric.is_restricted:
            security.merge_perm(sm, 'metric_access', metric.get_perm())

appbuilder.add_view_no_menu(SqlMetricInlineView)


class TableModelView(DatasourceModelView, DeleteMixin):  # noqa
    datamodel = SQLAInterface(models.SqlaTable)
        
    list_title = _('List Tables')
    show_title = _('Show Table')
    add_title = _('Add Table')
    edit_title = _('Edit Table')

    list_columns = [
        'link', 'database',
        'changed_by_', 'modified']
    add_columns = ['database', 'schema', 'table_name']
    edit_columns = [
        'table_name', 'sql', 'filter_select_enabled', 'slices',
        'fetch_values_predicate', 'database', 'schema',
        'description', 'owner',
        'main_dttm_col', 'default_endpoint', 'offset', 'cache_timeout']
    show_columns = edit_columns + ['perm']
    related_views = [TableColumnInlineView, SqlMetricInlineView]
    base_order = ('changed_on', 'desc')
    search_columns = (
        'database', 'schema', 'table_name', 'owner',
    )
    description_columns = {
        'slices': _(
            "The list of slices associated with this table. By "
            "altering this datasource, you may change how these associated "
            "slices behave. "
            "Also note that slices need to point to a datasource, so "
            "this form will fail at saving if removing slices from a "
            "datasource. If you want to change the datasource for a slice, "
            "overwrite the slice from the 'explore view'"),
        'offset': _("Timezone offset (in hours) for this datasource"),
        'table_name': _(
            "Name of the table that exists in the source database"),
        'schema': _(
            "Schema, as used only in some databases like Postgres, Redshift "
            "and DB2"),
        'description': Markup(
            "Supports <a href='https://daringfireball.net/projects/markdown/'>"
            "markdown</a>"),
        'sql': _(
            "This fields acts a Superset view, meaning that Superset will "
            "run a query against this string as a subquery."
        ),
        'fetch_values_predicate': _(
            "Predicate applied when fetching distinct value to "
            "populate the filter control component. Supports "
            "jinja template syntax. Applies only when "
            "`Enable Filter Select` is on."
        ),
        'default_endpoint': _(
            "Redirects to this endpoint when clicking on the table "
            "from the table list"),
        'filter_select_enabled': _(
            "Whether to populate the filter's dropdown in the explore "
            "view's filter section with a list of distinct values fetched "
            "from the backend on the fly"),
    }
    base_filters = [['id', DatasourceFilter, lambda: []]]
    label_columns = {
        'slices': _("Associated Slices"),
        'link': _("Table"),
        'changed_by_': _("Changed By"),
        'database': _("Database"),
        'changed_on_': _("Last Changed"),
        'filter_select_enabled': _("Enable Filter Select"),
        'schema': _("Schema"),
        'default_endpoint': _('Default Endpoint'),
        'offset': _("Offset"),
        'cache_timeout': _("Cache Timeout"),
        'table_name': _("Table Name"),
        'fetch_values_predicate': _('Fetch Values Predicate'),
        'owner': _("Owner"),
        'main_dttm_col': _("Main Datetime Column"),
        'description': _('Description'),
    }

    def pre_add(self, table):
        number_of_existing_tables = db.session.query(
            sa.func.count('*')).filter(
            models.SqlaTable.table_name == table.table_name,
            models.SqlaTable.schema == table.schema,
            models.SqlaTable.database_id == table.database.id
        ).scalar()
        # table object is already added to the session
        if number_of_existing_tables > 1:
            raise Exception(get_datasource_exist_error_mgs(table.full_name))

        # Fail before adding if the table can't be found
        try:
            table.get_sqla_table_object()
        except Exception as e:
            logging.exception(e)
            raise Exception(_(
                "Table [{}] could not be found, "
                "please double check your "
                "database connection, schema, and "
                "table name").format(table.name))

    def post_add(self, table, flash_message=True):
        table.fetch_metadata()
        security.merge_perm(sm, 'datasource_access', table.get_perm())
        if table.schema:
            security.merge_perm(sm, 'schema_access', table.schema_perm)

        if flash_message:
            flash(_(
                "The table was created. "
                "As part of this two phase configuration "
                "process, you should now click the edit button by "
                "the new table to configure it."), "info")

    def post_update(self, table):
        self.post_add(table, flash_message=False)

    def _delete(self, pk):
        DeleteMixin._delete(self, pk)

    @expose('/edit/<pk>', methods=['GET', 'POST'])
    @has_access
    def edit(self, pk):
        """Simple hack to redirect to explore view after saving"""
        resp = super(TableModelView, self).edit(pk)
        if isinstance(resp, basestring):
            return resp
        return redirect('/superset/explore/table/{}/'.format(pk))

appbuilder.add_view(
    TableModelView,
    "Tables",
    label=__("Tables"),
    category="Sources",
    category_label=__("Sources"),
    icon='fa-table',)

appbuilder.add_separator("Sources")
