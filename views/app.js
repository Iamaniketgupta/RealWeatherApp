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
});

closeIcn.addEventListener('click',()=>{
    nav.classList.toggle('display-nav');
});

clickAnyWhere.addEventListener('click',()=>{
    nav.classList.remove('display-nav');
});

// input validation
const inputBox=document.querySelector('#query');
const srchBtn=document.querySelector('#search-btn');







