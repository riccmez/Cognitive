const socket = io();

socket.emit('GetData',{msg:'hello'})

socket.on('Showdata',(msg)=>{
    // let series = msg.data
    let regressionOptions = {
        name:'Tendencia',
        type: 'linear',
        color: 'rgba(0, 0, 0, .7)',
        dashStyle:'dash'
    }
    let serie = {
        // regression:true,
        // regressionSettings:regressionOptions,
        name: 'Requests', data: msg.data,
        dashStyle:'longDash',
        marker:{radius:4,enabled: true}
    }
    console.log(msg.data);
    createChart('container',serie,'Daily Requests')
})

function createChart(containerId, serie, _title) {
    Highcharts.chart(containerId, {
        chart: {
            zoomType: 'x',
            type: 'column'
        },  
        tooltip: {
            shared: true
        },
        title: {
            text: _title
        },
        yAxis: {
            title: {
                text: 'Concentración de CO2 en PPM'
            },
        },
        xAxis: {
            type: 'datetime',
            labels:{
                format: '{value:%Y-%m-%d}'
            }
        },
        series: [serie]
    });

}