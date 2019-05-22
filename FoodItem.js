class FoodItem {

    constructor(params) {
        this.id = params.id
        this.calorie = params.calorie
        this.note = params.note
        FoodItem.all.push(this)
        this.render()
    }

    static all = []

    edit() {

        const updatedItem = this
        const editForm = document.querySelector('#edit-form-container #new-calorie-form')


        function _listener(e){
            updatedItem.update(e)
        e.target.removeEventListener('submit', _listener)

        }

        editForm.addEventListener('submit', _listener)

        const calories = editForm.querySelector('input')
        calories.value = this.calorie

        const notes = editForm.querySelector('textarea')
        notes.value = this.note

        const main = document.querySelector('#edit-form-container')
        main.addEventListener('click', function _mainListener(e) {
            editForm.removeEventListener('submit', _listener)
            e.target.removeEventListener('click', _mainListener)
        })

        const xButton = editForm.previousElementSibling
        xButton.addEventListener('click', function _mainListener(e) {
            e.stopPropagation()
            editForm.removeEventListener('submit', _listener)
            e.target.removeEventListener('click', _mainListener)
        })
        editForm.parentElement.addEventListener('click', e => e.stopPropagation())
    }

    update(e) {
        e.preventDefault()


        const calorie = e.target.querySelector('input').value
        const note = e.target.querySelector('textarea').value

        if(parseInt(calorie) === this.calorie && note === this.note) {
            const error = {message: 'Nothing Was Changed'}
            Page.showError(error)
            this.edit()
            return
        }

        if(!calorie || !note) {
            const error = {message: 'All Fields Must Be Filled'}
            Page.showError(error)
            this.edit()
            return
        }


        fetch('http://localhost:3000/api/v1/calorie_entries/' + this.id, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                calorie: calorie,
                note: note
            })
        })
            .then(resp => resp.json())
            .then(updatedItem => this.renderUpdate(updatedItem))
            .catch(error => Page.showError(error))
    }

    delete(e, id) {
        fetch('http://localhost:3000/api/v1/calorie_entries/' + id, {
            method: "DELETE",
            headers:{
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
            .then(resp => resp.json())
            .then(FoodItem.removeElement)
            .catch(Page.showError)
    }

    static removeElement(params) {
        const index = FoodItem.all.findIndex(v => v.id === params.id)
        FoodItem.all.splice(index, 1)

        document.getElementById(params.id).remove()

        User.updateTotalCalories()
    }




    // Submit Form Data
    static submit(e) {
        e.preventDefault()

        const calorie = e.target.querySelector('div input').value
        const note = e.target.querySelector('div textarea').value

        if(!calorie || !note) {
            const error = {message: 'All Fields Must Be Filled'}
            Page.showError(error)
            return
        }

        fetch('http://localhost:3000/api/v1/calorie_entries', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                calorie: calorie,
                note: note
            })
        })
            .then(resp => resp.json())
            .then(params => new FoodItem(params))
            .catch(error => Page.showError(error))
    }

    static getItems() {
        fetch('http://localhost:3000/api/v1/calorie_entries')
            .then(response => response.json())
            .then(foodItems => foodItems.forEach((params) => new FoodItem(params)))
            .catch(error => {Page.showError(error)})
    }

    // Render FoodItem to the DOM

    render() {
        const caloriesList = document.getElementById('calories-list')

        const foodEntry = document.createElement('li')
        foodEntry.id = this.id
        foodEntry.classList.add('calories-list-item')
        caloriesList.prepend(foodEntry)

        const gridContainer = document.createElement('div')
        gridContainer.classList.add('uk-grid')
        foodEntry.appendChild(gridContainer)

        const caloriesCell = document.createElement('div')
        caloriesCell.classList.add('uk-width-1-6')
        gridContainer.appendChild(caloriesCell)

        const calories = document.createElement('strong')
        calories.innerText = this.calorie
        caloriesCell.appendChild(calories)

        const unitOfMeasure = document.createElement('span')
        unitOfMeasure.innerText = ' kcal'
        caloriesCell.appendChild(unitOfMeasure)

        const descriptionCell = document.createElement('div')
        descriptionCell.classList.add('uk-width-4-5')
        gridContainer.appendChild(descriptionCell)

        const descriptionText = document.createElement('em')
        descriptionText.classList.add('uk-text-meta')
        descriptionText.innerText = this.note
        descriptionCell.appendChild(descriptionText)

        const actionMenu = document.createElement('div')
        actionMenu.classList.add('list-item-menu')
        foodEntry.appendChild(actionMenu)

        const editButton = document.createElement('a')
        editButton.classList.add('edit-button')
        editButton.setAttribute('uk-toggle', 'target: #edit-form-container')
        editButton.setAttribute('uk-icon', 'icon: pencil')
        editButton.addEventListener('click', (e) => {
            e.stopPropagation()
            this.edit()
        })
        actionMenu.appendChild(editButton)

        const deleteButton = document.createElement('a')
        deleteButton.classList.add('delete-button')
        deleteButton.setAttribute('uk-icon', 'icon: trash')
        deleteButton.addEventListener('click', (e) => this.delete(e, this.id))
        actionMenu.appendChild(deleteButton)

        User.updateTotalCalories()
    }

    renderUpdate(updatedItem) {
        this.calorie = updatedItem.calorie
        this.note = updatedItem.note

        const elementToUpdate = document.getElementById(this.id)

        elementToUpdate.querySelector('strong').innerText = this.calorie
        elementToUpdate.querySelector('em').innerText = this.note

        User.updateTotalCalories()
    }
}