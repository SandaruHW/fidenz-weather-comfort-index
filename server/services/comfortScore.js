function calculateComfortScore (weather){

    if(!weather || !weather.main || !weather.wind || !weather.clouds){
        return 0; //fallback if data is missing
    }

    const tempC = weather.main.temp; // in celsius
    const humidity = weather.main.humidity; // in percentage
    const windSpeed = weather.wind.speed; // in m/s
    const cloudiness = weather.clouds.all; // in percentage (0% = clear sky, 100% = overcast)

    //Individual sub scores
    //Temperature Score (ideal range: 20-25°C), quadratic penalty outside this range
    const tempScore = Math.max(0, 100 - Math.pow(Math.abs(tempC - 23), 1.8) * 3.5);
    
    //Humidity Score (ideal range: 40-60%), stronger penalty outside this range
    const humScore = Math.max(0, 100 - Math.max(0, Math.abs(humidity - 50) * 2 - 20));

    //Wind Score (ideal range: 2-5 m/s), too calm or too windy reduces comfort
    const windScore = Math.max(0, 100 - Math.abs(windSpeed - 3.5) * 12);

    //Cloudiness Score (ideal range: 30-60%), full sun or overcast less ideal
    const cloudScore = Math.max(0, 100 - Math.abs(cloudiness - 45) * 1.2);

    //Weighted sum -> temeperature 40%, humidity 25%, wind 20%, cloudiness 15%
    const score = 
        tempScore * 0.4 +
        humScore * 0.25 +
        windScore * 0.2 +
        cloudScore * 0.15;

    //Clamp final score between 0 and 100, rounded to nearest integer  
    return Math.round(Math.max(0, Math.min(100, score)));    
}

module.exports = {
    calculateComfortScore
};