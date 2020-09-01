//let searchedRestaurantArray = [];

$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
  });
  getSearchedRestaurants();
});

// Search restaurants by city
$("#searchCityBtn").on("click", e => {
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
      "x-rapidapi-key": "b388625a40mshaedce519e1c44cbp1d3075jsn5e9957639235"
    }
  };
  $.ajax(locationSearch).done(response => {
    const googlePlaceId = response.data.geolocation[0].id.id;

    queryURL =
      "https://thefork.p.rapidapi.com/locations/list?google_place_id=" +
      googlePlaceId;

    const cityIdSearch = {
      async: true,
      crossDomain: true,
      url: queryURL,
      method: "GET",
      headers: {
        "x-rapidapi-host": "thefork.p.rapidapi.com",
        "x-rapidapi-key": "b388625a40mshaedce519e1c44cbp1d3075jsn5e9957639235"
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
          "x-rapidapi-key": "b388625a40mshaedce519e1c44cbp1d3075jsn5e9957639235"
        }
      };
      $.ajax(finalRestSearch).done(response => {
        let i;
        //console.log(response);
        for (i = 0; i <= 3; i++) {
          postSearchedRestaurant(
            response.data[i].name,
            response.data[i].address.locality,
            response.data[i].servesCuisine,
            response.data[i].mainPhoto.source,
            response.data[i].id
          );
        }
        window.location.reload();
      });
    });
  });
});

//Search any restaurant by name (EU)
$("#searchNameBtn").on("click", e => {
  e.preventDefault();

  const searchName = $("#restaurantSearchNameInput")
    .val()
    .trim();

  const queryURL =
    "https://thefork.p.rapidapi.com/restaurants/auto-complete?text=" +
    searchName;

  const restNameSearch = {
    async: true,
    crossDomain: true,
    url: queryURL,
    method: "GET",
    headers: {
      "x-rapidapi-host": "thefork.p.rapidapi.com",
      "x-rapidapi-key": "b388625a40mshaedce519e1c44cbp1d3075jsn5e9957639235"
    }
  };

  $.ajax(restNameSearch).done(response => {
    const searchRestId = response.data.autocomplete[0].id;

    const searchRestIdInfo = {
      async: true,
      crossDomain: true,
      url:
        "https://thefork.p.rapidapi.com/restaurants/get-info?locale=en_US&id_restaurant=" +
        searchRestId,
      method: "GET",
      headers: {
        "x-rapidapi-host": "thefork.p.rapidapi.com",
        "x-rapidapi-key": "b388625a40mshaedce519e1c44cbp1d3075jsn5e9957639235"
      }
    };

    $.ajax(searchRestIdInfo).done(response => {
      console.log(response.data);
    });
  });
});

function postSearchedRestaurant(name, city, cuisine, photo, restId) {
  $.post("/api/searchedRestaurants", {
    name: name,
    city: city,
    cuisine: cuisine,
    photo: photo,
    restId: restId
  });
}

function getSearchedRestaurants() {
  $.get("/api/allsearchedRestaurants", data => {
    // for (i = 0; i < data.length; i++) {
    //   searchedRestaurantArray[i] = {
    //     name: data[i].name,
    //     city: data[i].city,
    //     restId: data[i].restId,
    //     cuisine: data[i].cuisine,
    //     photo: data[i].photo
    //   };
    // }
    console.log(data);
  });
}
