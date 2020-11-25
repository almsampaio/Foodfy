/*=== GO TO DESCRIPTION PAGE ===*/
const recipes = document.querySelectorAll('.recipe')
   
for (let recipe of recipes) {
    recipe.addEventListener("click", function(){
        const id = recipe.getAttribute('id')
        window.location.href = `/recipes/${id}`
    })
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

for (let item of menuItens) {
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
    
    newField.children[1].addEventListener("click", deleteHandler)
    
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

/*=== PAGINATION ===*/

function paginate(selectedPage, totalPages) {
    let pages = [], oldPage

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {

        const firstAndLastPages = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

        if (firstAndLastPages || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
            if (oldPage && currentPage - oldPage > 2) {
                pages.push("...")
            }
            if (oldPage && currentPage - oldPage == 2) {
                pages.push(oldPage + 1)
            }
            
            pages.push(currentPage)

            oldPage = currentPage
        }
    }

    return pages
}

function createPagination(pagination) {
    const filter = pagination.dataset.filter
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total

    const pages = paginate(page, total)

    let elements = ""

    for (let page of pages) {
        if (String(page).includes("...")) {
            elements += `<span>${page}</span>`
        } else {
            if (filter) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            } else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }

    pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")

if (pagination) {
    createPagination(pagination)
}

/*=== CURRENT PAGE BOLD (PAGINATION) ===*/

const indexOfPagination = window.location.search
const paginationIndexes = document.querySelectorAll("div.pagination > a")

for (let index of paginationIndexes) {
    if (indexOfPagination.includes(index.innerHTML)) {
        index.classList.add("currentPage")
    }
}

// if (!(indexOfPagination.includes("?page="))) {
//     paginationIndexes[0].classList.add("currentPage")
// }

/*=== FILE INPUT MANAGEMENT ===*/

const PhotosUpload = {
    input: '',
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 5,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value === 'photo')
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert('Você atingiu o limite máximo de fotos')
            event.preventDefault()
            return true
        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()
        // firefox OR chrome

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"

        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode // <div class="photo">
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}

/*=== SHOW IMAGE .PREVIEW ===*/
const preview =  document.querySelector('.preview')
const showGallery = document.querySelector('.show-gallery')

function showImage(event) {
    for (let index = 0; index < preview.children.length; index += 1) {
        if (preview.children[index].classList.contains('img-selected')) {
            preview.children[index].classList.remove('img-selected')
        }
    }

    event.target.classList.add('img-selected')
    const clone = event.target.cloneNode(true)
    showGallery.children[0].replaceWith(clone)
}

if (preview) {
    preview.children[0].classList.add('img-selected')
    for (let index = 0; index < preview.children.length; index += 1) {
        preview.children[index].addEventListener('click', showImage)
    }
}
