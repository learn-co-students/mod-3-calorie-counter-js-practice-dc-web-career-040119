'use strict'

document.addEventListener('DOMContentLoaded', () => {
    FoodItem.getItems()

    const newFoodItemForm = document.getElementById('new-calorie-form')
    newFoodItemForm.addEventListener('submit', FoodItem.submit)

    const calculateBmrForm = document.getElementById('bmr-calulator')
    calculateBmrForm.addEventListener('submit', User.submit)
})






