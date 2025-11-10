/**
 * cloud count by type
 * @author bdwheeler
 */
class CloudCountTypeWidget extends React.Component {
  
  constructor(props) {
    //props
    super(props);
    //state
    this.state = { 
      loaded: false,
      autoRefresh: true,
      data: null,
      chartId: Morpheus.utils.generateGuid()
    };
    this.state.chartConfig = this.configureChart();
    //refs
    //bind methods
    this.setData = this.setData.bind(this);
    this.loadData = this.loadData.bind(this);
    this.refreshData = this.refreshData.bind(this);
    console.log('[CloudCountTypeWidget] Constructor completed, initial state:', this.state);
  }

  componentDidMount() {
    console.log('[CloudCountTypeWidget] componentDidMount called');
    //load the data
    this.loadData();
    //auto refresh
    $(document).on('morpheus:refresh', this.refreshData);
    //search selector?
    if(this.props.searchSelector)
      $(document).on('morpheus:list.search' + this.props.searchSelector, this.loadData);
    console.log('[CloudCountTypeWidget] componentDidMount completed');
  }

  //data methods
  refreshData() {
    console.log('[CloudCountTypeWidget] refreshData called');
    if(this.state.autoRefresh == true)
      this.loadData();
  }

  loadData(filter, options) {
    //load count
    var searchOptions = {};
    //apply search config
    if(this.props.searchSelector)
      Morpheus.api.applySearchData(this.props.searchSelector, searchOptions);
    //execute search
    Morpheus.api.clouds.count('group(zoneType.name:count(id))', searchOptions).then(this.setData);
  }

  setData(results) {
    console.log('[CloudCountTypeWidget] setData called with results:', results);
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
    console.log('[CloudCountTypeWidget] setData updating state:', newState);

    this.setState(newState);
  }

  configureChart() {
    var self = this;
    var chartConfig = { 
      legend: {
        position: 'inset', 
        inset: { anchor:'top-left', x:100, y:0, step:100 }
      },
      size: { height:140, width:340 },
      donut: {
        position: 'left'
      }
    };
    //set the tooltip
    chartConfig.tooltip = { show:true, contents:Morpheus.chart.defaultTooltip, format:{ title:Morpheus.chart.fixedTooltipTitle('Clouds') } };
    //additional config?
    return chartConfig;
  }

  render() {
    console.log('[CloudCountTypeWidget] render called, current state:', this.state);
    //setup
    //render
    return(
      <Widget widgetClass="chart-legend-right">
        <WidgetHeader icon="/assets/infrastructure/clouds.svg#Layer_1" title="Cloud Types" link="/infrastructure/clouds"/>
        <DonutChartWidget tooltip="morpheus-value" data={this.state.data} config={this.state.chartConfig}/>
      </Widget>
    );
  }

}

//register it
Morpheus.components.register('cloud-count-type-widget', CloudCountTypeWidget);

$(document).ready(function() {
	const root = ReactDOM.createRoot(document.querySelector('#cloud-count-type-widget'));
	root.render(<CloudCountTypeWidget/>)
});
