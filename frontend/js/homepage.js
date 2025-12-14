async function cargarPosts() {
  try {
    const response = await fetch("http://localhost:3000/posts");
    const posts = await response.json();

    const container = document.querySelector(".post-container");
    container.innerHTML = "";

    posts.forEach(post => {
      const card = document.createElement("div");
      card.className = "card w-75 mb-3";

      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">@${post.usuario}</h5>
          <span class="category-label badge text-bg-secondary">#${post.categoria}</span>
          <p class="card-text">${post.texto}</p>
        </div>
        <div class="post-actions">
          <div class="buttons">
            <a href="#" class="btn btn-primary">Like</a>
            <a href="#" class="btn btn-primary">Comentar</a>
          </div>
          <p class="date-time">${new Date(post.creado_en).toLocaleString('es-AR')}</p>
        </div>
      `;        

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error cargando posts:", err);
  }
}

document.addEventListener("DOMContentLoaded", cargarPosts);
