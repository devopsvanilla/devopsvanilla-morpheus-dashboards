/**
 * instance count by status
 * @author bdwheeler
 */
class EnvironmentCountWidget extends React.Component {
  
  constructor(props) {
    super(props);
    console.log('[EnvironmentCountWidget] Constructor called with props:', props);
    //set state
    this.state = {
      loaded: false,
      autoRefresh: true,
      data: null
    };
    //apply state config
    if(props.autoRefresh == false)
      this.state.autoRefresh = false;
    //bind methods
    this.loadData = this.loadData.bind(this);
    this.setData = this.setData.bind(this);
    this.refreshData = this.refreshData.bind(this);
    console.log('[EnvironmentCountWidget] Constructor completed, initial state:', this.state);
  }

  componentDidMount() {
    console.log('[EnvironmentCountWidget] componentDidMount called');
    //load the data
    this.loadData();
    //configure auto refresh
    $(document).on('morpheus:refresh', this.refreshData);
    console.log('[EnvironmentCountWidget] componentDidMount completed, auto-refresh listener attached');
  }

  //data methods
  refreshData() {
    console.log('[EnvironmentCountWidget] refreshData called, autoRefresh:', this.state.autoRefresh);
    if(this.state.autoRefresh == true)
      this.loadData();
  }

  loadData() {
    console.log('[EnvironmentCountWidget] loadData called');
    var now = new Date();
    var self = this;
    //call api for data..
    console.log('[EnvironmentCountWidget] Calling Morpheus.api.health.counts()');
    Morpheus.api.health.counts().then(this.setData);
  }

  setData(results) {
    console.log('[EnvironmentCountWidget] setData called with results:', results);
    var newState = {};
    newState.data = {};
    //set the data list
    newState.data.success = results.success;
    newState.data.groups = results.groups ? results.groups : 0;
    newState.data.clouds = results.clouds ? results.clouds : 0;
    newState.data.clusters = results.clusters ? results.clusters : 0;
    newState.data.instances = results.instances ? results.instances : 0;
    newState.data.apps = results.apps ? results.apps : 0;
    newState.data.resources = results.resources ? results.resources : 0;
    newState.data.users = results.users ? results.users : 0;
    //set loaded
    newState.loaded = true;
    newState.data.loaded = true;
    newState.date = Date.now();
    newState.error = false;
    newState.errorMessage = null;
    console.log('[EnvironmentCountWidget] setData updating state:', newState);
    //update the state
    this.setState(newState);
  }

  render() {
    console.log('[EnvironmentCountWidget] render called, current state:', this.state);
    //setup
    var isLoaded = this.state.data && this.state.data.loaded == true;
    var showChart = isLoaded == true && this.state.data.success == true;
    var countData = this.state.data ? this.state.data : {};
    console.log('[EnvironmentCountWidget] render - isLoaded:', isLoaded, 'showChart:', showChart, 'countData:', countData);
    //render
    return (
      <Widget>
        <WidgetHeader icon="/assets/dashboard.svg#provisioning" title={Morpheus.utils.message('gomorpheus.widget.title.environment')} titleCode="gomorpheus.widget.title.environment" />
        <div className={'dashboard-widget-content' + (showChart ? '' : ' hidden')}>
          <div className="row">
            <div className="col-xs-2 dashboard-widget-count count-rows">
              <span className="count-value">{countData.groups}</span>
              <span className="count-label">{Morpheus.utils.message('gomorpheus.label.groups')}</span>
            </div>
            <div className="col-xs-2 dashboard-widget-count count-rows">
              <span className="count-value">{countData.clouds}</span>
              <span className="count-label">{Morpheus.utils.message('gomorpheus.label.clouds')}</span>
            </div>
            <div className="col-xs-2 dashboard-widget-count count-rows">
              <span className="count-value">{countData.clusters}</span>
              <span className="count-label">{Morpheus.utils.message('gomorpheus.label.clusters')}</span>
            </div>
            <div className="col-xs-2 dashboard-widget-count count-rows">
              <span className="count-value">{countData.apps}</span>
              <span className="count-label">{Morpheus.utils.message('gomorpheus.label.apps')}</span>
            </div>
            <div className="col-xs-2 dashboard-widget-count count-rows">
              <span className="count-value">{countData.instances}</span>
              <span className="count-label">{Morpheus.utils.message('gomorpheus.label.instances')}</span>
            </div>
            <div className="col-xs-2 dashboard-widget-count count-rows">
              <span className="count-value">{countData.users}</span>
              <span className="count-label">{Morpheus.utils.message('gomorpheus.label.users')}</span>
            </div>
          </div>
        </div>
        <EmptyWidget isEmpty={isLoaded == true && showChart != true}/>
        <LoadingWidget isLoading={isLoaded != true}/>
      </Widget>
    );
  }

}

//register it
Morpheus.components.register('environment-count-widget', EnvironmentCountWidget);

$(document).ready(function () {
	const root = ReactDOM.createRoot(document.querySelector('#environment-count-widget'));
	root.render(<EnvironmentCountWidget/>)
});
