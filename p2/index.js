// LOGIN VALIDATION

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (email === "" || password === "") {
            alert("Please fill all fields!");
            return;
        }

        if (!email.includes("@")) {
            alert("Enter a valid email!");
            return;
        }

        alert("Login Successful!");
    });

}

// JOIN COMMUNITY BUTTON

const communityButtons = document.querySelectorAll(".community-card button");

communityButtons.forEach((button) => {

    button.addEventListener("click", function () {

        if (button.innerText === "Join Community") {

            button.innerText = "Joined ✓";
            button.style.backgroundColor = "#22c55e";

        } else {

            button.innerText = "Join Community";
            button.style.backgroundColor = "";

        }

    });

});

// COMMUNITY SEARCH

const communitySearch = document.querySelector(
    ".community-page .search-box input"
);

const communityCards = document.querySelectorAll(".community-card");

if (communitySearch) {

    communitySearch.addEventListener("keyup", function () {

        const searchValue = communitySearch.value.toLowerCase();

        communityCards.forEach((card) => {

            const title = card.querySelector("h3").innerText.toLowerCase();

            if (title.includes(searchValue)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

        });

    });

}

// JOIN EVENT BUTTON

const eventButtons = document.querySelectorAll(".event-card button");

eventButtons.forEach((button) => {

    button.addEventListener("click", function () {

        if (button.innerText === "Join Event") {

            button.innerText = "Joined ✓";
            button.style.backgroundColor = "#22c55e";

        } else {

            button.innerText = "Join Event";
            button.style.backgroundColor = "";

        }

    });

});

// EVENT SEARCH

const eventSearch = document.querySelector(
    ".event-page .search-box input"
);

const eventCards = document.querySelectorAll(".event-card");

if (eventSearch) {

    eventSearch.addEventListener("keyup", function () {

        const searchValue = eventSearch.value.toLowerCase();

        eventCards.forEach((card) => {

            const title = card.querySelector("h3").innerText.toLowerCase();

            if (title.includes(searchValue)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

        });

    });

}

// CREATE COMMUNITY BUTTON

const createCommunityBtn = document.querySelector(
    ".community-hero .btn button"
);

if (createCommunityBtn) {

    createCommunityBtn.addEventListener("click", function () {

        alert("Community creation feature will be available soon!");

    });

}

// CREATE EVENT BUTTON

const createEventBtns = document.querySelectorAll(
    ".event-hero .btn button, .event-cta .btn button:first-child"
);

createEventBtns.forEach((button) => {

    button.addEventListener("click", function () {

        alert("Event creation feature will be available soon!");

    });

});