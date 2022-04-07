const descriptions = document.querySelectorAll('.description')
const buttons = document.querySelectorAll('.play')
const regulatorVolume = document.querySelector('.volume')
const allAudio = document.querySelectorAll('audio')
const currentTime = document.querySelectorAll('.current_time')
const durationTime = document.querySelectorAll('.duration_time')
const allTimelines = document.querySelectorAll('.timeline')
const searchElem = document.querySelector('.search')
let targetElem, targetAudio, targetLi


regulatorVolume.oninput = volumeChange
function volumeChange() {
    for(i = 0; i < allAudio.length; i++){
        allAudio[i].volume = regulatorVolume.value / 100
    }
    localStorage.volume = regulatorVolume.value
}

document.addEventListener('DOMContentLoaded', () => {
    regulatorVolume.value = localStorage.volume
    volumeChange()
})

searchElem.oninput = search
for(i = 0; i < buttons.length; i++){
    buttons[i].addEventListener('click', buttonClick)
    descriptions[i].addEventListener('click', descriptionClick)
    allAudio[i].addEventListener('loadedmetadata', setMeta)
    allAudio[i].addEventListener('timeupdate', timeUpdate)
    allAudio[i].addEventListener('ended', audioEnded)
    allTimelines[i].oninput = touchTimeUpdate
}


function setMeta(){
    for(i = 0; i < allAudio.length; i++){
        let mins = parseInt(`${(allAudio[i].duration / 60) % 60}`, 10)
        let secs = `${parseInt(`${allAudio[i].duration % 60}`, 10)}`.padStart(2, '0')
        durationTime[i].innerHTML = `${mins}:${secs}`
    }
}

function timeUpdate(e){
    const timeline = e.target.parentNode.querySelector('.timeline')
    const currentTime = e.target.parentNode.querySelector('.current_time')
    const audio = e.target
    timeline.value = e.srcElement.currentTime / e.srcElement.duration * 100
    
    mins = `${Math.floor(audio.currentTime / 60)}`
    secs = Math.floor(audio.currentTime % 60)
    if(secs < 10){
        secs = `0` + String(secs)
    }
    currentTime.innerHTML = `${mins}:${secs}`
}

function touchTimeUpdate(e){
    const audio = e.target.parentNode.parentNode.querySelector('audio')
    const currentTime = e.target.parentNode.parentNode.querySelector('.current_time')
    let onplaying
    let onpause
    function playAud() {      
        if (audio.paused && !onplaying) {
            audio.play();
        }
    } 
    function pauseAud() {     
        if (!audio.paused && !onpause) {
            audio.pause();
        }
    }
    if(e.target.parentNode.parentNode.querySelector('audio').paused){
        application()
    } else{
        onplaying = false
        onpause = true

        pauseAud()
        application()

        onplaying = true
        onpause = false

        playAud()
    }

    function application(){
        const newValue = audio.duration * (Number(e.target.value) / 100)
        audio.currentTime = newValue
        mins = `${Math.floor(newValue / 60)}`
        secs = Math.floor(newValue % 60)
        if(secs < 10){
            secs = `0` + String(secs)
        }
        currentTime.innerHTML = `${mins}:${secs}`
    }
}

function audioEnded(e){
    const targetLi = e.target.parentNode
    const timelineWrap = e.target.parentNode.querySelector('.timeline_wrap')
    const icon = e.target.parentNode.querySelector('img')

    targetLi.classList.remove('list_item_active')
    timelineWrap.style.display = 'none'

    icon.setAttribute('src', 'play.svg')
    icon.style.transform = 'scale(1)'
    e.target.currentTime = 0
    const allList = document.querySelectorAll('.list_item')
    for(i = 0; i < allList.length; i++){
        if(e.target.parentNode == allList[i]){
            if(allList.length > i+1){
                buttonClick(allList[i+1].querySelector('img'))
                console.log(1)
            } else{
                window.scrollBy(0, -9000)
                buttonClick(allList[0].querySelector('img'))
                console.log('22')
            } 
        }
    }

}







function buttonClick(e) {
    if(e.target){
        targetElem = e.target
    } else{
        targetElem = e
    }
    

    if(targetElem.src){
        setButton()
    } else{
        targetElem = targetElem.querySelector('img')
        setButton()
    }
    function setButton() {
        targetAudio = targetElem.parentNode.parentNode.querySelector('.audio')
    }

    descriptionClick(targetElem, true)
}

function descriptionClick(li, ife) {
    if(ife){
        targetLi = li.parentNode.parentNode
        play()
    } else{
        if(li.target.tagName == 'DIV'){
            targetLi = li.target.parentNode
            play()
        } else{
            targetLi = li.target.parentNode.parentNode
            play()
        }
    }

}



function play() {
    setMeta()
    targetAudio = targetLi.querySelector('audio')
    let icon = targetLi.querySelector('img')
    let timelineWrap = targetLi.querySelector('.timeline_wrap')

    if(targetAudio.currentTime == 0){
        whenNull()
    } else{
        whenNeNull()
    }

    function whenNull() {
        if(targetAudio.paused){
            targetAudio.play()
            targetLi.classList.add('list_item_active')
            icon.setAttribute('src', 'pause.svg')
            icon.style.transform = 'scale(1.3)'
            timelineWrap.style.display = 'block'

            allAudio.forEach(function(currentValue) {
                if(currentValue == targetAudio){
                    return
                } else{
                    currentValue.pause()
                    currentValue.currentTime = 0

                    currentValue.parentNode.classList.remove('list_item_active')
                    currentValue.parentNode.querySelector('.timeline_wrap').style.display = 'none'
                    icon = currentValue.parentNode.querySelector('img')
                    icon.setAttribute('src', 'play.svg')
                    icon.style.transform = 'scale(1)'

                }
            })
        } else{
            targetAudio.pause()
            icon.setAttribute('src', 'play.svg')
            icon.style.transform = 'scale(1)'
        }
    }
    function whenNeNull(){
        if(targetAudio.paused){
            targetAudio.play()
            icon.setAttribute('src', 'pause.svg')
            icon.style.transform = 'scale(1.3)'
            
        } else{
            targetAudio.pause()
            icon.setAttribute('src', 'play.svg')
            icon.style.transform = 'scale(1)'
        }
    }
}

function search(){
    const value = this.value.trim()
    if(value != ''){
        descriptions.forEach(function(element){
            if(element.innerText.toLowerCase().search(value.toLowerCase()) == -1){
                element.parentNode.style.display = 'none'
            } else{
                element.parentNode.style.display = 'flex'
            }
        })
    } else{
        descriptions.forEach(function(element){
            element.parentNode.style.display = 'flex'
        })
    }
}

lazyLoading()
async function lazyLoading(){
    let url = '/data.json'
    let response = await fetch(url)
    let commits = await response.json()
    console.log(commits)
}