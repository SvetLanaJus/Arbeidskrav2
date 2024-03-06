document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = "https://dog.ceo/api";
  const API_RANDOMUSER_URL = "https://randomuser.me/api/";
  const cardsContainer = document.getElementById("card-container");
  const newCardsBtn = document.getElementById("new-cards-btn");
  const breedSearch = document.getElementById("breed-search");

  let debounceTimer;
  breedSearch.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const breed = breedSearch.value.trim();
      if (breed) {
        loadCardsByBreed(breed);
      } else {
        loadNewCards();
      }
    }, 500);
  });

  newCardsBtn.addEventListener("click", loadNewCards);

  function loadNewCards() {
    cardsContainer.innerHTML = "";
    for (let i = 0; i < 10; i++) {
      fetchRandomUserAndDog();
    }
  }

  function fetchRandomUserAndDog(breed = "") {
    fetch(API_RANDOMUSER_URL)
      .then((response) => response.json())
      .then((data) => {
        const user = data.results[0];
        const dogUrl = breed
          ? `${API_BASE_URL}/breed/${breed}/images/random`
          : `${API_BASE_URL}/breeds/image/random`;
        fetch(dogUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Breed not found (master breed does not exist)");
            }
            return response.json();
          })
          .then((data) => {
            const dogImage = data.message;
            createUserCard(user, dogImage, breed !== "");
          })
          .catch((err) => {
            console.error("Failed to fetch Dog API", err);

            displayErrorMessage("Dog not found");
          });
      })
      .catch((err) => console.error("Failed to fetch RandomUser", err));
  }

  function displayErrorMessage(message) {
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.textContent = message;
    cardsContainer.appendChild(errorMessage);
  }

  function createUserCard(user, dogImage, isFiltered = false) {
    const userImage = user.picture.large;
    const userName = `${user.name.first} ${user.name.last}`;
    const userLocation = `${user.location.city}, ${user.location.country}`;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <div class="dog-img-container">
                <img src="${dogImage}" alt="Dog Image">
                <div class="pop-up-message" style="display:none" > </div>
            </div>
            <div class="user-info-container">
                <img src="${userImage}" class="user-photo" alt="User Image">
                <div class="text-info">
                    <p>${userName}</p>
                    <p>${userLocation}</p>
                </div>
            </div>

        `;
    if (!isFiltered) {
      card.innerHTML += '<button class="delete-btn">Delete</button>';
      card.querySelector(".delete-btn").addEventListener("click", function () {
        card.remove();
        fetchRandomUserAndDog();
      });
    }

    //Hundehilsen ved klikk
    card.addEventListener("click", function () {
      let randomDogMessage =
        dogMessage[Math.floor(Math.random() * dogMessage.length)];

      const dogMessageTxt = document.createElement("p");
      dogMessageTxt.textContent = randomDogMessage;
      card.querySelector(".pop-up-message").innerHTML = randomDogMessage;
      card.querySelector(".pop-up-message").style.display = "block";

    });
    //Hundehilsen Array
    const dogMessage = [
      "Voff voff",
      "Grrr!",
      "Mjau??",
      "Voff!",
      "Voff voff voff!",
      "WRAFF!!!",
    ];

    cardsContainer.appendChild(card);
  }

  function loadCardsByBreed(breed) {
    cardsContainer.innerHTML = "";
    fetchRandomUserAndDog(breed);
  }

  loadNewCards();
});
