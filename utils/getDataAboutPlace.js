const axios = require('axios');


const GOOGLE_API_KEY = 'AIzaSyBOzf-XaussCXmQ7jdKxZriWMjLcqPZDbo';

// Function to search for a place by query
const searchPlace = async (query) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
            params: {
                query: query,
                key: GOOGLE_API_KEY
            }
        });

        if (response.data.results.length > 0) {
            const placeId = response.data.results[0].place_id;
            return placeId;
        } else {
            throw new Error('No place found');
        }
    } catch (error) {
        console.error('Error searching for place:', error.message);
        return null;
    }
};

// Function to get detailed information about a place by placeId
const getPlaceDetails = async (placeId) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: placeId,
                key: GOOGLE_API_KEY,
                fields: 'name,geometry,editorial_summary,photos'
            }
        });

        const result = response.data.result;
        const description = result.editorial_summary ? result.editorial_summary.overview : 'No description available';
        
        // Fetch photos
        const photos = result.photos ? result.photos.map(photo => {
            return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`;
        }) : [];

        return {description, photos };
    } catch (error) {
        console.error('Error fetching place details:', error.message);
        return null;
    }
};

// Function to get place information based on the query
const getPlaceInfo = async (query) => {
    const placeId = await searchPlace(query);
    if (placeId) {
        const details = await getPlaceDetails(placeId);
        return details;  // Return the details object
    } else {
        return { error: 'Place not found' };  // Return an error message
    }
};

// Example usage
// getPlaceInfo('Port Said Military Museum').then(details => console.log(details));

module.exports = getPlaceInfo;
