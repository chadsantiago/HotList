const listInput = document.querySelector('[data-new-list-input]')
const inputForm = document.querySelector('[data-new-list-form]')
const container = document.querySelector('.task-container')
const listTemplate = document.querySelector('.task-template')

const local_storage_key = 'task'
const local_storage_selected_key = 'selectedTaskId'
let lists = JSON.parse(localStorage.getItem(local_storage_key)) || []
let selectedListId = localStorage.getItem(local_storage_selected_key)

inputForm.addEventListener('submit', e => {
    e.preventDefault()
    const listname = listInput.value
    if (listname == null || listname === '') return
    const list = createList(listname)
    listInput.value = null
    lists.push(list)
    save()
    render()
})

container.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'input') {
        selectedListId = e.target.dataset.listId
        const selectedTask = lists.find(task => task.id === e.target.id)
        selectedTask.active = e.target.checked
        save()
        render()
    }
})

function createList(name) {
    return { id: Date.now().toString(), note: name, active: false}
}

function save() {
    localStorage.setItem(local_storage_key, JSON.stringify(lists))
    localStorage.setItem(local_storage_selected_key, selectedListId)
}

function render() {
    clearElement(container)
    lists.forEach(list => {
        const listElement = document.importNode(listTemplate.content, true)

        const box = listElement.querySelector('label')
        box.htmlFor = list.id
        box.id = list.active

        const checkbox = listElement.querySelector('.checkbox')
        checkbox.id = list.id
        checkbox.dataset.listId = list.id
        checkbox.checked = list.active

        const task = listElement.querySelector('.task')
        task.htmlFor = list.id
        task.id = list.active
        task.append(list.note)

        container.appendChild(listElement)
    })
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

const deleteAll = () => {
    lists = lists.filter(list => !list.active && list.active)
    save()
    render()
}

const clearSelected = () => {
    lists = lists.filter(list => !list.active)
    save()
    render()
}

render()
  