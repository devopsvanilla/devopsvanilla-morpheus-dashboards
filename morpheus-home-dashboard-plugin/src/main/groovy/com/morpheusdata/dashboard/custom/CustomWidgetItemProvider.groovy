package com.morpheusdata.dashboard.custom

import com.morpheusdata.core.dashboard.AbstractDashboardItemTypeProvider
import com.morpheusdata.core.MorpheusContext
import com.morpheusdata.core.Plugin
import com.morpheusdata.model.DashboardItemType
import com.morpheusdata.model.OptionType
import groovy.util.logging.Slf4j

/**
 * Custom Widget that allows embedding external URL content
 * Provides configurable parameters for URL, title, height, and refresh interval
 *
 * @author DevOps Vanilla
 * @since 1.0.0
 */
@Slf4j
class CustomWidgetItemProvider extends AbstractDashboardItemTypeProvider {

	Plugin plugin
	MorpheusContext morpheusContext

	CustomWidgetItemProvider(Plugin plugin, MorpheusContext context) {
		this.plugin = plugin
		this.morpheusContext = context
	}

	@Override
	MorpheusContext getMorpheus() {
		return morpheusContext
	}

	@Override
	Plugin getPlugin() {
		return plugin
	}

	@Override
	String getCode() {
		return 'dashboard-item-custom-widget'
	}

	@Override
	String getName() {
		return 'Custom External Content'
	}

	@Override
	DashboardItemType getDashboardItemType() {
		def rtn = new DashboardItemType()
		rtn.name = getName()
		rtn.code = getCode()
		rtn.category = 'custom'
		rtn.title = 'Custom Widget'
		rtn.description = 'Embed external URL content with configurable parameters'
		rtn.uiSize = 'lg'
		rtn.templatePath = 'hbs/custom/custom-widget'
		rtn.scriptPath = 'custom/custom-widget.js'

		// Set permissions - using provisioning as default
		rtn.permission = morpheusContext.getPermission().getByCode('provisioning').blockingGet()
		def accessTypes = ['read', 'full']
		rtn.setAccessTypes(accessTypes)

		// Define configurable option types for the widget
		rtn.optionTypes = [
			new OptionType(
				name: 'externalUrl',
				code: 'dashboard-custom-widget-url',
				fieldName: 'externalUrl',
				fieldLabel: 'External URL',
				fieldContext: 'config',
				fieldGroup: 'Custom Widget Settings',
				inputType: OptionType.InputType.TEXT,
				displayOrder: 0,
				required: true,
				helpText: 'The external URL to embed (must support iframe embedding)'
			),
			new OptionType(
				name: 'widgetTitle',
				code: 'dashboard-custom-widget-title',
				fieldName: 'widgetTitle',
				fieldLabel: 'Widget Title',
				fieldContext: 'config',
				fieldGroup: 'Custom Widget Settings',
				inputType: OptionType.InputType.TEXT,
				displayOrder: 1,
				required: false,
				helpText: 'Custom title for the widget (optional)'
			),
			new OptionType(
				name: 'widgetHeight',
				code: 'dashboard-custom-widget-height',
				fieldName: 'widgetHeight',
				fieldLabel: 'Widget Height',
				fieldContext: 'config',
				fieldGroup: 'Custom Widget Settings',
				inputType: OptionType.InputType.NUMBER,
				displayOrder: 2,
				required: false,
				defaultValue: '400',
				helpText: 'Height of the widget in pixels (default: 400)'
			),
			new OptionType(
				name: 'autoRefresh',
				code: 'dashboard-custom-widget-autorefresh',
				fieldName: 'autoRefresh',
				fieldLabel: 'Auto Refresh',
				fieldContext: 'config',
				fieldGroup: 'Custom Widget Settings',
				inputType: OptionType.InputType.CHECKBOX,
				displayOrder: 3,
				required: false,
				defaultValue: 'on',
				helpText: 'Enable automatic refresh of the embedded content'
			),
			new OptionType(
				name: 'refreshInterval',
				code: 'dashboard-custom-widget-refresh-interval',
				fieldName: 'refreshInterval',
				fieldLabel: 'Refresh Interval',
				fieldContext: 'config',
				fieldGroup: 'Custom Widget Settings',
				inputType: OptionType.InputType.NUMBER,
				displayOrder: 4,
				required: false,
				defaultValue: '300',
				helpText: 'Refresh interval in seconds (default: 300)',
				visibleOnCode: 'autoRefresh:on'
			),
			new OptionType(
				name: 'showBorder',
				code: 'dashboard-custom-widget-show-border',
				fieldName: 'showBorder',
				fieldLabel: 'Show Border',
				fieldContext: 'config',
				fieldGroup: 'Custom Widget Settings',
				inputType: OptionType.InputType.CHECKBOX,
				displayOrder: 5,
				required: false,
				defaultValue: 'off',
				helpText: 'Show border around the embedded content'
			)
		]

		return rtn
	}

}
