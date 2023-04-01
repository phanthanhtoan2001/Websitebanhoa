import React, { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const GoogleMap = ({ onLocationSelect }) => {
    const [address, setAddress] = useState("");

    const handleSelect = async (value) => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        setAddress(value);
        onLocationSelect(latLng);
    };

    return (
        <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={handleSelect}
            searchOptions={{ types: ['(regions)'] }}
            googleCallbackName={'initMap'}
        >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                    <input {...getInputProps({ placeholder: "Enter your address" })} />
                    <div>
                        {loading ? <div>Loading...</div> : null}
                        {suggestions.map((suggestion) => {
                            const style = {
                                backgroundColor: suggestion.active ? '#41b6e6' : '#fff'
                            };
                            return (
                                <div {...getSuggestionItemProps(suggestion, { style })}>
                                    {suggestion.description}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </PlacesAutocomplete>
    );
};

export default GoogleMap;
