//*******************************************************************************************
//  CONTROL FOR WHAT IS SELECTED
//  starts at these values, as user changes selections they will update
//*******************************************************************************************

selected_county = "0500000US17031"
// selected_var1 = "median_home_value";
// selected_var2 = "median_income";
// selected_var3 = "population"

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

// Reference: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

buildTable(selected_county);

// set up ChartBuilder function
function TableBuilder(){
    buildTable(selected_county);
};

function buildTable(county) {

  selected_county = county
//   selected_var1 = var1
//   selected_var2 = var2
//   selected_var3 = var3
//   console.log(`current selected county is ${county}`)
//   console.log(`current selected variable 1 is ${var1}`)
//   console.log(`current selected variable 2 is ${var2}`)
//   console.log(`current selected variable 3 is ${var3}`)

  d3.json(`/summarycard/${county}/${selectedYear}`).then((data) => {
    const median_income = "$" + numberWithCommas(data["0"].median_income);
    const year = data["0"].year;
    const median_home_value = "$" + numberWithCommas(data["0"].median_home_value);
    const pop = numberWithCommas(data["0"].population);
    const county = data["0"].county;
    const total_housing_units = numberWithCommas(data["0"].total_housing_units);
    const median_rent = "$" + numberWithCommas(data["0"].median_rent);
    const median_rooms = data["0"].median_rooms
    const owned = Math.round(data["0"].owner_percent * 100) + "%"
    const occupied = Math.round(data["0"].occupied_percent * 100) + "%"
    const per_pop = Math.round(data["0"].percentile_population)
    const per_housing = Math.round(data["0"].percentile_total_housing_units)
    const per_income = Math.round(data["0"].percentile_median_income)
    const per_homevalue = Math.round(data["0"].percentile_median_home_value)
    const per_rent = Math.round(data["0"].percentile_median_rent)
    const per_rooms = Math.round(data["0"].percentile_median_rooms)
    const per_owned = Math.round(data["0"].percentile_owner_percent)
    const per_occupied = Math.round(data["0"].percentile_occupied_percent)
    const value_to_income = data["0"].value_to_income.toFixed(2)
    const per_valueincome = Math.round(data["0"].percentile_valueincome)




    console.log(data) 
        //Dot chart
        
        var attributes = [`<b>Population </b>: ${pop} `,`<b>Total Housing Units </b>: ${total_housing_units} `,`<b>Median Income </b>: ${median_income} `,`<b>Median Home Value </b>: ${median_home_value} `,`<b>Value-Income Ratio </b>: ${value_to_income} `,`<b>Median Rent </b>: ${median_rent} `,`<b>Median Rooms </b>: ${median_rooms} `,`<b>Units Owned </b>: ${owned} `,`<b>Units Occupied </b>: ${occupied} `]
        var percentiles = [per_pop,per_housing,per_income,per_homevalue,per_valueincome,per_rent,per_rooms,per_owned,per_occupied];
        var values = [pop, total_housing_units,median_income, median_home_value, value_to_income, median_rent, median_rooms, owned, occupied];

        var trace1 = {
          type: 'scatter',
          x: percentiles,
          y: attributes,
          mode: 'markers',
          name: 'Percentile',
          marker: {
            color: percentiles, cmin: 0, cmax: 100,
            colorscale: [
              ['0.0', 'rgb(245, 54, 42)'],
              ['0.1', 'rgb(214, 49, 39)'],
              ['0.2', 'rgb(150, 34, 27)'],
              ['0.3', 'rgb(102, 23, 18)'],
              ['0.4', 'rgb(0,0,0)'],
              ['0.5', 'rgb(0,0,0)'],
              ['0.6', 'rgb(0,0,0)'],
              ['0.7', 'rgb(29, 32, 89)'],
              ['0.8', 'rgb(45, 50, 140)'],
              ['0.9', 'rgb(62, 70, 201)'],
              ['1.0', 'rgb(78, 88, 245)']],
            line: {
              color: '#000000',
              width: 1,
            },
            symbol: 'circle',
            size: 16
          }
        };

        var trace2 = {
          type: 'scatter',
          x: [50,50,50,50,50,50,50,50,50],
          y: attributes,
          mode: 'markers',
          hoverinfo: 'none',
          marker: {
            color: '#E1E1E1',
            symbol: 'circle',
            size: 8
          }
        };
    
        
        var data = [trace2, trace1];
        
        var layout = {
          title: `<br>Overview: ${county} (${year})`,
          showlegend: false,
          xaxis: {
            title: {text: "Percentile"},
            showgrid: false,
            zeroline: false,
            tickvals: [0,50,100],
            range: [-7,107],
            linecolor: 'rgb(102, 102, 102)',
            titlefont: {
              font: {
                color: 'rgb(204, 204, 204)'
              }
            },
            tickfont: {
              font: {
                color: 'rgb(102, 102, 102)'
              }
            },
            ticks: 'outside',
            tickcolor: 'rgb(102, 102, 102)',
          },
          yaxis: {
            autorange: "reversed",
            linecolor: 'white',
            gridwidth: 3,
            gridcolor: '#E1E1E1',
          },
          margin: {
            l: 220,
            r: 40,
            b: 90,
            t: 110
          },
          width: 400,
          height: 550,
          hovermode: 'closest'
        };
        
        Plotly.newPlot('summary-card', data, layout);

      



        // Basic data table
//     var table_values = [
//         ['<b>Population</b>',"<b>Total Housing Units</b>",'<b>Median Income</b>','<b>Median Home Value</b>','<b>Value-Income Ratio</b>',"<b>Median Rent</b>","<b>Median Rooms</b>","<b>Units Owned</b>","<b>Units Occupied</b>"],
//         [pop, total_housing_units,median_income, median_home_value, value_to_income, median_rent, median_rooms, owned, occupied],
//         [per_pop,per_housing,per_income,per_homevalue,per_valueincome,per_rent,per_rooms,per_owned,per_occupied]]
  
    
//     var data = [{
//     type: 'table',
//     header: {
//         values: [["<b>Attribute</b>"],   
//                     ["<b>Value</b>"],   
//                     ["<b>Percentile</b>"]],
//         align: ["left", "center"],
//         line: {width: 0.25, color: 'black'},
//         fill: {color: 'gray'},
//         font: {family: "Arial", size: 18, color: "white"}
//     },
//     cells: {
//         values: table_values,
//         align: ["left", "center"],
//         height:25,
//         line: {color: "black", width: 0.25},
//         font: {family: "Arial", size: 12, color: ["#506784"]}
//     }

//     }]

// var layout = {
//     title: `Overview: ${county} (${year})`,
//     margin: {
//         l: 10,
//         r: 10,
//         b: 50,
//         t: 50,
//         pad: 1
//       },
//     }  
  
//   Plotly.plot('summary-card', data, layout);
  });
  
  
}

// //*******************************************************************************************
// //  RESPONDS TO DROPDOWN MENUSELECTIONFOR TIMESERIES CHART
// //  rebuilds charts based on dropdowns
// //*******************************************************************************************
// function NewVar1(new_var1){
//   selected_var1 = new_var1
//   console.log(`${selected_var1} is the new variable 1 selection`);
//   // buildCharts(selected_county, selected_var1, selected_var2, selected_var3);
//   ChartBuilder()
// }

// function NewVar2(new_var2){
//   selected_var2 = new_var2
//   console.log(`${selected_var2} is the new variable 2 selection`);
//   // buildCharts(selected_county, selected_var1, selected_var2, selected_var3);
//   ChartBuilder()
// }

// function NewVar3(new_var3){
//   selected_var3 = new_var3
//   console.log(`${selected_var3} is the new variable 3 selection`);
//   //buildCharts(selected_county, selected_var1, selected_var2, selected_var3);
//   ChartBuilder()
// }


function county_select(new_county){
  selected_county = new_county
  console.log(`County changed to ${new_county}`)
  buildTable(selected_county);
}