import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";



export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();

    this._loading =document.getElementsByClassName("progress")[0]; 
    
    this.urls = ["https://swapi.boom.dev/api/planets",
    "https://swapi.boom.dev/api/planets?page=2",
    "https://swapi.boom.dev/api/planets?page=3",
    "https://swapi.boom.dev/api/planets?page=4",
    "https://swapi.boom.dev/api/planets?page=5",
    "https://swapi.boom.dev/api/planets?page=6"]
    
    this.promise = this._load();
    
console.log(this._loading.style.display);
    this.promise
    .then(data=>this._create(data)).then(  this._stopLoading());
 
    
    console.log(this._loading);
    

    this.emit(Application.events.READY);
  }

  _render({ name, terrain, population }) {
    return `
<article class="media">
  <div class="media-left">
    <figure class="image is-64x64">
      <img src="${image}" alt="planet">
    </figure>
  </div>
  <div class="media-content">
    <div class="content">
    <h4>${name}</h4>
      <p>
        <span class="tag">${terrain}</span> <span class="tag">${population}</span>
        <br>
      </p>
    </div>
  </div>
</article>
    `;
  }

  async _create(data){
    const main = document.getElementsByClassName("main")[0];
    for(let x of data){
    
    
      const box = document.createElement("div");
      box.classList.add("box");
      box.innerHTML = this._render({
        name: x.name,
        terrain: x.terrain,
        population: x.population,
      });

      main.appendChild(box);
     }
    }
   
  _startLoading(){
    this._loading.style.display = "block";
    
  }

  _stopLoading (){
    this._loading.style.display = "none";
  }

 async _load(){
  this._startLoading();
  
  const response = await Promise.all(
    this.urls.map(url => fetch(url).then(res => res.json())));
  
   return response.map(x=>x.results).flat(1);
  }
}
