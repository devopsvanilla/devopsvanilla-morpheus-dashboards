package com.morpheusdata.dashboard

import com.morpheusdata.core.Plugin
import com.morpheusdata.dashboard.clouds.*
import com.morpheusdata.dashboard.clusters.*
import com.morpheusdata.dashboard.custom.*
import com.morpheusdata.model.Permission
import groovy.util.logging.Slf4j

/**
 * default morpheus dashboards and dashboard items
 */
@Slf4j
class MorpheusHomeDashboardPlugin extends Plugin {

	@Override
	String getCode() {
		log.debug("MorpheusHomeDashboardPlugin.getCode() called")
		def code = 'morpheus-home-dashboard-plugin'
		log.debug("MorpheusHomeDashboardPlugin.getCode() returning: ${code}")
		return code
	}

	@Override
	void initialize() {
		log.debug("MorpheusHomeDashboardPlugin.initialize() started")
		try {
			//set the name
			this.setName("Morpheus Home Dashboard")
			log.debug("MorpheusHomeDashboardPlugin.initialize() - plugin name set to: Morpheus Home Dashboard")

			//add the dashboard item types
			//activity
			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating RecentActivityItemProvider")
			RecentActivityItemProvider recentActivityProvider = new RecentActivityItemProvider(this, morpheus)
			this.pluginProviders.put(recentActivityProvider.code, recentActivityProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - RecentActivityItemProvider registered with code: ${recentActivityProvider.code}")
			log.debug("MorpheusHomeDashboardPlugin.initialize() - RecentActivityItemProvider registered with code: ${recentActivityProvider.code}")
			//user
			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating UserFavoritesItemProvider")
			UserFavoritesItemProvider userFavoritesProvider = new UserFavoritesItemProvider(this, morpheus)
			this.pluginProviders.put(userFavoritesProvider.code, userFavoritesProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - UserFavoritesItemProvider registered with code: ${userFavoritesProvider.code}")

			//workloads
			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating InstanceCountItemProvider")
			InstanceCountItemProvider instanceCountProvider = new InstanceCountItemProvider(this, morpheus)
			this.pluginProviders.put(instanceCountProvider.code, instanceCountProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - InstanceCountItemProvider registered with code: ${instanceCountProvider.code}")

			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating InstanceCountCloudItemProvider")
			InstanceCountCloudItemProvider instanceCountCloudProvider = new InstanceCountCloudItemProvider(this, morpheus)
			this.pluginProviders.put(instanceCountCloudProvider.code, instanceCountCloudProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - InstanceCountCloudItemProvider registered with code: ${instanceCountCloudProvider.code}")
			// InstanceCountCloudDayItemProvider instanceCountCloudDayProvider = new InstanceCountCloudDayItemProvider(this, morpheus)
			// this.pluginProviders.put(instanceCountCloudDayProvider.code, instanceCountCloudDayProvider)

			//logs
			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating LogCountItemProvider")
			LogCountItemProvider logCountProvider = new LogCountItemProvider(this, morpheus)
			this.pluginProviders.put(logCountProvider.code, logCountProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - LogCountItemProvider registered with code: ${logCountProvider.code}")

			// LogTrendsItemProvider logTrendsProvider = new LogTrendsItemProvider(this, morpheus)
			// this.pluginProviders.put(logTrendsProvider.code, logTrendsProvider)

			//clouds
			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating CloudCountTypeItemProvider")
			CloudCountTypeItemProvider cloudCountTypeProvider = new CloudCountTypeItemProvider(this, morpheus)
			this.pluginProviders.put(cloudCountTypeProvider.code, cloudCountTypeProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - CloudCountTypeItemProvider registered with code: ${cloudCountTypeProvider.code}")

			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating CloudWorkloadCountItemProvider")
			CloudWorkloadCountItemProvider cloudWorkloadCountProvider = new CloudWorkloadCountItemProvider(this, morpheus)
			this.pluginProviders.put(cloudWorkloadCountProvider.code, cloudWorkloadCountProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - CloudWorkloadCountItemProvider registered with code: ${cloudWorkloadCountProvider.code}")
			log.debug("MorpheusHomeDashboardPlugin.initialize() - CloudWorkloadCountItemProvider registered with code: ${cloudWorkloadCountProvider.code}")
			//groups
			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating GroupWorkloadCountItemProvider")
			GroupWorkloadCountItemProvider groupWorkloadCountProvider = new GroupWorkloadCountItemProvider(this, morpheus)
			this.pluginProviders.put(groupWorkloadCountProvider.code, groupWorkloadCountProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - GroupWorkloadCountItemProvider registered with code: ${groupWorkloadCountProvider.code}")

			//clusters
			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating ClusterWorkloadCountItemProvider")
			ClusterWorkloadCountItemProvider clusterWorkloadCountProvider = new ClusterWorkloadCountItemProvider(this, morpheus)
			this.pluginProviders.put(clusterWorkloadCountProvider.code, clusterWorkloadCountProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - ClusterWorkloadCountItemProvider registered with code: ${clusterWorkloadCountProvider.code}")

			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating ClusterTypeCountItemProvider")
			ClusterTypeCountItemProvider clusterTypeCountProvider = new ClusterTypeCountItemProvider(this, morpheus)
			this.pluginProviders.put(clusterTypeCountProvider.code, clusterTypeCountProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - ClusterTypeCountItemProvider registered with code: ${clusterTypeCountProvider.code}")

			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating ClusterCapacityItemProvider")
			ClusterCapacityItemProvider clusterCapacityProvider = new ClusterCapacityItemProvider(this, morpheus)
			this.pluginProviders.put(clusterCapacityProvider.code, clusterCapacityProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - ClusterCapacityItemProvider registered with code: ${clusterCapacityProvider.code}")
			log.debug("MorpheusHomeDashboardPlugin.initialize() - ClusterCapacityItemProvider registered with code: ${clusterCapacityProvider.code}")
			//jobs
			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating JobExecutionStatsItemProvider")
			JobExecutionStatsItemProvider jobExecutionStatsItemProvider = new JobExecutionStatsItemProvider(this, morpheus)
			this.pluginProviders.put(jobExecutionStatsItemProvider.code, jobExecutionStatsItemProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - JobExecutionStatsItemProvider registered with code: ${jobExecutionStatsItemProvider.code}")

			//backups
			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating BackupStatsItemProvider")
			BackupStatsItemProvider backupStatsItemProvider = new BackupStatsItemProvider(this, morpheus)
			this.pluginProviders.put(backupStatsItemProvider.code, backupStatsItemProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - BackupStatsItemProvider registered with code: ${backupStatsItemProvider.code}")

			//tasks
			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating TaskExecutionsOverTimeItemProvider")
			TaskExecutionsOverTimeItemProvider taskExecutionsOverTimeItemProvider = new TaskExecutionsOverTimeItemProvider(this, morpheus)
			this.pluginProviders.put(taskExecutionsOverTimeItemProvider.code, taskExecutionsOverTimeItemProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - TaskExecutionsOverTimeItemProvider registered with code: ${taskExecutionsOverTimeItemProvider.code}")

			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating WorkflowExecutionsOverTimeItemProvider")
			WorkflowExecutionsOverTimeItemProvider workflowExecutionsOverTimeItemProvider = new WorkflowExecutionsOverTimeItemProvider(this, morpheus)
			this.pluginProviders.put(workflowExecutionsOverTimeItemProvider.code, workflowExecutionsOverTimeItemProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - WorkflowExecutionsOverTimeItemProvider registered with code: ${workflowExecutionsOverTimeItemProvider.code}")

			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating TaskFailuresItemProvider")
			TaskFailuresItemProvider taskFailuresItemProvider = new TaskFailuresItemProvider(this, morpheus)
			this.pluginProviders.put(taskFailuresItemProvider.code, taskFailuresItemProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - TaskFailuresItemProvider registered with code: ${taskFailuresItemProvider.code}")

			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating TaskExecutionStatsItemProvider")
			TaskExecutionStatsItemProvider taskExecutionStatsProvider = new TaskExecutionStatsItemProvider(this, morpheus)
			this.pluginProviders.put(taskExecutionStatsProvider.code, taskExecutionStatsProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - TaskExecutionStatsItemProvider registered with code: ${taskExecutionStatsProvider.code}")
			log.debug("MorpheusHomeDashboardPlugin.initialize() - TaskExecutionStatsItemProvider registered with code: ${taskExecutionStatsProvider.code}")
			//health
			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating CurrentAlarmsItemProvider")
			CurrentAlarmsItemProvider currentAlarmsProvider = new CurrentAlarmsItemProvider(this, morpheus)
			this.pluginProviders.put(currentAlarmsProvider.code, currentAlarmsProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - CurrentAlarmsItemProvider registered with code: ${currentAlarmsProvider.code}")

			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating EnvironmentCountItemProvider")
			EnvironmentCountItemProvider environmentCountProvider = new EnvironmentCountItemProvider(this, morpheus)
			this.pluginProviders.put(environmentCountProvider.code, environmentCountProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - EnvironmentCountItemProvider registered with code: ${environmentCountProvider.code}")

			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating CurrentHealthItemProvider")
			CurrentHealthItemProvider currentHealthProvider = new CurrentHealthItemProvider(this, morpheus)
			this.pluginProviders.put(currentHealthProvider.code, currentHealthProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - CurrentHealthItemProvider registered with code: ${currentHealthProvider.code}")

			//custom widgets
			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating CustomWidgetItemProvider")
			CustomWidgetItemProvider customWidgetProvider = new CustomWidgetItemProvider(this, morpheus)
			this.pluginProviders.put(customWidgetProvider.code, customWidgetProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - CustomWidgetItemProvider registered with code: ${customWidgetProvider.code}")

			//add the main dashboard
			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating HomeDashboardProvider")
			HomeDashboardProvider homeDashboardProvider = new HomeDashboardProvider(this, morpheus)
			this.pluginProviders.put(homeDashboardProvider.code, homeDashboardProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - HomeDashboardProvider registered with code: ${homeDashboardProvider.code}")

			//add the cloud list dashboard
			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating CloudListDashboardProvider")
			CloudListDashboardProvider cloudListDashboardProvider = new CloudListDashboardProvider(this, morpheus)
			this.pluginProviders.put(cloudListDashboardProvider.code, cloudListDashboardProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - CloudListDashboardProvider registered with code: ${cloudListDashboardProvider.code}")

			//add the cluster list dashboard
			log.debug("MorpheusHomeDashboardPlugin.initialize() - creating ClusterListDashboardProvider")
			ClusterListDashboardProvider clusterListDashboardProvider = new ClusterListDashboardProvider(this, morpheus)
			this.pluginProviders.put(clusterListDashboardProvider.code, clusterListDashboardProvider)
			log.debug("MorpheusHomeDashboardPlugin.initialize() - ClusterListDashboardProvider registered with code: ${clusterListDashboardProvider.code}")

			log.debug("MorpheusHomeDashboardPlugin.initialize() - initialization completed successfully")
			log.debug("MorpheusHomeDashboardPlugin.initialize() - initialization completed successfully")
		} catch(e) {
			log.error("error initializing morpheus home dashboard plugin: ${e}", e)
		}
	}

	@Override
	void onDestroy() {
		log.debug("MorpheusHomeDashboardPlugin.onDestroy() called")
	}

}
