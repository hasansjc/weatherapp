const http=require('http');
const fs=require('fs');
var requests=require('requests');

const homeData=fs.readFileSync('home.html','utf-8');
const replaceVal =(tempVal, orgVal) =>{
        let temperature=tempVal.replace("{%tempval%}",orgVal.main.temp);
              temperature=temperature.replace("{%location%}" , orgVal.name);
              temperature=temperature.replace("{%mintemp%}" , orgVal.main.temp_min);
              temperature=temperature.replace("{%maxtemp%}" , orgVal.main.temp_max);
              temperature=temperature.replace("{%country%}" , orgVal.sys.country);
              
        return temperature;
}

const server=http.createServer((req,res)=>{
    if(req.url=='/'){
        requests('https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=4f618218fb946f13627606b4649eef9d')
        .on('data',(chunk)=>{
            const objdata=JSON.parse(chunk);
            const arrData=[objdata];
            var reaTimeData = arrData
            .map((val)=> replaceVal(homeData,val))
            .join("");
            console.log(reaTimeData);
            res.write(reaTimeData);
        })
        .on('end',(err)=>{
            if(err) return console.error('connection failed', err);
            res.end();
        })
        
    }
});
server.listen(3000,'127.0.0.1',()=>{
    console.log('listening to port 3000');
});