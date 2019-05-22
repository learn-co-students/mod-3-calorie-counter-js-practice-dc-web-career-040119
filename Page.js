class Page {

    static showError(error) {
        const body = document.querySelector('body')

        const errorBanner = document.createElement('div')
        errorBanner.innerText = error.message
        errorBanner.style.color = 'white'
        errorBanner.style.backgroundColor = 'red'
        errorBanner.style.textAlign = 'center'

        body.prepend(errorBanner)

        setTimeout(() => errorBanner.remove(), 5000)
    }

}