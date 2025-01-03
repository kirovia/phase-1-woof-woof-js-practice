// GRABBING VARIABLES FROM THE DOM

const filterDiv = document.getElementById('filter-div')
const filterButton = document.getElementById('good-dog-filter')
const dogBar = document.getElementById('dog-bar')
const dogContainer = document.getElementById('dog-summary-container')
const dogInfo = document.getElementById('dog-info')
let goodDogBool = false;

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', fetchDogs)
filterButton.addEventListener('click', displayGoodDogsToggle)

// CLASS FOR GENERATING DOGS

class Dog{
    constructor(id, name, isGoodDog, image) {
        this.id = id
        this.name = name
        this.isGoodDog = isGoodDog
        this.image = image
    }
    createDog() {
        const span = document.createElement('span')
        span.textContent = this.name
        span.id = this.id
        span.addEventListener('click', handleClick.bind(this))
        dogBar.append(span)
    }
}

// FUNCTIONS

function fetchDogs() {
    fetch('http://localhost:3000/pups')
    .then(resp => resp.json())
    .then(data => data.forEach(dog => {
        const newDog = new Dog(dog.id, dog.name, dog.isGoodDog, dog.image)
        newDog.createDog();
    }))
}

function fetchGoodDogs() {
    fetch('http://localhost:3000/pups')
    .then(resp => resp.json())
    .then(data => data.forEach(dog => {
        if (dog.isGoodDog) {
            const newDog = new Dog(dog.id, dog.name, dog.isGoodDog, dog.image)
            newDog.createDog();
        }
    }))    
}

function handleClick() {
    dogInfo.innerHTML = '';
    const img = document.createElement('img')
    img.src = this.image
    const h2 = document.createElement('h2')
    h2.textContent = this.name
    const button = document.createElement('button')
    button.textContent = this.isGoodDog ? 'Good Dog!' : 'Bad Dog!'
    button.addEventListener('click', goodBadToggle.bind(this))
    dogInfo.append(img, h2, button)

}

function goodBadToggle() {
    if (dogInfo.lastChild.textContent === 'Good Dog!') {
        dogInfo.lastChild.textContent = 'Bag Dog!'
        if (goodDogBool) {document.getElementById(`${this.id}`).remove()}
    } else {
        dogInfo.lastChild.textContent = 'Good Dog!'
    }
    fetch(`http://localhost:3000/pups/${this.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({isGoodDog: (dogInfo.lastChild.textContent === 'Good Dog!')})
    })
}

function displayGoodDogsToggle() {
    if (goodDogBool) {
        filterButton.textContent = 'Filter good dogs: OFF'
        dogBar.innerHTML = ''
        fetchDogs()
        goodDogBool = false
    } else {
        filterButton.textContent = 'Filter good dogs: ON'
        dogBar.innerHTML = ''
        fetchGoodDogs()
        goodDogBool = true
    }
}
