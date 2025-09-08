let input = document.querySelector('.search-country');
let container = document.querySelector('.country-container');
let template = null;

function renderCountry(data){
    container.innerHTML = template(data);
}

let templateReady = fetch('countries.hbs')
.then(response => response.text())
.then(card =>{
    template = Handlebars.compile(card);
});

input.addEventListener('input', _.debounce(()=>{
    let inputVal = input.value.trim().toLowerCase();

    if (!inputVal) return;

    templateReady.then(() =>{
      return fetch(`https://restcountries.com/v3.1/name/${inputVal}`);  
    })
    .then(response =>{
        if (!response.ok) throw new Error(response.status);
        return response.json();
    })
    .then(data =>{
        if(data.length > 1 && data.length < 10){
           container.innerHTML = `<ul class='found-con'></ul>`;
           let list = container.querySelector('.found-con');
           data.forEach(element => {
                let country = document.createElement('li');
                country.innerHTML = `${element.name.common}`;
                list.append(country);
           });
        }
        else if(data.length > 10){
            PNotify.error({ text:'Too many matches found. Please enter a more specific query'})
        }
        else if(data.length === 1){
            renderCountry({ countries: data });
        }
    })
    // .catch(error =>{
    //     PNotify.error({title:`${error.message}`, text:'the country is not found'})
    // });
}, 500));