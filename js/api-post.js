//Aplicamo metodo POST para enviar los datos del pedido.

function realizarPago() {
  $(() => {
    const URL = "https://jsonplaceholder.typicode.com/posts";

    const datos = {
      cliente: "Leandro",
      correo: "leantorr92@hotmail.com",
      comentario: "Enviado",
    };

    $("#btnRealizarPago").click(function () {
      $.ajax({
        type: "POST",
        url: URL,
        data: datos,
        success: function (response) {
          $("body").append(
            `<div>${response.cliente}   ${response.correo}  ${response.comentario}</div>`
          );
        },
      });
    });
  });
}
realizarPago();
