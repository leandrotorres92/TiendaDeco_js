//FUNCIONES DEL CARRITO.

//Lista donde iran todos los productos del json.
let compras = [];

function comprasEnStorage() {
  let contenidoEnStorage = JSON.parse(
    localStorage.getItem("productosEnStorage")
  );
  console.log("Carrito en LS", contenidoEnStorage);

  // Se toma el array que quedo en el carrito de compras.
  if (contenidoEnStorage) {
    let array = [];
    for (let i = 0; i < contenidoEnStorage.length; i++) {
      let compras = new Producto(
        contenidoEnStorage[i],
        contenidoEnStorage[i].cantidad
      );

      compras.importeTotal();
      array.push(compras);
    }
    return array;
  }
  return [];
}

function imprimirDatos() {
  //LLamada y formateo del documento JSON: /datos/productos.json.
  const URLJSON = "datos/productos.json";

  $.getJSON(URLJSON, function (respuesta, estado) {
    if (estado === "success") {
      let datos = respuesta;
      items = respuesta;

      for (const items of datos) {
        $("#contenedor").append(
          `<div class="card-group text-center" style="width:25rem">
                      <div class="card-body">
                          <div class="imgs">
                              <img src="${items.img}" class="card-img-top img-fluid" style="height:22rem; border-radius:10px;">
                          </div>                                    
                              <h3 class="card-title">${items.nombre}</h3>
                              <h5 class="card-subtitle mb-2 text-muted">${items.tipo}</h5>
                              <p class="card-text">$${items.precio}</p>                    
                          <div class="btn-group" role="group" aria-label="Basic mixed styles  example">
                              <button id="agregar${items.id}" type="button" onclick="" class="btn btn-dark"> Agregar </button>                                    
                          </div>                                
                      </div>
                    </div>`
        );

        //Evento agregar los productos al carrito.
        $(`#agregar${items.id}`).on("click", () => {
          $(`#agregar${items.id}`).fadeOut("fast", () => {
            $(`#agregar${items.id}`).fadeIn(1000);
          });

          agregarAlCarrito(items.id);

          //Alerta success del boton agregar items.
          toastr.options = {
            closeButton: false,
            debug: false,
            newestOnTop: false,
            progressBar: false,
            positionClass: "toast-bottom-right",
            preventDuplicates: false,
            onclick: null,
            showDuration: "300",
            hideDuration: "1000",
            timeOut: "1500",
            extendedTimeOut: "1000",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut",
          };
          toastr["success"](
            "Su producto ha sido agregado, Gracias!!",
            "VER CARRITO DE COMPRAS"
          );
        });
      }
    }
  });
}

function tablaEnBtn(array) {
  //Imprimimos la tabla dentro del Boton "Carrito de compras".
  let contenedor = document.getElementById("carritoCompras");
  contenedor.innerHTML = "";
  precioTotal = importeTotalCompra(array);
  let tabla = document.createElement("div");
  tabla.innerHTML = `
                        <table id="tablaCarrito" class="table">  
                            <tbody id="bodyTabla">
                                <tr>
                                    <td>Total: $${precioTotal}</td>
                                    <td> </td>
                                    <td> </td>
                                    <td> </td>
                                    <td> </td>                                        
                                </tr>
                            </tbody>
                        </table>
                        <div class="mt-2">
                            <tr>
                                <td><a href="#" id="finalizarCompra" 
                                                class="btn btn-dark">
                                        Finalizar Compra
                                    </a>
                                </td>
                            </tr>
                        </div>`;

  contenedor.appendChild(tabla);
  let bodyTabla = document.getElementById("bodyTabla");

  for (let items of array) {
    let datos = document.createElement("div");
    datos.innerHTML = `<tr> 
                                <th scope="row"></th>
                                <td>${items.cantidad}</td>
                                <td><img src="${items.img}" width=100> </td>
                                <td>${items.nombre}</td>                                
                                <td>$${items.precioTotal}</td>
                                <td><button id="eliminar${items.id}" type="button" 
                                class="btn btn-light">X</button></td>                                                               
                            </tr>`;

    bodyTabla.appendChild(datos);

    //Evento del Boton eliminar.
    $(`#eliminar${items.id}`).on("click", () => {
      eliminarDelCarrito(items.id);
    });
  }
  //Evento del Boton finalizar compra.
  $(`#finalizarCompra`).on("click", (e) => {
    finalizarCompra(e);
  });
}

function agregarAlCarrito(idProducto) {
  //Agregamos los productos dentro del array. Mediante metodos de Busqueda.
  let productoEnCarrito = compras.find((elemento) => {
    if (elemento.id == idProducto) {
      return true;
    }
  });

  if (productoEnCarrito) {
    let index = compras.findIndex((elemento) => {
      if (elemento.id === productoEnCarrito.id) {
        return true;
      }
    });

    compras[index].agregarUnidad();
    compras[index].importeTotal();
  } else {
    compras.push(new Producto(items[idProducto], 1));
  }

  localStorage.setItem("productosEnStorage", JSON.stringify(compras));
  tablaEnBtn(compras);
}

function eliminarDelCarrito(id) {
  //Buscamos por Id de cada producto, si al buscar se repite el Index, aplicamos el metodo quitar.
  let items = compras.find((items) => items.id === id);

  let index = compras.findIndex((element) => {
    if (element.id === items.id) {
      return true;
    }
  });

  if (items.cantidad > 1) {
    compras[index].quitarUnidad();
    compras[index].importeTotal();
  } else {
    compras.splice(index, 1);

    if (compras.lenght === 0) {
      compras = [];
    }
  }
  localStorage.setItem("productosEnStorage", JSON.stringify(compras));
  tablaEnBtn(compras);
}

function finalizarCompra(e) {
  //Utilizamos prevent para accionar un evento que me permite abrir una ventana de emergencia o redirigirme a otra page.
  e.preventDefault();

  if (this.comprasEnStorage().length === 0) {
    swal({
      icon: "warning",
      text: "No hay productos en su compra!!",
      timer: "1800",
    });
  } else {
    location.href = "./secciones/finalizar-compra.html";
  }
}

function importeTotalCompra(array) {
  //Iteramos la lista compras, inicializando la variable precioTotal en 0 y mediante una suma de la lista de compras obtenemos el Total.
  let precioTotal = 0;

  for (const producto of array) {
    precioTotal += producto.precioTotal;
  }
  return precioTotal;
}

function bucarProductos() {
  //Metodo de busqueda por nombre de los productos.
  const URLJSON = "datos/productos.json";

  $.getJSON(URLJSON, function (respuesta, estado) {
    if (estado === "success") {
      let datos = respuesta;
      items = respuesta;

      const entrada = document.querySelector(".buscar");
      const btnBuscar = document.querySelector(".btnbuscar");
      const resultado = document.querySelector("#contenedor");

      const filtrar = (e) => {
        e.preventDefault();
        resultado.textContent = "";

        const texto = entrada.value.toLowerCase();
        for (const productos of datos) {
          let nombre = productos.nombre.toLowerCase();
          if (nombre.indexOf(texto) !== -1) {
            $("#contenedor").append(`
            <div class="card-group text-center" style="width:25rem">
              <div class="card-body">
                  <div class="imgs">
                      <img src="${productos.img}" class="card-img-top img-fluid" style="height:22rem; border-radius:10px;">
                  </div>                                    
                      <h3 class="card-title">${productos.nombre}</h3>
                      <h5 class="card-subtitle mb-2 text-muted">${productos.tipo}</h5>
                      <p class="card-text">$${productos.precio}</p>                    
                  <div class="btn-group" role="group" aria-label="Basic mixed styles  example">
                      <button id="agregar${productos.id}" type="button" onclick="" class="btn btn-dark"> Agregar </button>                                    
                  </div>                                
              </div>
            </div>`);
            //Evento agregar los productos al carrito.
            $(`#agregar${productos.id}`).on("click", () => {
              $(`#agregar${productos.id}`).fadeOut("fast", () => {
                $(`#agregar${productos.id}`).fadeIn(1000);
              });

              agregarAlCarrito(productos.id);
            });
          }
        }
        if (resultado.textContent === "") {
          swal({
            icon: "warning",
            text: "El producto no se encuentra disponible!!",           
            timer: "2800",
          });
        }
      };
      btnBuscar.addEventListener("click", filtrar);
      entrada.addEventListener("keyup", filtrar);
    }
  });
}

function animaciones() {
  //Utilizamos animaciones de JQ para el titulo principal.
  $("#tituloPrincipal").animate(
    {
      opacity: "0",
      timer: 4000,
    },
    "slow",
    () => {
      $("#tituloPrincipal").animate({
        opacity: "100",
        timer: 4000,
      });
    }
  );
}

//INVOCACION DE FUNCIONES.
imprimirDatos();
compras = comprasEnStorage();
tablaEnBtn(compras);
animaciones();
bucarProductos();
//--------------------------------------------------------
