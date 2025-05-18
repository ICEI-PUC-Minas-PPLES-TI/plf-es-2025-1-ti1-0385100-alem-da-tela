 fetch('http://localhost:3000/comentarios')
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('listaComentarios');
        container.innerHTML = ''; // Limpa o texto inicial

        if (data.length === 0) {
          container.innerHTML = '<p>Nenhum comentário encontrado.</p>';
          return;
        }

        data.forEach(item => {
          const div = document.createElement('div');
          div.className = 'comentario';
          div.innerHTML = `<strong>${item.tipo === 'resposta' ? 'Resposta' : 'Comentário'}:</strong> ${item.texto}`;
          container.appendChild(div);
        });
      })
      .catch(err => {
        console.error('Erro ao carregar:', err);
        document.getElementById('listaComentarios').innerText = 'Erro ao carregar comentários.';
      });