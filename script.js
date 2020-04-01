let list = document.getElementById("list");

const oneFiftyOne = axios
  .get("https://pokeapi.co/api/v2/pokemon?limit=151")
  .then(res => {
    // console.log(res.data);
    printList(res.data.results);
  })
  .catch(function(error) {
    console.log(error);
  });

function printList(array) {
  array.forEach(pokemon => {
    listItem = document.createElement("li");
    pokemonH2 = document.createElement("h2");
    pokemonH2.innerHTML = pokemon.name;
    pokemonH2.setAttribute("data-url", pokemon.url);
    pokemonH2.onclick = moreDeetsOnClick;
    listItem.appendChild(pokemonH2);
    list.appendChild(listItem);
  });
}

function moreDeetsOnClick(e) {
  if (e.target.parentNode.lastChild.nodeName === "H2") {
    let pokeURL = e.target.getAttribute("data-url");
    const gottaCatchEmAll = axios
      .get(pokeURL)
      .then(res => {
        console.log(res.data);
        addDeets(res.data, e.target);
      })
      .catch(function(error) {
        console.log(error);
      });
  } else {
    e.target.parentNode.removeChild(e.target.parentNode.lastChild);
    e.target.parentNode.removeChild(e.target.parentNode.lastChild);
  }
}

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
  console.log(abilities);
  image = document.createElement("img");
  image.setAttribute("src", res.sprites.front_default);
  node.parentNode.appendChild(image);
  node.parentNode.appendChild(abilitiesList);
}
