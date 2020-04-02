// Select the list container
let list = document.getElementById("list");
let nextPage;

// LOAD INITIAL LIST

// On load, get the pokemon
var oneFiftyOne = axios
  .get("https://pokeapi.co/api/v2/pokemon?limit=33")
  .then(res => {
    // Call the `printList()` function
    nextPage = res.data.next;
    printList(res.data.results);
  })
  .catch(function(error) {
    // Call an error
    console.log(error);
  });

// PRINT INITIAL LIST

// This is the `printList()` function called on load
function printList(array) {
  array.forEach(pokemon => {
    // Create HTML node for an `li` and an `h2` inside it
    listItem = document.createElement("li");
    pokemonH2 = document.createElement("h2");
    pokemonH2.innerHTML = pokemon.name;
    listItem.appendChild(pokemonH2);
    list.appendChild(listItem);
    // add `hr` after last pokemon of each generation
    if (
      pokemon.name === "mew" ||
      pokemon.name === "celebi" ||
      pokemon.name === "deoxys" ||
      pokemon.name === "arceus" ||
      pokemon.name === "genesect" ||
      pokemon.name === "volcanion" ||
      pokemon.name === "melmetal"
    ) {
      list.appendChild(document.createElement("hr"));
    }

    // Add a "data-url" attribute to the `h2` for the pokemon's url
    pokemonH2.setAttribute("data-url", pokemon.url);

    // Add event listener for moreDeets click
    pokemonH2.onclick = moreDeetsOnClick;
  });
}

// H2 CLICK LISTENER

// printList() adds a listener to each h2 with this function
function moreDeetsOnClick(e) {
  // Check to see if there's already more info or not
  if (e.target.parentNode.lastChild.nodeName === "H2") {
    // Grab that pokemon url
    let pokeURL = e.target.getAttribute("data-url");
    // Make the call
    const gottaCatchEmAll = axios
      .get(pokeURL)
      .then(res => {
        // Call `addDeets()` w/ response & clicked element
        addDeets(res.data, e.target);
      })
      .catch(function(error) {
        // Throw an error if need be
        console.log(error);
      });
  }
  // If it has already been called, collapse it
  else {
    e.target.parentNode.removeChild(e.target.parentNode.lastChild);
    e.target.parentNode.removeChild(e.target.parentNode.lastChild);
  }
}

// RENDER CLICK RESPONSE

// Once the click call has been received, add the extra info
function addDeets(res, node) {
  abilitiesList = document.createElement("p");
  let abilities = "";
  res.abilities.forEach((ability, index) => {
    // console.log(ability.ability.name);
    abilities += ability.ability.name;
    if (res.abilities.length - 1 !== index) {
      abilities += ", ";
    }
  });
  abilitiesList.innerText = "Abilities: " + abilities;
  image = document.createElement("img");
  image.setAttribute("src", res.sprites.front_default);
  node.parentNode.appendChild(image);
  node.parentNode.appendChild(abilitiesList);
}

// SCROLL LOGIC

// Distance from bottom of page we want to trigger event
let bottomTrigger = 200;

// To pause scroll events while they're executing
let addingEventListener = false;

// Note: winTop + winBot = winHeight

// Height of window
winHeight = () => document.documentElement.clientHeight;

// Distance from top of page to top of screen
winTop = () => document.documentElement.getBoundingClientRect().top;

// Distance from top of screen to bottom of page
winBot = () => document.documentElement.getBoundingClientRect().bottom;

// Distance from bottom of screen to bottom of page
depth = () => winBot() - winHeight();

// Is the bottom of the page close? Boolean.
getToBottom = () => (depth() < bottomTrigger ? true : false);

// Scroll event listener
window.addEventListener("scroll", function(e) {
  if (getToBottom() && !addingEventListener) {
    addingEventListener = true;
    axios
      .get(nextPage)
      .then(res => {
        // Call the `printList()` function
        nextPage = res.data.next;
        printList(res.data.results);
        addingEventListener = false;
      })
      .catch(function(error) {
        // Call an error
        console.log(error);
      });
  }
});

// HEADER IMAGES

// !IMPORTANT: Add random pokemon images to `h1`s

function getRandomPokemonImage(element) {
  let pokemonNumber = Math.floor(Math.random() * 151 + 1);
  const randoPokemon = axios
    .get("https://pokeapi.co/api/v2/pokemon/" + pokemonNumber + "/")
    .then(res => {
      let imageSource = res.data.sprites.front_default;
      let imageElement = document.createElement("img");
      imageElement.setAttribute("src", imageSource);
      element.parentNode.insertBefore(imageElement, element);
    })
    .catch(function(error) {
      // Call an error
      console.log(error);
    });
}

function decorateTitle() {
  h1Spans = document.querySelectorAll("span.title");
  h1Spans.forEach(function(element) {
    getRandomPokemonImage(element);
  });
}

decorateTitle();

// FILTER

textInput = document.getElementById("main-input");
textInput.oninput = function(e) {
  list.innerHTML = "";
  if (textInput.value.length > 0) {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=1000")
      .then(res => {
        // Call the `printList()` function
        printSearchList(res.data.results, textInput.value);
      })
      .catch(function(error) {
        // Call an error
        console.log(error);
      });
  } else {
    var oneFiftyOne = axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=33")
      .then(res => {
        // Call the `printList()` function
        nextPage = res.data.next;
        printList(res.data.results);
      })
      .catch(function(error) {
        // Call an error
        console.log(error);
      });
  }
};

function printSearchList(array, query) {
  let counter = 0;
  array.forEach(pokemon => {
    if (pokemon.name.includes(query.toLowerCase())) {
      listItem = document.createElement("li");
      pokemonH2 = document.createElement("h2");
      pokemonH2.innerHTML = pokemon.name;
      listItem.appendChild(pokemonH2);
      list.appendChild(listItem);
      pokemonH2.setAttribute("data-url", pokemon.url);
      pokemonH2.onclick = moreDeetsOnClick;
      counter++;
    }
  });
  if (counter == 0) {
    noResults = document.createElement("p");
    noResults.innerText = "No results.";
    list.appendChild(noResults);
  }
}
