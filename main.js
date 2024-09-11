const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db/database');  // Importar o banco de dados

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
//      preload: path.join(__dirname, 'preload.js'), //remover?
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('../Home/home.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Gerenciando comunicação IPC com o renderer (frontend)

// Busca produtos
ipcMain.on('get-produtos', (event) => {
  db.all('SELECT * FROM produto', (err, rows) => {
    if (err) {
      event.reply('get-produtos-reply', { error: err.message });
    } else {
      event.reply('get-produtos-reply', rows);
    }
  });
});

// Adiciona Produtos
ipcMain.on('add-produto', (event, produto) => {
  const { nome, descricao, preco, estoque, usuario_idusuario } = produto;
  db.run(`INSERT INTO produto (nome, descricao, preco, estoque, data_cadastro, usuario_idusuario) VALUES (?, ?, ?, ?, datetime('now'), ?)`,
    [nome, descricao, preco, estoque, usuario_idusuario], function(err) {
      if (err) {
        event.reply('add-produto-reply', { error: err.message });
      } else {
        event.reply('add-produto-reply', { success: 'Produto adicionado com sucesso!', id: this.lastID });
      }
    });
});

// Validação de login
ipcMain.on('login', (event, credentials) => {
    const { usuario, senha } = credentials;
    db.get('SELECT * FROM usuario WHERE nome_usuario = ? AND senha = ?', [usuario, senha], (err, row) => {
      if (err) {
        event.reply('login-reply', { success: false, error: err.message });
      } else if (row) {
        event.reply('login-reply', { success: true });
      } else {
        event.reply('login-reply', { success: false });
      }
    });
  });

// Cadastro de usuario cpf  
ipcMain.on('cadastro', (event, novoUsuario) => {
    const { nome, usuario, senha, email, senha_seguranca, data_nascimento, cpf, endereco } = novoUsuario;
    db.run('INSERT INTO usuario (nome, usuario, senha, email, senha_seguranca, data_nascimento, cpf, endereco) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nome, usuario, senha, email, senha_seguranca, data_nascimento, cpf, endereco],
      (err) => {
        if (err) {
          event.reply('cadastro-reply', { success: false, error: err.message });
        } else {
          event.reply('cadastro-reply', { success: true });
        }
      });
  });
 
// Recuperar Usuario  
ipcMain.on('recuperar-senha', (event, { email }) => {
    db.get('SELECT * FROM usuario WHERE email = ?', [email], (err, row) => {
      if (err) {
        event.reply('recuperar-senha-reply', { success: false, error: err.message });
      } else if (row) {
        event.reply('recuperar-senha-reply', { success: true });
      } else {
        event.reply('recuperar-senha-reply', { success: false, error: 'E-mail não encontrado.' });
      }
    });
  });
  