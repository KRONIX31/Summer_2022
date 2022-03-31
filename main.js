const descriptions = document.querySelectorAll('.description')
const buttons = document.querySelectorAll('.play')
const regulatorVolume = document.querySelector('.volume')
const allAudio = document.querySelectorAll('audio')
let opIndex = 0
regulatorVolume.oninput = volumeChange


document.addEventListener('DOMContentLoaded', () => {
    regulatorVolume.value = localStorage.volume
    volumeChange()
})

for(i = 0; i < buttons.length; i++){
    buttons[i].addEventListener('click', buttonClick)
    allAudio[i].addEventListener('abort', () => console.log('gfgf'))
}
for(i = 0; i < descriptions.length; i++){
    descriptions[i].addEventListener('click', descriptionClick)
}


function volumeChange() {
    for(i = 0; i < allAudio.length; i++){
        allAudio[i].volume = regulatorVolume.value / 100
    }
    localStorage.volume = regulatorVolume.value
}

function buttonClick(e) {
    console.log('button')
    let targetElem = e.target
    let audio

    if(targetElem.src){
        setButton()
    } else{
        targetElem = targetElem.querySelector('img')
        setButton()
    }

    function setButton() {
        audio = targetElem.parentNode.parentNode.querySelector('.audio')
        if(targetElem.getAttribute('src') == 'play.svg'){
            targetElem.setAttribute('src', 'pause.svg')
            targetElem.style.transform = 'scale(1.3)'
            start()
        } else{
            targetElem.setAttribute('src', 'play.svg')
            targetElem.style.transform = 'scale(1)'
            stop()
        }
    }


    function start() {
        audio.play()
    }
    function stop() {
        audio.pause()
    }
    
    if(opIndex == 0){
        descriptionClick(targetElem.parentNode.parentNode, 1)
    }
}

function descriptionClick(correntElem, ife) {
    let liElem
    if(opIndex == 0){
        opIndex = 1
    } else{
        opIndex = 0
    }
    function openTimeline(){
        liElem.classList.toggle('list_item_active')
        console.log('description', liElem)
    }
    if(ife){
        liElem = correntElem
        openTimeline()
    } else{
        if(correntElem.target.tagName == 'DIV'){
            liElem = correntElem.target.parentNode
            openTimeline()
        } else{
            liElem = correntElem.target.parentNode.parentNode
            openTimeline()
        }
    }
}