/**
 * Custom Widget - Embed external URL content
 * Supports configurable URL, title, height, and auto-refresh
 * @author DevOps Vanilla
 */
class CustomWidget extends React.Component {

  constructor(props) {
    super(props);

    // Parse widget configuration from props
    const config = this.parseConfig(props);

    // Set initial state
    this.state = {
      loaded: false,
      autoRefresh: config.autoRefresh,
      externalUrl: config.externalUrl,
      widgetTitle: config.widgetTitle || 'Custom Content',
      widgetHeight: config.widgetHeight || 400,
      refreshInterval: config.refreshInterval || 300,
      showBorder: config.showBorder || false,
      iframeKey: 0,
      error: null,
      errorMessage: null
    };

    // Bind methods
    this.loadData = this.loadData.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.reloadIframe = this.reloadIframe.bind(this);
    this.parseConfig = this.parseConfig.bind(this);
    this.handleIframeLoad = this.handleIframeLoad.bind(this);
    this.handleIframeError = this.handleIframeError.bind(this);
  }

  componentDidMount() {
    // Mark as loaded once component is mounted
    this.loadData();

    // Configure auto refresh listener
    $(document).on('morpheus:refresh', this.refreshData);

    // Set up automatic refresh interval if enabled
    if (this.state.autoRefresh && this.state.refreshInterval > 0) {
      this.refreshTimer = setInterval(() => {
        this.reloadIframe();
      }, this.state.refreshInterval * 1000);
    }
  }

  componentWillUnmount() {
    // Clean up event listeners and timers
    $(document).off('morpheus:refresh', this.refreshData);
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  /**
   * Parse configuration from props
   * Configuration can come from dashboard item config
   */
  parseConfig(props) {
    const config = {};

    // Check if config exists in props
    if (props.config) {
      config.externalUrl = props.config.externalUrl || '';
      config.widgetTitle = props.config.widgetTitle || 'Custom Content';
      config.widgetHeight = parseInt(props.config.widgetHeight) || 400;
      config.autoRefresh = props.config.autoRefresh === 'on' || props.config.autoRefresh === true;
      config.refreshInterval = parseInt(props.config.refreshInterval) || 300;
      config.showBorder = props.config.showBorder === 'on' || props.config.showBorder === true;
    } else {
      // Default values
      config.externalUrl = '';
      config.widgetTitle = 'Custom Content';
      config.widgetHeight = 400;
      config.autoRefresh = false;
      config.refreshInterval = 300;
      config.showBorder = false;
    }

    return config;
  }

  /**
   * Load initial data
   */
  loadData() {
    // Validate URL
    if (!this.state.externalUrl || this.state.externalUrl.trim() === '') {
      this.setState({
        loaded: true,
        error: true,
        errorMessage: 'No external URL configured. Please configure the widget.'
      });
      return;
    }

    // Mark as loaded
    this.setState({
      loaded: true,
      error: false,
      errorMessage: null
    });
  }

  /**
   * Handle refresh event from Morpheus
   */
  refreshData() {
    if (this.state.autoRefresh === true) {
      this.reloadIframe();
    }
  }

  /**
   * Reload the iframe by changing its key
   */
  reloadIframe() {
    this.setState(prevState => ({
      iframeKey: prevState.iframeKey + 1
    }));
  }

  /**
   * Handle iframe load event
   */
  handleIframeLoad() {
    // Clear any previous errors
    this.setState({
      error: false,
      errorMessage: null
    });
  }

  /**
   * Handle iframe error event
   */
  handleIframeError() {
    this.setState({
      error: true,
      errorMessage: 'Failed to load external content. The URL may not support embedding or may be unreachable.'
    });
  }

  render() {
    const { loaded, externalUrl, widgetTitle, widgetHeight, showBorder, iframeKey, error, errorMessage } = this.state;

    // Check if we have a valid configuration
    const hasValidConfig = externalUrl && externalUrl.trim() !== '';
    const showContent = loaded && hasValidConfig && !error;
    const showError = loaded && (error || !hasValidConfig);

    // Iframe styles
    const iframeStyle = {
      width: '100%',
      height: widgetHeight + 'px',
      border: showBorder ? '1px solid #ddd' : 'none',
      borderRadius: '4px'
    };

    return (
      <Widget>
        <WidgetHeader
          icon="/assets/dashboard.svg#provisioning"
          title={widgetTitle}
        />

        {showContent && (
          <div className="dashboard-widget-content" style={{ padding: '10px' }}>
            <iframe
              key={iframeKey}
              src={externalUrl}
              style={iframeStyle}
              onLoad={this.handleIframeLoad}
              onError={this.handleIframeError}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              title={widgetTitle}
            />
          </div>
        )}

        {showError && (
          <div className="dashboard-widget-content" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="alert alert-warning" style={{ margin: '20px' }}>
              <i className="fa fa-exclamation-triangle" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
              <p style={{ margin: '10px 0' }}>
                <strong>Configuration Required</strong>
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                {errorMessage || 'Please configure the external URL in the widget settings.'}
              </p>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
                Click the widget settings icon to configure the URL and other options.
              </p>
            </div>
          </div>
        )}

        <LoadingWidget isLoading={!loaded} />
      </Widget>
    );
  }
}

// Register the component
Morpheus.components.register('custom-widget', CustomWidget);

// Initialize on document ready
$(document).ready(function() {
  const element = document.querySelector('#custom-widget');
  if (element) {
    // Get configuration from data attributes if available
    const config = {
      externalUrl: element.getAttribute('data-external-url') || '',
      widgetTitle: element.getAttribute('data-widget-title') || 'Custom Content',
      widgetHeight: element.getAttribute('data-widget-height') || '400',
      autoRefresh: element.getAttribute('data-auto-refresh') || 'off',
      refreshInterval: element.getAttribute('data-refresh-interval') || '300',
      showBorder: element.getAttribute('data-show-border') || 'off'
    };

    const root = ReactDOM.createRoot(element);
    root.render(<CustomWidget config={config} />);
  }
});
