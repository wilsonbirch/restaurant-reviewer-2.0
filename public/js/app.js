/* eslint-disable camelcase */
$(document).ready(() => {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get('/api/user_data').then(data => {
        $('.member-name').text(data.email)
    })

    // This function handles the click event on the heart icon on favorite page
    // and sends a request to remove from favorite list
    $(document).on('click', '.favorite-page-table-heart-icon', function() {
        favoritesRemove($(this), true)
    })

    // This function is used to hide/unhide the truncated review on review page
    $(document).on('click', '.review-page-table-text', function() {
        $(this)
            .closest('tr')
            .next()
            .toggleClass('d-none')
    })

    $(document).on('click', '.search-page-heart-icon-add', function() {
        const heart = $(this)
        const el = heart.parent().siblings()
        const data = {}
        $.each(el, (index, element) => {
            const subEl = $(element)
            data[subEl.attr('class')] = subEl.text()
        })
        $.ajax({
            url: '/api/addToFavorites',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                if (response.added) {
                    heart.removeClass('heart-icon-hover-red')
                    heart.removeClass('search-page-heart-icon-add')
                    heart.addClass('heart-icon-hover-black')
                    heart.addClass('text-danger')
                    heart.addClass('search-page-heart-icon-remove')
                    heart.attr('id', `${response.id}`)
                } else {
                    alert('Already in the system.')
                }
            },
        })
    })

    $(document).on('click', '.search-page-heart-icon-remove', function() {
        favoritesRemove($(this), false)
    })

    $(document).on('click', '.search-page-table-review-btn', function() {
        $(this)
            .closest('tr')
            .next()
            .toggleClass('d-none')
    })

    $(document).on('click', '.search-page-review-form button', function() {
        const form = $(this).closest('.search-page-review-form')
        const text = form.find('textarea').val()
        const data = {}
        if (text) {
            const el = form.prev().children()
            $.each(el, (_index, element) => {
                const tag = $(element)
                if (tag.attr('class')) {
                    data[tag.attr('class')] = `${tag.text()}`
                }
            })
            data.review = text
            $.ajax({
                url: '/api/addReview',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function(response) {
                    if (response.added) {
                        alert('Added')
                    } else {
                        alert('Already in the system Or some error occurred.')
                    }
                },
            })
        } else {
            alert('Please Write Something In Order To Post.')
        }
    })
})

// Search restaurants by city
$('#searchCityBtn').on('click', e => {
    e.preventDefault()

    startSpinning()

    const searchCity = $('#restaurantSearchCityInput')
        .val()
        .trim()

    let queryURL =
        'https://thefork.p.rapidapi.com/locations/auto-complete?text=' +
        searchCity

    const locationSearch = {
        async: true,
        crossDomain: true,
        url: queryURL,
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'thefork.p.rapidapi.com',
            'x-rapidapi-key':
                'b388625a40mshaedce519e1c44cbp1d3075jsn5e9957639235',
        },
    }
    $.ajax(locationSearch).done(response => {
        const google_place_Id = response.data.geolocation[0].id.id

        queryURL =
            'https://thefork.p.rapidapi.com/locations/list?google_place_id=' +
            google_place_Id

        const cityIdSearch = {
            async: true,
            crossDomain: true,
            url: queryURL,
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'thefork.p.rapidapi.com',
                'x-rapidapi-key':
                    'b388625a40mshaedce519e1c44cbp1d3075jsn5e9957639235',
            },
        }

        $.ajax(cityIdSearch).done(response => {
            const cityId = response.id_city
            //const lat = response.coordinates.latitude;
            //const long = response.coordinates.longitude;

            queryURL =
                'https://thefork.p.rapidapi.com/restaurants/list?queryPlaceValueCityId=' +
                cityId

            const finalRestSearch = {
                async: true,
                crossDomain: true,
                url: queryURL,
                method: 'GET',
                headers: {
                    'x-rapidapi-host': 'thefork.p.rapidapi.com',
                    'x-rapidapi-key':
                        'b388625a40mshaedce519e1c44cbp1d3075jsn5e9957639235',
                },
            }
            $.ajax(finalRestSearch).done(response => {
                displayInformation(response.data)
            })
        })
    })
})

//Search any restaurant by name (EU)
$('#searchNameBtn').on('click', e => {
    e.preventDefault()

    startSpinning()

    const searchName = $('#restaurantSearchNameInput')
        .val()
        .trim()

    const queryURL =
        'https://thefork.p.rapidapi.com/restaurants/auto-complete?text=' +
        searchName

    const restNameSearch = {
        async: true,
        crossDomain: true,
        url: queryURL,
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'thefork.p.rapidapi.com',
            'x-rapidapi-key':
                'b388625a40mshaedce519e1c44cbp1d3075jsn5e9957639235',
        },
    }

    $.ajax(restNameSearch).done(response => {
        const searchRestId = response.data.autocomplete[0].id

        const searchRestIdInfo = {
            async: true,
            crossDomain: true,
            url:
                'https://thefork.p.rapidapi.com/restaurants/get-info?locale=en_US&id_restaurant=' +
                searchRestId,
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'thefork.p.rapidapi.com',
                'x-rapidapi-key':
                    'b388625a40mshaedce519e1c44cbp1d3075jsn5e9957639235',
            },
        }

        $.ajax(searchRestIdInfo).done(response => {
            //console.log(response.data);
            displaySingleInformation(response.data)
        })
    })
})

$('.reviewDeleteButton').on('click', e => {
    e.preventDefault()
    const id = $('.reviewDeleteButton').attr('id')
    deleteReview(id)
})

function displayInformation(data) {
    let tag = ''
    data.forEach(element => {
        tag += `
    <tr>
      <td class="tableRestaurantName">${element.name}</td>
      <td class="tableRestaurantCity">${element.address.locality}</td>
      <td class="tableRestaurantCuisine">${element.servesCuisine}</td>
      <td>
        <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-heart-fill search-page-heart-icon-add heart-icon-hover-red" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
        </svg>&nbsp;&nbsp;&nbsp;
        <button type="button" class="search-page-table-review-btn btn btn btn-info">Review It</button>
      </td>
    </tr>
    <tr class="d-none search-page-review-form">
        <td colspan="3">
          <textarea rows="5" class="form-control" placeholder="Write A Review" maxlength="256"></textarea>
        </td>
        <td>
          <button type="button" class="btn btn-primary pl-5 pr-5 mt-3">Post</button>
        </td>
    </tr>
    `
    })
    const tbody = $('#search-page-table tbody')
    tbody.empty()
    tbody.append(tag)
    stopSpinning()
}

function displaySingleInformation(data) {
    console.log(data)
    let tag = ''
    tag += `
    <tr>
      <td class="tableRestaurantName">${data.name}</td>
      <td class="tableRestaurantCity">${data.city}</td>
      <td class="tableRestaurantCuisine">${data.speciality}</td>
      <td>
        <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-heart-fill search-page-heart-icon-add heart-icon-hover-red" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
        </svg>&nbsp;&nbsp;&nbsp;
        <button type="button" class="search-page-table-review-btn btn btn btn-info">Review It</button>
      </td>
    </tr>
    <tr class="d-none search-page-review-form">
        <td colspan="3">
          <textarea rows="5" class="form-control" placeholder="Write A Review" maxlength="256"></textarea>
        </td>
        <td>
          <button type="button" class="btn btn-primary pl-5 pr-5 mt-3">Post</button>
        </td>
    </tr>
    `
    const tbody = $('#search-page-table tbody')
    tbody.empty()
    tbody.append(tag)
    stopSpinning()
}

function startSpinning() {
    const table = $('#search-page-table')
    if (!table.hasClass('d-none')) {
        table.addClass('d-none')
    }
    const el = $('#search-page-spinner')
    if (el.hasClass('d-none')) {
        el.removeClass('d-none')
        el.addClass('d-flex')
    }
}

function stopSpinning() {
    const table = $('#search-page-table')
    if (table.hasClass('d-none')) {
        table.removeClass('d-none')
    }
    const el = $('#search-page-spinner')
    if (!el.hasClass('d-none')) {
        el.addClass('d-none')
        el.removeClass('d-flex')
    }
}

function favoritesRemove(tag, favoritePage) {
    const data = {
        id: tag.attr('id'),
    }
    $.ajax({
        url: '/api/removeFromFavorites',
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            if (response.removed && favoritePage) {
                el.closest('tr').remove()
            } else if (!favoritePage) {
                tag.removeClass('heart-icon-hover-black')
                tag.removeClass('text-danger')
                tag.removeClass('search-page-heart-icon-remove')
                tag.attr('id', '')
                tag.addClass('heart-icon-hover-red')
                tag.addClass('search-page-heart-icon-add')
            }
        },
    })
}

function deleteReview(data) {
    console.log(data)
    $.ajax({
        url: '/api/deleteReview',
        type: 'PUT',
        //dataType: "string",
        //contentType: "application/json",
        data: data,
        success: function() {
            console.log('deleted!')
        },
        // $.ajax({
        //   url: "api/deleteReview",
        //   type: "DELETE",
        //   dataType: "json",
        //   contentType: "application/json",
        //   data: JSON.stringify(data)
        // });
    })
}
