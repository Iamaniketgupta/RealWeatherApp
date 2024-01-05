const search ='search.json';
const url =`https://api.weatherapi.com/v1/`;


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
 console.log('url is  : ' + URL);

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
                console.log('Coordinates:', q);
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


  




