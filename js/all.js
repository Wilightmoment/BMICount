const el_height = document.querySelector('#height')
const el_weight = document.querySelector('#weight')
const btn = document.querySelector('.btn')
const BMI_status = document.querySelector('.btn-status')
const restrat = document.querySelector('.icon')
const BMI_text = document.querySelector('.BMI-text')
const card_list = document.querySelector('.card-list')

let height, weight, BMI, status = [], datas = new Set()
const heavy = {
    'init' : ['#86D73E', '理想'],
    'light': ['#31BAF9', '過輕'],
    'obsity': ['#FF982D', '過重'],
    'mild': ['#FF6C02', '輕度肥胖'],
    'moderate': ['#FF6C02', '中度肥胖'],
    'ervere': ['#FF1200', '重度肥胖']
}

el_height.addEventListener('change', function (e) {
   if (parseInt(e.target.value) !== NaN){
        height = parseInt(e.target.value)
   }
})
el_weight.addEventListener('change', function (e) {
    if (parseInt(e.target.value) !== NaN){
        weight = parseInt(e.target.value)
    }
 })

 btn.addEventListener('click', compute)
 restrat.addEventListener('click', function () {
     showMes(false)
})
 card_list.addEventListener('click', function (e) {
    if (e.target.className === 'remove') {
        let temp = JSON.parse(localStorage.getItem('record'))
        temp = temp.filter(m=>m[6]!==e.target.parentElement.id)
        localStorage.setItem('record', JSON.stringify(temp))
        location.reload()
    }
 })

 function compute () {
     document.getElementById('msg').textContent = ''
     if (height === undefined || weight === undefined || height === 0 || weight === 0) {
         document.getElementById('msg').textContent = '請輸入正確的身高/體重'
         return
        }
     BMI = weight / ((height/100) * (height/100))
     BMI = BMI.toFixed(2)
     compare(BMI)
 }

 function compare (BMI) {
    status = []
    if (BMI <= 18.5) {
        status = heavy['light']
    } else if (BMI <= 25) {
        status = heavy['init']
    } else if (BMI <= 30) {
        status = heavy['obsity']
    } else if (BMI <= 35) {
        status = heavy['mild']
    } else if (BMI <= 40) {
        status = heavy['moderate']
    } else {
        status = heavy['ervere']
    }
    status = status.slice(0, 2)
    showMes()
    addCard()
 }

 function showMes (show = true) {
     if (show) {
         btn.style.display = 'none'
         BMI_status.children[0].textContent = BMI
         BMI_status.style.color = status[0]
         BMI_status.style.borderColor = status[0]
         BMI_status.lastChild.style.backgroundColor = status[0]
         BMI_text.textContent = status[1]
         BMI_text.style.color = status[0]
         BMI_status.style.display = 'flex'
     } else {
         BMI_status.style.display = 'none'
         btn.style.display = 'block'
         BMI_text.textContent = ''
         el_height.value = null
         el_weight.value = null
     }
 }

 function addCard () {
     const date = new Date()
     status.push(BMI)
     status.push(weight)
     status.push(height)
     status.push(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`)
     status.push(Math.floor(date.getTime() / 1000).toString())
     datas.add(status)
     localStorage.setItem('record', JSON.stringify([...datas]))
     let card = document.createElement('div')
     card.setAttribute('class', 'card')
     card.setAttribute('id', status[6])
     card.innerHTML = `
        <div class="color" style="background-color: ${status[0]}"></div>
        <div class="result" style="min-width: 80px">${status[1]}</div>
        <div class="group">
            <div class="lab">BMI</div>
            <div class="result">${status[2]}</div>
        </div>
        <div class="group">
            <div class="lab">weight</div>
            <div class="result">${status[3]}kg</div>
        </div>
        <div class="group">
            <div class="lab">height</div>
            <div class="result">${status[4]}cm</div>
        </div>
        <div class="lab">${status[5]}</div>
        <div class="remove">刪除此紀錄</div>
     `
     card_list.appendChild(card)
 }

 window.onload = function () {
     if (localStorage.getItem('record') !== null) {
         let temp  = JSON.parse(localStorage.getItem('record'))
         for (let item of temp) {
            let card = document.createElement('div')
            card.setAttribute('class', 'card')
            card.setAttribute('id', item[6])
            card.innerHTML = `
               <div class="color" style="background-color: ${item[0]}"></div>
               <div class="result" style="min-width: 80px">${item[1]}</div>
               <div class="group">
                   <div class="lab">BMI</div>
                   <div class="result">${item[2]}</div>
               </div>
               <div class="group">
                   <div class="lab">weight</div>
                   <div class="result">${item[3]}kg</div>
               </div>
               <div class="group">
                   <div class="lab">height</div>
                   <div class="result">${item[4]}cm</div>
               </div>
               <div class="lab">${item[5]}</div>
               <div class="remove">刪除此紀錄</div>
            `
            card_list.appendChild(card)
            datas.add(item)
         }
     }
 }