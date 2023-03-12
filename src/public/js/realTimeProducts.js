const socket = socket();

let addProductForm = document.getElementById("addProductForm");
let deleteProductForm = document.getElementById("deleteProductForm");
let toast = document.getElementById("toast");

deleteProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let id = e.target[0].value.trim();
  socket.emit("deleteProduct", id);
  e.target.reset();
});

sendMessageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let product = {
    title: e.target[0].value.trim(),
    description: e.target[1].value.trim(),
    code: e.target[2].value.trim(),
    price: e.target[3].value.trim(),
    status: e.target[4].value.trim(),
    stock: e.target[5].value.trim(),
    category: e.target[6].value.trim(),
    thumbnails: [e.target[7].value.trim(), e.target[8].value.trim()],
  };
  socket.emit("addProduct", product);
  e.target.reset();
});

const showToast = (message) => {
  toast.innerHTML = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
};

window.addEventListener("load", () => showToast("Lista actualizada!"));

socket.on("productListUpdated", () => {
  location.reload();
});

socket.on("addProductRes", (response) => {
  showToast(response.message);
  if (response.success) {
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
});

socket.on("deleteProductRes", (response) => {
  showToast(response.message);
  if (response.success) {
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
});