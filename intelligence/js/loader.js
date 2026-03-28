async function loadComponent(id, file) {
  const res = await fetch(file);
  const data = await res.text();
  document.getElementById(id).innerHTML = data;
}

loadComponent("navbar", "/alfattah/components/navbar.html");
loadComponent("footer", "/alfattah/components/footer.html");
