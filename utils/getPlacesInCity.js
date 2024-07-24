const axios = require('axios');
const getDataAboutPlace = require('./getDataAboutPlace');

// Your Google Places API Key
const apiKey = 'AIzaSyBOzf-XaussCXmQ7jdKxZriWMjLcqPZDbo';

// Function to fetch places and get data about each place
const fetchPlaces = async (location, radius = 10000, types = ['historical', 'tourist_attraction']) => {
  // Construct the API URL for Nearby Search
  const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${types.join('|')}&key=${apiKey}`;

  try {
    // Fetch places from Places API
    const response = await axios.get(apiUrl);
    const places = response.data.results;

    // Array to store the results
    const results = [];

    for (const place of places) {
      // Get additional data about the place using Place Details API
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,vicinity,formatted_phone_number,geometry&key=${apiKey}`;
      const detailsResponse = await axios.get(detailsUrl);
      const placeDetails = detailsResponse.data.result;

      // Create a place object
      const placeData = {
        name: placeDetails.name,
        address: placeDetails.vicinity,
        location: {
          lat: placeDetails.geometry.location.lat,
          lng: placeDetails.geometry.location.lng
        },
        phoneNumber: placeDetails.formatted_phone_number || 'N/A', // Use 'N/A' if phone number is not available
        additionalData: await getDataAboutPlace(placeDetails.name) // Fetch additional data
      };

      // Add place data to results
      results.push(placeData);
    }

    // Return the results array
    return results;
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
};

module.exports = fetchPlaces;
