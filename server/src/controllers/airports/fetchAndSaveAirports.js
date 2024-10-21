const airportSchema = require('../../models/airports.js');
const axios = require('axios');

const fetchAndSaveAirports = async (req, res) => {
    try {
        const apiKey = '4Jq6/dW1y6cSXWFo0qASJQ==Px8bjClo9xbpVik0';
        let offset = 6180;
        let completed = false;

        while (!completed) {
            const response = await axios.get(`https://api.api-ninjas.com/v1/airports?max_elevation=15000&offset=${offset}`, {
                headers: {
                    'X-Api-Key': apiKey,
                },
            });
            const airports = response.data;
            if (airports.length === 0) {
                completed = true;
            } else {
                offset += 30;
                for (const airport of airports) {
                    const existingAirport = await airportSchema.findOne({ icao: airport.icao });

                    if (!existingAirport) {
                        const newAirport = new airportSchema({
                            icao: airport.icao,
                            iata: airport.iata || '',
                            name: airport.name,
                            city: airport.city || '',
                            region: airport.region,
                            country: airport.country,
                            elevation_ft: airport.elevation_ft || null,
                            latitude: airport.latitude,
                            longitude: airport.longitude,
                            timezone: airport.timezone,
                        });
                        await newAirport.save();
                    }
                }
            }
        }

        res.status(200).json({ message: 'Aeropuertos guardados exitosamente' });
    } catch (error) {
        console.error('Error al obtener y guardar aeropuertos:', error);
        res.status(500).json({ error: 'Error al obtener y guardar aeropuertos' });
    }
};

module.exports = fetchAndSaveAirports;