const apiKey = "edl9H4GOQc4lK7xSmUi1YSV8pwYSUh12K2ERcTyMD385NFibUL736hAmvLwHM66WgWcelOj9xOG9eGYOJQ6cEWT4c6dqNCaC9NhJhnhDXHZf0v69QncXT69n0c4SX3Yx";

let Yelp = {
    search(term,location,sortBy){
        return fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`,{
            headers:{
                Authorization: `Bearer ${apiKey}`
            }
        }).then(response =>{
            return response.json();
        }).then(jsonResponse =>{
            if (jsonResponse.businesses) {
               return jsonResponse.businesses.map(business =>{
                    return {
                            id: business.id,
                            img: business.image_url,
                            name: business.name,
                            address: business.location.address1,
                            city: business.location.city,
                            state: business.location.state,
                            zipCode: business.location.zip_code,
                            category: business.categories[0].title,
                            rating: business.rating,
                            reviewCount: business.review_count,
                        }
                    
                })
            }
        })
    }
};

export default Yelp;