// Define a data atual no campo de data
document.getElementById("data-registro").value = new Date().toISOString().split("T")[0];


const textarea = document.getElementById('registro');
textarea.addEventListener('input', function () {
  this.style.height = 'auto'; 
  this.style.height = this.scrollHeight + 'px'; 
});


const btnEnviar = document.getElementById("btn-enviar");


function getQueryParams() {
    const params = {};
    window.location.search.substring(1).split("&").forEach(param => {
        const parts = param.split("=");
        params[parts[0]] = decodeURIComponent(parts[1]);
    });
    return params;
}

const queryParams = getQueryParams();
const recordId = queryParams.id;

if (recordId) {
   
    document.getElementById("Diary").textContent = "Editar Registro"; 
    btnEnviar.textContent = "Atualizar"; 

    fetch(`http://localhost:3000/registros/${recordId}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erro ao carregar registro para edição.');
        })
        .then(registro => {
            document.getElementById("data-registro").value = registro.data;
            document.getElementById("titulo-registro").value = registro.titulo === "Sem título" ? "" : registro.titulo;
            document.getElementById("registro").value = registro.conteudo;
            if (registro.privado) {
                document.getElementById("sim").checked = true;
            } else {
                document.getElementById("nao").checked = true;
            }
            if (registro.profissional) {
                document.getElementById("sim-profissional").checked = true;
            } else {
                document.getElementById("nao-profissional").checked = true;
            }
            
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        })
        .catch(error => {
            console.error("Erro ao carregar registro para edição:", error);
            alert("Erro ao carregar registro para edição.");
        });
}


btnEnviar.addEventListener("click", () => {
 
  const dataRegistro = document.getElementById("data-registro").value;
  const tituloRegistro = document.getElementById("titulo-registro").value;
  const registro = document.getElementById("registro").value;
  const privado = document.querySelector('input[name="privado"]:checked')?.value === "sim";
  const profissional = document.querySelector('input[name="profissional"]:checked')?.value === "sim";

  
  const novoRegistro = {
    data: dataRegistro,
    titulo: tituloRegistro || "Sem título", 
    conteudo: registro,
    privado: privado,
    profissional: profissional,
  };

  const method = recordId ? "PUT" : "POST"; 
  const url = recordId ? `http://localhost:3000/registros/${recordId}` : "http://localhost:3000/registros";

 
  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(novoRegistro),
  })
    .then((response) => {
      if (response.ok) {
        alert(`Registro ${recordId ? 'atualizado' : 'enviado'} com sucesso!`);
        
        if (!recordId) {
            document.getElementById("data-registro").value = new Date().toISOString().split("T")[0];
            document.getElementById("titulo-registro").value = "";
            document.getElementById("registro").value = "";
            document.querySelectorAll('input[name="privado"]').forEach((el) => (el.checked = false));
            document.querySelectorAll('input[name="profissional"]').forEach((el) => (el.checked = false));
        }
        window.location.href = "tela_gerada.html"; 
      } else {
        alert(`Erro ao ${recordId ? 'atualizar' : 'enviar'} registro.`);
      }
    })
    .catch((error) => {
      console.error(`Erro ao ${recordId ? 'atualizar' : 'enviar'} registro:`, error);
      alert(`Erro ao ${recordId ? 'atualizar' : 'enviar'} registro.`);
    });
});

