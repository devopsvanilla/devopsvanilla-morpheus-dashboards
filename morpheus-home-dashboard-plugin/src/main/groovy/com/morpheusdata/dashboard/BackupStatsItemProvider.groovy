package com.morpheusdata.dashboard

import com.morpheusdata.core.MorpheusContext
import com.morpheusdata.core.Plugin
import com.morpheusdata.core.dashboard.AbstractDashboardItemTypeProvider
import com.morpheusdata.model.DashboardItemType
import groovy.util.logging.Slf4j

/**
 * Provides an interface and standard set of methods for creating custom dashboards
 *
 * @since 0.13
 * @author bdwheeler
 */
@Slf4j
class BackupStatsItemProvider extends AbstractDashboardItemTypeProvider {

	Plugin plugin
	MorpheusContext morpheusContext

	BackupStatsItemProvider(Plugin plugin, MorpheusContext context) {
		log.debug("BackupStatsItemProvider constructor called with plugin: ${plugin?.class?.simpleName}, context: ${context?.class?.simpleName}")
		this.plugin = plugin
		this.morpheusContext = context
		log.debug("BackupStatsItemProvider constructor completed")
	}

	@Override
	MorpheusContext getMorpheus() {
		log.debug("BackupStatsItemProvider.getMorpheus() called")
		return morpheusContext
	}

	@Override
	Plugin getPlugin() {
		log.debug("BackupStatsItemProvider.getPlugin() called")
		return plugin
	}

	@Override
	String getCode() {
		log.debug("BackupStatsItemProvider.getCode() called")
		def code = 'dashboard-item-backup-stats'
		log.debug("BackupStatsItemProvider.getCode() returning: ${code}")
		return code
	}

	@Override
	String getName() {
		log.debug("BackupStatsItemProvider.getName() called")
		def name = 'Backup statistics'
		log.debug("BackupStatsItemProvider.getName() returning: ${name}")
		return name
	}

	@Override
	DashboardItemType getDashboardItemType() {
		log.debug("BackupStatsItemProvider.getDashboardItemType() called")
		def rtn = new DashboardItemType()
		//populate it
		//rtn.uuid = ?
		rtn.name = getName()
		rtn.code = getCode()
		rtn.category = 'backups'
		rtn.title = 'backup statistics'
		rtn.description = 'backup statistics'
		rtn.uiSize = 'sm'
		rtn.templatePath = 'hbs/backups/backup-stats-widget'
		rtn.scriptPath = 'backups/backup-stats-widget.js'
		//set permissions
		rtn.permission = morpheusContext.getPermission().getByCode('backups').blockingGet()
		def accessTypes = ['view', 'read', 'user', 'full']
		rtn.setAccessTypes(accessTypes)
		log.debug("BackupStatsItemProvider.getDashboardItemType() returning DashboardItemType: [code: ${rtn.code}, name: ${rtn.name}, category: ${rtn.category}, uiSize: ${rtn.uiSize}, scriptPath: ${rtn.scriptPath}]")
		return rtn
	}

}
