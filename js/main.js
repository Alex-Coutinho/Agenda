'use strict'

const openModal = () => document.getElementById('modal')
     .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('dbContato')) ?? []
const setLocalStorage = (dbContato) => localStorage.setItem("dbContato", JSON.stringify(dbContato))

// CRUD 
const deleteContato = (index) => {
    const dbContato = readContato()
    dbContato.splice(index, 1)
    setLocalStorage(dbContato)
}

const updateContato = (index, contato) => {
    const dbContato = readContato()
    dbContato[index] = contato
    setLocalStorage(dbContato)
}

const readContato = () => getLocalStorage()

const createContato = (contato) => {
     const dbContato = getLocalStorage()
     dbContato.push (contato)
     setLocalStorage(dbContato)

}

const isvalidFields = () => {
    return document.getElementById('form').reportvalidity()
}

const clearFields = () => {
    const fiels = document.querySelectorAll('.modal-field')
    clearFields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index ='new'
}

const saveContato = () => {
    debugger
    if (isvalidFields()) {
        const contato = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            Telefone: document.getElementById('telefone').value,
            cidade: document.getElementById('cidade').value
        }

        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createContato(contato)
            updateTable()
            closeModal()
        } else{
            updateContato(index, contato)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (contato, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td>${contato.nome}</td>
    <td>${contato.email}</td>
    <td>${contato.telefone}</td>
    <td>${contato.cidade}</td>
    <td>
        <button type="button" class="button green" id="edit-${index}">Editar</buttton>
        <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tableContato>tbody').appendChild(newRow)

    }

    const clearTable = () => {
        const rows = document.querySelectorAll('#tableContato>tbody tr')
        rows.forEach(row => row.parentNode.removeChild(row))

    }

    const updateTable = () => {
        const dbContato = readContato()
        clearTable()
        dbContato.forEach(createRow)
    }

    const fillFields = (contato) => {
        document.getElementById('nome').value = contato.nome
        document.getElementById('email').value = contato.email
        document.getElementById('telefone').value = contato.telefone
        document.getElementById('cidade').value = contato.cidade
        document.getElementById('nome').dataset.index = contato.index

    }

    const editContato = (index) =>{
         const contato = readContato()[index]
         contato.index = index
         fillFields(contato)
         openModal()
    }

    const editDelete = (event) => {
        if (event.target.type == 'button'){

            const [action, index] = event.target.id.split('-')

            if (action == 'edit'){
                editContato(index)

            }else{
                const contato = readContato()[index]
                const response = confirm(`Deseja realmente excluir o contato ${contato.nome}`)
                if (response) {
                    deleteContato(index)
                    updateTable()
                }
            }
        }
    }

    updateTable()


    document.getElementById('adicionarContato')
        .addEventListener('click', openModal)

    document.getElementById('modalClose')
        .addEventListener('click', closeModal)

    document.getElementById('salvar')
        .addEventListener('click', saveContato)

    document.getElementById('#tableContato>tbody')
        .addEventListener('click', editDelete)

    document.getElementById('cancelar')
        .addEventListener('click', closeModal)

    