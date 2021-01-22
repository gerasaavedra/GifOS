// API Key

const apikey = 'FXDMFhEr4CuWIgBxvfdBVEk8NEtCDjhV';
const defaultUrl = 'https://api.giphy.com/v1';
const searchUrl = `${defaultUrl}/gifs/search?`;
const trendingUrl = `${defaultUrl}/trending/searches?api_key=${apikey}`;
const trendingsGifos = `${defaultUrl}/gifs/trending?api_key=${apikey}`;
const searchSuggestionsUrl = `${defaultUrl}/tags/related/`;


// VARIABLES

// Paginación
const totalCount = 36;
const limit = 12;
const registrosPorPagina = 12;
let offSet = 0;
let totalPaginas;
let iterador;
let paginaActual;

// Header
let header = document.querySelector('header');

// Navigation
let sections = document.querySelector('.sections');

// Mobile Menu
let toggle = document.querySelector('#toggle');

// Modo Nocturno
let theme = document.querySelector('#theme');
let changeTheme = localStorage.getItem('darkmode');
let switchTheme = document.querySelector('#switchTheme');

// Search
let searchSection = document.querySelector('#search');
let ctnBox = document.querySelector('#ctn-box');
let boxSearch = document.querySelector('#box-search');
let searchForm = document.querySelector('#search-form');
let searchInput = document.querySelector('#search-input');
let ctnBody = document.querySelector('#ctn-body');
let searchIcon = document.querySelector('#searchIcon');

// Suggestions
let suggestion = document.querySelector('ul.suggestion');

// Clase grid
let grid = document.querySelector('.grid');

// Resultados de búsqueda
let inputValue = document.querySelector('#input-value'); // input value
let resultsElement = document.querySelector('.resultsElements'); // div results
let divIdResults = document.querySelector('#results');

// Trendings
let trendings = document.querySelector('#trendings'); // Trendings

// Paginacion
let paginacionDiv = document.querySelector('#btn-pager');

// Carousel
let row = document.querySelector('.ctn-carousel');
let carouselId = document.querySelector('#carousel');
let carouselImg = document.querySelector('.carousel');
let trendingCard = document.querySelector('.trending-card');
let leftArroy = document.querySelector('#left-arrow');
let rightArroy = document.querySelector('#right-arrow');

// Favoritos
let favorites = [];
let myList = document.querySelector('.myList');

// Mis Gifos
let myGifos = [];
let myGifosList = document.querySelector('.myGifosList');

// Crear gifos
let ctnVideoImg = document.querySelector('.ctn-video img');
let progressBarImg = document.querySelector('.progress-bar img');
let divVideo = document.querySelector('.video');
let video = document.querySelector('#video');
let preview = document.querySelector('.preview');
let stepOne = document.querySelector('#stepOne');
let stepTwo = document.querySelector('#stepTwo');
let stepThree = document.querySelector('#stepThree');
let instructions = document.querySelector('#instructions');
let instructionsP = document.querySelector('#instructions-p');
let clock = document.querySelector('#timer');
let restart = document.querySelector('#restart');
let btnStart = document.querySelector('#start');
let btnRecord = document.querySelector('#grabar');
let btnFinalizar = document.querySelector('#finalizar');
let btnUpload = document.querySelector('#upload');
let videoCover = document.querySelector('.video .capa');
let onLoadImg = document.querySelector('#onLoadImg');
let onLoadParagraph = document.querySelector('#onLoadParagraph');
let onLoadUl = document.querySelector('#onLoadUl');

// Objeto recorder
let recorder;

// Variable para manejar el timer
let recording = false;

let constraints = {
    audio: false,
    video: {
        width: 480,
        height: 320
    }
};

// Modal
let ctnGlobalModal = document.querySelector('.ctn-modal-global');
let exit = document.querySelector('.exit-modal');
let modalImg = document.querySelector('.img-modal img');
let modalTitle = document.querySelector('#title');
let modalUser = document.querySelector('#user');
let modalUl = document.querySelector('.modal-ul');
let modalRightArrow = document.querySelector('.ctn-modal .right-arrow');
let modalLeftArrow = document.querySelector('.ctn-modal .left-arrow');

// Alerta
let alert = document.querySelector('.alert');
let globalCtnAlert = document.querySelector('.global-ctn-alert');


// EVENTLISTENERS

document.addEventListener('DOMContentLoaded', () => {

    loadTheme();
    trendingsResults();
    showCarousel();
});

window.addEventListener('scroll', staticNavBar);

alert.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-alert')) {
        globalCtnAlert.style.display = "none";
        alert.style.display = 'none';
    };
});

if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        searchGifos();
        searchSuggestion();
    });
};

if (ctnBox) {
    ctnBox.addEventListener('keyup', boxSearch_expand);
};

if (searchInput) {
    searchInput.addEventListener('keyup', searchSuggestion);
};

if (suggestion) {
    suggestion.addEventListener('click', e => {
        e.stopPropagation();
        const selectedTerm = e.target.textContent;
        searchInput.value = selectedTerm;
        searchGifos();
        boxSearch_hidden();
        
        while (inputValue.firstChild) {
            inputValue.removeChild(inputValue.firstChild);
        };

        inputValue.innerHTML = `<span class="divider"></span>
                                    <h2>${selectedTerm}</h2>`;
    });
};

if (divIdResults) {
    divIdResults.addEventListener('click', e => {
        if (e.target.classList.contains('giphy-img')) {
            fullScreen(e.target.src);
        };
    });
};

if (trendings) {
    trendings.addEventListener('DOMContentLoaded', trendingsResults);
};

if (resultsElement) {
    resultsElement.addEventListener('click', likes)
};

if (row) {
    row.addEventListener('click', e => {
        if (e.target.classList.contains('giphy-img')) {
            fullScreen(e.target.src);
        };
    });
};

// En caso de que exista el id= myList , lo sincroniza con localStorage y muestra los
// favoritos
if (myList) {
    document.addEventListener('DOMContentLoaded', () => {
            favorites = JSON.parse(localStorage.getItem('Lista de likes')) || [];
            showInFavorites();
        })
        // Agrega la función para mostrar el modal
    document.addEventListener('click', e => {
        if (e.target.classList.contains('giphy-img')) {
            fullScreen(e.target.src);
        };
    });
};

if (grid) {
    grid.addEventListener('click', deleteGifo);
};

if (rightArroy) {
    rightArroy.addEventListener('click', scrollRight);
};

if (leftArroy) {
    leftArroy.addEventListener('click', scrollLeft);
};

if (exit) {
    exit.addEventListener('click', () => {
        if (ctnGlobalModal.style.display == 'flex') {
            ctnGlobalModal.style.display = 'none';
        };
    });
};

if (carouselId) {
    carouselId.addEventListener('click', likes);
};

if (modalUl) {
    modalUl.addEventListener('click', getLikesOnModal);
};

if (btnStart) {
    btnStart.addEventListener('click', () => {
        if (btnStart.textContent === 'Comenzar') {
            recording = !recording;
            activateCamera();
        };
    });
};

if (myGifosList) {
    // Obtenemos del localStorage los gifos creados y guardados
    document.addEventListener('DOMContentLoaded', () => {
        myGifos = JSON.parse(localStorage.getItem('Mis Gifos')) || [];
        showInMyGifos();
    });
    // Agrega la función para eliminar
    myGifosList.addEventListener('click', deleteOwnGifo);

    // Agrega función para mostrar el modal
    document.addEventListener('click', e => {
        if (e.target.classList.contains('giphy-img')) {
            fullScreen(e.target.src);
        };
    });
};

toggle.addEventListener('click', dropDownMenu);
switchTheme.addEventListener('click', swapTheme);



// FUNCIONES

// Alerts
function showAlert(mensaje) {

    globalCtnAlert.style.display = "flex";
    alert.style.display = "inline";

    const alertCtn = document.createElement('div');
    alertCtn.classList.add('alert-ctn');

    alertCtn.innerHTML = `
                          <div class="alert-body">
                               <div class="alert-icon"><i class="far fa-check-circle"></i></div>
                               <p>${mensaje}</p>
                               <div class="btn-alert">Ok</div>
                          </div>
    `;

    while (alert.firstChild) {
        alert.removeChild(alert.firstChild);
    };

    alert.appendChild(alertCtn);
};

function errorAlert(mensaje) {

    globalCtnAlert.style.display = "flex";
    alert.style.display = "inline";

    const alertCtn = document.createElement('div');
    alertCtn.classList.add('alert-ctn');

    alertCtn.innerHTML = `
                          <div class="alert-body">
                               <div class="alert-icon-error"><i class="far fa-times-circle"></i></div>
                               <p>${mensaje}</p>
                               <div class="btn-alert">Ok</div>
                          </div>
    `;

    while (alert.firstChild) {
        alert.removeChild(alert.firstChild);
    };

    alert.appendChild(alertCtn);
};

// Load theme
function loadTheme() {

    if (theme === undefined || theme === null) {
        theme.setAttribute('href', 'css/styles.css');
        changeTheme = localStorage.setItem('darkmode', 'false');
        switchTheme.textContent = 'Modo Nocturno';

    } else if (changeTheme === 'true') {

        theme.setAttribute('href', 'css/darkmode.css');
        changeTheme = localStorage.setItem('darkmode', 'true');
        switchTheme.textContent = 'Modo Diurno';
        if (ctnVideoImg, progressBarImg) {
            ctnVideoImg.src = 'assets/camara-modo-noc.svg';
            progressBarImg.src = 'assets/pelicula-modo-noc.svg';
        };
    } else {

        if (changeTheme === 'false') {
            theme.setAttribute('href', 'css/styles.css');
            changeTheme = localStorage.setItem('darkmode', 'false');
            switchTheme.textContent = 'Modo Nocturno';
        };
    };
};

// Switch Themes * ligth - dark
function swapTheme() {

    if (switchTheme.textContent === 'Modo Nocturno') {

        theme.setAttribute('href', 'css/darkmode.css');
        changeTheme = localStorage.setItem('darkmode', 'true');
        switchTheme.textContent = 'Modo Diurno';
        if (ctnVideoImg, progressBarImg) {
            ctnVideoImg.src = 'assets/camara-modo-noc.svg';
            progressBarImg.src = 'assets/pelicula-modo-noc.svg';
        }
    } else if (switchTheme.textContent === 'Modo Diurno') {

        theme.setAttribute('href', 'css/styles.css');
        changeTheme = localStorage.setItem('darkmode', 'false');
        switchTheme.textContent = 'Modo Nocturno';
        if (ctnVideoImg, progressBarImg) {
            ctnVideoImg.src = 'assets/camara.svg';
            progressBarImg.src = 'assets/pelicula.svg';
        }
    } else {
        theme.setAttribute('href', 'css/styles.css');
        changeTheme = localStorage.setItem('darkmode', 'false');
        switchTheme.textContent = 'Modo Nocturno';
    };

};



// Static Nav Bar
function staticNavBar() {

    const scrolledY = window.scrollY;
    const totalWidth = window.screen.width;

    if (scrolledY >= 70 && totalWidth > 500) {
        header.classList.add('fixed');
    } else {
        header.classList.remove('fixed');
    };
};


// mobile-menu
function dropDownMenu() {

    if (sections.classList.contains('toggle-menu')) {
        sections.classList.remove('toggle-menu');
        sections.classList.remove('active');
        toggle.classList.remove('fa-times');
        toggle.classList.add('fa-bars');
    } else {
        sections.classList.add('toggle-menu');
        sections.classList.add('active');
        toggle.classList.remove('fa-bars');
        toggle.classList.add('fa-times');
    };

};

// Expand search bar
function boxSearch_expand() {

    if (searchInput.value === '') {
        ctnBox.style.height = '50px';
        suggestion.style.display = 'none';
        searchIcon.style.display = 'inline';
    } else {
        searchIcon.style.display = 'none';
        ctnBox.style.height = '200px';
        boxSearch.style.display = 'block';
        searchInput.style.borderBottom = "3px solid #9CAFC3";
    };
};

// Hide search bar
function boxSearch_hidden() {

    searchIcon.style.display = 'inline';
    ctnBox.style.height = '50px';
    boxSearch.style.display = 'none';
    searchInput.style.borderBottom = 'none';
};


// Trendings
function trendingsResults() {

    const url = trendingUrl;
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {

            const arr = resultado.data;
            const arr2 = arr.slice([0], [5]).join(', ');

            const trendingsParagraph = document.createElement('p');
            trendingsParagraph.textContent = `${arr2}`;

            if (trendings) {
                trendings.appendChild(trendingsParagraph);
            };

        }).catch(error => console.log(error));

};


// Busqueda de GIFOS
function searchGifos() {

    // validación...
    if (searchInput.value === '') {
        const errorMessage = errorAlert(' Ooops, la busqueda no puede ir vacia!');
        return errorMessage;
    };

    const q = searchInput.value;
    const path = `${searchUrl}api_key=${apikey}&q=${q}&limit=${limit}&offset=${offSet}`;

    fetch(path).then(function(response) {
        return response.json()
    }).then(function(json) {
        console.log(json.data);

        // Oculta box search
        ctnBox.style.height = "50px";
        boxSearch.style.display = 'none';
        searchInput.style.borderBottom = 'none';
        searchIcon.style.display = 'inline';

        if (json.data.length > 0) {

            let resultsGifos = '';

            json.data.forEach((obj) => {

                const id = obj.id;
                const giphyUrl = obj.url;
                const url = obj.images.original.url;
                const width = obj.images.fixed_width.width;
                const height = obj.images.fixed_width.height;
                const title = obj.title;

                resultsElement.classList.add('grid');
                resultsGifos += `
                    <div class="giphy-card">
                        <img class="giphy-img" id="${id}" src="${url}" width="${width}" height="${height}" alt="${title}">
                        <div class="capa">
                            <ul>
                                <li id="like" class="like"><i class="far fa-heart"></i></li>
                                <li id="download" onclick="downloadGiphy('${url}')"><i class="fas fa-cloud-download-alt"></i></li>
                                <li id="fullScreen" onclick="fullScreen('${url}')"><i class="fas fa-expand-alt"></i></li>
                            </ul>
                            <p>${title}</p>

                        </div>
                    </div>`;

                inputValue.innerHTML = `<span class="divider"></span>
                                        <h2>${q}</h2>`;

                resultsElement.innerHTML = resultsGifos;

                totalPaginas = calcularPaginas(offSet);

                // Limpiar el paginador previo
                while (paginacionDiv.firstChild) {
                    paginacionDiv.removeChild(paginacionDiv.firstChild);
                }
                // Generamos nuevo HTML
                if (json.data.length > 0) {
                    imprimirPaginador();
                } else {
                    paginacionDiv.style.display = 'none';
                };

            });

        } else {

            resultsElement.classList.remove('grid');
            inputValue.innerHTML = `<span class="divider"></span>
                                    <h2>Search not found!</h2>`;

            resultsGifos = `<img src="assets/icon-busqueda-sin-resultado.svg" alt="Search not find"></img>
                            <p class="error-paragraph">Intenta con otra búsqueda.</p>`;

            resultsElement.innerHTML = resultsGifos;
        };
    });
};

// Calculador de páginas
function calcularPaginas(total) {

    return parseInt(totalCount / registrosPorPagina);
};

// Generador que va registrar la cantidad de elementos de acuerdo a las paginas
function* crearPaginador(total) {

    for (let i = 1; i <= total; i++) {
        yield i;
    };
};

// Imprimir cantidad de paginas
function imprimirPaginador() {

    iterador = crearPaginador(totalPaginas);

    while (true) {

        const { value, done } = iterador.next();
        if (done) return;

        // caso contrario genera un boton para cada pagina
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;

        boton.onclick = () => {

            paginaActual = value;
            console.log(paginaActual);
            if (paginaActual === 1) {
                offSet = 0;
            } else if (paginaActual === 2) {
                offSet = 12;
            } else {
                offSet = 25;
            };

            searchGifos();
        };

        paginacionDiv.appendChild(boton);
    };
};


// Search Suggestions
function searchSuggestion() {

    const term = searchInput.value;
    const autoSearch = `${searchSuggestionsUrl}${term}?api_key=${apikey}&limit=3`;


    if (term.length > 0) {

        fetch(autoSearch)
            .then(response => response.json())
            .then(result => {

                let suggestsArray = result.data.slice([0], [3]);

                let showSuggestions = '';
                suggestsArray.forEach(function(suggest) {

                    showSuggestions += `<li class="suggest-entrie"><i class="fas fa-search"></i>${suggest.name}</li>`;

                    suggestion.innerHTML = showSuggestions;

                });
            });
    };
};


// Mostrar carousel

function showCarousel() {

    fetch(trendingsGifos)
        .then(response => response.json())
        .then(json => {
            //console.log(json.data);

            let gifosImg = '';

            json.data.forEach((obj) => {

                const id = obj.id;
                const gifoTitle = obj.title;
                const gifoUrl = obj.images.original.url;


                gifosImg += `
                            
                            <div class="giphy-card trending-card">
                                <img class="giphy-img" src="${gifoUrl}" id="${id}" alt="${gifoTitle}">
                                <div class="capa">
                                    <ul>
                                        <li id="like" class="like"><i class="far fa-heart"></i></li>
                                        <li id="download" onclick="downloadGiphy('${gifoUrl}')"><i class="fas fa-cloud-download-alt"></i></li>
                                        <li id="fullScreen" onclick="fullScreen('${gifoUrl}')"><i class="fas fa-expand-alt"></i></li>
                                    </ul>
                                    <p>Título: ${gifoTitle}</p>
                                </div>
                            </div>
                `;

                if (carouselImg) {
                    carouselImg.innerHTML = gifosImg;
                };
            });
        });
};

// Funcionalidad al Carousel 

function scrollRight() {
    row.scrollLeft += row.offsetWidth;
};

function scrollLeft() {
    row.scrollLeft -= row.offsetWidth;
};

// Sincronizar localStorage
function syncUpStorage() {
    localStorage.setItem('Lista de likes', JSON.stringify(favorites));
};

// Like sobre un giphy y almacenarlo en LocalStorage
function likes(e) {

    if (e.target.classList.contains('fa-heart')) {
        e.target.classList.remove('far');
        e.target.classList.add('fas');
        const selectedGiphy = e.target.parentElement.parentElement.parentElement.parentElement;
        console.log(selectedGiphy);
        getLikedGiphy(selectedGiphy);
        syncUpStorage();
        showAlert('Gifo agregado a "Favoritos"');
    };
};

// Like sobre modal
function getLikesOnModal(e) {

    if (e.target.classList.contains('fa-heart')) {
        e.target.classList.remove('far');
        e.target.classList.add('fas');
        const selectedGiphy = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
        console.log(selectedGiphy);
        getLikedGiphy(selectedGiphy);
        syncUpStorage();
        showAlert('Gifo agregado a "Favoritos"');
    };
};

function getLikedGiphy(gifo) {

    const infoGifo = {
        image: gifo.querySelector('img').src,
        id: gifo.querySelector('img').id,
        tittle: gifo.querySelector('p').textContent
    };

    // Revisar si el giphy ya existe en la lista de favoritos
    const exist = favorites.some(gifo => gifo.id === infoGifo.id);
    if (!exist) {
        favorites = [...favorites, infoGifo];
    } else {
        showInFavorites();
    };
};


function showInFavorites() {

    if (favorites.length > 0) {
        favorites.forEach(likedGiphy => {
            const htmlElement = document.createElement('div');
            htmlElement.classList.add('giphy-card');
            htmlElement.innerHTML = `
        
            <img class="giphy-img" id="${likedGiphy.id}" src="${likedGiphy.image}" width="200" height="200" alt="${likedGiphy.tittle}">
            <div class="capa">
                <ul>
                    <li id="delete" class="delete"><i class="far fa-trash-alt"></i></li>
                    <li id="download" onclick="downloadGiphy('${likedGiphy.image}')"><i class="fas fa-cloud-download-alt"></i></li>
                    <li id="fullScreen" onclick="fullScreen('${likedGiphy.image}')"><i class="fas fa-expand-alt"></i></li>
                </ul>
                <p>${likedGiphy.tittle}</p>;
             </div>
         
            `;

            if (myList) {
                myList.appendChild(htmlElement);
            };

        })

    } else {
        myList.classList.remove('grid');
        const empty = document.createElement('div');

        empty.innerHTML = `<img src="assets/icon-fav-sin-contenido.svg" alt="Search not find"></img>
                       <p class="error-paragraph">"¡Guarda tu primer GIFO en Favoritos 
                       para que se muestre aquí!".</p>`;

        myList.appendChild(empty);
    }

    syncUpStorage();
};

// Descargar Giphy
async function downloadGiphy(imageUrl) {

    const downloadUrl = imageUrl;
    const fetchedGif = fetch(downloadUrl);
    const blobGif = (await fetchedGif).blob();
    const urlGif = URL.createObjectURL(await blobGif);
    const saveImg = document.createElement("a");
    saveImg.href = urlGif;
    saveImg.download = "downloaded-giphy.gif";
    saveImg.style = 'display: "none"';
    document.body.appendChild(saveImg);
    saveImg.click();
    document.body.removeChild(saveImg);
    showAlert('Descarga exitosa!');
};


// fullScreen para desplegar el modal
function fullScreen(imageUrl) {

    let giphyImg = document.querySelectorAll('img[class="giphy-img"]');

    let modalButtons = document.createElement('ul');
    for (let i = 0; i < giphyImg.length; i++) {
        if (giphyImg[i].src == imageUrl) {
            ctnGlobalModal.style.display = 'flex';
            modalImg.src = imageUrl;
            modalImg.id = giphyImg[i].id;
            modalTitle.textContent = `Título: ${giphyImg[i].alt}`;

            // Genera los botones dinámicamente
            modalButtons.innerHTML = `
                            
                    <li id="like" class="like"><i class="far fa-heart"></i></li>
                    <li id="download" onclick="downloadGiphy('${imageUrl}')"><i class="fas fa-cloud-download-alt"></i></li>
            `;

            while (modalUl.firstChild) {
                modalUl.removeChild(modalUl.firstChild);
            };

            modalUl.appendChild(modalButtons);


            // Funcionalidad a las flechas
            modalRightArrow.onclick = () => {
                modalImg.src = giphyImg[i++].src;
                modalTitle.textContent = giphyImg[i++].alt;
            };

            modalLeftArrow.onclick = () => {
                modalImg.src = giphyImg[i--].src;
                modalTitle.textContent = giphyImg[i--].alt;
            };

        };
    };

};

// Elimiar Gifo de Favoristos -
function deleteGifo(e) {

    if (e.target.classList.contains('fa-trash-alt')) {
        const gifoToDelete = e.target.parentElement.parentElement.parentElement.parentElement;
        const gifoToDeleteId = gifoToDelete.querySelector('img').id;

        favorites = favorites.filter(gifo => gifo.id !== gifoToDeleteId);

        showAlert('Gifo eliminado correctamente!');

        // Llamo a la función que imprime los gifos
        while (myList.firstChild) {
            myList.removeChild(myList.firstChild);
        };

        showInFavorites();
    };
};

// Eliminar Gifo creado

function deleteOwnGifo(e) {
    if (e.target.classList.contains('fa-trash-alt')) {
        const gifoToDelete = e.target.parentElement.parentElement.parentElement.parentElement;
        const gifoToDeleteId = gifoToDelete.querySelector('img').id;

        myGifos = myGifos.filter(gifo => gifo.id !== gifoToDeleteId);

        showAlert('Gifo eliminado correctamente!');

        while (myGifosList.firstChild) {
            myGifosList.removeChild(myGifosList.firstChild);
        };

        showInMyGifos();
    };
};

// Crear propio Gifo

// Primer paso
function firstStep() {

    instructions.textContent = '¿Nos das acceso a tu cámara?';
    instructionsP.textContent = 'El acceso a tu camara será válido sólo por el tiempo en el que estés creando el GIFO.';
    stepOne.style.color = '#fff';
    stepOne.style.backgroundColor = 'var(--primary)';
};

// Segundo Paso
function secondStep() {
    stepOne.style.color = 'var(--primary)';
    stepOne.style.backgroundColor = '#fff';
    stepTwo.style.color = '#fff';
    stepTwo.style.backgroundColor = 'var(--primary)';

};

// Tercer Paso
function thirdStep() {
    stepTwo.style.color = 'var(--primary)';
    stepTwo.style.backgroundColor = '#fff';
    stepThree.style.color = '#fff';
    stepThree.style.backgroundColor = 'var(--primary)';
    btnStart.style.display = 'none';
    btnUpload.classList.remove('button-inactive');
};

// Obtener video y grabación
function activateCamera() {

    firstStep();
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            height: { max: 480 }
        }
    }).then(function(stream) {

        video.srcObject = stream;
        video.play();

        // modifico el DOM
        secondStep();

        btnStart.classList.remove('button-active');
        btnStart.classList.add('button-inactive');
        instructions.style.display = 'none';
        instructionsP.style.display = 'none';
        btnRecord.classList.remove('button-inactive');
        btnRecord.classList.add('button-active');

        btnRecord.onclick = () => {

            btnRecord.classList.remove('button-active');
            btnRecord.classList.add('button-inactive');

            btnFinalizar.classList.remove('button-inactive');
            btnFinalizar.classList.add('button-active');

            recording != recording;

            if (recording === true) {
                this.disabled = true;
                recorder = RecordRTC(stream, {
                    type: 'gif',
                    frameRate: 1,
                    quality: 10,
                    width: 360,
                    hidden: 240,
                    onGifRecordingStarted: function() {
                        console.log('started')
                    },
                });

                recorder.startRecording();
                getDuration();


                btnFinalizar.onclick = () => {
                    recorder.camera = stream;
                    recorder.stopRecording(stopRecordingCallback);
                }



            } else {
                this.disabled = true;
                recorder.stopRecording(stopRecordingCallback);
                recording = false;
            }
        }

    })
};

// Timer
function getDuration() {

    let seconds = 0;
    let minutes = 0;
    let timer = setInterval(() => {
        if (recording) {
            if (seconds < 60) {
                if (seconds <= 9) {
                    seconds = '0' + seconds;
                }
                document.getElementById('timer').innerHTML = `00:0${minutes}:${seconds}`;
                seconds++;
            } else {
                minutes++;
                seconds = 0;
            }
        } else {
            clearInterval(timer)
        }
    }, 1000);
};

function stopRecordingCallback() {

    btnFinalizar.classList.remove('button-active');
    btnFinalizar.classList.add('button-inactive');

    btnUpload.classList.remove('button-inactive');
    btnUpload.classList.add('button-active');

    recorder.camera.stop();

    let form = new FormData();
    form.append("file", recorder.getBlob(), 'test.gif');

    btnUpload.addEventListener('click', () => {
        // modifico el DOM
        thirdStep();
        uploadGif(form);
    })

    // mostramos el preview
    objectURL = URL.createObjectURL(recorder.getBlob());
    preview.src = objectURL;
    preview.style.display = 'inline';

    // modificamos el dom para mostrar el preview, remover el timer
    clock.style.display = 'none';
    restart.style.display = 'inline-block';

    recorder.destroy();
    recorder = null;

    // en caso de resetear la grabación...
    restart.addEventListener('click', () => {
        location.reload();
        activateCamera();
    })
};


function uploadGif(gif) {

    videoCover.style.display = 'inline';

    fetch(`https://upload.giphy.com/v1/gifs?api_key=${apikey}`, {
            method: 'POST',
            body: gif
        }).then(res => {
            console.log(res.status)
            if (res.status != 200) {
                console.log('Hubo un error al subir tu Gifo');
            }
            return res.json();
        }).then(data => {
            const gifId = data.data.id;
            console.log(gifId);
            preview.id = gifId;

            getGifDetails(gifId);
        })
        .catch(error => {
            console.log(error);
        })

    // modifica el DOM    
    setTimeout(() => {
        onLoadImg.src = 'assets/ok.svg';
        onLoadParagraph.textContent = 'GIFO subido con éxito - Podrás verlo en la sección "Mis Gifos"';
    }, 4000);

};

// Traemos el gif creado
function getGifDetails(id) {

    fetch(`${defaultUrl}/gifs/${id}?api_key=${apikey}`)
        .then((response) => {
            return response.json()
        }).then(data => {
            console.log(data.data);
            const ownGif = {
                image: data.data.images.original.url,
                id: data.data.id,
                user: data.data.username,
                title: "Created"
            }

            // aplica la url del gif creado al preview
            preview.src = ownGif.image;

            // agrega el gif creado a la lista de "Mis Gifos"
            const misGifosArray = JSON.parse(localStorage.getItem('Mis Gifos'));
            misGifosArray.push(ownGif);
            localStorage.setItem('Mis Gifos', JSON.stringify(misGifosArray));

            const ul = document.createElement('ul');
            ul.id = 'onLoadUl';
            ul.innerHTML = `<li><i class="fas fa-download"></i></li>
                            <li id="like" class="like"><i class="far fa-heart"></i></li>`;

            videoCover.appendChild(ul);

            // funcionalidad a la descarga
            videoCover.addEventListener('click', (e) => {
                if (e.target.classList.contains('fa-download')) {
                    getNode = e.target.parentElement.parentElement.parentElement.parentElement;
                    getUrl = getNode.childNodes[7].currentSrc;
                    downloadGiphy(getUrl);
                };
            });

            // funcionalidad al like
            let faHeart = document.querySelector('.fa-heart');
            faHeart.addEventListener('click', likes);

        })
        .catch((error) => {
            return error
        });
};

// Mostramos los gifos creados en la sección Mis Gifos de nuestra pagina web
async function showInMyGifos() {

    if (myGifos.length > 0) {
        myGifos.forEach(createdGif => {
            const innerElement = document.createElement('div');
            innerElement.classList.add('giphy-card');
            innerElement.innerHTML = `
                <img class="giphy-img" id="${createdGif.id}" src="${createdGif.image}" width="200" height="200" alt="${createdGif.title}">
                <div class="capa">
                    <ul>
                        <li id="delete" class="delete"><i class="far fa-trash-alt"></i></li>
                        <li id="download" onclick="downloadGiphy('${createdGif.image}')"><i class="fas fa-cloud-download-alt"></i></li>
                        <li id="fullScreen" onclick="fullScreen('${createdGif.image}')"><i class="fas fa-expand-alt"></i></li>
                    </ul>
                    <p id="user">User: ${createdGif.user}</p> <br>
                    <p id="title">Título: ${createdGif.title}</p>
                </div>            
            
            `;

            if (myGifosList, modalUser) {
                myGifosList.appendChild(innerElement);
                modalUser.textContent = `User: ${createdGif.user}`;
            };

        });
    } else {
        myGifosList.classList.remove('grid');
        const myGifosEmpty = document.createElement('div');

        myGifosEmpty.innerHTML = `<img src="assets/icon-mis-gifos-sin-contenido.svg" alt="Icon Empty List"></img>
                                  <p class="error-paragraph">¡Anímate a crear tu primer GIFO!</p>`;

        myGifosList.appendChild(myGifosEmpty);
    };

    // sincroniza el storage
    myGifosOnStorage();
};

function myGifosOnStorage() {
    localStorage.setItem('Mis Gifos', JSON.stringify(myGifos));
};
