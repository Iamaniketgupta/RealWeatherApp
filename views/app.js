
// Nav Tab functionality
let listItems = document.querySelectorAll('.list-item');

for (let item of listItems) {
item.addEventListener('click',(event)=>{

    listItems.forEach((listItem) => {
        listItem.classList.remove('active');
    });

    event.currentTarget.classList.add('active');


});

}
// navbar functionality

const nav=document.querySelector('#navbar');
const bars=document.querySelector('.bars-icn');
const closeIcn=document.querySelector('.close-icn');
const clickAnyWhere=document.querySelector('.weather-info-wrapper');

bars.addEventListener('click',()=>{
    nav.classList.toggle('display-nav');

});

closeIcn.addEventListener('click',()=>{
    nav.classList.toggle('display-nav');
});

clickAnyWhere.addEventListener('click',()=>{
    nav.classList.remove('display-nav');
});

// Locator Feature

const inputBox=document.querySelector('#query');
const form=document.querySelector('#form');
const srchBtn=document.querySelector('#search-btn');

const locator = document.querySelector('#location');
let q = '';

locator.addEventListener('click', getLocation);

function getLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                q = `${latitude},${longitude}`;
                inputBox.value = q;
                form.submit();
               
            },
            (error) => {
                console.error('Error getting location:', error.message);
                alert('Unable to fetch location. Please try again later.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}



// Auto Complete Search Feature
let container = document.getElementById('autocomplete-container');
container.style.display = "none";

let timeoutId;
const debouncedAutosearch = (q_string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => autosearchHandler(q_string), 300);
};

const autosearchHandler = async (q_string) => {
    container.innerHTML = '';

    try {
        const response = await fetch(`/autocomplete?q=${q_string}`);
        const data = await response.json();

        if (data.length > 0) {
            container.style.display = "block";
            data.forEach((item) => {
                const placeElement = document.createElement('p');
                placeElement.textContent = `${item.name}, ${item.region}, ${item.country}`;
                placeElement.addEventListener('click', () => {
                    inputBox.value = item.name + "," + item.region;
                    container.style.display = "none";
                    form.submit();
                });
                container.append(placeElement);
            });
        } else {
            container.style.display = "none";
        }
    } catch (error) {
        console.error(error);
    }
};


