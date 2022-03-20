const fetchPokemon = () => {
    const pokeNameInput = document.getElementById("pokeName");
    let pokeName = pokeNameInput.value;
    pokeName = pokeName.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokeName}`;
    fetch(url).then((res) => {
        if (res.status != "200") {
            console.log(res);
            pokeImage("https://http.cat/400")
        }
        else {
            return res.json();
        }
    }).then((data) => {
        if (data) {
            const {name: nombrePokemon, weight: pesoPokemon, height: estaturaPokemon, stats} = data
            let nombre = document.getElementById("name-screen"),
            altura = document.getElementById("size"),
            peso = document.getElementById("weight"),
            tipo = document.getElementById("type"),
            debilidad = document.getElementById("weakness"),
            salud = document.getElementById("health")
            ataque = document.getElementById("attack"),
            defensa = document.getElementById("defense"),
            especial1 = document.getElementById("special-attack"),
            especial2 = document.getElementById("special-defense"),
            velocidad = document.getElementById("speed"),
            tipoPokemon = processType(data.types),
            datos = []
            for(let i of stats){
                datos.push(i.base_stat)
            }

            processWeakness(data.types).then(dato => {
                dato.map(i => {
                    i.then(j => debilidad.innerHTML = j.toString())
                })
            })
            console.log(data);
            let pokeImg = data.sprites.front_default;
            pokeImage(pokeImg);
            console.log(tipoPokemon);
            nombre.innerHTML = nombrePokemon.toUpperCase()
            altura.innerHTML = `${estaturaPokemon/10} m`
            peso.innerHTML = `${pesoPokemon/10} kg`
            tipo.innerHTML = `${tipoPokemon.toString()}`
            salud.innerHTML = datos[0]
            ataque.innerHTML = datos[1]
            defensa.innerHTML = datos [2]
            especial1.innerHTML = datos[3]
            especial2.innerHTML = datos[4]
            velocidad.innerHTML = datos[5]
        }
    });
}

const pokeImage = (url) => {
    const pokeDisplay = document.getElementById("main-screen");
    img = document.getElementById("pokeImage")
    let pokeImage = img?? document.createElement("img")
    pokeImage.src = url
    pokeImage.id = "pokeImage"
    pokeDisplay.appendChild(pokeImage)

}

const processType = (data) => {
    let tipo = []
    for(let i of data){
        tipo.push(i.type.name)
    }
    return tipo
}

const processWeakness = async (data) => {
    var debilidad = []
    var promesas = []
    for(let i of data){
         promesas.push(fetch(i.type.url).then((res) => {
            if (res.status != "200") {
                console.log(res);
            }
            else {
                return res.json();
            }
        }).then((data) => {
            const {double_damage_from: damageFrom} = data.damage_relations
            return damageFrom.map((i) => i.name)
        }))

        for(let j of promesas)
            debilidad.push(j)
    }

    return debilidad
}