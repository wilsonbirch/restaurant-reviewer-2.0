/* eslint-disable camelcase */
$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
  });
});

$("#searchBtn").on("click", e => {
  e.preventDefault();

  const searchCity = $("#restaurantSearchCityInput")
    .val()
    .trim();

  let queryURL =
    "https://thefork.p.rapidapi.com/locations/auto-complete?text=" + searchCity;

  const locationSearch = {
    async: true,
    crossDomain: true,
    url: queryURL,
    method: "GET",
    headers: {
      "x-rapidapi-host": "thefork.p.rapidapi.com",
      "x-rapidapi-key": "e915407c69msh9ee027f59377df5p171a0bjsncb60597ede45"
    }
  };
  $.ajax(locationSearch).done(response => {
    const google_place_Id = response.data.geolocation[0].id.id;

    queryURL =
      "https://thefork.p.rapidapi.com/locations/list?google_place_id=" +
      google_place_Id;

    const cityIdSearch = {
      async: true,
      crossDomain: true,
      url: queryURL,
      method: "GET",
      headers: {
        "x-rapidapi-host": "thefork.p.rapidapi.com",
        "x-rapidapi-key": "e915407c69msh9ee027f59377df5p171a0bjsncb60597ede45"
      }
    };

    $.ajax(cityIdSearch).done(response => {
      const cityId = response.id_city;
      //const lat = response.coordinates.latitude;
      //const long = response.coordinates.longitude;

      queryURL =
        "https://thefork.p.rapidapi.com/restaurants/list?queryPlaceValueCityId=" +
        cityId;

      const finalRestSearch = {
        async: true,
        crossDomain: true,
        url: queryURL,
        method: "GET",
        headers: {
          "x-rapidapi-host": "thefork.p.rapidapi.com",
          "x-rapidapi-key": "e915407c69msh9ee027f59377df5p171a0bjsncb60597ede45"
        }
      };
      $.ajax(finalRestSearch).done(response => {
        console.log(response);
      });
    });
  });
});
