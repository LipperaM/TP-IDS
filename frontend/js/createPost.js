function crearPostBox() {
    const modal = document.getElementById("modal");
    const openModal = document.getElementById("openModal");
    const closeModal = document.getElementById("closeModal");
    const postBtn = document.getElementById("postBtn");
    const postText = document.getElementById("postText");
    const postsContainer = document.getElementById("post-container");
    const categoriaBtn = document.getElementById("categoria-btn");

    // funcionalidad del modal
    openModal.onclick = () => {
        modal.style.display = "flex";
    };

    closeModal.onclick = () => {
        modal.style.display = "none";
        postText.value = "";
        categoriaBtn.textContent = "Categoria";
        categoriaBtn.classList.remove("btn-warning");
        categoriaBtn.classList.add("btn-secondary");
    };

    //boton de postear
    postBtn.onclick = () => {
        const text = postText.value.trim();
        const categoriaTexto = categoriaBtn.textContent.trim();
        //chequear si el usuario escribio algo en el campo de texto
        if (text === "") {
            alert("Por favor escribe algo en tu post");
            postText.focus();
            return;
        }
        //chequeo si selecciono una categoria
        if (categoriaTexto === "Categoria") {
            alert("⚠️ Debes seleccionar una categoría antes de postear");
            categoriaBtn.classList.remove("btn-secondary");
            categoriaBtn.classList.add("btn-warning");
            return;
        }

        // crear el nuevo post y agregarlo al contenedor
        const nuevoPost = document.createElement("div");
        nuevoPost.className = "card w-75 mb-3";
        nuevoPost.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">@TuUsuario</h5>
                <span class="category-label badge text-bg-secondary">#${categoriaTexto}</span>
                <p class="card-text">
                    ${text}
                </p>
            </div>

            <div class="post-actions">
                <div class="buttons">
                    <a href="#" class="btn btn-primary">Like</a>
                    <a href="#" class="btn btn-primary">Comentar</a>
                </div>

                <p class="date-time">Ahora</p>
            </div>
        `;

        postsContainer.prepend(nuevoPost);

        postText.value = "";
        categoriaBtn.textContent = "Categoria";
        categoriaBtn.classList.remove("btn-warning");
        categoriaBtn.classList.add("btn-secondary");
        modal.style.display = "none";
    };
    
    //Modal de categorias
    const opciones = document.querySelectorAll(".categoria-opcion");

    opciones.forEach((option) => {
        option.addEventListener("click", function (e) {
            e.preventDefault();
            categoriaBtn.textContent = this.textContent;
            // Cambiar el color cuando se selecciona una categoría
            categoriaBtn.classList.remove("btn-warning");
            categoriaBtn.classList.add("btn-secondary");
        });
    });
}