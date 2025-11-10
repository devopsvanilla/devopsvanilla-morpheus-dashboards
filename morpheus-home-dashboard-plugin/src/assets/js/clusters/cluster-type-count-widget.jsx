/**
 * cluster type count
 * @author bdwheeler
 */
class ClusterTypeCountWidget extends React.Component {

  constructor(props) {
    //props
    super(props);
    //state
    this.state = { 
      autoRefresh: true,
      data: null,
      loaded: false
    };
    this.state.chartConfig = this.configureChart();
    //refs
    //bind methods
    this.setData = this.setData.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.onLegendClick = this.onLegendClick.bind(this);
    console.log('[ClusterTypeCountWidget] Constructor completed, initial state:', this.state);
  }

  componentDidMount() {
    console.log('[ClusterTypeCountWidget] componentDidMount called');
    //load the data
    this.loadData();
    //auto refresh
    $(document).on('morpheus:refresh', this.refreshData);
    console.log('[ClusterTypeCountWidget] componentDidMount completed');
  }

  //data methods
  refreshData() {
    console.log('[ClusterTypeCountWidget] refreshData called');
    if(this.state.autoRefresh == true)
      this.loadData();
  }

  loadData(filter, options) {
    //load count
    Morpheus.api.clusters.count('group(type.shortName)').then(this.setData);
  }

  setData(results) {
    console.log('[ClusterTypeCountWidget] setData called with results:', results);
    //set it
    var newState = {};
    newState.data = {};
    newState.data.config = results.config;
    newState.data.meta = results.meta;
    //set the data list
    newState.data.items = []
    newState.data.total = 0;
    //extract the data
    var chartData = Morpheus.chart.extractNameValueData(results.items, 25, 100);
    newState.data.items = chartData.items;
    newState.data.total = chartData.total;
    //mark loaded
    newState.loaded = true;
    newState.data.loaded = true;
    newState.date = Date.now();
    newState.error = false;
    newState.errorMessage = null;
    //update the state
    console.log('[ClusterTypeCountWidget] setData updating state:', newState);

    this.setState(newState);
  }

  configureChart() {
    var self = this;
    var chartConfig = { 
      legend: {
        show: true,
        position: 'inset', 
        inset: { anchor:'top-left', x:100, y:0, step:100 }
      },
      donut: {
        position: 'left'
      },
      size: { height:140, width:340 },
      tooltip: {
        format: {
          value: () => ""
        }
      }
    };
    //set the tooltip
    chartConfig.tooltip = { show:true, contents:Morpheus.chart.defaultTooltip, format:{ title:Morpheus.chart.fixedTooltipTitle('Clusters') } };
    //additional config?
    return chartConfig;
  }

  onLegendClick(chart) {
    var total = 0;
    for(const item of chart.data()){
      if(chart.internal.isTargetToShow(item.id)){
        total += item.values[0].value;
      }
    }
    $('.c3-chart-arcs-title', $(chart.element)).text(total);
  }

  render() {
    console.log('[ClusterTypeCountWidget] render called, current state:', this.state);
    //setup
    //render
    return(
      <Widget widgetClass="chart-legend-right">
        <WidgetHeader title="Cluster Types" icon="/assets/infrastructure/clusters.svg#Layer_1" link="/infrastructure/clusters"/>
        <DonutChartWidget data={this.state.data} config={this.state.chartConfig} onLegendClick={this.onLegendClick}/>
      </Widget>
    );
  }

}

//register it
Morpheus.components.register('cluster-type-count-widget', ClusterTypeCountWidget);

$(document).ready(function() {
  const root = ReactDOM.createRoot(document.querySelector('#cluster-type-count-widget'));
  root.render(<ClusterTypeCountWidget/>)
});
