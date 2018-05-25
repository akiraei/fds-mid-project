import './index.scss';
import axios from 'axios';

// document.querySelector('h1').addEventListener('click', e => {
//   alert('Hello World!');
// });




//--------------------------variable--------------------------
//--------------------------variable--------------------------
//--------------------------variable--------------------------

const postAPI = axios.create({
  baseURL: process.env.API_URL
})

const templates = {
  anchor : document.querySelector('.anchor')
  ,todolist : document.querySelector('.toDoList').content
  ,todoitem : document.querySelector('.toDoItem').content
  ,itemEdit : document.querySelector('.itemEdit').content
}


const loginBtn = document.querySelector('.logIn__btn')
const logoutBtn = document.querySelector('.logOut__btn')
const idInput = document.querySelector('.logInForm-id__input')
const pwInput = document.querySelector('.logInForm-pw__input')


//-----------------------function----------------------------------
//-----------------------function----------------------------------
//-----------------------function----------------------------------


function login(res) {
  let token;
    if(localStorage.getItem('token')) {
      token = localStorage.getItem('token')
      postAPI.defaults.headers['Authorization'] = `Bearer ${token}`
      logoutBtn.classList.remove('hidden')
      loginBtn.classList.add('hidden')
      idInput.classList.add('hidden')
      pwInput.classList.add('hidden')
      indexPage()
    } else if (res){
    localStorage.setItem('token', res.data.token)
    token = localStorage.getItem('token')
    postAPI.defaults.headers['Authorization'] = `Bearer ${token}`
    logoutBtn.classList.remove('hidden')
    loginBtn.classList.add('hidden')
    idInput.classList.add('hidden')
    pwInput.classList.add('hidden')
    indexPage()
    }
  }
  
  function logout(){
    delete postAPI.defaults.headers['Authorization']
    localStorage.removeItem('token')
    loginBtn.classList.remove('hidden')
    idInput.classList.remove('hidden')
    pwInput.classList.remove('hidden')
    logoutBtn.classList.add('hidden')
    indexPage()
  }
  
  
  function render(fragment) {
    templates.anchor.textContent = ""; 
    templates.anchor.appendChild(fragment);
    console.log("render")
  }



//------------------login section-----------------------------
//------------------login section-----------------------------
//------------------login section-----------------------------


  const form = document.querySelector('.logInForm')
  form.addEventListener("submit", async e => {
  const payload = {
    username : e.target.elements.id.value,
    password: e.target.elements.pw.value
  }
  
  e.preventDefault()
  
  const res = await postAPI.post('./users/login', payload)

  e.target.elements.pw.value = ""
  
  login(res)
  })

  logoutBtn.addEventListener("click", e => {
    logout()
  })












//----------------template section-----------------------------
//----------------template section-----------------------------
//----------------template section-----------------------------




//-------------index page--------------------------
//-------------index page--------------------------



async function indexPage() {

  if(localStorage.getItem('token')) {

    login()


    //-------------todo list template-----------------------
    const res = await postAPI.get('./contents')
    const listFragment = document.importNode(templates.todolist, true)
    
  console.log(res)
  
  
  
  
  //-------------todo item template-----------------------
    res.data.reverse().forEach( content => {
  
      const itemFragment =document.importNode(templates.todoitem, true)
  
  
      if (content.complete === 1) {
  
        
        
        
        itemFragment.querySelector('.toDoItem-content__title').textContent = "TITLE: " + content.title +" / "
        itemFragment.querySelector('.toDoItem-content__body').textContent = "BODY: " + content.body + " / "
        itemFragment.querySelector('.toDoItem-content__time').textContent = "RECORD TIME: " + content.time
    
    
    
        const editBtn = itemFragment.querySelector('.toDoItem-content__edit-btn')
        const completeBtn = itemFragment.querySelector('.toDoItem-content__complete-btn')
        const itemContents = itemFragment.querySelector('.toDoItem-content')
        
        editBtn.classList.add("hidden")
        completeBtn.classList.add("hidden")
        itemContents.classList.add("lining")
  
        itemFragment.querySelector('.toDoItem-content__delete-btn').addEventListener("click", async e => {
          const deleteRes = await postAPI.delete(`./contents/${content.id}`)
          indexPage()
        })
        
     
        const anchor = listFragment.querySelector('.toDoList__anchor').appendChild(itemFragment)
  
  
      } else {


        logOut()
        
        
        
            itemFragment.querySelector('.toDoItem-content__title').textContent = "TITLE: " + content.title +" / "
            itemFragment.querySelector('.toDoItem-content__body').textContent = "BODY: " + content.body + " / "
            itemFragment.querySelector('.toDoItem-content__time').textContent = "RECORD TIME: " + content.time
        
        
        
            const editBtn = itemFragment.querySelector('.toDoItem-content__edit-btn')
            const completeBtn = itemFragment.querySelector('.toDoItem-content__complete-btn')
            const itemContents = itemFragment.querySelector('.toDoItem-content')
            
        
            
        
            editBtn.addEventListener("click", e => {
              editPage(content.id)
            })
        
            itemFragment.querySelector('.toDoItem-content__delete-btn').addEventListener("click", async e => {
              const deleteRes = await postAPI.delete(`./contents/${content.id}`)
              indexPage()
            })
            
        
            completeBtn.addEventListener("click", async e => {
              editBtn.classList.add("hidden")
              completeBtn.classList.add("hidden")
              itemContents.classList.add("lining")
              
              const payload = {
                complete : 1
              }
              
              const completeRes = await postAPI.patch(`./contents/${content.id}`, payload)
            })
        
        
        
            const anchor = listFragment.querySelector('.toDoList__anchor').appendChild(itemFragment)
  
      } 
  
    })
  
  //-------------------------new item form-----------------------
  
    const form = listFragment.querySelector(".toDoList__newContent")
    form.addEventListener("submit", async e => {
      const now = new Date()
      const parseNow = now.getFullYear().toString()
      + "." + (now.getMonth()+1).toString()
      + "." + now.getDate().toString()
      + " " + now.getHours().toString()
      + ":" + now.getMinutes().toString()
      + ":" + now.getSeconds().toString()
      const payload = {
        title : e.target.elements.title.value,
        body : e.target.elements.body.value,
        time : parseNow,
        complete : 0
      }
      
      e.preventDefault()
      
      const res = await postAPI.post('./contents', payload)
      
      indexPage()
  
        })

        render(listFragment)
  } else {
    templates.anchor.textContent = ""; 
  }
}





//----------------------edit page-----------------------------
//----------------------edit page-----------------------------





async function editPage(num) {
  
  const res = await postAPI.get(`./contents/${num}`)
  const fragment = document.importNode(templates.itemEdit, true)

  fragment.querySelector(".itemEdit__form__input-title").value = res.data.title
  fragment.querySelector(".itemEdit__form__input-body").value = res.data.body

  const form = fragment.querySelector(".itemEdit__form")
  form.addEventListener("submit", async e => {
    const now = new Date()
    const parseNow = now.getFullYear().toString()
    + "." + (now.getMonth()+1).toString()
    + "." + now.getDate().toString()
    + " " + now.getHours().toString()
    + ":" + now.getMinutes().toString()
    + ":" + now.getSeconds().toString()
    const payload = {
      title : e.target.elements.title.value,
      body : e.target.elements.body.value,
      time : parseNow,
      complete : 0
    }
    
    e.preventDefault()
    
    const res = await postAPI.patch(`./contents/${num}`, payload)
    
    indexPage()

      })

      render(fragment)
}













//--------------------action----------------------
//--------------------action----------------------
//--------------------action----------------------


indexPage()