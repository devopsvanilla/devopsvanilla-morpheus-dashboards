/**
 * alarm counts and open alarm table
 * @author bdwheeler
 */
class RecentActivityWidget extends React.Component {

  constructor(props) {
    super(props);
    console.log('[RecentActivityWidget] Constructor called with props:', props);
    //set state
    this.state = {
      loaded: false,
      autoRefresh: true,
      data: null
    };
    //dataType
    this.state.type = 'all' //error, warnings, all?
    //apply state config
    if(props.autoRefresh == false)
      this.state.autoRefresh = false;
    //bind methods
    this.setData = this.setData.bind(this);
    this.refreshData = this.refreshData.bind(this);
    console.log('[RecentActivityWidget] Constructor completed, initial state:', this.state);
  }

  componentDidMount() {
    console.log('[RecentActivityWidget] componentDidMount called');
    this.loadData();
    $(document).on('morpheus:refresh', this.refreshData);
    console.log('[RecentActivityWidget] componentDidMount completed');
  }

  componentDidUpdate() {
    //refresh times
    Morpheus.timeService.refresh();
  }

  //data methods
  refreshData() {
    console.log('[RecentActivityWidget] refreshData called');
    if(this.state.autoRefresh == true)
      this.loadData();
  }

  loadData() {
    console.log('[RecentActivityWidget] loadData called');
    //call api for data...
    var apiQuery = '';
    var apiOptions = { max:5 };
    Morpheus.api.activity.recent(apiQuery, apiOptions).then(this.setData);
  }

  setData(results) {
    console.log('[RecentActivityWidget] setData called with results:', results);
    //set it
    var newState = {};
    newState.data = {};
    newState.data.config = results.config;
    newState.data.offset = results.offset;
    newState.data.max = results.max;
    //set the data list
    newState.data.items = results.activity;
    //mark it loaded
    newState.loaded = true;
    newState.data.loaded = true;
    newState.date = Date.now();
    newState.error = false;
    newState.errorMessage = null;
    //update the state
    console.log('[RecentActivityWidget] setData updating state:', newState);

    this.setState(newState);
  }

  render() {
    console.log('[RecentActivityWidget] render called, current state:', this.state);
    //setup
    var isLoaded = this.state.data && this.state.data.loaded == true;
    var itemList = isLoaded == true && this.state.data.items ? this.state.data.items : [];
    var showTable = isLoaded == true && itemList.length > 0;
    //render
    return (
      <Widget>
        <WidgetHeader icon="/assets/dashboard.svg#logs" title="Activity" titleCode="gomorpheus.label.activity" link="/operations/activity"/>
        <div className="dashboard-widget-content">
          <table className={'widget-table' + (showTable ? '' : ' hidden')}>
            <tbody>
              { itemList.map(row => (
                <tr key={row.id}>
                  <td className="col-md nowrap">
                    <svg className="icon">
                      <use href={'/assets/dashboard.svg#' + (row.success == false ? 'alert' : row.activityType.toLowerCase())}/>
                    </svg>
                    {row.name ? row.name : row.activityType}
                  </td>
                  <td className="col-md ts"><time dateTime={row.timestamp}/></td>
                  <td className="col-xxl nowrap">
                    {row.message ? row.message : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <EmptyWidget isEmpty={isLoaded == true && showTable != true}/>
          <LoadingWidget isLoading={isLoaded != true}/>
        </div>
      </Widget>
    );
  }

}

//register it
Morpheus.components.register('recent-activity-widget', RecentActivityWidget);

$(document).ready(function () {
  const root = ReactDOM.createRoot(document.querySelector('#recent-activity-widget'));
  root.render(<RecentActivityWidget/>)
});
