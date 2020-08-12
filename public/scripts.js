/*=== GO TO DESCRIPTION PAGE ===*/
const recipes = document.querySelectorAll('.recipe')
   
for (let recipe of recipes) {
    if ( !(recipe.className.includes('admin')) ) {
        recipe.addEventListener("click", function(){
            const index = recipe.getAttribute('id')
            window.location.href = `/recipes/${index}`
        })
    }

}
    
/*=== HIDE/SHOW RECIPE INFO ===*/ 
const contents = document.querySelectorAll('.content')

for (let content of contents) {
    const id = content.getAttribute('id')
    const after = document.querySelector(`#${id}`)

    after.addEventListener("click", function() {
        if (after.innerHTML == "ESCONDER") { 
            content.remove()
            after.innerHTML = "MOSTRAR"
        } else {
            document.querySelector(`.${id}`).insertAdjacentElement("afterend", content)
            after.innerHTML = "ESCONDER"
        }
    })
}

/*=== CURRENT PAGE BOLD (HEADER) ===*/
const currentPage = window.location.pathname
const menuItens = document.querySelectorAll("header a")

for (item of menuItens) {
    if (currentPage.includes(item.getAttribute('href'))) {
        item.classList.add("currentPage")
    }
}

/*=== ADD INGREDIENT/STEP IN THE FORM ===*/

function addIngredient() {
    const ingredients = document.querySelector("#ingredients")
    const fieldContainer = document.querySelectorAll(".ingredient")
    
    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)
    
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false
    
    // Deixa o valor do input vazio
    newField.children[0].value = ""
    
    //newField.children[1].addEventListener("click", deleteHandler)
    
    ingredients.appendChild(newField)
}

function addPreparationStep() {
    const preparation = document.querySelector("#preparation")
    const fieldContainer = document.querySelectorAll(".preparation-step")
    
    // Realiza um clone do último passo adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)
    
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false
    
    // Deixa o valor do input vazio
    newField.children[0].value = ""
    
    newField.children[1].addEventListener("click", deleteHandler)
    
    preparation.appendChild(newField)
}

function deleteHandler() {
    var parent = this.parentElement;
    parent.parentElement.removeChild(parent);
}

if (document.querySelector(".add-ingredient")) {
    document.querySelector(".add-ingredient").addEventListener("click", addIngredient)
}
if (document.querySelector(".add-preparation-step")) {
    document.querySelector(".add-preparation-step").addEventListener("click", addPreparationStep)
}