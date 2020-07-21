class User {
    constructor (weight, height, age) {
        this.weight = parseInt(weight)
        this.height = parseInt(height)
        this.age = parseInt(age)
    }

    lowerBmr() {
        return Math.round(655 + (4.35 * this.weight) + (4.7 * this.height) - (4.7 * this.age))
    }

    upperBmr() {
        return Math.round(66 + (6.23 * this.weight) + (12.7 * this.height) - (6.8 * this.age))
    }

    avgBmr() {
        return Math.round((this.upperBmr() + this.lowerBmr()) / 2)
    }

    static updateTotalCalories() {
        const progressBar = document.querySelector('#bmr-calculation-result progress')
        if (!!FoodItem.all) {
            const allCalories = FoodItem.all.map(item => item.calorie)
            const totalCalories = allCalories.reduce((total, item) => total + item)
            progressBar.value = totalCalories
        } else {
            progressBar.value = 0
        }
    }


    static submit(e) {
        e.preventDefault()

        const fields = e.target.querySelectorAll('div input')
        const weight = fields[0].value
        const height = fields[1].value
        const age = fields[2].value

        const newUser = new User(weight, height, age)
        newUser.render()
    }


    // Render User Data
    render() {
        const lowerRangeContainer = document.getElementById('lower-bmr-range')
        lowerRangeContainer.innerText = this.lowerBmr()

        const upperRangeContainer = document.getElementById('higher-bmr-range')
        upperRangeContainer.innerText = this.upperBmr()

        const progressBar = document.querySelector('#bmr-calculation-result progress')
        progressBar.setAttribute('max', this.avgBmr())
    }
}