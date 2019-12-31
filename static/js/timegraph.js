//*******************************************************************************************
//  CONTROL FOR WHAT IS SELECTED
//  starts at these values, as user changes selections they will update
//*******************************************************************************************

selected_county = "0500000US17031"
selected_var1 = "median_home_value";
selected_var2 = "median_income";
selected_var3 = "population"

//*******************************************************************************************
//  FRIENDLY NAME CONVERTER
//  Converts database SQL column names to friendly syntax for users
//*******************************************************************************************

function friendlyName(i){
  if (i == "total_housing_units") {
    return "Total Housing Units";
  }
  else if (i == "total_housing_units_occupied") {
    return  "Total Housing Units (Occupied)";
  }
  else if (i == "median_rooms") {
    return  "Median Rooms";
  }
  else if (i == "owner_occupied_units") {
    return  "Owner Occupied Units";
  }
  else if (i == "renter_occupied_units") {
    return  "Renter Occupied Units";
  }
  else if (i == "median_home_value") {
    return  "Median Home Value";
  }
  else if (i == "median_rent") {
    return  "Median Rent";
  }
  else if (i == "monthly_cost_with_mortgage") {
    return  "Monthly Cost - With Mortgage";
  }
  else if (i == "monthly_cost_no_mortgage") {
    return  "Monthly Cost - No Mortgage";
  }
  else if (i == "median_income") {
    return  "Median Income";
  }
  else if (i == "population") {
    return  "Population";
  }
}

//*******************************************************************************************
//  BUILD TIME SERIES CHARTS FUNCTION
//  for initial load and which state view is desired
//*******************************************************************************************

buildChart(selected_county, selected_var1, selected_var2, selected_var3);

// set up ChartBuilder function
function ChartBuilder(){
  buildChart(selected_county, selected_var1, selected_var2, selected_var3);
};


function buildChart(county, var1, var2, var3) {

  selected_county = county
  selected_var1 = var1
  selected_var2 = var2
  selected_var3 = var3
  console.log(`current selected county is ${county}`)
  console.log(`current selected variable 1 is ${var1}`)
  console.log(`current selected variable 2 is ${var2}`)
  console.log(`current selected variable 3 is ${var3}`)

  d3.json(`/timeseries/${county}`).then((data) => {
    //const median_income = data.median_income;
    //const year = data.year;
    //const median_home_value = data.median_home_value;
    //const pop = data.population;
    // Build a Bubble Chart
    
    let trace1 = {
      x: [],
      y: [],
      name: friendlyName(var1),
      type: 'scatter',
      opacity: 0.65,
      marker: {
        color: '#62ac42', // //6db94d
        size: 8
      },
      line: {
        color: '#62ac42',
        width: 3,
        //dash: 'dash'
      }
    };
    let trace2 = {
      x: [],
      y: [],
      name: friendlyName(var2),
      yaxis: 'y2',
      type: 'scatter',
      opacity: 0.65,
      marker: {
        color: '#2685b5',
        size: 8
      },
      line: {
        color: '#2685b5',
        width: 3,
        //dash:'dot'
      }
    };

    let trace3 = {
      x: [],
      y: [],
      name: friendlyName(var3),
      yaxis: 'y3',
      type: 'scatter',
      opacity: 0.65,
      marker: {
        color: '#ca7979',
        size: 8
      },
      line: {
        color: '#ca7979, 0.1',
        width: 3,
        //dash: 'dashdot'
      }
    };

    data.forEach(function(val) {
      trace1.x.push(val["year"]);
      trace1.y.push(val[var1]);
      trace2.x.push(val["year"]);
      trace2.y.push(val[var2]);
      trace3.x.push(val["year"]);
      trace3.y.push(val[var3]);
    });

    

    var data = [trace1, trace2, trace3];
    console.log(data)

    var layout = {
      title: {
        text: friendlyName(var1) + ", " +  friendlyName(var2) +  ", and <br> " + friendlyName(var3) + " Over Time",
        font:{size:16},
        y:0.92
      },
      //yaxis: {domain: [0.2, 1.5]},
      xaxis: {domain: [0.3, 0.1]},
      hoverlabel: { 
        font: {
              color: 'white'
              },
      },
      showlegend: true,
      //width: 800,
      legend: {
        "orientation": "h",
        x: 0.05,
        y: 1.12, // -0.3//.
        // x: 0.0,
        // y: 1.3, // -0.3//.
        bgcolor: 'rgba(0,0,0,0)'
      },
      // plot_bgcolor:"black",
      // paper_bgcolor:"#FFF3",
      margin: {
        l: 40,
        r: 70,
        //b: 50,
        //t: 15,
        pad: 3
      },
      hovermode: 'x',
      showspikes: true,
      spikemode: 'across+toaxis',
      spikedash: 'solid',
      spikesnap: 'cursor',
      showline: true,
      showgrid: true,
      spikedistance: -1,
      

      xaxis: {
        title: 'Year',
        showspikes: true,
        spikemode: 'across',
        spikesnap: 'cursor',
        showline: true,
        showgrid: true,
        domain: [0.05, 0.90],
      },

      yaxis: {
        title: friendlyName(var1),
        titlefont: {color: '#62ac42'},//#1f76b4
        tickfont: {color: '#62ac42'},//#1f76b4
        showgrid: true,
        position: 0.08
      },
      
      yaxis2: {
        title: friendlyName(var2),
        titlefont: {color: '#2685b5'}, //4aa9d9 //#ff7e0e
        tickfont: {color: '#2685b5'}, //4aa9d9 //#ff7e0e
        anchor: 'free',
        overlaying: 'y',
        side: 'right',
        position: 0.87,
        showgrid: false,
        //rangemode:'tozero'   
      },
      yaxis3: {
        title: friendlyName(var3),
        titlefont: {color: '#ca7979'},//#2ca02c
        tickfont: {color: '#ca7979'},//#2ca02c
        anchor: 'free',
        overlaying: 'y',
        side: 'right',
        position: 1,
        showgrid: false,
        //rangemode:'tozero'  

      },
      

    };

    Plotly.newPlot('line-chart', data, layout);
  });
  
  
}

//*******************************************************************************************
//  RESPONDS TO DROPDOWN MENUSELECTIONFOR TIMESERIES CHART
//  rebuilds charts based on dropdowns
//*******************************************************************************************
function NewVar1(new_var1){
  selected_var1 = new_var1
  console.log(`${selected_var1} is the new variable 1 selection`);
  // buildCharts(selected_county, selected_var1, selected_var2, selected_var3);
  ChartBuilder()
}

function NewVar2(new_var2){
  selected_var2 = new_var2
  console.log(`${selected_var2} is the new variable 2 selection`);
  // buildCharts(selected_county, selected_var1, selected_var2, selected_var3);
  ChartBuilder()
}

function NewVar3(new_var3){
  selected_var3 = new_var3
  console.log(`${selected_var3} is the new variable 3 selection`);
  //buildCharts(selected_county, selected_var1, selected_var2, selected_var3);
  ChartBuilder()
}
