const ref = document.getElementById("branchGraph");

if(ref){
    const container = document.createElement("div");
    container.style.marginTop = "20px";
    container.innerHTML = `
    <h3>Dummy carbon timeline</h3>`;

    ref.appendChild(container);
}

