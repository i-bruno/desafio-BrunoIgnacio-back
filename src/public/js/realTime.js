const socketCliente = io();
socketCliente.on("productos", (products) => {
  console.log(products);
  updateProductList(products);
});

// Función para actualizar la lista de productos en la página web
function updateProductList(products) {
  let div = document.getElementById("list-products");
  let productos = "";

  products.forEach((product) => {
    productos += `
        <article class="container">
      <div class="card">
        <div class="contentBx">
          <h2>${product.title}</h2>
          <div class="size">
            <h3>${product.description}</h3>
          </div>
          <div class="color">
            <h3>$ ${product.price}</h3>
          </div>
          <a href="#">Comprar</a>
        </div>
      </div>
      
    </article>
        
        
        
        
        
        
        `;
  });

  div.innerHTML = productos;
}

let form = document.getElementById("formProduct");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let title = form.elements.title.value;
  let description = form.elements.description.value;
  let price = form.elements.price.value;
  let code = form.elements.code.value;

  socketCliente.emit("addProduct", {
    title,
    description,
    price,
    code,
  });

  form.reset();
});

document.getElementById("delete-btn").addEventListener("click", function () {
    const deleteidinput = document.getElementById("id-prod");
    const deleteid = parseInt(deleteidinput.value);
    socketCliente.emit("deleteProduct", deleteid);
    deleteidinput.value = "";
  });
socketCliente.on("productosupdated", (obj) => {
  updateProductList(obj);
});