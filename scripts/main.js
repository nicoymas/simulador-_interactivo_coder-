
import * as clases from './classviaje.js'

document.addEventListener('DOMContentLoaded', function() {

    
    
    const viajes =[
        {id:1 ,region:"Cancun",precio: 2000 , imagen:"https://t-cf.bstatic.com/xdata/images/hotel/max1024x768/319148225.jpg?k=2cb97b204ecc359bf8f5b82f183068167ca910965c83ddb72812f5ce6d3b2871&o=&hp=1"},
        {id:2 ,region:"Playa del Carmen",precio: 2500 , imagen:"https://www.coming2.com/co2content/co2image/1418246196811/playa-del-carmen-RMY-PLAYA-CAR.jpg" },
        {id:3 ,region:"Japon", precio: 3000, imagen:"https://www.caracteristicas.co/wp-content/uploads/2018/08/japon-e1573443550864.jpg" },
    ];
    

    localStorage.setItem("listaviajes",JSON.stringify(viajes));
    
    const guardados=JSON.parse(localStorage.getItem("listaviajes"));
    
    for(const objeto of guardados){
        new clases.Viaje(objeto);
    }; 
    
    
    
    const divdest=document.getElementById("datos");
    const nuevoul= document.createElement("ul");
    nuevoul.id="destino";
    divdest.append(nuevoul);
    document.getElementById("destino");
    for(const lugar of viajes){
        let muestra = document.createElement("li");
        muestra.innerHTML=`<div class="row gx-0 mb-5 mb-lg-0 justify-content-center">
        <div class="col-lg-6"><img class="img-fluid" src="${lugar.imagen}" alt="..." /></div>
        <div class="col-lg-6">
            <div class="bg-black text-center h-100 project">
                <div class="d-flex h-100">
                    <div class="project-text w-100 my-auto text-center text-lg-left">
                        <h4 class="text-white">id: ${lugar.id}</h4>
                        <h4 class="text-white"> ${lugar.region}</h4>
                        <p class="mb-0 text-white-50">${lugar.precio} $</p>
                        <hr class="d-none d-lg-block mb-0 ms-0" /></div></div></div></div></div>`
        
        nuevoul.appendChild(muestra);
    }
    
     
    const logout=document.getElementById("logout");
    logout.addEventListener("click",(e)=>{
        e.preventDefault();
        sessionStorage.clear();
        window.location.href="index.html";
    })

    const botonsito=document.getElementById("botonbusca"); 
    const formulario=document.getElementById("formularioguard");    
    const busqueda=JSON.parse(localStorage.getItem("users"));
    const sesion=JSON.parse(sessionStorage.getItem("usuariossesion"));
    let noencontrado =document.getElementById("error1")
    console.log(busqueda[3])
    if(sesion == null){
        botonsito.addEventListener("click",validacion)
        function validacion(e){
            e.preventDefault();
            const localuser={usuario :document.getElementById("formularioguard")[0].value, pasword: document.getElementById("formularioguard")[1].value}
            
            sessionStorage.setItem("usuariossesion",JSON.stringify(localuser));
            const encontrado=busqueda.find((el)=> el.usuario == localuser.usuario)
            const pasencontrado=busqueda.find((el)=> el.pasword == localuser.pasword)
            if( encontrado && pasencontrado){
            // if(localuser.usuario== busqueda.usuario && localuser.pasword== busqueda.pasword){
                location.reload(),
                formulario.innerHTML=`<h1>Bienvenido  ${localuser.usuario}</h1>`
                return 
            } else {
                noencontrado.innerHTML="Usuario o contraseña incorrectos";
            }
        }
    }else{
        formulario.innerHTML=`<h1>Bienvenido  ${sesion.usuario}</h1>`
    }
    
    const formdest=document.getElementById("formdest");
    let lugarid=document.getElementById("idlugar");
    let costo=0
    let img
    let reg
    formdest.addEventListener("submit",destinos);
    
    function destinos(e){
        e.preventDefault();
        if(sesion != null){
            let pais = lugarid.value;            
            guardados.forEach((obj)=>{
                if(obj.id == pais){
                    costo = obj.precio
                    img = obj.imagen
                    reg = obj.region     
            
                    Swal.fire({
                        title: `viaje a ${reg}`,
                        text: `$ ${costo}`,    
                        imageUrl: `${img}`,
                        imageWidth: 400,
                        imageHeight: 200,
                        imageAlt: 'Custom image',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'ver metodos de pago'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            let datosviaje={costo:costo,img:img,reg:reg}
                            sessionStorage.setItem('datosviaje',JSON.stringify(datosviaje));
                            location.reload()
                        }else{
                            location.reload()
                        }   
                    })
                }             
            });  
        }else{
            let mensaje= document.getElementById("error")
            mensaje.innerHTML="<h4>debe registrarse para continuar</h4>";
        }
    }
    
    //ver monto total
   
    const mensaje=document.getElementById("mensajecosto")
    const metodopago=document.getElementById("metodform");
    const metodid=document.getElementById("metodid");
    const destino=document.getElementById("datos2")   
    
    let loadviajes=JSON.parse(sessionStorage.getItem("datosviaje"));
    
    console.log(loadviajes);
    

    if(loadviajes!= null){
       
        
        formdest.innerHTML=`<button ><a href="#metodform"> metodos</a></button><br><h2></h2>
        <h2>${loadviajes.reg}</h2><h2>${loadviajes.costo}</h2>
        <img src="${loadviajes.img} "alt="${loadviajes.reg}"height="300 px" width="1000 px id ="imagenviajes">`
        
        const borrarviaje=document.createElement("button");
        borrarviaje.id="borrarviaje"
        borrarviaje.textContent="seguir viendo"
        formdest.append(borrarviaje);
        
        borrarviaje.addEventListener("click",(e)=>{
            e.preventDefault();
            sessionStorage.removeItem("datosviaje");
            window.location.href="index.html";
        })
        
    
        let costos= loadviajes.costo
        destino.innerHTML=`<h2>${loadviajes.reg}</h2><h2>${loadviajes.costo}</h2>
        <img src="${loadviajes.img} "alt="${loadviajes.reg}"height="250 px" width="300 px id ="imagenviajes">`
        metodopago.addEventListener("submit",metodoDePago);
        
        function metodoDePago(event){
            event.preventDefault();
            let metodo= metodid.value
            if(metodo== "TARJETA" || metodo== "EFECTIVO"){
                let aumento=costos*0.15
                if (metodo== "TARJETA") {
                    costos+= aumento
                    mensaje.innerHTML=`<h4>eligio el pago con tarjeta, monto total a pagar es de  ${costos}</h4><a href="metod.html">reservar</a>`
                    metodopago.reset();
                }else{
                    costos-= aumento
                    mensaje.innerHTML=`<h4>eligio el pago en efectivo , monto total a pagar es de  ${costos}</h4><a href="metod.html">reservar</a>`
                    metodopago.reset();
                }
            }else{
                mensaje.innerHTML="<h4>ingrese datos correctos<h4>";
            }
        }    
    }else{
        mensaje.innerHTML= "<h4> debe elejir un destino primero</h4>";
    }    

}, false);   
























