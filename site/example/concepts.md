# Concepts extracted from neon_map.js for reference

plotType 
oneOf 
      distributed_birdGrid: "",
      distributed_basePlot: "distributedBasePlot",
      distributed_mammalGrid: "mammal",
      distributed_mosquitoPlot: "mosquito",
      distributed_tickPlot: "tick",
      tower_basePlot: "towerPlot",
      tower_phenology: "phenology"

locationTypes
 oneOf
      {
        MET_STATION: "metStation",
        S1_LOC: "sensorStation",
        S2_LOC: "sensorStation",
        STAFF_GAUGE: "staffGaugeCamera",
        AOSreachTop: "reach-icon",
        AOSreachBottom: "reach-icon",
        riparian: "riparianAssessment",
        GROUNDWATER_WELL: "groundwaterWell",
        BUOY: "locationmarker",
        INLET_LOC: "sensorStation",
        OUTLET_LOC: "sensorStation",
      };


samplingBoundaries
airshedBoundaries

siteType = Aquatic
siteType = Terrestrial


switch(i) {
        /** TERRESTRIAL **/
        case 'distributed_birdGrid':
        this.markersDBG.push(data_marker);
        break;
        case 'distributed_basePlot':
        this.markersDBP.push(data_marker);
        break;
        case 'distributed_mammalGrid':
        this.markersDMG.push(data_marker);
        break;
        case 'distributed_mosquitoPlot':
        this.markersDMP.push(data_marker);
        break;
        case 'distributed_tickPlot':
        this.markersDTP.push(data_marker);
        break;
        case 'tower_basePlot':
        this.markersTBP.push(data_marker);
        break;
        case 'tower_phenology':
        this.markersTP.push(data_marker);
        break;
        /** AQUATIC **/
        case 'MET_STATION':
        this.markersMS.push(data_marker);
        break;
        case 'S1_LOC':
        this.markersSS.push(data_marker);
        break;
        case 'S2_LOC':
        this.markersSS.push(data_marker);
        break;
        case 'STAFF_GAUGE':
        this.markersSG.push(data_marker);
        break;
        case 'AOSreachTop':
        this.markersAR.push(data_marker);
        break;
        case 'AOSreachBottom':
        this.markersAR.push(data_marker);
        break;
        case 'riparian':
        this.markersRA.push(data_marker);
        break;
        case 'GROUNDWATER_WELL':
        this.markersGW.push(data_marker);
        break;
        case 'BUOY':
        this.markersMS.push(data_marker_MS);
        this.markersSS.push(data_marker_SS);
        break;
        case 'INLET_LOC':
        this.markersSS.push(data_marker);
        break;
        case 'OUTLET_LOC':
        this.markersSS.push(data_marker);
        break;
      }
    }
  }



case 'MET_STATION':
      popupDesc = 'Data collected via the shore meteorological station are comparable with flux tower measurements at terrestrial sites. Above water met stations on buoys are unique with different sensors and data frequencies due to power and data storage constraints.';
      break;
      case 'S1_LOC':
      popup2ndTitle = 'Upper Reach Sensor Station';
      popupDesc = 'Wadeable stream measurements include: water temperature, conductivity, water level (pressure transducer-based), PAR (below water), chlorophyll a, dissolved oxygen, pH, and turbidity. At non-wadeable rivers only water level (pressure transducer-based) is measured.';
      break;
      case 'S2_LOC':
      popup2ndTitle = 'Lower Reach Sensor Station';
      popupDesc = 'Wadeable stream measurements include: water temperature, conductivity, water level (pressure transducer-based), PAR (below water), chlorophyll a, dissolved oxygen, pH, turbidity, SUNA nitrate analyzer, and fluorescent dissolved organic matter (fDOM)';
      break;
      case 'STAFF_GAUGE':
      popupDesc = 'Gauge height, in meters, measured at lakes, wadeable rivers and non-wadeable streams. A phenocam is installed near most gauges. It collects RGB and IR images of the lake, river, or stream vegetation, stream surface, and stream gauge every 15 minutes.';
      break;
      case 'AOSreachTop':
      popupDesc = 'This marks the top of the aquatic observational sampling reach for streams and rivers. Observational sampling activities may include: Reaeration sampling;  water chemistry, isotopes, dissolved gas; zooplankton, phytoplankton; secchi depth profile; bathymetric and morphologic mapping; discharge; sediment chemistry; riparian assessment; macroinvertebrates, plants, algae, and microbes; and fish.';
      break;
      case 'AOSreachBottom':
      popupDesc = 'This marks the bottom of the aquatic observational sampling reach for streams and rivers. Observational sampling activities may include: Reaeration sampling; water chemistry, isotopes, dissolved gas; zooplankton, phytoplankton; secchi depth profile; bathymetric and morphologic mapping; discharge; sediment chemistry; riparian assessment; macroinvertebrates, plants, algae, and microbes; and fish.';
      break;
      case 'riparian':
      popupDesc = 'Locations for assessment of riparian vegetation composition and physical structure in lakes, non-wadeable rivers and wadeable streams; and assessment of riparian vegetation percent cover in wadeable streams.';
      break;
      case 'GROUNDWATER_WELL':
      popupDesc = 'Sensors measure high temporal resolution groundwater elevation (pressure transducer-based), temperature, and specific conductance.';
      break;
      case 'BUOY':
      popupDesc = 'Data collected include: water temperature, conductivity, water depth relative to bottom of the water body, PAR (below water), chlorophyll a, dissolved oxygen, pH, turbidity, SUNA nitrate analyzer, fluorescent dissolved organic matter (fDOM)';
      break;
      case 'INLET_LOC':
      popupDesc = 'INLET SENSOR STATION: Data collected include: water temperature, water level (pressure transducer-based), and PAR (below water)';
      break;
      case 'OUTLET_LOC':
      popupDesc = 'OUTLET SENSOR STATION: Data collected include: water temperature, water level (pressure transducer-based), PAR (below water)';
      break;


Tower Popup
 markup += '<div class="map-popup-title">Tower</div>';
      markup += '<div class="map-popup-content">';
      markup += '<div class="map-popup-id">Elevation: '+ tower_data['elevation (m)'] + ' m</div>';
      markup += '<div class="map-popup-latitude">Latitude: '+ data.geo.coordinates[0] + '</div>';
      markup += '<div class="map-popup-longitude">Longitude: '+ data.geo.coordinates[1] + '</div>';
      markup += '<div class="map-popup-towerheight">Tower Height: '+ tower_data['towerheight'] + '\'</div>';
      markup += '<div class="map-popup-modules">No. of measurement levels: '+ tower_data['num of mls'] + '</div>'


Domains metadata:
