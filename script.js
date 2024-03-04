document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = 'https://dog.ceo/api';
    const API_RANDOMUSER_URL = 'https://randomuser.me/api/';
    const cardsContainer = document.getElementById('card-container');
    const newCardsBtn = document.getElementById('new-cards-btn');



    newCardsBtn.addEventListener('click', loadNewCards);

    function loadNewCards() {
        cardsContainer.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            fetchRandomUserAndDog();
        }
    }

    function fetchRandomUserAndDog() {
        fetch(API_RANDOMUSER_URL)
            .then(response => response.json())
            .then(data => {
                const user = data.results[0];
                const dogUrl = `${API_BASE_URL}/breeds/image/random`;
                fetch(dogUrl)
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        const dogImage = data.message;
                        createUserCard(user, dogImage);
                    })
                    .catch(err => {
                        console.error('Failed to fetch Dog API', err);

                        
                    });
            })
            .catch(err => console.error('Failed to fetch RandomUser', err));
    }



    function createUserCard(user, dogImage) {
        const userImage = user.picture.large;
        const userName = `${user.name.first} ${user.name.last}`;
        const userLocation = `${user.location.city}, ${user.location.country}`;
    
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="dog-img-container">
                <img src="${dogImage}" alt="Dog Image">
            </div>
            <div class="user-info-container">
                <img src="${userImage}" class="user-photo" alt="User Image">
                <div class="text-info">
                    <p>${userName}</p>
                    <p>${userLocation}</p>
                </div>
            </div>
        `;
        
            card.innerHTML += '<button class="delete-btn">Delete</button>';
            card.querySelector('.delete-btn').addEventListener('click', function () {
                card.remove();
                fetchRandomUserAndDog(); 
            });
    
    
        cardsContainer.appendChild(card);
    }
    

    loadNewCards();
});