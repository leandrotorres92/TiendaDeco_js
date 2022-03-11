//CLASE CONSTRUCTORA, PRODUCTOS TEXTILES.

class Producto {
  constructor(textil, cantidad) {
    this.id = textil.id;
    this.nombre = textil.nombre;
    this.tipo = textil.tipo;
    this.medidas = textil.medidas;
    this.cantidad = cantidad;
    this.precio = textil.precio;
    this.img = textil.img;
    this.precioTotal = textil.precio;
  }

  agregarUnidad() {
    this.cantidad++;
  }

  quitarUnidad() {
    this.cantidad--;
  }

  importeTotal() {
    this.precioTotal = this.precio * this.cantidad;
  }
}
